"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Brain,
  DollarSign,
  FormInput,
  Home,
  Layout,
  MessageSquare,
  Monitor,
  Moon,
  Navigation,
  Network,
  Settings,
  Shield,
  Sun,
  Table,
  Target,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useTheme } from "@/components/theme/theme-provider"
import { searchCatalog } from "@/lib/component-catalog"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  anchorRef?: React.RefObject<HTMLElement | null>
}

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
] as const

const CATEGORY_ITEMS = [
  { label: "Agentic AI", href: "/showcase/agentic", icon: Brain },
  { label: "Data Display", href: "/showcase/data-display", icon: Table },
  { label: "Data Viz", href: "/showcase/data-viz", icon: BarChart3 },
  { label: "Feedback", href: "/showcase/feedback", icon: MessageSquare },
  { label: "Financial", href: "/showcase/financial", icon: DollarSign },
  { label: "Forms", href: "/showcase/forms", icon: FormInput },
  { label: "Layout", href: "/showcase/layout", icon: Layout },
  { label: "Navigation", href: "/showcase/navigation", icon: Navigation },
  { label: "Network", href: "/showcase/network", icon: Network },
  { label: "Operations", href: "/showcase/ops", icon: Settings },
  { label: "Strategy", href: "/showcase/strategy", icon: Target },
] as const

const THEME_ITEMS = [
  { label: "Light", value: "light" as const, icon: Sun },
  { label: "Dark", value: "dark" as const, icon: Moon },
  { label: "Navy", value: "navy" as const, icon: Monitor },
  { label: "Colorblind", value: "colorblind" as const, icon: Shield },
] as const

export function CommandMenu({ open, onOpenChange, anchorRef }: CommandMenuProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [query, setQuery] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)
  const results = query.length >= 2 ? searchCatalog(query).slice(0, 8) : []

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === "Escape" && open) {
        e.preventDefault()
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  // Position + focus when opening — use layout effect to avoid flicker
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const el = anchorRef?.current
    if (el) {
      const rect = el.getBoundingClientRect()
      panel.style.position = "fixed"
      panel.style.top = `${rect.bottom + 4}px`
      panel.style.left = `${rect.left}px`
      panel.style.width = `${rect.width}px`
      panel.style.right = ""
    } else {
      panel.style.position = "fixed"
      panel.style.top = "56px"
      panel.style.left = "16px"
      panel.style.right = "16px"
      panel.style.width = "auto"
    }
    requestAnimationFrame(() => {
      panel.querySelector<HTMLInputElement>("input")?.focus()
    })
  }) // runs every render when open — keeps position fresh

  const close = useCallback(() => {
    onOpenChange(false)
    setQuery("")
  }, [onOpenChange])

  const handleNav = useCallback(
    (href: string) => { close(); router.push(href) },
    [close, router],
  )

  const handleTheme = useCallback(
    (value: "light" | "dark" | "navy" | "colorblind") => { setTheme(value); close() },
    [setTheme, close],
  )

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs" onClick={close} aria-hidden="true" />
      <div ref={panelRef} role="dialog" aria-label="Command Palette" className="z-50">
        <Command
          shouldFilter={false}
          className="rounded-xl border border-[var(--mn-border)] bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10"
        >
          <CommandInput placeholder="Type a command or search..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {results.length > 0 ? (
              <CommandGroup heading="Components">
                {results.map((entry) => (
                  <CommandItem key={entry.slug} onSelect={() => handleNav(`/showcase/${entry.category}#${entry.slug}`)}>
                    <span className="text-xs font-mono text-muted-foreground w-4">Mn</span>
                    <span>{entry.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px]">{entry.description}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <>
                <CommandGroup heading="Navigation">
                  {NAV_ITEMS.map((item) => (
                    <CommandItem key={item.href} onSelect={() => handleNav(item.href)}>
                      <item.icon className="size-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Categories">
                  {CATEGORY_ITEMS.map((item) => (
                    <CommandItem key={item.href} onSelect={() => handleNav(item.href)}>
                      <item.icon className="size-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Theme">
                  {THEME_ITEMS.map((item) => (
                    <CommandItem key={item.value} onSelect={() => handleTheme(item.value)}>
                      <item.icon className="size-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </div>
    </>
  )
}
