# convergio-app

Native macOS app — SwiftUI mission control for the Convergio daemon.

## Architecture

| Layer | Path | Purpose |
|---|---|---|
| App entry | `ConvergioMissionControl/App.swift` | MenuBarExtra menu bar app |
| Navigation | `ConvergioMissionControl/ContentView.swift` | Six-tab TabView |
| Views | `ConvergioMissionControl/Views/` | Tab views (native SwiftUI) |
| Services | `ConvergioMissionControl/Services/` | DaemonConnection, MeshActionService |
| Models | `ConvergioMissionControl/Models/` | DaemonState |

## Daemon API

All tabs connect to the daemon at `http://localhost:8420`.

| Tab | Endpoint |
|---|---|
| Brain | `/api/health` |
| Mesh | `/api/mesh/peers` |
| Plans | `/api/plans` |
| Agents | `/api/agents` |
| Chat | `/api/chat` |
| Terminal | `ws://localhost:8420/ws-pty` (Plan 721) |

## Conventions (NON-NEGOTIABLE)

- 100% native SwiftUI — ZERO WKWebView
- Max 250 lines/file
- English only (code, comments, docs)
- SPDX-License-Identifier: MPL-2.0 on every file
- Platform: macOS 14+
- Async/await for all network calls
- `DaemonViewState` for loading/connected/offline states

## Build

```bash
swift build
```

## Test

```bash
swift test
```
