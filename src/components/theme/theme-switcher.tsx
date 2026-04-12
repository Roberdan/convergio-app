"use client";

import { useTheme, type Theme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Sun, Eye } from "lucide-react";

const THEME_META: Record<Theme, { label: string; icon: typeof Sun }> = {
  light: { label: "Light", icon: Sun },
  dark: { label: "Dark", icon: Moon },
  navy: { label: "Navy", icon: Monitor },
  colorblind: { label: "Colorblind", icon: Eye },
};

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const current = THEME_META[theme];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Theme: ${current.label}`}
      >
        <Icon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => {
          const meta = THEME_META[t];
          const ItemIcon = meta.icon;
          return (
            <DropdownMenuItem
              key={t}
              onClick={() => setTheme(t)}
              className={t === theme ? "bg-accent" : ""}
            >
              <ItemIcon className="mr-2 h-4 w-4" />
              {meta.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
