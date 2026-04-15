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

  test("Spawn Agent button if available", async ({ page }) => {
    await page.goto("/agents", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const btn = page.getByRole("button", { name: /Spawn/i });
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(500);
      const cancel = page.getByRole("button", { name: /Cancel/i });
      if (await cancel.isVisible({ timeout: 2000 }).catch(() => false)) await cancel.click();
    }
    await expect(page.locator("main").first()).toBeVisible();
  });

  test("handles daemon offline gracefully", async ({ page }) => {
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

  test("New Plan button if available", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const btn = page.getByRole("button", { name: /New Plan/i });
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(500);
      const cancel = page.getByRole("button", { name: /Cancel/i });
      if (await cancel.isVisible({ timeout: 2000 }).catch(() => false)) await cancel.click();
    }
    await expect(page.locator("main").first()).toBeVisible();
  });
});

test.describe("Mesh Network page", () => {
  test("renders without crash", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/mesh", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    expect(issues.filter((i) => i.type === "error-boundary" || i.type === "blank-page")).toHaveLength(0);
  });

  test("shows heading", async ({ page }) => {
    await page.goto("/mesh", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Observatory page", () => {
  test("renders without crash", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/observatory", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    expect(issues.filter((i) => i.type === "error-boundary" || i.type === "blank-page")).toHaveLength(0);
  });

  test("search input works if available", async ({ page }) => {
    await page.goto("/observatory", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const search = page.locator('input[placeholder*="Search"]').first();
    if (await search.isVisible({ timeout: 3000 }).catch(() => false)) {
      await search.fill("agent");
      await page.waitForTimeout(500);
    }
    await expect(page.locator("main").first()).toBeVisible();
  });

  test("event type filter works if available", async ({ page }) => {
    await page.goto("/observatory", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const sel = page.locator("select").first();
    if (await sel.isVisible({ timeout: 3000 }).catch(() => false)) {
      const options = sel.locator("option");
      if ((await options.count()) > 1) {
        await sel.selectOption({ index: 1 });
        await page.waitForTimeout(500);
      }
    }
    await expect(page.locator("main").first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("sidebar nav links navigate correctly", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const link = page.locator('a[href="/agents"]').first();
    if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
      await link.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/agents");
    }
  });

  test("skip to main content link exists", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    const skip = page.locator('a[href="#main-content"]');
    await expect(skip).toBeAttached({ timeout: 5000 });
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
