# Spec Review: post-review-hardening.yaml

**Reviewed:** 2025-07-16  
**Spec:** `specs/post-review-hardening.yaml`  
**Total tasks:** 34 (28 feature tasks + 2 checkpoints + 4 final closure)  
**Waves:** W0 → W1 → W2 → WC1 → W3∥W4 → WC2 → W5 → W6 → W7 → WF  

---

## VERDICT: ❌ FAIL

**4 blockers must be resolved before approval.**

---

## BLOCKERS

### B1 — ADR-024 has no implementation task (T0-03, line 54)
ADR-024 describes merging deploy/build/provisioning → `convergio-ops` and folding `longrunning` into `agent-runtime`. This is a significant architectural change. The ADR is written in W0 but **no task in the entire plan performs the consolidation**. Either:
- Add an implementation task (likely W6 refactor wave, effort 3) for the merge, or  
- Explicitly mark ADR-024 as "decision deferred" with a note that implementation is out of scope for this plan.  

As-is, an ADR is committed that promises a change that never happens — misleading to future agents.

---

### B2 — T0-05 commits intentionally failing tests to the repo (line 89)
The task explicitly states: *"NON sono test che devono passare — sono test che MISURANO lo stato attuale."* The verify array only checks `test -f` and `cargo check` — it does not check how `cargo test` behaves. These tests will make `cargo test --workspace` **fail at WC1 (line 316-317)**, which requires the baseline tests to now *pass* as security checks.

This creates a contradictory state: the tests are committed broken, then WC1 expects them to "pass" (meaning bypass fails), but there's no task that converts them from baseline-measurement mode to assertion mode.

**Fix required:** T0-05 must either:
- Mark baseline tests with `#[ignore]` and document a separate `cargo test -- --ignored` invocation for baseline measurement, or  
- Make them a standalone script (not a test module) that writes `security_baseline_results.json` without being part of the test suite.

---

### B3 — T3-01 verify array is empty of meaning for its scope (line 340)
T3-01 claims to remove all `Json(json!({"error": ...}))` patterns with HTTP 200 responses across **10 crates** (ipc, mesh, orchestrator, backup, build, cockpit, billing, observatory, deploy, delegation). The verify array contains only:
```
- cargo check --workspace
- cargo test --workspace
```
No grep to confirm the pattern is actually removed. An executor can change 1 file and call it done — CI will not catch this.

**Fix required:** Add verification such as:
```yaml
- "! grep -rn 'Json(json!.*error' daemon/crates/convergio-ipc/src/ daemon/crates/convergio-mesh/src/ daemon/crates/convergio-orchestrator/src/ | grep -v test"
- "bash daemon/scripts/error-baseline.sh | python3 -c \"import sys,json; d=json.load(sys.stdin); assert d['error_200_count'] == 0\""
```
Criterion 7 (meaningful verify) is violated.

---

### B4 — T2-05 verify is insufficient for 3 critical security fixes (line 287)
T2-05 covers:
1. Process scanner — strip command-line args from `ps aux` to prevent secret leakage
2. Secret isolation — replace XOR/fake encryption with real AEAD (AES-256-GCM or ChaCha20Poly1305)
3. Rate limiter — extract real client IP from `ConnectInfo`

The verify array only checks `! grep -q '"unknown"'` for fix #3. Fixes #1 and #2 have **zero verification**. For a security task, this is unacceptable. Secret isolation in particular is a cryptographic change with no correctness check.

**Fix required:**
```yaml
- "cargo test -p convergio-security"  # must include AEAD roundtrip test
- "! grep -q 'xor\\|fake_encrypt\\|base64_only' daemon/crates/convergio-multitenancy/src/secret_isolation.rs"
- "grep -q 'Aes256Gcm\\|ChaCha20Poly1305' daemon/crates/convergio-multitenancy/src/secret_isolation.rs"
- "! grep -q 'args\\|cmdline' daemon/crates/convergio-ipc/src/process_scanner.rs"
```

---

## ADVISORIES

### A1 — T5-01 embeds ADR-026 inside an implementation task (line 529)
ADR-026 (API versioning strategy) is authored inside T5-01 (wave W5, Prevention Gates). Criterion 10 requires ADR tasks to come **before** implementation tasks. Even though no implementation task in this plan depends on ADR-026, mixing ADR authoring into a CI-gate implementation task is a pattern violation.

