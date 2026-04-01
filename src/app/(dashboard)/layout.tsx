"use client";

import { AppShell } from "@/components/shell/app-shell";
import { defaultNavSections } from "@/config/navigation";
import { appConfig } from "@/config/app";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sections={defaultNavSections} brandName={appConfig.name}>
      {children}
    </AppShell>
  );
}
