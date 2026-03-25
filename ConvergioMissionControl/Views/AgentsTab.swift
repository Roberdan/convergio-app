// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — Agents tab: agent roster and activity feed (native SwiftUI)
// WHY: Replaced WKWebView bridge with URLSession fetching /api/agents for Plan 724 zero-webview mandate.

import SwiftUI

/// Agent roster fetched natively from the daemon REST API.
struct AgentsTab: View {
    @State private var viewState: DaemonViewState = .loading
    @State private var activeAgentCount: Int?
    @State private var agents: [AgentSummary] = []

    var body: some View {
        VStack(spacing: 0) {
            header
            content
        }
        .task { await refresh() }
    }

    private var header: some View {
        HStack {
            Image(systemName: "person.3")
                .foregroundStyle(.green)
            Text("Agents")
                .font(.headline)
            Spacer()
            if let count = activeAgentCount {
                Text("\(count) active")
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
            DaemonLoadingView(label: "Loading agents...")
                .frame(minHeight: 280, maxHeight: .infinity)
        case .connected:
            agentsList
                .frame(minHeight: 280, maxHeight: .infinity)
        case .offline(let error):
            DaemonOfflinePlaceholder(tab: "agents", error: error)
                .frame(minHeight: 280, maxHeight: .infinity)
        }
    }

    private var agentsList: some View {
        List(agents) { agent in
            HStack {
                Image(systemName: "person.circle")
                    .foregroundStyle(.green)
                Text(agent.name)
                    .font(.body)
                    .lineLimit(1)
                Spacer()
                Text(agent.project)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
        .listStyle(.plain)
    }

    private func refresh() async {
        viewState = .loading
        do {
            let (data, _) = try await URLSession.shared.data(
                from: URL(string: "http://localhost:8420/api/agents")!
            )
            if let json = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] {
                agents = json.compactMap { AgentSummary(dict: $0) }
                activeAgentCount = agents.count
            }
            viewState = .connected
        } catch {
            viewState = .offline(error.localizedDescription)
        }
    }
}

struct AgentSummary: Identifiable {
    let id: String
    let name: String
    let project: String

    init?(dict: [String: Any]) {
        guard let name = dict["name"] as? String ?? (dict["id"] as? String) else { return nil }
        self.id = dict["id"] as? String ?? name
        self.name = name
        self.project = dict["project"] as? String ?? "—"
    }
}
