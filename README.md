# convergio-app

Native macOS mission control app for the [Convergio](https://github.com/Roberdan/ConvergioPlatform) platform.

## Requirements

- macOS 14.0+
- Xcode 15+
- Convergio daemon running (`./daemon/start.sh` in ConvergioPlatform)

## Build

```bash
swift build
```

## Architecture

Six-tab native SwiftUI menu bar app. Each tab connects to the Convergio daemon
at `localhost:8420` using URLSession — zero WKWebView.

| Tab | Purpose |
|---|---|
| Brain | Daemon health and module overview |
| Mesh | P2P node topology |
| Plans | Plan list and execution status |
| Agents | Active agent roster |
| Chat | Multi-agent chat |
| Terminal | PTY session (Plan 721) |

## License

Mozilla Public License 2.0 — see [LICENSE](LICENSE).

Copyright (c) 2026 Roberto D'Angelo. Not affiliated with Microsoft.
