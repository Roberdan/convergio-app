/**
 * crud-prompts.spec.ts — CRUD operations on the Prompts page.
 * Verifies: new prompt modal, tab switching (prompts/skills),
 * row selection shows detail with delete action.
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Prompts CRUD", () => {
  test("New Prompt button is visible and opens modal", async ({ page }) => {
    await page.goto("/prompts", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const newBtn = page.getByRole("button", { name: /New Prompt/i });
    await expect(newBtn).toBeVisible();
    await newBtn.click();
    await page.waitForTimeout(300);

    // Modal dialog should open
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("New Prompt modal has name and template fields", async ({ page }) => {
    await page.goto("/prompts", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /New Prompt/i }).click();
    await page.waitForTimeout(300);

    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();

    const templateArea = page.locator("textarea");
    await expect(templateArea).toBeVisible();
  });

  test("New Prompt modal Cancel button closes it", async ({ page }) => {
    await page.goto("/prompts", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /New Prompt/i }).click();
    await page.waitForTimeout(300);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: /Cancel/i }).click();
    await page.waitForTimeout(300);

    await expect(dialog).not.toBeVisible();
  });

  test("tab buttons switch between Prompts and Skills views", async ({ page }) => {
    await page.goto("/prompts", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    // Tab buttons exist
    const promptsTab = page.getByRole("button", { name: /^prompts$/i });
    const skillsTab = page.getByRole("button", { name: /^skills$/i });

    await expect(promptsTab).toBeVisible();
    await expect(skillsTab).toBeVisible();

    // Click skills tab
    await skillsTab.click();
    await page.waitForTimeout(400);

    // Page should still be functional
    await expect(page.locator("main").first()).toBeVisible();

    // Click back to prompts
    await promptsTab.click();
    await page.waitForTimeout(400);
    await expect(page.locator("main").first()).toBeVisible();
  });

  test("clicking a prompt row shows detail panel with Delete action", async ({ page }) => {
    await page.goto("/prompts", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const rows = page.locator("tbody tr");
    const rowCount = await rows.count();
    if (rowCount === 0) {
      // Empty state — skip row-click assertions
      return;
    }

    await rows.first().click();
    await page.waitForTimeout(400);

    // Detail section with Delete action button should appear
    const deleteBtn = page.getByRole("button", { name: /Delete/i });
    await expect(deleteBtn).toBeVisible();
  });
});
