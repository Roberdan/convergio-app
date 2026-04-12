"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { Sidebar, type NavSection } from "./sidebar";
import { Header } from "./header";
import { BottomTabBar } from "./bottom-tab-bar";
import { AiChatPanel, useAiChatPanelState } from "./ai-chat-panel";
import { MnA11yFab } from "@/components/maranello";

export interface AppShellProps {
  children: React.ReactNode;
  sections: NavSection[];
  brandName?: string;
  brandLogo?: string;
}

export function AppShell({ children, sections, brandName, brandLogo }: AppShellProps) {
  const t = useLocale("shell");
  const pathname = usePathname();
  // Start collapsed so mobile Sheet is closed on initial render
  const [collapsed, setCollapsed] = useState(true);
  const { open: chatOpen, setOpen: setChatOpen, toggle: toggleChat } = useAiChatPanelState();

  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), []);

  // Cmd+J (Mac) / Ctrl+J (Windows/Linux) to toggle AI chat panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleChat();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggleChat]);

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
        onChatToggle={toggleChat}
      />
      <div className="flex pt-[52px]">
        <Sidebar
          sections={sections}
          collapsed={collapsed}
          onToggle={toggleSidebar}
          brandName={brandName}
          brandLogo={brandLogo}
        />
        {/* pb-16 on mobile leaves room for bottom tab bar; removed on md+ */}
        <main
          id="main-content"
          className="flex-1 min-h-[calc(100vh-52px)] overflow-auto pb-16 md:pb-0"
        >
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
      {/* Bottom tab bar — visible only on mobile (< md) */}
      <BottomTabBar sections={sections} />
      <AiChatPanel open={chatOpen} onOpenChange={setChatOpen} />
      <MnA11yFab />
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
