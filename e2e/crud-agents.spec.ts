/**
 * crud-agents.spec.ts — CRUD operations on the Agents page.
 * Verifies: spawn modal opens/closes, row click shows detail panel, kill action visible.
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Agents CRUD", () => {
  test("Spawn Agent button is visible and opens modal", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const spawnBtn = page.getByRole("button", { name: /Spawn Agent/i });
    await expect(spawnBtn).toBeVisible();
    await spawnBtn.click();
    await page.waitForTimeout(300);

    // Modal should open with a title
    const modalTitle = page.getByRole("dialog").getByText(/Spawn Agent/i);
    await expect(modalTitle).toBeVisible();
  });

  test("Spawn modal contains required form fields", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /Spawn Agent/i }).click();
    await page.waitForTimeout(300);

    // Name input placeholder "e.g. Elena"
    const nameInput = page.locator('input[placeholder*="Elena"]');
    await expect(nameInput).toBeVisible();

    // Model select should exist
    const modelSelect = page.locator("select").first();
    await expect(modelSelect).toBeVisible();
  });

  test("Spawn modal Cancel button closes modal", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /Spawn Agent/i }).click();
    await page.waitForTimeout(300);

    const nameInput = page.locator('input[placeholder*="Elena"]');
    await expect(nameInput).toBeVisible();

    await page.getByRole("button", { name: /Cancel/i }).click();
    await page.waitForTimeout(300);

    await expect(nameInput).not.toBeVisible();
  });

  test("Agents table is rendered (table or empty state)", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Either rows or empty message should be present
    const tableOrEmpty = page.locator('table, [role="table"], [data-testid="empty-state"], p');
    await expect(tableOrEmpty.first()).toBeVisible();

    // Page should not be blank
    const body = await page.locator("body").textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(20);
  });

  test("Clicking an agent row shows detail panel with Kill action", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Try clicking a data row — only verify if rows exist
    const rows = page.locator('tr[role="row"], tbody tr').filter({ hasNotText: /Name|Model|Tier/ });
    const rowCount = await rows.count();
    if (rowCount === 0) {
      // Empty catalog — skip row-click assertions
      return;
    }

    await rows.first().click();
    await page.waitForTimeout(400);

    // Detail panel should appear with Kill button
    const killBtn = page.getByRole("button", { name: /Kill/i });
    await expect(killBtn).toBeVisible();
  });
});
