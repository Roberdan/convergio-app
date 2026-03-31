"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  Monitor,
  Moon,
  Plus,
  Settings,
  Shield,
  Sun,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useTheme } from "@/components/theme/theme-provider"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Projects", href: "/projects", icon: FolderKanban },
] as const

const THEME_ITEMS = [
  { label: "Light", value: "light" as const, icon: Sun },
  { label: "Dark", value: "dark" as const, icon: Moon },
  { label: "Navy", value: "navy" as const, icon: Monitor },
  { label: "Colorblind", value: "colorblind" as const, icon: Shield },
] as const

const ACTION_ITEMS = [
  { label: "Create project", icon: Plus },
  { label: "View notifications", icon: Bell },
] as const

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const { setTheme } = useTheme()

  // Global Cmd-K / Ctrl-K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  const handleNav = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [close, router],
  )

  const handleTheme = useCallback(
    (value: "light" | "dark" | "navy" | "colorblind") => {
      setTheme(value)
      close()
    },
    [setTheme, close],
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Palette"
      description="Search for a command to run..."
      className="sm:max-w-lg backdrop-blur-sm"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleNav(item.href)}
            >
              <item.icon className="size-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          {THEME_ITEMS.map((item) => (
            <CommandItem
              key={item.value}
              onSelect={() => handleTheme(item.value)}
            >
              <item.icon className="size-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {ACTION_ITEMS.map((item) => (
            <CommandItem key={item.label} onSelect={close}>
              <item.icon className="size-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
