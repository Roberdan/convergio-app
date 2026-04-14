# Plan Review: Iota — CTT Report Service

**Spec file**: `specs/iota-ctt-reports.yaml`
**Reviewer**: plan-reviewer agent
**Date**: 2025-07-24
**Tasks**: 10 across 5 waves (W1, W2, W3‖, W4, WF)

---

## Verdict: PROCEED

The plan is well-structured, follows Convergio conventions, and produces
working end-to-end code at every wave boundary. No blockers found.
Three advisories should be addressed before execution.

---

## Blockers (must fix)

None.

---

## Advisories (should fix)

### A1 — TF-deploy-verify verify command always passes

```yaml
verify:
  - "curl -sf localhost:8420/api/reports || true"
```

The `|| true` makes this verify a no-op. If the daemon isn't running or
the route is broken, this still passes. Replace with:

```yaml
  - "curl -sf localhost:8420/api/reports"
```

Or keep `|| true` only if deploy-verify is informational, but then mark
the task as `type: verify` not `type: code`.

### A2 — engine.rs and latex.rs risk exceeding 300-line rule

- **engine.rs** (T2-01): 5 phases (research, synthesis, generation,
  formatting, error handling) plus async spawn wiring. This will likely
  reach 250–350 lines. Plan should instruct executor to split into
  `engine.rs` (orchestration) + `engine_research.rs` (research/synthesis)
  if it exceeds 300 lines.

- **latex.rs** (T2-02): LaTeX templates are verbose. The preamble alone
  (colors, packages, header/footer) can consume 80+ lines. Plan should
  instruct executor to split template strings into a `latex_template.rs`
  constants module if needed.

### A3 — engine.rs calls own daemon HTTP API (self-call pattern)

T2-01 has the engine calling `POST /api/inference/complete` on the same
server via HTTP. This works in production (server is listening) but has
implications:

- **Tests**: integration tests need the full server running with the
  inference endpoint available, or a mock. The plan doesn't specify
  a mocking strategy.
- **Alternative**: call the inference service directly via Rust function
  instead of HTTP round-trip. However, the HTTP approach is consistent
  with the daemon's microservice-like internal architecture and keeps
  the reports crate decoupled from inference internals.

**Recommendation**: keep the HTTP approach but add a note in T2-01 or
TF-tests that integration tests should use the real server (test harness)
or mock the inference endpoint.

---

## Observations

### O1 — All 12 review criteria pass

| #  | Criterion                | Result |
|----|--------------------------|--------|
| 1  | Rule 10 (no scaffolds)   | ✅ PASS — T1-01 engine.rs is explicitly a working minimal pipeline, not a stub |
| 2  | Task completeness        | ✅ PASS — all 10 tasks have id, do, type, output_type, model, executor_agent, validator_agent, effort, verify[] |
| 3  | Wave structure           | ✅ PASS — W1→W2→W3‖→W4→WF, correct dependency ordering |
| 4  | Final closure            | ✅ PASS — TF-tests, TF-doc, TF-pr, TF-deploy-verify all present |
| 5  | Test rules               | ✅ PASS — TF-tests explicitly forbids hardcoded counts |
| 6  | Verify arrays            | ⚠️ ADVISORY — TF-deploy-verify uses `|| true` (see A1) |
| 7  | Effort ratings           | ✅ PASS — all ratings reasonable for scope |
| 8  | Model routing            | ✅ PASS — all sonnet-4-6, no task requires opus-level architecture |
| 9  | Protected files          | ✅ PASS — no protected files modified (check_e2e_smoke.rs is NOT protected) |
| 10 | CLI-API contract         | ✅ PASS — 4 CLI commands match 4 API endpoints exactly |
| 11 | 300-line rule            | ⚠️ ADVISORY — engine.rs and latex.rs at risk (see A2) |
| 12 | Multi-domain             | ✅ PASS — TF-doc correctly uses type:document + doc-validator |

### O2 — Codebase validation confirms plan feasibility

All referenced codebase touchpoints verified:

- `convergio-reports` crate does **not** exist yet — clean slate ✅
- `daemon/src/main.rs` register_extensions() uses `Arc::new(...)` pattern — plan is compatible ✅
- `daemon/Cargo.toml` workspace members — no conflicts ✅
- `/api/inference/complete` endpoint **exists** at `convergio-inference/src/routes.rs:57` ✅
- `check_e2e_smoke.rs` SMOKE_ROUTES is an `&[(&str, &str)]` array — adding `("reports", "/api/reports")` is trivial ✅
- CLI dispatch uses `match Commands::*` → `exit_on_err(cli_x::handle(...))` pattern — plan follows it ✅
- MCP tools.rs uses `McpTool` structs with `all_tools()` + `extend()` — plan follows it ✅
- `seed_rest.rs` has research-report-generator at tier **t3** — T4-01 correctly bumps to t1 per Learning #26 ✅
- `research-report-generator.md` and `agents_meta.txt` both exist and can be updated ✅

### O3 — PDF pipeline is realistic with graceful degradation

T2-02 correctly handles the pdflatex system dependency:
- Returns `Err` with clear message if pdflatex unavailable
- Download endpoint returns 501 if pdflatex not installed
- Markdown format works independently of PDF

This is a good design. Unit tests can test LaTeX generation (string output)
without requiring pdflatex. Only the actual PDF compilation step needs the
binary.

### O4 — No session-checkpoint wave needed

10 tasks is well under the 20-task threshold. No checkpoint wave required.

### O5 — W3 could theoretically parallel with W2

W3 tasks (CLI + MCP) only need the API endpoints from W1, not the full
engine from W2. CLI would work against the minimal engine. However,
keeping W3 after W2 is conservative and ensures the CLI is tested against
the real engine. Not a problem — just an optimization opportunity if
velocity matters.

### O6 — PR batching is implicitly correct

Each task has `output_type: pr`, but TF-pr creates a single final PR
("Create PR for the Iota wave branch"). This implies all work happens
on one branch with the final PR covering everything — consistent with
Learning #25's "one PR per wave" rule (or in this case, one PR for
the entire plan since it's a single focused feature).

---

## Summary

Clean, well-specified plan. Fix the deploy-verify `|| true` (A1) and
add 300-line split guidance (A2) before execution. The self-call
pattern (A3) is a design observation, not a defect.

**Ready to execute after addressing A1 and A2.**
