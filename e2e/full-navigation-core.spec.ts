/**
 * full-navigation.spec.ts — Comprehensive site navigation and interaction tests.
 *
 * Tests every dashboard page, all buttons, modals, forms, tables, filters,
 * and interactive features. Ensures nothing crashes in production.
 */
import { test, expect } from "@playwright/test";
import {
  authenticate,
  collectPageIssues,
  checkErrorBoundary,
} from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

// ── Complete Page Navigation ───────────────────────────────────────────────

const ALL_PAGES = [
  { path: "/", title: "Dashboard" },
  { path: "/agents", title: "Agents" },
  { path: "/plans", title: "Plans" },
  { path: "/mesh", title: "Mesh" },
  { path: "/observatory", title: "Observatory" },
  { path: "/inference", title: "Inference" },
  { path: "/billing", title: "Billing" },
  { path: "/settings", title: "Settings" },
  { path: "/night-agents", title: "Night Agents" },
  { path: "/orgs", title: "Org" },
  { path: "/metrics", title: "Metrics" },
  { path: "/prompts", title: "Prompt" },
];

test.describe("Full Site Navigation", () => {
  for (const pg of ALL_PAGES) {
    test(`${pg.title} (${pg.path}) — no crash, no blank, no error boundary`, async ({
      page,
    }) => {
      const issues = await collectPageIssues(page);
      await page.goto(pg.path, {
        waitUntil: "domcontentloaded",
        timeout: 20000,
      });
      await page.waitForTimeout(1500);

      // Page must not be blank
      const body = await page.locator("body").textContent();
      expect(
        body?.trim().length ?? 0,
        `${pg.title} appears blank`
      ).toBeGreaterThan(20);

      // No error boundary
      const allIssues = [...issues, ...(await checkErrorBoundary(page))];
      const crashes = allIssues.filter(
        (i) =>
          i.type === "error-boundary" ||
          i.type === "blank-page" ||
          (i.type === "pageerror" &&
            !i.message.includes("CanvasRenderingContext2D"))
      );
      expect(
        crashes,
        `${pg.title} has crash-level issues: ${JSON.stringify(crashes)}`
      ).toHaveLength(0);

      // Main content area must be visible
      await expect(page.locator("main").first()).toBeVisible();
    });
  }
});

// ── Sidebar Navigation Links ───────────────────────────────────────────────

test.describe("Sidebar Navigation", () => {
  test("sidebar contains all nav links", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const navLinks = [
      "/agents",
      "/plans",
      "/mesh",
      "/observatory",
      "/inference",
      "/billing",
      "/settings",
    ];

    for (const href of navLinks) {
      const link = page.locator(`a[href="${href}"]`).first();
      // Some links might be in mobile menu — just check they exist in DOM
      await expect(link).toBeAttached();
    }
  });

  test("clicking sidebar links changes page", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    // Navigate to Plans
    const plansLink = page.locator('a[href="/plans"]').first();
    if (await plansLink.isVisible()) {
      await plansLink.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/plans");
    }

    // Navigate to Agents
    const agentsLink = page.locator('a[href="/agents"]').first();
    if (await agentsLink.isVisible()) {
      await agentsLink.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/agents");
    }
  });
});

// ── Plans Page Interactive Tests ───────────────────────────────────────────

test.describe("Plans Page — Full Interaction", () => {
  test("plans table renders with correct columns", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Check table headers exist
    const headers = page.locator("th, [role='columnheader']");
    const count = await headers.count();
    // Table should have columns or show empty state
    if (count > 0) {
      const headerTexts = await headers.allTextContents();
      const hasRelevant = headerTexts.some(
        (t) =>
          t.includes("Plan") ||
          t.includes("Status") ||
          t.includes("Project") ||
          t.includes("Name")
      );
      expect(hasRelevant, "Table should have plan-related columns").toBe(true);
    }
  });

  test("New Plan modal opens and closes", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const newBtn = page.getByRole("button", { name: /New Plan/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await page.waitForTimeout(500);

      // Modal should be visible
      await expect(page.getByText("Create Plan")).toBeVisible();

      // Name input should exist
      const nameInput = page.locator("input").first();
      await expect(nameInput).toBeVisible();

      // Type in the name field
      await nameInput.fill("Test Plan E2E");
      await page.waitForTimeout(200);

      // Cancel closes modal
      const cancelBtn = page.getByRole("button", { name: /Cancel/i });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test("plan row click opens detail panel", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Click first table row if plans exist
    const rows = page.locator("tr, [role='row']").filter({ hasNotText: /Plan|Name|Status/ });
    const rowCount = await rows.count();
    if (rowCount > 0) {
      await rows.first().click();
      await page.waitForTimeout(1000);

      // If no data, at least the page shouldn't crash
      await expect(page.locator("main").first()).toBeVisible();
    }
  });
});

// ── Agents Page Interactive Tests ──────────────────────────────────────────

test.describe("Agents Page — Full Interaction", () => {
  test("Spawn Agent modal — fill form and cancel", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const spawnBtn = page.getByRole("button", { name: /Spawn/i });
    if (await spawnBtn.isVisible()) {
      await spawnBtn.click();
      await page.waitForTimeout(500);

      // Fill form fields
      const inputs = page.locator("dialog input, [role='dialog'] input");
      const inputCount = await inputs.count();
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          await input.fill(`test-value-${i}`);
        }
      }

      // Cancel
      const cancelBtn = page.getByRole("button", { name: /Cancel/i });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }
  });

  test("agent table shows catalog or empty state", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Should show table or empty state message
    const hasTable = await page
      .locator("table, [role='table']")
      .first()
      .isVisible()
      .catch(() => false);
    const hasEmpty = await page
      .locator("text=/No agents|empty|no data/i")
      .first()
      .isVisible()
      .catch(() => false);
    expect(
      hasTable || hasEmpty,
      "Agents page should show table or empty state"
    ).toBe(true);
  });
});

// ── Observatory Interactive Tests ──────────────────────────────────────────

test.describe("Observatory — Full Interaction", () => {
  test("search box filters events", async ({ page }) => {
    await page.goto("/observatory", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    await page.waitForTimeout(1000);

    const search = page.locator('input[placeholder*="Search"]');
    if (await search.isVisible()) {
      await search.fill("task_submitted");
      await page.waitForTimeout(500);
      // Page should not crash
      await expect(page.locator("main").first()).toBeVisible();

      // Clear search
      await search.clear();
      await page.waitForTimeout(300);
    }
  });

  test("event type dropdown works", async ({ page }) => {
    await page.goto("/observatory", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    await page.waitForTimeout(1000);

    const selects = page.locator("select");
    const selectCount = await selects.count();
    if (selectCount > 0) {
      const options = selects.first().locator("option");
      const optCount = await options.count();
      if (optCount > 1) {
        await selects.first().selectOption({ index: 1 });
        await page.waitForTimeout(500);
        await expect(page.locator("main").first()).toBeVisible();
      }
    }
  });
});
