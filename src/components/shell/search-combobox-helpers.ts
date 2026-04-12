/**
 * Helpers for the SearchCombobox — data fetching, types, fuzzy filter.
 * Extracted to keep search-combobox.tsx under 250 lines.
 */

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Bot, Building2, ClipboardList, Globe,
  Moon, Monitor, Palette, Plus, Shield, Stethoscope, Sun,
} from "lucide-react"
import * as api from "@/lib/api"
import type { Agent, Plan, Org } from "@/lib/types"

// ---------------------------------------------------------------------------
// Item types
// ---------------------------------------------------------------------------

export interface NavItem {
  type: "nav"
  label: string
  href: string
  icon?: LucideIcon
  desc?: string
  group: "navigation" | "categories" | "components" | "agents" | "plans" | "orgs" | "quickActions"
}

export interface ThemeItem {
  type: "theme"
  label: string
  value: "light" | "dark" | "navy" | "colorblind"
  icon: LucideIcon
  group: "theme"
}

export interface ActionItem {
  type: "action"
  label: string
  action: string
  icon: LucideIcon
  group: "quickActions"
}

export type PaletteItem = NavItem | ThemeItem | ActionItem

// ---------------------------------------------------------------------------
// Theme items
// ---------------------------------------------------------------------------

export const THEME_DEFS: readonly { key: string; value: ThemeItem["value"]; icon: LucideIcon }[] = [
  { key: "light", value: "light", icon: Sun },
  { key: "dark", value: "dark", icon: Moon },
  { key: "navy", value: "navy", icon: Monitor },
  { key: "colorblind", value: "colorblind", icon: Shield },
] as const

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------

export const QUICK_ACTIONS: readonly { labelKey: string; action: string; icon: LucideIcon; href?: string }[] = [
  { labelKey: "spawnAgent", action: "navigate:/agents", icon: Plus, href: "/agents" },
  { labelKey: "createPlan", action: "navigate:/plans", icon: ClipboardList, href: "/plans" },
  { labelKey: "runDoctor", action: "navigate:/doctor", icon: Stethoscope, href: "/doctor" },
  { labelKey: "switchTheme", action: "cycle-theme", icon: Palette },
  { labelKey: "switchLanguage", action: "cycle-lang", icon: Globe },
] as const

// ---------------------------------------------------------------------------
// Fuzzy match
// ---------------------------------------------------------------------------

/** Case-insensitive subsequence match. */
export function fuzzyMatch(text: string, query: string): boolean {
  const lText = text.toLowerCase()
  const lQuery = query.toLowerCase()
  let qi = 0
  for (let i = 0; i < lText.length && qi < lQuery.length; i++) {
    if (lText[i] === lQuery[qi]) qi++
  }
  return qi === lQuery.length
}

/** Score a text against query terms — higher = better match. */
function scoreText(text: string, terms: string[]): number {
  const lower = text.toLowerCase()
  let score = 0
  for (const term of terms) {
    if (lower === term) score += 5
    else if (lower.startsWith(term)) score += 4
    else if (lower.includes(term)) score += 3
    else if (fuzzyMatch(lower, term)) score += 1
  }
  return score
}

/** Filter and rank palette items by query. */
export function filterItems(items: PaletteItem[], query: string): PaletteItem[] {
  if (!query.trim()) return items
  const terms = query.toLowerCase().trim().split(/\s+/)

  return items
    .map((item) => {
      const fields = [item.label]
      if ("desc" in item && item.desc) fields.push(item.desc)
      if ("href" in item && item.href) fields.push(item.href)
      if ("action" in item) fields.push(item.action)
      const score = fields.reduce((s, f) => s + scoreText(f, terms), 0)
      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

// ---------------------------------------------------------------------------
// Data fetching hook — loads agents, plans, orgs from daemon
// ---------------------------------------------------------------------------

interface ConvergioData {
  agents: Agent[]
  plans: Plan[]
  orgs: Org[]
  loaded: boolean
}

export function useConvergioData(enabled: boolean): ConvergioData {
  const [data, setData] = useState<ConvergioData>({
    agents: [],
    plans: [],
    orgs: [],
    loaded: false,
  })
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!enabled || fetchedRef.current) return
    fetchedRef.current = true

    const fetchAll = async () => {
      const [agents, plans, orgs] = await Promise.allSettled([
        api.agentList(),
        api.planList(),
        api.orgList(),
      ])
      setData({
        agents: agents.status === "fulfilled" ? agents.value : [],
        plans: plans.status === "fulfilled" ? plans.value : [],
        orgs: orgs.status === "fulfilled" ? orgs.value : [],
        loaded: true,
      })
    }
    fetchAll()
  }, [enabled])

  return data
}

// ---------------------------------------------------------------------------
// Build items from daemon data
// ---------------------------------------------------------------------------

export function buildAgentItems(agents: Agent[]): NavItem[] {
  return agents.slice(0, 8).map((a) => ({
    type: "nav",
    label: a.name,
    href: `/agents/${encodeURIComponent(a.name)}`,
    icon: Bot,
    desc: a.description || a.tier,
    group: "agents",
  }))
}

export function buildPlanItems(plans: Plan[]): NavItem[] {
  return plans.slice(0, 8).map((p) => ({
    type: "nav",
    label: p.name,
    href: `/plans/${encodeURIComponent(p.id)}`,
    icon: ClipboardList,
    desc: p.status,
    group: "plans",
  }))
}

export function buildOrgItems(orgs: Org[]): NavItem[] {
  return orgs.slice(0, 8).map((o) => ({
    type: "nav",
    label: o.name,
    href: `/orgs/${encodeURIComponent(o.id)}`,
    icon: Building2,
    desc: o.status,
    group: "orgs",
  }))
}

export function buildQuickActionItems(
  labels: Record<string, string>,
): ActionItem[] {
  return QUICK_ACTIONS.map((qa) => ({
    type: "action",
    label: labels[qa.labelKey] ?? qa.labelKey,
    action: qa.action,
    icon: qa.icon,
    group: "quickActions",
  }))
}

export function buildThemeItems(
  labels: Record<string, string>,
): ThemeItem[] {
  return THEME_DEFS.map((td) => ({
    type: "theme",
    label: labels[td.key] ?? td.key,
    value: td.value,
    icon: td.icon,
    group: "theme",
  }))
}

// ---------------------------------------------------------------------------
// Group items by category for rendering
// ---------------------------------------------------------------------------

export type GroupKey = PaletteItem["group"]

export const GROUP_ORDER: GroupKey[] = [
  "quickActions",
  "agents",
  "plans",
  "orgs",
  "navigation",
  "categories",
  "theme",
  "components",
]

export function groupItems(items: PaletteItem[]): Map<GroupKey, PaletteItem[]> {
  const map = new Map<GroupKey, PaletteItem[]>()
  for (const item of items) {
    const group = item.group
    if (!map.has(group)) map.set(group, [])
    map.get(group)!.push(item)
  }
  return map
}
