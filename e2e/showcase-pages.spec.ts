import { test, expect } from "@playwright/test";
import { collectPageIssues, checkErrorBoundary, authenticate } from "./helpers";

test.beforeEach(async ({ context }) => {
  await authenticate(context);
});

test.describe("Showcase Page", () => {
  test("renders all showcase sections", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/showcase", { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(1500);

    await expect(page.locator("h1").first()).toContainText("Maranello Component Showcase");

    const sections = page.locator("section[aria-labelledby]");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThanOrEqual(6);

    const allIssues = [...issues, ...(await checkErrorBoundary(page))];
    const crashes = allIssues.filter(
      (i) => (i.type === "error-boundary" || i.type === "blank-page") ||
        (i.type === "pageerror" && !i.message.includes("CanvasRenderingContext2D"))
    );
    expect(crashes, "Showcase page has crash-level issues").toHaveLength(0);
  });

  test("preview page renders all waves", async ({ page }) => {
    const issues = await collectPageIssues(page);
    await page.goto("/preview", { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(1500);

    const sectionCount = await page.locator("section").count();
    expect(sectionCount).toBeGreaterThanOrEqual(2);

    const allIssues = [...issues, ...(await checkErrorBoundary(page))];
    const crashes = allIssues.filter(
      (i) => i.type === "pageerror" || i.type === "error-boundary" || i.type === "blank-page"
    );
    expect(crashes, "Preview page has crash-level issues").toHaveLength(0);
  });
});
