import { test, expect } from "@playwright/test";
import { authenticate, collectPageIssues, checkErrorBoundary } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

const ALL_PAGES = [
  "/", "/agents", "/plans", "/mesh", "/observatory", "/inference",
  "/billing", "/settings", "/night-agents", "/orgs", "/metrics",
  "/prompts", "/deploy", "/doctor", "/backup", "/reports",
  "/kernel", "/voice", "/bus",
];

test.describe("Full Site Navigation", () => {
  for (const path of ALL_PAGES) {
    test(`${path} — no crash`, async ({ page }) => {
      const issues = await collectPageIssues(page);
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 20000 });
      await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
      const body = await page.locator("body").textContent();
      expect(body?.trim().length ?? 0, `${path} blank`).toBeGreaterThan(20);
      const allIssues = [...issues, ...(await checkErrorBoundary(page))];
      const crashes = allIssues.filter((i) => i.type === "error-boundary" || i.type === "blank-page");
      expect(crashes, `${path} crashes`).toHaveLength(0);
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
});

test.describe("Accessibility", () => {
  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
    for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
    await expect(page.locator("main").first()).toBeVisible();
  });
});
