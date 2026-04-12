"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, ListTodo, MessageSquare, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import type { NavSection } from "./sidebar";

/* ── Types ── */

interface BottomTab {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

/* ── Helper: find href for a tab by scanning nav sections ── */

function findHref(sections: NavSection[], id: string): string {
  for (const section of sections) {
    for (const item of section.items) {
      if (item.id === id) return item.href;
    }
  }
  return "/";
}

/* ── Component ── */

export interface BottomTabBarProps {
  sections: NavSection[];
}

export function BottomTabBar({ sections }: BottomTabBarProps) {
  const t = useLocale("sidebar");
  const pathname = usePathname();

  const tabs: BottomTab[] = [
    { id: "home",   label: t.tabHome,   href: findHref(sections, "home")   || "/",         icon: Home },
    { id: "agents", label: t.tabAgents, href: findHref(sections, "agents") || "/agents",    icon: Bot },
    { id: "plans",  label: t.tabPlans,  href: findHref(sections, "plans")  || "/plans",     icon: ListTodo },
    { id: "chat",   label: t.tabChat,   href: findHref(sections, "chat")   || "/chat",      icon: MessageSquare },
    { id: "more",   label: t.tabMore,   href: findHref(sections, "settings")|| "/settings", icon: MoreHorizontal },
  ];

  return (
    <nav
      aria-label={t.tabMore}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "flex md:hidden",
        "h-16 items-stretch",
        "border-t border-sidebar-border bg-sidebar",
        /* safe-area inset for iPhone home indicator */
        "pb-[env(safe-area-inset-bottom,0px)]"
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === "home"
          ? pathname === tab.href
          : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5",
              "text-xs font-medium transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
              isActive
                ? "text-sidebar-primary"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-5 shrink-0",
                isActive && "stroke-[2.5]"
              )}
              aria-hidden="true"
            />
            <span className="truncate leading-none">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
