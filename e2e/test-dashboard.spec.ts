import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'Dashboard' },
  { path: '/agents', name: 'Agents' },
  { path: '/approvals', name: 'Approvals' },
  { path: '/backup', name: 'Backup' },
  { path: '/billing', name: 'Billing' },
  { path: '/deploy', name: 'Deploy' },
  { path: '/doctor', name: 'Doctor' },
  { path: '/inbox', name: 'Inbox' },
  { path: '/inference', name: 'Inference' },
  { path: '/knowledge', name: 'Knowledge' },
  { path: '/mesh', name: 'Mesh' },
  { path: '/night-agents', name: 'Night Agents' },
  { path: '/observatory', name: 'Observatory' },
  { path: '/orgs', name: 'Orgs' },
  { path: '/plans', name: 'Plans' },
  { path: '/prompts', name: 'Prompts' },
  { path: '/reports', name: 'Reports' },
  { path: '/scheduler', name: 'Scheduler' },
  { path: '/security', name: 'Security' },
  { path: '/settings', name: 'Settings' },
];

for (const pg of pages) {
  test(`${pg.name} loads without crash`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(pg.path, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    // Check no "Something went wrong" error boundary
    const errorBoundary = page.locator('text=Something went wrong');
    const hasError = await errorBoundary.count();
    expect(hasError, `${pg.name} shows error boundary`).toBe(0);
    // Check no console errors
    expect(errors, `${pg.name} has console errors: ${errors.join(', ')}`).toHaveLength(0);
  });
}
