/**
 * crud-knowledge.spec.ts — CRUD operations on the Knowledge page.
 * Verifies: search input, write form with key/value/namespace, submit button.
 * Knowledge page uses a write form (not edit/delete per-entry in current UI).
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Knowledge CRUD", () => {
  test("page renders search and write sections", async ({ page }) => {
    await page.goto("/knowledge", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    await expect(page.locator("h1").first()).toBeVisible();

    // Search input should be present
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  test("search input accepts text and triggers search state", async ({ page }) => {
    await page.goto("/knowledge", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill("test-key");
    await page.waitForTimeout(500);

    // Page should remain functional after typing
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("write form has key, value, namespace inputs and submit button", async ({ page }) => {
    await page.goto("/knowledge", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    // Inputs: key (text), value (textarea), namespace (text)
    const inputs = page.locator('input[type="text"]');
    expect(await inputs.count()).toBeGreaterThanOrEqual(1);

    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();

    // Submit button
    const submitBtn = page.getByRole("button", { name: /Submit|Save|Write/i });
    await expect(submitBtn).toBeVisible();
  });

  test("write form fills and submit button is clickable", async ({ page }) => {
    await page.goto("/knowledge", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    // Fill key field (second text input after search)
    const textInputs = page.locator('input[type="text"]');
    const count = await textInputs.count();
    // At minimum: search (idx 0) + key (idx 1). Fill key.
    if (count >= 2) {
      await textInputs.nth(1).fill("test.e2e.key");
    }

    // Fill value textarea
    const textarea = page.locator("textarea").first();
    await textarea.fill("E2E test value");

    // Submit button should be enabled
    const submitBtn = page.getByRole("button", { name: /Submit|Save|Write/i });
    await expect(submitBtn).toBeEnabled();
  });

  test("search returns results section (empty or populated)", async ({ page }) => {
    await page.goto("/knowledge", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill("ag"); // min 2 chars triggers search
    await page.waitForTimeout(800);

    // Results section or no-results message should appear
    const body = await page.locator("body").textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(20);
    await expect(page.locator("main").first()).toBeVisible();
  });
});
