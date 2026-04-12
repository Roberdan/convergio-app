# ADR-0005: Security Audit & Hardening

**Status:** Accepted  
**Date:** 2025-07-19  
**Context:** First comprehensive security audit of convergio-app

## Findings & Fixes

### CRITICAL

| Finding | Fix |
|---------|-----|
| Session secret defaults to known `convergio-dev-secret` | Fail closed in production; ephemeral random secret in dev |

### HIGH

| Finding | Fix |
|---------|-----|
| Hardcoded `convergio-dev` bearer token fallback in 5 files | Empty string fallback — fail closed |
| Default `admin/admin` login credentials | Require `ADMIN_USERNAME` + `ADMIN_PASSWORD` env vars |
| Catch-all API proxy (`/api/[...path]`) had no session check | Added `getSessionValue()` gate (health endpoint exempt) |

### MEDIUM

| Finding | Fix |
|---------|-----|
| No security headers (CSP, HSTS, X-Frame-Options) | Added headers via `next.config.ts` |
| `NEXT_PUBLIC_AUTH_TOKEN` shipped to browser bundle | Token cleared to empty default; proxy handles daemon auth |

### LOW

| Finding | Fix |
|---------|-----|
| `localStorage` JSON.parse without schema validation (a11y settings) | Added field-by-field validation with allowlists |
| React lint: `setState` called synchronously in `useEffect` (3 files) | Replaced with lazy initializers or inline async |
| `Record<string, any>` in api-ext.ts | Changed to `Record<string, unknown>` |

### INFO (No Action Required)

- `dangerouslySetInnerHTML` in theme-script.tsx — inputs are static/JSON-stringified
- `dangerouslySetInnerHTML` in mn-icon.tsx — SVG catalog is immutable
- localStorage stores: locale, theme, chat-panel state, a11y prefs — non-sensitive
- Health endpoint is public by design

## Files Modified

- `src/lib/session.ts` — session secret hardening
- `src/app/(auth)/login/page.tsx` — remove default credentials
- `src/app/api/[...path]/route.ts` — session auth gate + remove hardcoded token
- `src/lib/api.ts` — remove hardcoded fallback token
- `src/lib/api-ext.ts` — remove hardcoded fallback token + fix `any` types
- `src/lib/api-night-agents.ts` — remove hardcoded fallback token
- `src/lib/a2ui/client.ts` — remove hardcoded fallback token
- `src/app/(dashboard)/approvals/page.tsx` — remove hardcoded fallback token
- `next.config.ts` — security headers
- `src/components/maranello/theme/mn-a11y-fab.helpers.ts` — validate localStorage input
- `src/app/(dashboard)/settings/daemon-switcher.tsx` — fix lint (lazy state init)
- `src/components/shell/ai-chat-panel.tsx` — fix lint (lazy state init)
- `src/components/shell/notification-bell.tsx` — fix lint (inline async in effect)

## Required Environment Variables (Production)

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | HMAC session signing (required in production) |
| `ADMIN_USERNAME` | Login username (required) |
| `ADMIN_PASSWORD` | Login password (required) |
| `AUTH_TOKEN` | Daemon bearer token (server-side only) |
| `NEXT_PUBLIC_AUTH_TOKEN` | Client auth token (optional, defaults empty) |
