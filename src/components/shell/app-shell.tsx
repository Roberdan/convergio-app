"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, type NavSection } from "./sidebar";
import { Header } from "./header";
import { CommandMenu } from "./command-menu";

export interface AppShellProps {
  children: React.ReactNode;
  sections: NavSection[];
  brandName?: string;
}

export function AppShell({ children, sections, brandName }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), []);
  const openCommand = useCallback(() => setCommandOpen(true), []);

  const breadcrumb = buildBreadcrumb(brandName ?? "Convergio", pathname, sections);

  return (
    <>
      <Header
        onMenuToggle={toggleSidebar}
        onSearchClick={openCommand}
        breadcrumb={breadcrumb}
      />
      <Sidebar
        sections={sections}
        collapsed={collapsed}
        onToggle={toggleSidebar}
        brandName={brandName}
      />
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      <main
        className="pt-[52px] transition-[margin-left] duration-200 ease-out"
        style={{ marginLeft: collapsed ? 64 : 256 }}
      >
        <div className="p-6">{children}</div>
      </main>
    </>
  );
}

function buildBreadcrumb(brand: string, pathname: string, sections: NavSection[]): string[] {
  if (pathname === "/") return [brand, "Dashboard"];
  for (const section of sections) {
    for (const item of section.items) {
      if (item.href === pathname) return [brand, item.label];
    }
  }
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  return [brand, slug.charAt(0).toUpperCase() + slug.slice(1)];
}
