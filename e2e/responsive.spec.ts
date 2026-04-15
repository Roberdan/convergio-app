import { test, expect } from "@playwright/test";
import { authenticate } from "./helpers";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

const PAGES = [
  { path: "/", name: "Dashboard" },
  { path: "/agents", name: "Agents" },
  { path: "/plans", name: "Plans" },
  { path: "/mesh", name: "Mesh" },
  { path: "/observatory", name: "Observatory" },
];

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

for (const vp of VIEWPORTS) {
  test.describe(`Responsive — ${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const pg of PAGES) {
      test(`${pg.name} renders at ${vp.name}`, async ({ page }) => {
        await page.goto(pg.path, { waitUntil: "domcontentloaded", timeout: 20000 });
        await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
        const body = await page.locator("body").textContent();
        expect(body?.trim().length ?? 0, `${pg.name} blank at ${vp.name}`).toBeGreaterThan(20);
      });
    }

    test(`header visible at ${vp.name}`, async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
      await expect(page.locator("header").first()).toBeVisible({ timeout: 10000 });
    });
  });
}

test.describe("Mobile — sidebar", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("main content is visible on mobile", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("KPI grid — no overflow", () => {
  for (const vp of VIEWPORTS) {
    test(`no horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await authenticate(page.context());
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20000 });
      await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth, `Overflow at ${vp.name}`).toBeLessThanOrEqual(vp.width + 20);
    });
  }
});
