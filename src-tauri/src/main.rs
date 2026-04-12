#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashSet;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    Manager,
};
use tauri_plugin_notification::NotificationExt;

const HEALTH_URL: &str = "http://localhost:8420/api/health";
const NOTIFY_URL: &str = "http://localhost:8420/api/notify/queue";
const POLL_INTERVAL: Duration = Duration::from_secs(10);
const NOTIFY_INTERVAL: Duration = Duration::from_secs(30);

#[derive(serde::Deserialize)]
struct NotifyItem {
    id: String,
    subject: String,
    body: String,
}

#[derive(serde::Deserialize)]
struct NotifyQueue {
    notifications: Vec<NotifyItem>,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let open = MenuItemBuilder::with_id("open", "Open Dashboard").build(app)?;
            let status_item =
                MenuItemBuilder::with_id("status", "Daemon: checking...").build(app)?;
            status_item.set_enabled(false)?;
            let quit = MenuItemBuilder::with_id("quit", "Quit Convergio").build(app)?;
            let menu = MenuBuilder::new(app)
                .items(&[&open, &status_item, &quit])
                .build()?;

            let tray = TrayIconBuilder::new()
                .menu(&menu)
                .tooltip("Convergio - checking...")
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "open" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = tauri::WebviewWindow::show(&window);
                            let _ = tauri::WebviewWindow::set_focus(&window);
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            let client = reqwest::Client::builder()
                .timeout(Duration::from_secs(5))
                .build()
                .unwrap_or_default();

            // Health polling loop — aggiorna tray ogni 10s
            let was_online = Arc::new(AtomicBool::new(false));
            let first_check = Arc::new(AtomicBool::new(true));
            let health_client = client.clone();

            tauri::async_runtime::spawn(async move {
                loop {
                    let online = health_client
                        .get(HEALTH_URL)
                        .send()
                        .await
                        .map(|r| r.status().is_success())
                        .unwrap_or(false);

                    let prev = was_online.swap(online, Ordering::Relaxed);
                    let is_first = first_check.swap(false, Ordering::Relaxed);

                    if online != prev || is_first {
                        let label = if online {
                            "Daemon: Online"
                        } else {
                            "Daemon: Offline"
                        };
                        let tooltip = if online {
                            "Convergio - Online"
                        } else {
                            "Convergio - Offline"
                        };
                        let _ = status_item.set_text(label);
                        let _ = tray.set_tooltip(Some(tooltip));
                    }

                    tokio::time::sleep(POLL_INTERVAL).await;
                }
            });

            // Notification polling loop — poll queue ogni 30s, notifica nuovi ID
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                let mut seen: HashSet<String> = HashSet::new();
                loop {
                    if let Ok(resp) = client
                        .get(NOTIFY_URL)
                        .header("Authorization", "Bearer convergio-dev")
                        .send()
                        .await
                    {
                        if let Ok(queue) = resp.json::<NotifyQueue>().await {
                            for item in queue.notifications {
                                if seen.insert(item.id) {
                                    let _ = app_handle
                                        .notification()
                                        .builder()
                                        .title(&item.subject)
                                        .body(&item.body)
                                        .show();
                                }
                            }
                        }
                    }
                    tokio::time::sleep(NOTIFY_INTERVAL).await;
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
