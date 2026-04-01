import { PageRenderer } from "@/components/page-renderer";
import { dashboardConfig } from "@/config/pages/dashboard.config";

/**
 * Dashboard page — rendered from config.
 * Edit src/config/pages/dashboard.config.ts to change the content.
 */
export default function DashboardPage() {
  return <PageRenderer config={dashboardConfig} />;
}
