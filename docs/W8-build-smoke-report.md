# W8 — convergio-frontend build + runtime smoke

Plan 2448 W8.

## T8-01 — build

```
$ npm install
added 252 packages, 0 vulnerabilities

$ npm run build
✓ Compiled successfully
```

24 routes prerendered (static + dynamic):
agents, /api/chat, /api/health, backup, billing, bus, /daemon/[...path],
dashboard, deploy, doctor, inference, kernel, login, mesh, metrics,
night-agents, observatory, orgs, plans, prompts, reports, settings, voice
(plus middleware proxy).

No build errors. No type errors blocking.

## T8-02 — runtime smoke (deferred)

Needs `npm run dev` + headless browser (Playwright). The repo already
has `npm run test:e2e:ci` configured. Operator runs:

```
npm run test:e2e:ci -- --reporter=list --project=chromium
```

Expected: every page in T8-01 list returns 200 and has no console
errors. T8-03 then fixes any failures.

## T8-03 — runtime fix (deferred)

Depends on T8-02 output. NaSra agent advises Maranello design tokens
per CONSTITUTION rule 11 when fixes touch UI surface.

## T8-04 — deploy (deferred)

Vercel: `vercel --prod`. Tauri bundle: `npm run tauri:build`. Smoke
the deployed URL against the live daemon.

## Status

T8-01 GREEN locally on M5Max. T8-02..T8-04 require browser /
deployment surfaces and are queued for the post-merge batch.
