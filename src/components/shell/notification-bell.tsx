"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import { notifyQueue, notifyDismiss } from "@/lib/api-ext";
import type { Notification } from "@/lib/types";

const POLL_INTERVAL_MS = 30_000;

export function NotificationBell() {
  const t = useLocale("notificationBell");
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initial load + polling every 30s
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await notifyQueue();
        if (mounted) setNotifications(data);
      } catch {
        // silently ignore polling errors
      }
    };
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleDismiss = useCallback(async (id: string) => {
    try {
      await notifyDismiss(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silently ignore
    }
  }, []);

  const unreadCount = notifications.filter((n) => n.status === "pending").length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.bell}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span
            className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] font-bold text-destructive-foreground"
            aria-hidden="true"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label={t.bell}
          className="absolute right-0 top-full z-[9100] mt-1 w-80 rounded-lg border border-[var(--mn-border)] bg-[var(--mn-surface-overlay)] shadow-lg"
        >
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[var(--mn-text-muted)]">{t.loading}</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[var(--mn-text-muted)]">{t.noNotifications}</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 border-b border-[var(--mn-border-subtle)] px-4 py-3 last:border-b-0",
                    n.status === "pending" && "bg-[var(--mn-surface-hover)]",
                  )}
                  role="option"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--mn-text)]">{n.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--mn-text-muted)]">{n.body}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDismiss(n.id)}
                    aria-label={`${t.dismiss} ${n.subject}`}
                    className="shrink-0 rounded p-1 text-[var(--mn-text-muted)] hover:bg-[var(--mn-hover-bg)] hover:text-[var(--mn-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mn-border-focus)]"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
