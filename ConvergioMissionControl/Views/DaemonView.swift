// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — Native SwiftUI daemon content view (replaces WKWebView bridge)
// WHY: Plan 724 mandates 100% native SwiftUI, zero WKWebView. Views fetch via URLSession.

import SwiftUI

/// Shared loading/error states for daemon-backed tab views.
enum DaemonViewState {
    case loading
    case connected
    case offline(String)
}

/// Reusable offline placeholder shown when daemon is unreachable.
struct DaemonOfflinePlaceholder: View {
    let tab: String
    let error: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "plug.slash")
                .font(.system(size: 36))
                .foregroundStyle(.secondary)
            Text("Daemon Unavailable")
                .font(.headline)
                .foregroundStyle(.primary)
            Text("Cannot reach localhost:8420")
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(error)
                .font(.caption2)
                .foregroundStyle(.tertiary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(nsColor: .controlBackgroundColor))
    }
}

/// Reusable loading spinner shown while fetching daemon data.
struct DaemonLoadingView: View {
    let label: String

    var body: some View {
        VStack(spacing: 8) {
            ProgressView()
                .scaleEffect(0.8)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
