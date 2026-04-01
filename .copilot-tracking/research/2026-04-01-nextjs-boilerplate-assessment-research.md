# Research: Next.js boilerplate assessment

Date: 2026-04-01

## Scope

- Goal: evaluate whether this repository is a highly standard Next.js frontend starter and whether it is easy to reuse as a base for future frontend applications connected to APIs, data, and business logic.
- Questions:
  - Is the stack close to a standard Next.js setup?
  - How opinionated is the project structure and UX shell?
  - Are there non-standard platform choices that reduce portability?
  - Is there already a simple pattern for integrating APIs and data?
  - Is it better used as-is, trimmed down, or replaced by a more neutral starter?
- Assumptions:
  - The target reuse case is multiple future frontend projects, not only dashboards.
  - A good baseline should minimize product-specific branding, routes, and shell assumptions.
  - Ease of reuse depends on both technical correctness and architectural neutrality.

## Codebase Analysis

- Files examined:
  - `package.json:5-40`
  - `README.md:3-25`
  - `README.md:39-98`
  - `next.config.ts:1-7`
  - `tsconfig.json:2-34`
  - `eslint.config.mjs:1-18`
  - `playwright.config.ts:3-23`
  - `src/app/layout.tsx:27-55`
  - `src/app/page.tsx:3-52`
  - `src/app/settings/page.tsx:8-113`
  - `src/config/navigation.ts:13-37`
  - `src/components/shell/app-shell.tsx:15-57`
  - `src/components/theme/theme-provider.tsx:5-74`
  - `src-tauri/tauri.conf.json:3-39`
  - `e2e/shell.spec.ts:3-43`
  - `e2e/themes.spec.ts:3-27`
  - `e2e/zero-errors.spec.ts:3-38`
- Patterns found:
  - Standard App Router + TypeScript strict + Tailwind + ESLint + Playwright baseline.
  - Strongly opinionated application shell with sidebar, header, breadcrumb, command palette, and fixed navigation taxonomy.
  - Product-specific branding and UX conventions embedded at root layout/theme/navigation level.
  - Static demo/dashboard content instead of reusable data-access patterns.
  - Desktop packaging support via Tauri scaffold.
- Dependencies:
  - `next@16.2.1`, `react@19.2.4`, `react-dom@19.2.4` (`package.json:23-25`)
  - Tailwind CSS v4 and `@tailwindcss/postcss` (`package.json:31,37`)
  - `eslint-config-next@16.2.1` (`package.json:35-36`)
  - `@playwright/test` (`package.json:30`)
  - `@base-ui/react`, `cmdk`, `lucide-react`, `class-variance-authority`, `tailwind-merge` (`package.json:18-27`)
  - `shadcn` CLI as dev dependency (`package.json:39`)

## Key Discoveries

1. **The core web stack is standard and healthy, but not minimal.**  
   Scripts and tooling are conventional for a Next.js app: `dev`, `build`, `start`, `lint`, `typecheck`, `test:e2e`, `format` (`package.json:5-15`). `next.config.ts` is essentially default (`next.config.ts:1-7`), and `tsconfig.json` is close to the standard strict App Router setup with a simple `@/*` alias (`tsconfig.json:2-34`).

2. **This is not a neutral starter; it is a branded operational shell.**  
   The root metadata and shell already encode product identity: title/description are `Convergio` and `operational product shell` (`src/app/layout.tsx:27-30`). The main layout always mounts `ThemeProvider`, `TooltipProvider`, and `ShellWrapper` (`src/app/layout.tsx:43-51`). The app shell itself assumes a persistent header, sidebar, breadcrumb model, and command menu (`src/components/shell/app-shell.tsx:15-45`).

3. **Navigation and page taxonomy are hardcoded around one product shape.**  
   The default sections are `Overview`, `Operations`, and `System`, with routes such as `/agents`, `/security`, `/notifications`, `/docs`, and `/settings` (`src/config/navigation.ts:13-37`). That is useful for a dashboard/admin template, but it is not a generic front-end baseline for arbitrary apps.

4. **Current pages are mostly static showcase content, not API/data architecture.**  
   The dashboard renders inline KPI arrays and activity mocks (`src/app/page.tsx:11-47`). The settings page uses local React state and default values only, with no persistence, schema validation, or backend interaction (`src/app/settings/page.tsx:8-113`). No reusable API client, no server actions pattern, no data-fetching library, and no `src/app/api` structure were found in the inspected tree.

