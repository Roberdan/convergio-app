// SPDX-License-Identifier: MPL-2.0
// ConvergioApp — WebViewBridge removed (Plan 724: zero WKWebView)
// WHY: Replaced by native SwiftUI views using URLSession to the daemon REST API.
//      Each tab now fetches its data via http://localhost:8420/api/<endpoint>.
//      BridgeMessage type retained for any future inter-component messaging.

import SwiftUI

/// Retained for source compatibility during migration.
/// No longer wraps WKWebView — all tabs use URLSession directly.
struct BridgeMessage {
    let action: String
    let payload: [String: String]?
}
