import { test, expect } from "@playwright/test";
import { authenticate, collectPageIssues, checkErrorBoundary } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

const ALL_PAGES = [
  { path: "/", title: "Dashboard" },
  { path: "/agents", title: "Agents" },
  { path: "/plans", title: "Plans" },
  { path: "/mesh", title: "Mesh" },
  { path: "/observatory", title: "Observatory" },
  { path: "/inference", title: "Inference" },
  { path: "/billing", title: "Billing" },
  { path: "/settings", title: "Settings" },
  { path: "/night-agents", title: "Night Agents" },
  { path: "/orgs", title: "Organizations" },
  { path: "/metrics", title: "Metrics" },
  { path: "/prompts", title: "Prompts" },
  { path: "/deploy", title: "Deploy" },
  { path: "/doctor", title: "Doctor" },
  { path: "/backup", title: "Backup" },
  { path: "/reports", title: "Reports" },
  { path: "/kernel", title: "Kernel" },
  { path: "/voice", title: "Voice" },
  { path: "/bus", title: "Message Bus" },
];

test.describe("Full Site Navigation", () => {
  for (const pg of ALL_PAGES) {
    test(`${pg.title} (${pg.path}) — no crash`, async ({ page }) => {
      const issues = await collectPageIssues(page);
      await page.goto(pg.path, { waitUntil: "domcontentloaded", timeout: 20000 });
      await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
      const body = await page.locator("body").textContent();
      expect(body?.trim().length ?? 0, `${pg.title} blank`).toBeGreaterThan(20);
      const allIssues = [...issues, ...(await checkErrorBoundary(page))];
      const crashes = allIssues.filter((i) => i.type === "error-boundary" || i.type === "blank-page");
      expect(crashes, `${pg.title} crashes`).toHaveLength(0);
    });
  }
});

test.describe("Sidebar Navigation", () => {
  test("sidebar contains nav links", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    for (const href of ["/agents", "/plans", "/mesh", "/settings"]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached({ timeout: 5000 });
    }
  });

  test("clicking sidebar links changes page", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    const link = page.locator('a[href="/plans"]').first();
    if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
      await link.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/plans");
    }
  });
});

test.describe("Accessibility", () => {
  test("pages have heading structure", async ({ page }) => {
    for (const pg of ALL_PAGES.slice(0, 6)) {
      await page.goto(pg.path, { waitUntil: "domcontentloaded", timeout: 20000 });
      await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
      expect(await page.locator("h1, h2").count(), `${pg.title} missing headings`).toBeGreaterThanOrEqual(1);
    }
  });

  test("skip-to-content link exists", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator('a[href="#main-content"]')).toBeAttached({ timeout: 5000 });
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/plans", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
    await expect(page.locator("main").first()).toBeVisible();
  });
});
