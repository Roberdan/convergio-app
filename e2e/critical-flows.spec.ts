import { test, expect } from "@playwright/test";
import { authenticate, collectPageIssues, checkErrorBoundary } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Dashboard", () => {
  test("loads and shows content", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const body = await page.locator("body").textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(20);
    const allIssues = [...issues, ...(await checkErrorBoundary(page))];
    const crashes = allIssues.filter((i) => i.type === "error-boundary" || i.type === "blank-page");
    expect(crashes, "Dashboard crashes").toHaveLength(0);
  });

  test("shows status badge", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const badge = page.locator("main").getByText(/Live|Offline|Disconnected|Demo/i);
    await expect(badge.first()).toBeVisible({ timeout: 5000 });
  });

  test("event stream filters render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const filters = page.locator("button").filter({ hasText: /All|Messages|Tasks|Completed|Delegations/ });
    const count = await filters.count();
    if (count > 0) {
      await filters.first().click();
      await expect(page.locator("main").first()).toBeVisible();
    }
  });
});

test.describe("Agents page", () => {
  test("renders without crash", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const allIssues = [...issues, ...(await checkErrorBoundary(page))];
    expect(allIssues.filter((i) => i.type === "error-boundary" || i.type === "blank-page")).toHaveLength(0);
  });

  test("handles daemon state gracefully", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const body = await page.locator("body").textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(20);
  });
});

test.describe("Plans page", () => {
  test("renders without crash", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    expect(issues.filter((i) => i.type === "error-boundary" || i.type === "blank-page")).toHaveLength(0);
  });
});

test.describe("Mesh Network page", () => {
  test("renders without crash", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/mesh", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    expect(issues.filter((i) => i.type === "error-boundary" || i.type === "blank-page")).toHaveLength(0);
  });
});

test.describe("Observatory page", () => {
  test("renders without crash", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/observatory", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    expect(issues.filter((i) => i.type === "error-boundary" || i.type === "blank-page")).toHaveLength(0);
  });
});

test.describe("Navigation", () => {
  test("sidebar has nav links in DOM", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('a[href="/agents"]').first()).toBeAttached({ timeout: 5000 });
  });

  test("all pages render without blank screen", async ({ page }) => {
    const pages = ["/", "/agents", "/plans", "/mesh", "/observatory", "/inference", "/billing", "/settings"];
    for (const path of pages) {
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 20000 });
      await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
      const body = await page.locator("body").textContent();
      expect(body?.trim().length ?? 0, `${path} blank`).toBeGreaterThan(20);
    }
  });
});
