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
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(20);
  });

  test("sidebar renders with navigation items", async ({ authenticatedPage }) => {
    const page = authenticatedPage;
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
    await expect(page.getByPlaceholder("Search...")).toBeVisible({ timeout: 5000 });
  });
});
