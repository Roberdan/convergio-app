"use client";

import { useCallback, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { Sidebar, type NavSection } from "./sidebar";
import { Header } from "./header";

export interface AppShellProps {
  children: React.ReactNode;
  sections: NavSection[];
  brandName?: string;
  brandLogo?: string;
  /** Optional slot for accessibility FAB (e.g. MnA11yFab). */
  a11ySlot?: ReactNode;
}

export function AppShell({ children, sections, brandName, brandLogo, a11ySlot }: AppShellProps) {
  const t = useLocale("shell");
  const pathname = usePathname();
  // Start collapsed so mobile Sheet is closed on initial render
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), []);

  const breadcrumb = buildBreadcrumb(brandName ?? t.brandFallback, pathname, sections, t.dashboard);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
      >
        {t.skipToContent}
      </a>
      <Header
        onMenuToggle={toggleSidebar}
        breadcrumb={breadcrumb}
      />
      <div className="flex pt-[52px]">
        <Sidebar
          sections={sections}
          collapsed={collapsed}
          onToggle={toggleSidebar}
          brandName={brandName}
          brandLogo={brandLogo}
        />
        <main id="main-content" className="flex-1 min-h-[calc(100vh-52px)] overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      {a11ySlot}
    </>
  );
}

function buildBreadcrumb(brand: string, pathname: string, sections: NavSection[], dashboard = "Dashboard"): string[] {
  if (pathname === "/") return [brand, dashboard];
  for (const section of sections) {
    for (const item of section.items) {
      if (item.href === pathname) return [brand, item.label];
    }
  }
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  return [brand, slug.charAt(0).toUpperCase() + slug.slice(1)];
}
