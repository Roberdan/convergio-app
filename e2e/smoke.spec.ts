/**
 * Smoke test — app loads, sidebar renders, theme switching works.
 */
import { test, expect } from "./fixtures";

test.describe("Smoke — App bootstrap", () => {
  test.beforeEach(async ({ authenticatedPage, apiMock }) => {
    await apiMock.mockDefaults();
    await authenticatedPage.goto("/");
    await authenticatedPage.waitForLoadState("domcontentloaded");
    await authenticatedPage.waitForTimeout(2000);
  });

  test("app loads and shows the dashboard", async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("body")).not.toHaveText("Something went wrong");
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(20);
  });

  test("sidebar renders with navigation items", async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const sidebar = page.locator("aside, nav").first();
    await expect(sidebar).toBeVisible({ timeout: 10000 });
    const navLinks = page.locator("nav a[href], aside a[href]");
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

test.describe("Smoke — Theme switching", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockDefaults();
  });

  test("switches from navy to dark and back", async ({ authenticatedPage, themeHelper }) => {
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "navy"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await themeHelper.waitFor("navy");
    expect(await themeHelper.get()).toBe("navy");

    await themeHelper.set("dark");
    await themeHelper.waitFor("dark");
    expect(await themeHelper.get()).toBe("dark");

    await themeHelper.set("navy");
    await themeHelper.waitFor("navy");
    expect(await themeHelper.get()).toBe("navy");
  });
});

test.describe("Smoke — Visual regression", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockDefaults();
  });

  test("Navy theme — dashboard screenshot", async ({ authenticatedPage, themeHelper }) => {
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "navy"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    await themeHelper.waitFor("navy");
    await expect(page).toHaveScreenshot("dashboard-navy.png", { fullPage: true });
  });

  test("Dark theme — dashboard screenshot", async ({ authenticatedPage, themeHelper }) => {
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "dark"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    await themeHelper.waitFor("dark");
    await expect(page).toHaveScreenshot("dashboard-dark.png", { fullPage: true });
  });

  test("Navy theme — sidebar screenshot", async ({ authenticatedPage, themeHelper }) => {
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "navy"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    await themeHelper.waitFor("navy");
    const sidebar = page.locator("aside").first();
    if (await sidebar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sidebar).toHaveScreenshot("sidebar-navy.png");
    }
  });

  test("Dark theme — sidebar screenshot", async ({ authenticatedPage, themeHelper }) => {
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "dark"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    await themeHelper.waitFor("dark");
    const sidebar = page.locator("aside").first();
    if (await sidebar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sidebar).toHaveScreenshot("sidebar-dark.png");
    }
  });
});

test.describe("Smoke — Locale labels", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockDefaults();
  });

  test("header shows search placeholder", async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    const search = page.getByPlaceholder("Search...");
    await expect(search).toBeVisible({ timeout: 5000 });
  });

  test("sidebar shows brand name", async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    const brand = page.locator("aside, nav").getByText("Convergio");
    await expect(brand.first()).toBeVisible({ timeout: 5000 });
  });
});
