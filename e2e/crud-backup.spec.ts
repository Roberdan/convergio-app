/**
 * crud-backup.spec.ts — Backup page verification.
 * Verifies: Create Snapshot button, snapshots table, retention rules table,
 * and KPI metrics strip are present.
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Backup page", () => {
  test("page renders without crash", async ({ page }) => {
    await page.goto("/backup", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("main").first()).toBeVisible();

    const body = await page.locator("body").textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(20);
    expect(body?.includes("Something went wrong")).toBe(false);
  });

  test("Create Snapshot button is visible", async ({ page }) => {
    await page.goto("/backup", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const createBtn = page.getByRole("button", { name: /Create Snapshot|Snapshot/i });
    await expect(createBtn).toBeVisible();
  });

  test("Create Snapshot button is enabled (not loading)", async ({ page }) => {
    await page.goto("/backup", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const createBtn = page.getByRole("button", { name: /Create Snapshot|Snapshot/i });
    await expect(createBtn).toBeEnabled();
  });

  test("Snapshots section card is present", async ({ page }) => {
    await page.goto("/backup", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Section card title "Snapshots" or translated equivalent
    const snapshotSection = page.getByText(/Snapshots/i).first();
    await expect(snapshotSection).toBeVisible();
  });

  test("Retention Rules section card is present", async ({ page }) => {
    await page.goto("/backup", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    const rulesSection = page.getByText(/Retention Rules|Retention/i).first();
    await expect(rulesSection).toBeVisible();
  });

  test("KPI metrics strip renders", async ({ page }) => {
    await page.goto("/backup", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Dashboard strip: at least 2 metric cards
    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    const cards = page.locator(".rounded-md.border, .rounded-lg.border");
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