5. **Theming is richer than standard boilerplate and increases reuse cost.**  
   A four-theme system is baked in: `light`, `dark`, `navy`, `colorblind` (`src/components/theme/theme-provider.tsx:5-6`). Theme persistence is tied to the product-specific storage key `convergio-theme` (`src/components/theme/theme-provider.tsx:16-21`), and the README defines a branded “Maranello visual language” plus “4 themes always” as a principle (`README.md:89-98`). This is polished, but not generic.

6. **There is a significant non-standard platform choice: Tauri.**  
   The repository includes `tauri:dev` and `tauri:build` scripts (`package.json:10-11`) and a full `src-tauri/` scaffold (`src-tauri/tauri.conf.json:3-39`). README explicitly markets the project as “Tauri-ready” (`README.md:15-25`, `README.md:72-87`). This does not block web use, but it makes the repo broader and more opinionated than a pure web starter.

7. **Developer ergonomics are good for UI shell work, but thin for application architecture.**  
   ESLint config is clean and standard (`eslint.config.mjs:1-18`). Playwright E2E coverage checks shell rendering, themes, navigation, and zero console errors (`e2e/shell.spec.ts:3-43`, `e2e/themes.spec.ts:3-27`, `e2e/zero-errors.spec.ts:3-38`). However, there is no unit/integration testing layer and no conventions for API mocking, domain modules, auth, env validation, or shared data services.

8. **Documentation itself shows a mismatch that slightly weakens confidence as a reusable baseline.**  
   README says “Next.js 15 App Router” (`README.md:19`), while `package.json` pins `next` to `16.2.1` (`package.json:23`). This is minor, but a reusable base should keep docs aligned with actual versions.

9. **Baseline quality is solid.**  
   `pnpm lint`, `pnpm typecheck`, and `pnpm build` complete successfully in the current state. That means the repo is stable as a starting point for UI work, even if its architecture is not yet generalized.

## Recommended Approach

**Selected**: Use this repository only as a **dashboard/admin shell starter**, not as the universal base for all future frontend applications.

**Rationale**:  
The technical foundation is sound and standard enough at the framework level, but the repository is already heavily shaped around one branded operational product. Reusing it unchanged across many future apps would force repeated cleanup of product naming, navigation, themes, page taxonomy, and desktop packaging concerns. It is better suited as a starting point when you specifically want:

- Next.js App Router
- a ready-made dashboard shell
- shadcn-style local UI components
- polished theming and keyboard-oriented UX

It is not yet the simplest base for plugging in APIs/business logic “in maniera semplice,” because the data layer conventions are largely absent.

**Implementation sketch**:
1. Extract or fork this into a neutral internal starter.
2. Remove or make optional: Convergio branding, fixed routes, Tauri, multi-theme product language.
3. Add a standard data-access layer:
   - `src/lib/api/` for API client(s)
   - env validation
   - server action / route handler conventions
   - optional fetch/cache/query abstraction
4. Add authentication and form validation primitives if those are common across future apps.
5. Keep the shell/UI primitives as optional modules instead of always-on defaults.

## Alternatives Considered

| Approach | Pros | Cons | Rejected Because |
| -------- | ---- | ---- | ---------------- |
| Reuse this repo exactly as the universal frontend base | Fastest short-term start; polished shell; already passing build/lint | Every new app inherits Convergio branding, dashboard routes, four-theme system, and Tauri baggage | Too opinionated for a universal starter |
| Strip this repo down into a neutral internal starter | Preserves working stack, UI primitives, testing, and shell pieces you already like | Requires one cleanup/refactor pass now | Not rejected; this is the best long-term path if you want a shared base |
| Start from fresh `create-next-app` every time | Maximum neutrality and lowest inherited assumptions | You lose the shell, UI kit, testing setup, and custom polish; repeated setup work | Rejected if you want consistency and speed across projects |

## Open Questions

- Should the future shared base target only **dashboard/internal tools**, or also public marketing/product frontends?
- Do you want Tauri support to remain part of the shared baseline, or should desktop packaging live in a separate template?
- Do you prefer server-first data fetching with App Router patterns only, or a client query layer (for example SWR/TanStack Query) as a default?

Research complete. Proceed with `/planner`?
