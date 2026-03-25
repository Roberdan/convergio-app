// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — Chat tab: multi-agent chat interface (native SwiftUI)
// WHY: Replaced WKWebView bridge with native SwiftUI + URLSession for Plan 724 zero-webview mandate.

import SwiftUI

/// Multi-agent chat interface backed by the daemon chat API.
struct ChatTab: View {
    @State private var viewState: DaemonViewState = .loading
    @State private var unreadCount: Int = 0
    @State private var messages: [ChatMessage] = []
    @State private var inputText: String = ""

    var body: some View {
        VStack(spacing: 0) {
            header
            content
        }
        .task { await refresh() }
    }

    private var header: some View {
        HStack {
            Image(systemName: "bubble.left.and.bubble.right")
                .foregroundStyle(.teal)
            Text("Chat")
                .font(.headline)
            Spacer()
            if unreadCount > 0 {
                Text("\(unreadCount)")
                    .font(.caption2.bold())
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(.red)
                    .foregroundStyle(.white)
                    .clipShape(Capsule())
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    @ViewBuilder
    private var content: some View {
        switch viewState {
        case .loading:
            DaemonLoadingView(label: "Loading messages...")
                .frame(minHeight: 300, maxHeight: .infinity)
        case .connected:
            chatContent
                .frame(minHeight: 300, maxHeight: .infinity)
        case .offline(let error):
            DaemonOfflinePlaceholder(tab: "chat", error: error)
                .frame(minHeight: 300, maxHeight: .infinity)
        }
    }

    private var chatContent: some View {
        VStack(spacing: 0) {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 8) {
                    ForEach(messages) { msg in
                        HStack(alignment: .top, spacing: 8) {
                            Image(systemName: "person.circle.fill")
                                .foregroundStyle(.teal)
                                .frame(width: 20)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(msg.sender)
                                    .font(.caption2.bold())
                                    .foregroundStyle(.secondary)
                                Text(msg.content)
                                    .font(.body)
                            }
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 4)
                    }
                }
            }
            Divider()
            HStack {
                TextField("Message...", text: $inputText)
                    .textFieldStyle(.plain)
                    .padding(.leading, 12)
                Button("Send", action: { Task { await sendMessage() } })
                    .buttonStyle(.borderless)
                    .padding(.trailing, 8)
                    .disabled(inputText.isEmpty)
            }
            .padding(.vertical, 6)
        }
    }

    private func refresh() async {
        viewState = .loading
        do {
            let (data, _) = try await URLSession.shared.data(
                from: URL(string: "http://localhost:8420/api/chat")!
            )
            if let json = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] {
                messages = json.compactMap { ChatMessage(dict: $0) }
            }
            unreadCount = 0
            viewState = .connected
        } catch {
            viewState = .offline(error.localizedDescription)
        }
    }

    private func sendMessage() async {
        guard !inputText.isEmpty else { return }
        let text = inputText
        inputText = ""
        var request = URLRequest(url: URL(string: "http://localhost:8420/api/chat")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: ["content": text])
        _ = try? await URLSession.shared.data(for: request)
        await refresh()
    }
}

struct ChatMessage: Identifiable {
    let id: String
    let sender: String
    let content: String

    init?(dict: [String: Any]) {
        guard let content = dict["content"] as? String else { return nil }
        self.id = dict["id"] as? String ?? UUID().uuidString
        self.sender = dict["sender"] as? String ?? "agent"
        self.content = content
    }
}
