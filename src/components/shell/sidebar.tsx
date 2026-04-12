"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import {
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { SidebarNav } from "./sidebar-nav";

/* ── Public types ── */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface SidebarProps {
  sections: NavSection[];
  collapsed: boolean;
  onToggle: () => void;
  brandName?: string;
  brandLogo?: string;
}

/* ── Media query hook ── */

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return mobile;
}

/* ── Footer section (empty — available for downstream apps) ── */

function useFooterSection(): NavSection {
  const t = useLocale("sidebar");
  return React.useMemo(() => ({ label: t.support, items: [] }), [t.support]);
}

/* ── Shared sidebar content (brand + nav + footer) ── */

function SidebarInner({
  sections,
  collapsed,
  brandName,
  brandLogo,
}: {
  sections: NavSection[];
  collapsed: boolean;
  brandName: string;
  brandLogo?: string;
}) {
  const footerSection = useFooterSection();
  return (
    <>
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-sidebar-border px-4 gap-2",
          collapsed && "justify-center px-2"
        )}
      >
        {brandLogo && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={brandLogo} alt="" aria-hidden="true" className="h-7 w-7 shrink-0 object-contain" />
        )}
        {collapsed ? (
          !brandLogo && (
            <span className="font-heading text-lg font-bold text-sidebar-primary">
              {brandName.charAt(0)}
            </span>
          )
        ) : (
          <span className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
            {brandName}
          </span>
        )}
      </div>
      <SidebarNav sections={sections} collapsed={collapsed} />
      <div className="border-t border-sidebar-border">
        <SidebarNav sections={[footerSection]} collapsed={collapsed} />
      </div>
    </>
  );
}

/* ── Collapse toggle ── */

function CollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const t = useLocale("sidebar");
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const label = collapsed ? t.expandSidebar : t.collapseSidebar;
  const classes = cn(
    "flex items-center justify-center rounded-md p-2",
    "text-sidebar-foreground hover:bg-sidebar-accent",
    "hover:text-sidebar-accent-foreground transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-sidebar-ring"
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onToggle}
              aria-label={label}
              className={classes}
            />
          }
        >
          <Icon className="size-5" />
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className={classes}
    >
      <Icon className="size-5" />
    </button>
  );
}

/* ── Main Sidebar ── */

export function Sidebar({
  sections,
  collapsed,
  onToggle,
  brandName,
  brandLogo,
}: SidebarProps) {
  const t = useLocale("sidebar");
  const isMobile = useIsMobile();
  const resolvedBrand = brandName ?? t.brandFallback;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col",
          "h-[calc(100vh-52px)] sticky top-[52px] overflow-hidden",
          "bg-sidebar text-sidebar-foreground",
          "border-r border-sidebar-border",
          "transition-[width] duration-200 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarInner
          sections={sections}
          collapsed={collapsed}
          brandName={resolvedBrand}
          brandLogo={brandLogo}
        />
        <div
          className={cn(
            "flex border-t border-sidebar-border p-3",
            collapsed ? "justify-center" : "justify-end"
          )}
        >
          <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
        </div>
      </aside>

      {/* Mobile sheet overlay */}
      {isMobile && (
        <Sheet
          open={!collapsed}
          onOpenChange={(open) => {
            if (!open) onToggle();
          }}
        >
          <SheetContent
            side="left"
            className="gap-0 bg-sidebar p-0 text-sidebar-foreground"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{resolvedBrand}</SheetTitle>
            </SheetHeader>
            <SidebarInner
              sections={sections}
              collapsed={false}
              brandName={resolvedBrand}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
