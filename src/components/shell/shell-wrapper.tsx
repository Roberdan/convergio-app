"use client";

import { AppShell } from "@/components/shell/app-shell";
import { defaultNavSections } from "@/config/navigation";

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sections={defaultNavSections} brandName="Convergio">
      {children}
    </AppShell>
  );
}
