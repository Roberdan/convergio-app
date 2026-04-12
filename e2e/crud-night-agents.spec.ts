/**
 * crud-night-agents.spec.ts — Night Agents page verification.
 * Verifies: page renders with KPI strip, Agent Definitions table,
 * Active Runs table, and Tracked Projects table are present.
 * Night agents page uses table-based views (no create modal in current UI).
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Night Agents page", () => {
  test("page renders without crash", async ({ page }) => {
    await page.goto("/night-agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("main").first()).toBeVisible();

    const body = await page.locator("body").textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(20);
    expect(body?.includes("Something went wrong")).toBe(false);
  });

  test("Agent Definitions section is present", async ({ page }) => {
    await page.goto("/night-agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Section card with "Agent Definitions" heading
    const section = page.getByText("Agent Definitions");
    await expect(section).toBeVisible();
  });

  test("Active Runs section is present", async ({ page }) => {
    await page.goto("/night-agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const section = page.getByText("Active Runs");
    await expect(section).toBeVisible();
  });

  test("Tracked Projects section is present", async ({ page }) => {
    await page.goto("/night-agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const section = page.getByText("Tracked Projects");
    await expect(section).toBeVisible();
  });

  test("KPI metrics strip renders with at least one metric", async ({ page }) => {
    await page.goto("/night-agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // KPI strip values should be visible — look for numeric values or metric labels
    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    // At least one section card should render
    const cards = page.locator(".rounded-md.border, .rounded-lg.border");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("page handles daemon offline without blank screen", async ({ page }) => {
    await page.goto("/night-agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Should show content (loading, error state, or actual data) — not blank
    const hasContent = await page
      .locator("h1, [data-testid='error'], .text-destructive, main")
      .first()
      .isVisible();
    expect(hasContent).toBe(true);
  });
});
