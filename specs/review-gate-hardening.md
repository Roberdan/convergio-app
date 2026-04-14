# Plan Review: Gate Hardening — Ironclad Plan Lifecycle

**Spec file**: `specs/gate-hardening-spec.yaml`
**Reviewer**: plan-reviewer agent (Copilot)
**Date**: 2025-07-25
**Tasks**: 9 across 4 waves (W1, W2, W3, WTF)

---

## Verdict: BLOCK

Two structural defects prevent safe execution. Fix blockers B1 and B2
before importing into the daemon.

---

## Blockers (must fix)

### B1 — WTF wave: missing intra-wave `depends_on` declarations

WTF contains 4 tasks with hard sequential dependencies:

```
TF-tests ──┐
            ├──→ TF-pr ──→ TF-deploy-verify
TF-doc  ───┘
```

- TF-pr cannot run until TF-tests and TF-doc are complete (you can't PR untested/undocumented code).
- TF-deploy-verify explicitly says "After PR merge" — it requires TF-pr to be merged first.

Without `depends_on`, the executor may run all 4 tasks in parallel. TF-deploy-verify
will fail immediately (no PR to merge), and TF-pr may ship without passing tests.

Other specs in this repo use intra-wave `depends_on` correctly (see
`night-agents-ui-bootstrap.yaml` lines 211, 232, 277, 320, 393, 432).

**Fix**: Add explicit dependencies:

```yaml
- id: TF-pr
  depends_on: [TF-tests, TF-doc]
  ...

- id: TF-deploy-verify
  depends_on: [TF-pr]
  ...
```

### B2 — TF-deploy-verify has `output_type: pr` but cannot produce a PR

TF-deploy-verify runs **after** the PR is already merged. Its job is operational
verification (rebuild, restart, smoke test). It does not produce code or a PR.

The gate chain (`EvidenceGate → TestGate → PrCommitGate → ...`) will expect PR
evidence in task notes. Since no PR is created by this task, PrCommitGate will block
submission indefinitely.

**Fix**: Change `output_type` to `verification` or `report`, or split TF-deploy-verify
into a post-merge manual-gate wave (W5) with relaxed gate requirements.

---

## Advisories (should fix)

### A1 — Wave ID "WTF" is non-conventional

All other specs use sequential wave numbering (W1, W2, W3, WF). "WTF" is presumably
"Wave The Final" but reads as an expletive. Rename to `WF` for consistency with
existing specs (iota, beta, gamma all use `WF`).

### A2 — T1-02 verify[] missing cargo clippy

T1-01 includes both `cargo test` and `cargo clippy` in its verify array.
T1-02 only has `cargo test` and a grep check. Since T1-02 modifies `gates.rs`
(new types, match arms), clippy should validate the new code.

**Fix**: Add to T1-02 verify:
```yaml
- "cargo clippy --workspace -- -D warnings"
```

### A3 — Acceptance invariants 4–6 are not machine-verifiable

Three of the six acceptance invariants are behavioral descriptions, not executable commands:

| # | Invariant | Issue |
|---|-----------|-------|
| 4 | "Last task submitted in wave auto-triggers Thor" | No executable test command |
| 5 | "Evidence on pending task returns HTTP 400" | No curl command specified |
| 6 | "PrCommitGate logs GitHub API check result" | Checking logs is fragile |

Compare with invariants 1–3 which are concrete commands (`cargo test`, `cargo clippy`,
specific HTTP status code with trigger condition).

**Recommendation**: Rewrite as executable checks, e.g.:
```yaml
- "cargo test --workspace -- test_auto_thor_on_wave_completion"
- "cargo test --workspace -- test_evidence_on_pending_task_rejected"
- "cargo test --workspace -- test_pr_commit_gate_github_check"
```

### A4 — Model routing: consider Opus for effort-3 tasks

All 9 tasks use `claude-sonnet-4-6`. Tasks T2-02 (effort 3, new module + GitHub API
client) and T3-01 (effort 3, cross-crate refactoring + worktree utility extraction)
involve architectural decisions. Per Learning #26's spirit ("Sonnet produces broken
code on complex tasks"), effort-3 tasks may benefit from Opus routing.

Not a blocker since `executor_agent: copilot` means GitHub Copilot executes
(not a spawned Claude agent), but worth noting.

### A5 — No plan-level `depends_on` metadata

Other specs declare plan-level dependencies:
```yaml
# gamma-night-agents-org.yaml
depends_on: alpha-stabilize.W2

# delta-skill-pipeline.yaml
depends_on: [alpha-stabilize, beta-test-doctor, gamma-night-agents-org]
```

This spec has no `depends_on` at the plan level. If gate-hardening requires
any prior plan to be complete, it should declare it explicitly.

### A6 — T2-02 and T1-02 both modify gates.rs

T1-02 (W1) adds `plan_status_gate` to `gates.rs`. T2-02 (W2) upgrades
`PrCommitGate` in the same file. Because W1 completes before W2 starts,
there's no parallel conflict — but the executor for T2-02 must be aware
that gates.rs has changed since the spec was written. Add a note in T2-02's
`do` field: "gates.rs will already contain PlanStatusGate from T1-02."

---

## Observations

### O1 — Review criteria checklist

| #  | Criterion                   | Result |
|----|-----------------------------|--------|
| 1  | verify[] on every task      | ✅ PASS — all 9 tasks have verify arrays |
| 2  | Effort 1–3 range            | ✅ PASS — effort 1 (×3), effort 2 (×4), effort 3 (×2) |
| 3  | Required metadata fields    | ✅ PASS — all tasks have model, executor_agent, validator_agent, output_type |
| 4  | No orphan tasks             | ✅ PASS — all feature tasks consumed by TF-tests; all F-xx covered |
| 5  | Acceptance invariants       | ⚠️ ADVISORY — 3 of 6 not machine-verifiable (see A3) |
| 6  | Wave ordering               | ❌ BLOCK — WTF wave missing intra-wave deps (see B1) |
| 7  | Requirements coverage       | ✅ PASS — F-01→T1-01, F-02→T1-02, F-03→T2-02, F-04→T2-01, F-05→T3-01 |
| 8  | Protected files             | ✅ PASS — no protected files modified |
| 9  | 300-line rule               | ✅ PASS — all tasks are surgical additions to existing files |
| 10 | Test rules                  | ✅ PASS — no hardcoded counts, no version literals |
| 11 | PR batching                 | ✅ PASS — WTF has single TF-pr for final delivery |
| 12 | deploy-verify output_type   | ❌ BLOCK — cannot produce PR post-merge (see B2) |

### O2 — Requirements → task traceability

| Requirement | Task  | Wave | Coverage |
|-------------|-------|------|----------|
| F-01        | T1-01 | W1   | Full — auto-Thor trigger on last submitted task |
| F-02        | T1-02 | W1   | Full — PlanStatusGate rejects non-active plans |
| F-03        | T2-02 | W2   | Full — GitHub API verification + graceful fallback |
| F-04        | T2-01 | W2   | Full — existence, status, duplicate pre-checks |
| F-05        | T3-01 | W3   | Full — auto-worktree with .worktree-owner |

No requirements are missing coverage. No tasks are unlinked to requirements.

### O3 — Task instructions are high quality

All `do` blocks include:
- Step-by-step implementation instructions
- Specific file paths
- Reference to existing code (line numbers)
- Concrete test scenarios

This is well above the typical spec quality. The executor has enough context
to implement without guessing.

### O4 — Wave parallelism is conservative and safe

W1 and W2 could theoretically run in parallel (different files except gates.rs).
However, since both W1-T1-02 and W2-T2-02 modify `gates.rs`, sequential ordering
(W1 → W2) is correct and prevents merge conflicts.

---

## Summary

Strong spec with clear requirements, good traceability, and high-quality task
instructions. Two structural blockers must be fixed before execution:

1. **B1**: Add `depends_on` to WTF wave tasks (TF-pr → [TF-tests, TF-doc],
   TF-deploy-verify → [TF-pr])
2. **B2**: Change TF-deploy-verify `output_type` from `pr` to `verification`

After fixing B1 + B2, address advisories A1 (rename WTF → WF) and A2 (add
clippy to T1-02 verify) for completeness.

**Not ready to execute. Fix blockers first.**
