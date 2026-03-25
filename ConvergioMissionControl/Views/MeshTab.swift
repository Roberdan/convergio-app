// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — Mesh tab: P2P topology and node status (native SwiftUI)
// WHY: Replaced WKWebView bridge with URLSession fetching /api/mesh/peers for Plan 724 zero-webview mandate.

import SwiftUI

/// Mesh topology and node status fetched natively from the daemon REST API.
struct MeshTab: View {
    @State private var viewState: DaemonViewState = .loading
    @State private var nodeCount: Int?
    @State private var peers: [PeerInfo] = []

    var body: some View {
        VStack(spacing: 0) {
            header
            content
        }
        .task { await refresh() }
    }

    private var header: some View {
        HStack {
            Image(systemName: "network")
                .foregroundStyle(.blue)
            Text("Mesh Network")
                .font(.headline)
            Spacer()
            if let count = nodeCount {
                Text("\(count) nodes")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    @ViewBuilder
    private var content: some View {
        switch viewState {
        case .loading:
            DaemonLoadingView(label: "Scanning mesh...")
                .frame(minHeight: 280, maxHeight: .infinity)
        case .connected:
            meshContent
                .frame(minHeight: 280, maxHeight: .infinity)
        case .offline(let error):
            DaemonOfflinePlaceholder(tab: "mesh", error: error)
                .frame(minHeight: 280, maxHeight: .infinity)
        }
    }

    private var meshContent: some View {
        List(peers) { peer in
            HStack {
                Circle()
                    .fill(peer.online ? Color.green : Color.gray)
                    .frame(width: 8, height: 8)
                Text(peer.name)
                    .font(.body)
                Spacer()
                Text(peer.address)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .listStyle(.plain)
    }

    private func refresh() async {
        viewState = .loading
        do {
            let (data, _) = try await URLSession.shared.data(
                from: URL(string: "http://localhost:8420/api/mesh/peers")!
            )
            if let json = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] {
                peers = json.compactMap { PeerInfo(dict: $0) }
                nodeCount = peers.count
            }
            viewState = .connected
        } catch {
            viewState = .offline(error.localizedDescription)
        }
    }
}

struct PeerInfo: Identifiable {
    let id: String
    let name: String
    let address: String
    let online: Bool

    init?(dict: [String: Any]) {
        guard let name = dict["name"] as? String else { return nil }
        self.id = dict["id"] as? String ?? name
        self.name = name
        self.address = dict["address"] as? String ?? "—"
        self.online = dict["online"] as? Bool ?? false
    }
}
