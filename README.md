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

## License & Mission

> **Convergio is free. The code is open. We trust you.**

This project is released under the [Convergio Community License](./LICENSE).

Use it to learn. Use it to build. Use it to grow your business.
Fork it, modify it, redistribute it — the license travels with the code.

If Convergio helps you, we ask one thing: **help someone who needs it** —
consider a donation to [FightTheStroke Foundation](https://fightthestroke.org),
a non-profit supporting children and families affected by pediatric stroke
and cerebral palsy.

**Always free, no questions asked, for:**
- 🎓 Students
- ♿ People with disabilities
- 💚 Non-profit organizations

**Want to go further?** We offer consulting, workshops, and speaking
engagements — priced on the value we create together, not by the hour.
→ [convergio.io](https://convergio.io)

---

*Built for solopreneurs who dare to build alone.*
*If it helps you grow, help someone grow too.*
