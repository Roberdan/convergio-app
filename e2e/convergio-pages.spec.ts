import { test, expect } from "@playwright/test";
import { collectPageIssues, checkErrorBoundary, authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

/**
 * All Convergio app pages with expected content indicators.
 */
const PAGES = [
  { path: "/dashboard", name: "Dashboard", heading: /dashboard/i },
  { path: "/agents", name: "Agents", heading: /agents/i },
  { path: "/plans", name: "Plans", heading: /plans/i },
  { path: "/mesh", name: "Mesh Network", heading: /mesh/i },
  { path: "/deploy", name: "Deploy", heading: /deploy/i },
  { path: "/night-agents", name: "Night Agents", heading: /night/i },
  { path: "/observatory", name: "Observatory", heading: /observ/i },
  { path: "/metrics", name: "Metrics", heading: /metric/i },
  { path: "/kernel", name: "Kernel", heading: /kernel/i },
  { path: "/voice", name: "Voice", heading: /voice/i },
  { path: "/bus", name: "Message Bus", heading: /bus|ipc|message/i },
  { path: "/inference", name: "Inference", heading: /inference/i },
  { path: "/prompts", name: "Prompts", heading: /prompt/i },
  { path: "/reports", name: "Reports", heading: /report/i },
  { path: "/doctor", name: "Doctor", heading: /doctor|diagnos/i },
  { path: "/backup", name: "Backup", heading: /backup/i },
  { path: "/orgs", name: "Organizations", heading: /org/i },
  { path: "/billing", name: "Billing", heading: /billing/i },
  { path: "/settings", name: "Settings", heading: /setting/i },
];

test.describe("Convergio Pages — render without crashes", () => {
  for (const pg of PAGES) {
    test(`${pg.name} (${pg.path}) loads and renders`, async ({ page }) => {
      const issues = await collectPageIssues(page);
      await page.goto(pg.path, { waitUntil: "domcontentloaded", timeout: 20000 });

      // Wait for main content area
      await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });

      // Page should have visible content — heading, error state, or retry button
      // (API errors like 401 are expected when daemon requires auth)
      const content = page.locator("h1, h2, [data-testid='error'], button:has-text('Retry')").first();
      await expect(content).toBeVisible({ timeout: 10000 });

      // No crash-level issues
      const allIssues = [...issues, ...(await checkErrorBoundary(page))];
      const crashes = allIssues.filter(
        (i) =>
          i.type === "error-boundary" ||
          i.type === "blank-page" ||
          (i.type === "pageerror" &&
            !i.message.includes("CanvasRenderingContext2D") &&
            !i.message.includes("localhost:8420") &&
            !i.message.includes("CORS") &&
            !i.message.includes("Failed to fetch") &&
            !i.message.includes("ERR_CONNECTION_REFUSED"))
      );
      expect(crashes, `${pg.name} has crash-level issues`).toHaveLength(0);
    });
  }
});

test.describe("Convergio Pages — sidebar navigation", () => {
  test("all sidebar links are reachable", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1000);

    const sidebarLinks = page.locator("nav a[href]");
    const count = await sidebarLinks.count();
    expect(count).toBeGreaterThanOrEqual(15);

    // Collect all href values
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await sidebarLinks.nth(i).getAttribute("href");
      if (href && href.startsWith("/") && !hrefs.includes(href)) {
        hrefs.push(href);
      }
    }

    // Verify each page in PAGES has a sidebar link
    for (const pg of PAGES) {
      expect(hrefs, `Missing sidebar link for ${pg.name}`).toContain(pg.path);
    }
  });
});

test.describe("Convergio Pages — dashboard specific", () => {
  test("dashboard shows KPI cards", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Should show KPI strip or cards
    const kpiCards = page.locator("[class*='kpi'], [class*='strip'], [class*='metric']");
    const stripOrCards = (await kpiCards.count()) > 0
      || (await page.locator("text=Active Agents").count()) > 0;
    expect(stripOrCards).toBeTruthy();
  });

  test("dashboard shows brain visualization or placeholder", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Should have brain section or neural nodes section
    const hasBrain = (await page.locator("text=Brain 3D").count()) > 0
      || (await page.locator("text=Active Agents").count()) > 0;
    expect(hasBrain).toBeTruthy();
  });
});

test.describe("Convergio Pages — bus page", () => {
  test("bus page shows channels table", async ({ page }) => {
    await page.goto("/bus", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Should show channels section
    const hasChannels = (await page.locator("text=Channels").count()) > 0;
    expect(hasChannels).toBeTruthy();
  });
});

test.describe("Convergio Pages — kernel page", () => {
  test("kernel page shows daemon status", async ({ page }) => {
    await page.goto("/kernel", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);

    // Should show daemon online/offline badge
    const hasBadge = (await page.locator("text=Online").count()) > 0
      || (await page.locator("text=Offline").count()) > 0;
    expect(hasBadge).toBeTruthy();
  });
});
