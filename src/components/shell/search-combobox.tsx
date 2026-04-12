"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3, Brain, DollarSign, FormInput, Home, Layout,
  MessageSquare, Navigation, Network,
  Search, Settings, Table, Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/lib/i18n"
import { useTheme } from "@/components/theme/theme-provider"
import { searchCatalog } from "@/lib/component-catalog"
import {
  type PaletteItem, type NavItem, type GroupKey,
  filterItems, groupItems, GROUP_ORDER,
  useConvergioData,
  buildAgentItems, buildPlanItems, buildOrgItems,
  buildQuickActionItems, buildThemeItems,
} from "./search-combobox-helpers"

const NAV_ICONS = [
  { key: "home" as const, href: "/", icon: Home },
] as const

const CATEGORY_ITEMS: readonly { label: string; href: string; icon: typeof Home }[] = [
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
]

const ITEM_CLS = "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm cursor-pointer transition-colors text-[var(--mn-text)] hover:bg-[var(--mn-hover-bg)]"
const ITEM_ACTIVE_CLS = "bg-[var(--mn-hover-bg)]"
const GROUP_CLS = "px-3 py-1 text-[0.65rem] uppercase tracking-wider text-[var(--mn-text-muted)]"

const GROUP_LABEL_KEYS: Record<GroupKey, string> = {
  quickActions: "quickActions",
  agents: "agents",
  plans: "plans",
  orgs: "organizations",
  navigation: "navigation",
  categories: "categories",
  theme: "theme",
  components: "components",
}

export function SearchCombobox() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const t = useLocale("searchCombobox")
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch Convergio objects when palette opens
  const cvgData = useConvergioData(open)

  // Build label lookup from typed i18n object
  const labels: Record<string, string> = useMemo(() => {
    const entries: Record<string, string> = {}
    for (const [k, v] of Object.entries(t)) entries[k] = v
    return entries
  }, [t])

  // Build all palette items
  const allItems = useMemo<PaletteItem[]>(() => {
    const navItems: NavItem[] = NAV_ICONS.map((i) => ({
      type: "nav", label: labels[i.key] ?? i.key,
      href: i.href, icon: i.icon, group: "navigation",
    }))
    const catItems: NavItem[] = CATEGORY_ITEMS.map((i) => ({
      type: "nav", label: i.label, href: i.href, icon: i.icon, group: "categories",
    }))
    const themeItems = buildThemeItems(labels)
    const quickActions = buildQuickActionItems(labels)
    const agentItems = buildAgentItems(cvgData.agents)
    const planItems = buildPlanItems(cvgData.plans)
    const orgItems = buildOrgItems(cvgData.orgs)

    return [...quickActions, ...agentItems, ...planItems, ...orgItems, ...navItems, ...catItems, ...themeItems]
  }, [labels, cvgData])

  // Component search results from catalog
  const catalogResults = query.length >= 2 ? searchCatalog(query).slice(0, 8) : []
  const catalogItems: NavItem[] = catalogResults.map((e) => ({
    type: "nav", label: e.name,
    href: `/showcase/${e.category}#${e.slug}`,
    desc: e.description, group: "components",
  }))

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (query.length >= 2) {
      return [...filterItems(allItems, query), ...catalogItems]
    }
    return allItems
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, query])

  // Group for rendering
  const grouped = useMemo(() => groupItems(filteredItems), [filteredItems])

  // Flat list for keyboard navigation
  const flatItems = useMemo(() => {
    const flat: PaletteItem[] = []
    for (const gk of GROUP_ORDER) {
      const g = grouped.get(gk)
      if (g) flat.push(...g)
    }
    return flat
  }, [grouped])

  // Cmd-K global shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const select = useCallback((item: PaletteItem) => {
    if (item.type === "theme") {
      setTheme(item.value)
    } else if (item.type === "action") {
      if (item.action.startsWith("navigate:")) {
        router.push(item.action.replace("navigate:", ""))
      }
      // cycle-theme and cycle-lang are placeholder actions
    } else if (item.type === "nav" && item.href) {
      router.push(item.href)
    }
    setOpen(false)
    setQuery("")
    inputRef.current?.blur()
  }, [router, setTheme])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === "Enter" && flatItems[activeIdx]) { e.preventDefault(); select(flatItems[activeIdx]) }
    else if (e.key === "Escape") { setOpen(false); inputRef.current?.blur() }
  }

  // Track flat index for rendering
  let runningIdx = 0

  return (
    <div ref={rootRef} className="relative w-full max-w-md" role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-controls="search-combobox-listbox" aria-owns="search-combobox-listbox">
      <div className="flex h-8 items-center gap-2 rounded-md border border-sidebar-border bg-sidebar px-3 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-colors">
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label={t.placeholder}
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded border border-sidebar-border bg-sidebar-accent px-1.5 py-0.5 font-mono text-[11px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </div>

      {open && (
        <div
          id="search-combobox-listbox"
          role="listbox"
          aria-label={t.searchResults}
          className="absolute top-[calc(100%+4px)] left-0 w-full max-h-80 overflow-y-auto rounded-lg border border-[var(--mn-border)] bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10 z-50"
        >
          {GROUP_ORDER.map((gk) => {
            const groupedItems = grouped.get(gk)
            if (!groupedItems || groupedItems.length === 0) return null
            const labelKey = GROUP_LABEL_KEYS[gk]
            const groupLabel = labels[labelKey] ?? labelKey
            const startIdx = runningIdx
            runningIdx += groupedItems.length

            return (
              <div key={gk}>
                {startIdx > 0 && <div className="mx-2 my-1 h-px bg-[var(--mn-border-subtle)]" />}
                <div className={GROUP_CLS}>{groupLabel}</div>
                {groupedItems.map((item, gi) => {
                  const idx = startIdx + gi
                  const Icon = "icon" in item ? item.icon : undefined
                  return (
                    <div key={`${gk}-${gi}`} role="option" aria-selected={idx === activeIdx}
                      className={cn(ITEM_CLS, idx === activeIdx && ITEM_ACTIVE_CLS)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => select(item)}>
                      {Icon ? <Icon className="size-4 text-muted-foreground" /> : <span className="text-xs font-mono text-muted-foreground w-4">Mn</span>}
                      <span>{item.label}</span>
                      {"desc" in item && item.desc && (
                        <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px]">{item.desc}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
          {query.length >= 2 && flatItems.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">{t.noResults}</div>
          )}
        </div>
      )}
    </div>
  )
}