**Recommendation:** Extract ADR-026 to a `T0-07` in W0 (it's a 30-min planning task, fits effort 1). T5-01 becomes cleaner (CI gates + unsafe annotations only).

---

### A2 — T3-01 scope is too large for a single task (line 340)
10 crates, effort 3 (max 16h). Realistic estimate for systematic error-handling refactor across 10 crates is 20-30h. This will either: (a) be done incompletely, or (b) overflow the task budget.

**Recommendation:** Split into two tasks:
- `T3-01a`: Fix ipc, mesh, orchestrator, backup (4 crates most critical)
- `T3-01b`: Fix build, cockpit, billing, observatory, deploy, delegation (6 crates)

---

### A3 — T1-03 outsources to another spec file (line 179)
`T1-03` says: *"Eseguire fix CLI-API alignment da specs/fix-cli-api-alignment.yaml"* — this makes the current spec non-self-contained. An executor must read a second YAML to know what to do. If `fix-cli-api-alignment.yaml` changes, T1-03 changes implicitly with no version control.

**Recommendation:** Either inline the key fixes (there are only 3 listed) or add `depends_on: fix-cli-api-alignment.yaml` as an explicit metadata field so the relationship is tracked.

---

### A4 — T4-02 verify too weak for 30-test requirement (line 455)
T4-02 requires "minimum 30 test cases" but verify only checks `test -f`. Add:
```yaml
- "grep -c '#\[test\]' daemon/tests/e2e/critical_routes.rs | xargs -I{} sh -c 'test {} -ge 30'"
```

---

### A5 — T4-03 scope too broad — 4 unrelated concerns (line 475)
T4-03 bundles: contract test ratchet + deploy tests + SSH mock + CI additions (dependabot, cargo-audit, Tauri CI check). These have no coupling to each other. If any one part fails, all four are stuck.

**Recommendation:** Split into `T4-03a` (contract ratchet + deploy tests) and `T4-03b` (CI/CD additions).

---

### A6 — T6-01 scope is very broad for effort 3 (line 578)
9 file splits + main.rs refactor. Each split requires: rename, re-export, update mod declarations, verify cargo check. 9 × ~2h = ~18h, which exceeds effort 3 ceiling (16h).

**Recommendation:** Split into two tasks by priority: T6-01a (top 5 largest files), T6-01b (remaining 4 + main.rs).

---

### A7 — W3 and W4 are both marked parallel:true but T6-02 depends on T3-02 (line 615)
T6-02 references "nel TaskSupervisor (T3-02)" and adds metrics to it. W3 runs before W6 in the wave sequence, so this is not a runtime ordering problem. But the dependency is implicit — if an executor runs W6 without W3 being complete (e.g., in a parallel multi-agent setup), T6-02 will fail.

**Recommendation:** Add `depends_on: T3-02` to T6-02 metadata.

---

## PASSES

| Criterion | Status |
|-----------|--------|
| All required fields present on every task | ✅ Pass |
| No todo!() or empty handlers | ✅ Pass |
| Wave ordering respects dependencies | ✅ Pass |
| Checkpoint waves at correct intervals (WC1 at task 14, WC2 at task 21) | ✅ Pass |
| Final closure wave: TF-tests → TF-doc → TF-pr → TF-deploy-verify | ✅ Pass |
| Model selection appropriate (opus for ADR, sonnet for security, codex for coding, mini for mechanical) | ✅ Pass |
| Effort values realistic for most tasks | ✅ Pass (exceptions noted in A2, A6) |
| No duplicate work between tasks | ✅ Pass |
| ADR-013/ADR-014/ADR-015 come before their implementation tasks | ✅ Pass |

---

## SUMMARY TABLE

| ID | Severity | Criterion Violated | Issue |
|----|----------|--------------------|-------|
| B1 | BLOCKER | #2 (no scaffold work) | ADR-024 promises crate consolidation with no implementation task |
| B2 | BLOCKER | #2 (working code) | T0-05 baseline tests committed in failing state, breaks WC1 |
| B3 | BLOCKER | #7 (meaningful verify) | T3-01 verifies nothing about 200+error pattern removal |
| B4 | BLOCKER | #7 (meaningful verify) | T2-05 verifies only 1 of 3 security fixes |
| A1 | ADVISORY | #10 (ADR before impl) | ADR-026 authored in W5 instead of W0 |
| A2 | ADVISORY | #8 (realistic effort) | T3-01 scope too large for effort 3 |
| A3 | ADVISORY | self-containment | T1-03 delegates to external spec file |
| A4 | ADVISORY | #7 (meaningful verify) | T4-02 doesn't verify test count |
| A5 | ADVISORY | maintainability | T4-03 bundles 4 unrelated concerns |
| A6 | ADVISORY | #8 (realistic effort) | T6-01 exceeds effort 3 ceiling |
| A7 | ADVISORY | dependency tracking | T6-02 implicit dependency on T3-02 undeclared |
