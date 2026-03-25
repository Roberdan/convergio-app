// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — Plans tab: plan list and execution tree (native SwiftUI)
// WHY: Replaced WKWebView bridge with URLSession fetching /api/plans for Plan 724 zero-webview mandate.

import SwiftUI

/// Plan list fetched natively from the daemon REST API.
struct PlansTab: View {
    @State private var viewState: DaemonViewState = .loading
    @State private var activePlanName: String?
    @State private var plans: [PlanSummary] = []

    var body: some View {
        VStack(spacing: 0) {
            header
            content
        }
        .task { await refresh() }
    }

    private var header: some View {
        HStack {
            Image(systemName: "list.clipboard")
                .foregroundStyle(.orange)
            Text("Plans")
                .font(.headline)
            Spacer()
            if let name = activePlanName {
                Text(name)
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
            DaemonLoadingView(label: "Loading plans...")
                .frame(minHeight: 280, maxHeight: .infinity)
        case .connected:
            plansList
                .frame(minHeight: 280, maxHeight: .infinity)
        case .offline(let error):
            DaemonOfflinePlaceholder(tab: "plans", error: error)
                .frame(minHeight: 280, maxHeight: .infinity)
        }
    }

    private var plansList: some View {
        List(plans) { plan in
            HStack {
                Circle()
                    .fill(statusColor(plan.status))
                    .frame(width: 8, height: 8)
                Text(plan.name)
                    .font(.body)
                    .lineLimit(1)
                Spacer()
                Text(plan.status)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            .onTapGesture { activePlanName = plan.name }
        }
        .listStyle(.plain)
    }

    private func statusColor(_ status: String) -> Color {
        switch status {
        case "doing": return .green
        case "done": return .blue
        case "cancelled": return .red
        default: return .gray
        }
    }

    private func refresh() async {
        viewState = .loading
        do {
            let (data, _) = try await URLSession.shared.data(
                from: URL(string: "http://localhost:8420/api/plans")!
            )
            if let json = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] {
                plans = json.compactMap { PlanSummary(dict: $0) }
                activePlanName = plans.first(where: { $0.status == "doing" })?.name
            }
            viewState = .connected
        } catch {
            viewState = .offline(error.localizedDescription)
        }
    }
}

struct PlanSummary: Identifiable {
    let id: Int
    let name: String
    let status: String

    init?(dict: [String: Any]) {
        guard let name = dict["name"] as? String else { return nil }
        self.id = dict["id"] as? Int ?? 0
        self.name = name
        self.status = dict["status"] as? String ?? "todo"
    }
}
