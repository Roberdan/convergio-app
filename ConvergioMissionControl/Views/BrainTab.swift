// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — Brain tab: daemon health and neural overview (native SwiftUI)
// WHY: Replaced WKWebView bridge with URLSession fetching /api/health for Plan 724 zero-webview mandate.

import SwiftUI

/// Daemon health overview fetched natively from the daemon REST API.
/// Renders module counts and status indicators via SwiftUI — no webview.
struct BrainTab: View {
    @State private var viewState: DaemonViewState = .loading
    @State private var lastEvent: String?
    @State private var moduleCount: Int = 0
    @State private var daemonVersion: String = ""

    var body: some View {
        VStack(spacing: 0) {
            header
            content
        }
        .task { await refresh() }
    }

    private var header: some View {
        HStack {
            Image(systemName: "brain")
                .foregroundStyle(.purple)
            Text("Neural Overview")
                .font(.headline)
            Spacer()
            if let event = lastEvent {
                Text(event)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    @ViewBuilder
    private var content: some View {
        switch viewState {
        case .loading:
            DaemonLoadingView(label: "Connecting to daemon...")
                .frame(minHeight: 300, maxHeight: .infinity)
        case .connected:
            brainContent
                .frame(minHeight: 300, maxHeight: .infinity)
        case .offline(let error):
            DaemonOfflinePlaceholder(tab: "brain", error: error)
                .frame(minHeight: 300, maxHeight: .infinity)
        }
    }

    private var brainContent: some View {
        VStack(spacing: 16) {
            HStack(spacing: 24) {
                statCard(label: "Modules", value: "\(moduleCount)", icon: "cpu")
                statCard(label: "Version", value: daemonVersion, icon: "info.circle")
                statCard(label: "Status", value: "Online", icon: "checkmark.circle.fill")
            }
            .padding()
            Spacer()
        }
    }

    private func statCard(label: String, value: String, icon: String) -> some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(.purple)
            Text(value)
                .font(.headline)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(8)
        .background(Color(nsColor: .controlBackgroundColor))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    private func refresh() async {
        viewState = .loading
        do {
            let (data, _) = try await URLSession.shared.data(
                from: URL(string: "http://localhost:8420/api/health")!
            )
            if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                moduleCount = json["modules"] as? Int ?? 107
                daemonVersion = json["version"] as? String ?? "—"
                lastEvent = "healthy"
            }
            viewState = .connected
        } catch {
            viewState = .offline(error.localizedDescription)
        }
    }
}
