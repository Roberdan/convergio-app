/**
 * crud-security.spec.ts — Security page verification.
 * Verifies: Trust Levels section, Secrets Filters section, Tenancy Resources section.
 * Security page uses data tables with section cards (no edit tabs in current UI).
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Security page", () => {
  test("page renders without crash", async ({ page }) => {
    await page.goto("/security", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("main").first()).toBeVisible();

    const body = await page.locator("body").textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(20);
    expect(body?.includes("Something went wrong")).toBe(false);
  });

  test("Trust Levels section is visible", async ({ page }) => {
    await page.goto("/security", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Section card with trust levels heading
    const trustSection = page.getByText(/Trust Levels|Trust/i).first();
    await expect(trustSection).toBeVisible();
  });

  test("Secrets Filters section is visible", async ({ page }) => {
    await page.goto("/security", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const secretsSection = page.getByText(/Secrets|Secret Filters/i).first();
    await expect(secretsSection).toBeVisible();
  });

  test("Tenancy Resources section is visible", async ({ page }) => {
    await page.goto("/security", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const resourcesSection = page.getByText(/Tenancy|Resources/i).first();
    await expect(resourcesSection).toBeVisible();
  });

  test("org filter input is present and accepts text", async ({ page }) => {
    await page.goto("/security", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    // Org ID filter input in header area
    const orgInput = page.locator('input[type="text"]').first();
    await expect(orgInput).toBeVisible();

    await orgInput.fill("test-org");
    await page.waitForTimeout(400);

    // Page should remain functional
    await expect(page.locator("main").first()).toBeVisible();
  });

  test("section cards render (table or empty state inside)", async ({ page }) => {
    await page.goto("/security", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const cards = page.locator(".rounded-md.border, .rounded-lg.border");
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
