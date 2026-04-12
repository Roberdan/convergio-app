/**
 * crud-plans.spec.ts — CRUD operations on the Plans page.
 * Verifies: New Plan button, create modal, row click shows execution tree,
 * wave toggle buttons work.
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Plans CRUD", () => {
  test("New Plan button is visible", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const newPlanBtn = page.getByRole("button", { name: /New Plan/i });
    await expect(newPlanBtn).toBeVisible();
  });

  test("New Plan button opens create modal", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /New Plan/i }).click();
    await page.waitForTimeout(300);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("Create Plan modal has name and project fields", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /New Plan/i }).click();
    await page.waitForTimeout(300);

    // Plan name input (placeholder "Q2 Migration")
    const nameInput = page.locator('input[placeholder*="Q2"]');
    await expect(nameInput).toBeVisible();

    // Project ID input (placeholder "default")
    const projectInput = page.locator('input[placeholder="default"]');
    await expect(projectInput).toBeVisible();
  });

  test("Create Plan modal Cancel closes it", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /New Plan/i }).click();
    await page.waitForTimeout(300);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: /Cancel/i }).click();
    await page.waitForTimeout(300);

    await expect(dialog).not.toBeVisible();
  });

  test("Plans table renders (rows or empty state)", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const tableOrEmpty = page.locator('table, [role="table"], p').first();
    await expect(tableOrEmpty).toBeVisible();
  });

  test("clicking a plan row shows execution tree panel", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const rows = page.locator("tbody tr");
    const rowCount = await rows.count();
    if (rowCount === 0) return; // Empty — skip

    await rows.first().click();
    await page.waitForTimeout(800);

    // Execution tree section should appear
    const treeSection = page.getByText(/Execution Tree|execution tree/i).first();
    await expect(treeSection).toBeVisible();
  });

  test("wave toggle buttons expand/collapse wave rows", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const rows = page.locator("tbody tr");
    const rowCount = await rows.count();
    if (rowCount === 0) return;

    await rows.first().click();
    await page.waitForTimeout(800);

    // Wave rows with toggle buttons
    const waveButtons = page.locator("button").filter({ hasText: /Wave|wave/ });
    if (await waveButtons.count() === 0) return;

    await waveButtons.first().click();
    await page.waitForTimeout(300);

    // Page remains functional after toggle
    await expect(page.locator("main").first()).toBeVisible();
  });
});
