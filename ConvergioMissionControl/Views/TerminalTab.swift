// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — Terminal tab: native SwiftUI PTY placeholder
// WHY: Replaced WKWebView/xterm.js with native SwiftUI shell for Plan 724 zero-webview mandate.
//      Full PTY implementation via SwiftNIO planned in Plan 721.

import SwiftUI

/// Native terminal view connecting to the daemon WS-PTY endpoint.
/// Displays a PTY session placeholder; full implementation ships in Plan 721.
struct TerminalTab: View {
    @State private var sessionActive = false
    @State private var output: [String] = []

    var body: some View {
        VStack(spacing: 0) {
            header
            terminalContent
        }
    }

    private var header: some View {
        HStack {
            Image(systemName: "terminal")
                .foregroundStyle(.mint)
            Text("Terminal")
                .font(.headline)
            Spacer()
            Circle()
                .fill(sessionActive ? .green : .gray)
                .frame(width: 8, height: 8)
            Text(sessionActive ? "Connected" : "Idle")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    private var terminalContent: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(alignment: .leading, spacing: 4) {
                ForEach(output.indices, id: \.self) { idx in
                    Text(output[idx])
                        .font(.system(.caption, design: .monospaced))
                        .foregroundStyle(.green)
                }
                HStack {
                    Text("$")
                        .font(.system(.caption, design: .monospaced))
                        .foregroundStyle(.green)
                    Text("_")
                        .font(.system(.caption, design: .monospaced))
                        .foregroundStyle(.green)
                        .opacity(sessionActive ? 1 : 0.3)
                }
                Spacer()
                if !sessionActive {
                    Text("PTY available via daemon WS — start daemon to connect")
                        .font(.caption2)
                        .foregroundStyle(.gray)
                        .padding(.bottom, 8)
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
        .frame(minHeight: 300, maxHeight: .infinity)
        .onAppear { connectPTY() }
    }

    private func connectPTY() {
        // WHY: Actual WS-PTY connects to ws://localhost:8420/ws-pty.
        // Full SwiftNIO WebSocket implementation planned in Plan 721.
        // For now we surface connection status without blocking daemon check.
        Task {
            do {
                let (_, response) = try await URLSession.shared.data(
                    from: URL(string: "http://localhost:8420/api/health")!
                )
                if let http = response as? HTTPURLResponse, http.statusCode == 200 {
                    sessionActive = true
                    output = ["Convergio daemon online. PTY available at ws://localhost:8420/ws-pty"]
                }
            } catch {
                sessionActive = false
            }
        }
    }
}
