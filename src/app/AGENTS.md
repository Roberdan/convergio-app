# App Routes

Next.js App Router layout. All routes live under `(dashboard)/` and inherit the AppShell.

## Route map

| Route | What |
|-------|------|
| `(dashboard)/layout.tsx` | Dashboard layout — loads config, renders AppShell, imports block registrations |
| `(dashboard)/page.tsx` | Root redirect to `/dashboard` |
| `(dashboard)/dashboard/` | Main dashboard — Brain 3D, neural nodes, event stream, system health, costs |
| `(dashboard)/agents/` | Agent lifecycle management — spawn, delete, heartbeat, catalog |
| `(dashboard)/mesh/` | Mesh network — peer discovery, topology, hub-spoke |
| `(dashboard)/plans/` | Plan management and selection |
| `(dashboard)/scheduler/` | Scheduled job management — trigger, toggle, history |
| `(dashboard)/deploy/` | Deployment status — rollback, version tracking |
| `(dashboard)/night-agents/` | Autonomous night agent scheduling |
| `(dashboard)/observatory/` | Observability dashboard |
| `(dashboard)/metrics/` | System metrics and monitoring |
| `(dashboard)/security/` | Security policies, scanning, vulnerability findings |
| `(dashboard)/reports/` | Report generation |
| `(dashboard)/doctor/` | System diagnostics and health checks |
| `(dashboard)/backup/` | Backup management and restore |
| `(dashboard)/inference/` | Inference engine management |
| `(dashboard)/prompts/` | Prompt template management |
| `(dashboard)/orgs/` | Organization management |
| `(dashboard)/billing/` | Billing and cost tracking |
| `(dashboard)/settings/` | Configuration, extensions, audit trail |
| `(dashboard)/demo-data/` | Seed data for offline/demo mode (not a route) |
| `api/chat/route.ts` | AI chat endpoint — 5 providers (openai, azure, anthropic, copilot, qwen) |
| `api/health/route.ts` | Health check endpoint |

## Adding a page
1. Create `src/app/(dashboard)/your-page/page.tsx` — inherits shell automatically
2. Add navigation entry in `maranello.yaml` under the appropriate section
3. Wire to daemon API via `src/lib/api.ts` + types in `src/lib/types.ts`
