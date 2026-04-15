import { test, expect } from "./fixtures";

test.describe("Smoke — App bootstrap", () => {
  test.beforeEach(async ({ authenticatedPage, apiMock }) => {
    await apiMock.mockDefaults();
    await authenticatedPage.goto("/");
    await authenticatedPage.waitForLoadState("domcontentloaded");
    await authenticatedPage.waitForTimeout(2000);
  });

  test("app loads", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator("main").first()).toBeVisible({ timeout: 10000 });
    const bodyText = await authenticatedPage.locator("body").textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(20);
  });

  test("sidebar renders", async ({ authenticatedPage }) => {
    const navLinks = authenticatedPage.locator("nav a[href], aside a[href]");
    expect(await navLinks.count()).toBeGreaterThanOrEqual(5);
  });
});

test.describe("Smoke — Theme switching", () => {
  test("applies navy theme", async ({ authenticatedPage, themeHelper, apiMock }) => {
    await apiMock.mockDefaults();
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "navy"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    await themeHelper.waitFor("navy");
    expect(await themeHelper.get()).toBe("navy");
  });

  test("applies dark theme", async ({ authenticatedPage, themeHelper, apiMock }) => {
    await apiMock.mockDefaults();
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "dark"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    await themeHelper.waitFor("dark");
    expect(await themeHelper.get()).toBe("dark");
  });
});

test.describe("Smoke — Visual regression", () => {
  test("Navy theme screenshot", async ({ authenticatedPage, themeHelper, apiMock }) => {
    await apiMock.mockDefaults();
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "navy"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    await themeHelper.waitFor("navy");
    await expect(page).toHaveScreenshot("dashboard-navy.png", { fullPage: true });
  });

  test("Dark theme screenshot", async ({ authenticatedPage, themeHelper, apiMock }) => {
    await apiMock.mockDefaults();
    const page = authenticatedPage;
    await page.addInitScript(() => { localStorage.setItem("convergio-theme", "dark"); });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    await themeHelper.waitFor("dark");
    await expect(page).toHaveScreenshot("dashboard-dark.png", { fullPage: true });
  });
});

test.describe("Smoke — Locale", () => {
  test("search placeholder visible", async ({ authenticatedPage, apiMock }) => {
    await apiMock.mockDefaults();
    await authenticatedPage.goto("/");
    await authenticatedPage.waitForLoadState("domcontentloaded");
    await authenticatedPage.waitForTimeout(2000);
    await expect(authenticatedPage.getByPlaceholder("Search...")).toBeVisible({ timeout: 5000 });
  });
});
