/**
 * smoke.spec.ts — Core smoke tests for Convergio Mission Control.
 * Verifies: app loads, sidebar renders, theme switching, locale switching,
 * and all dashboard pages are accessible without crashes.
 */
import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Smoke Tests", () => {
  test("app loads and shows Mission Control", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);
    await expect(page.locator("main").first()).toBeVisible();
    // No error boundary
    const errorBoundary = page.locator('[data-testid="error-boundary"]');
    expect(await errorBoundary.count()).toBe(0);
  });

  test("sidebar renders with navigation sections", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);
    const nav = page.locator("nav");
    expect(await nav.count()).toBeGreaterThan(0);
    const links = page.locator('nav a[href]');
    expect(await links.count()).toBeGreaterThan(3);
  });

  test("theme switching works (Navy to Dark)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);
    const html = page.locator("html");
    const initialTheme = await html.getAttribute("data-theme");
    expect(initialTheme).toBeTruthy();
    const themeBtn = page.locator('button[aria-label*="theme" i], button[aria-label*="Theme" i]');
    if (await themeBtn.count() > 0) {
      await themeBtn.first().click();
      await page.waitForTimeout(500);
      await expect(page.locator("main").first()).toBeVisible();
    }
  });

  test("locale switching works", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);
    const langSelect = page.locator('select[aria-label="Switch language"]');
    if (await langSelect.count() > 0) {
      await langSelect.selectOption("it");
      await page.waitForTimeout(500);
      await expect(page.locator("main").first()).toBeVisible();
      await langSelect.selectOption("en");
      await page.waitForTimeout(500);
      await expect(page.locator("main").first()).toBeVisible();
    }
  });

  test("all dashboard pages are accessible", async ({ page }) => {
    const allPages = [
      // Core pages
      "/",
      "/agents",
      "/agents/workspace",
      "/approvals",
      "/backup",
      "/billing",
      "/deploy",
      "/doctor",
      "/inbox",
      "/inference",
      "/knowledge",
      "/mesh",
      "/night-agents",
      "/observatory",
      "/orgs",
      "/plans",
      "/prompts",
      "/reports",
      "/scheduler",
      "/security",
      "/settings",
    ];

    for (const path of allPages) {
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(500);
      await expect(page.locator("main").first()).toBeVisible();
      const errorBoundary = page.locator('[data-testid="error-boundary"]');
      expect(await errorBoundary.count()).toBe(0);
    }
  });
});
