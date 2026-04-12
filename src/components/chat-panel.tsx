"use client"

import * as React from "react"
import { useCallback, useRef, useState } from "react"
import { X, Bot, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { MnSectionCard } from "@/components/maranello/layout"
import { MnChat, type ChatMessage } from "@/components/maranello/agentic"

/* ── Types ─────────────────────────────────────────────── */

interface AgentOption { id: string; name: string; description: string }

interface ChatPanelProps {
  open: boolean
  onClose: () => void
  agents?: AgentOption[]
  defaultAgent?: string
  orgId?: string
  className?: string
}

/* ── Constants ─────────────────────────────────────────── */

const DEFAULT_AGENTS: AgentOption[] = [
  { id: "jervis", name: "Jervis", description: "Platform orchestrator" },
  { id: "nasra", name: "NaSra", description: "Research analyst" },
]
const CHAT_TITLE = "AI Assistant"
const PLACEHOLDER = "Ask anything..."
const AGENT_LABEL = "Agent"

/* ── Helpers ───────────────────────────────────────────── */

let msgCounter = 0
function createMessage(role: "user" | "assistant", content: string, streaming = false): ChatMessage {
  msgCounter += 1
  return { id: `msg-${Date.now()}-${msgCounter}`, role, content, timestamp: new Date(), streaming }
}

/* ── Agent Selector ────────────────────────────────────── */

function AgentSelector({ agents, selected, onSelect }: {
  agents: AgentOption[]; selected: string; onSelect: (id: string) => void
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const current = agents.find((a) => a.id === selected) ?? agents[0]

  React.useEffect(() => {
    if (!dropdownOpen) return
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [dropdownOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((p) => !p)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
          "border border-[var(--mn-border)] bg-[var(--mn-surface-input)]",
          "text-[var(--mn-text)] hover:bg-[var(--mn-hover-bg)]",
          "transition-colors duration-150",
        )}
        aria-label={AGENT_LABEL}
        aria-expanded={dropdownOpen}
      >
        <Bot className="size-3 text-[var(--mn-accent)]" />
        <span>{current?.name ?? selected}</span>
        <ChevronDown className={cn("size-3 transition-transform", dropdownOpen && "rotate-180")} />
      </button>

      {dropdownOpen && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1 w-48",
            "rounded-lg border border-[var(--mn-border)]",
            "bg-[var(--mn-surface-overlay)] shadow-lg",
          )}
          role="listbox"
          aria-label={AGENT_LABEL}
        >
          {agents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              role="option"
              aria-selected={agent.id === selected}
              onClick={() => { onSelect(agent.id); setDropdownOpen(false) }}
              className={cn(
                "flex w-full flex-col px-3 py-2 text-left text-xs transition-colors",
                "hover:bg-[var(--mn-hover-bg)]",
                agent.id === selected && "bg-[var(--mn-accent-bg)]",
              )}
            >
              <span className="font-medium text-[var(--mn-text)]">{agent.name}</span>
              <span className="text-[var(--mn-text-muted)]">{agent.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Component ────────────────────────────────────── */

function ChatPanel({
  open,
  onClose,
  agents = DEFAULT_AGENTS,
  defaultAgent = "jervis",
  orgId,
  className,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(defaultAgent)
  const abortRef = useRef<AbortController | null>(null)

  const handleSend = useCallback(async (text: string) => {
    const userMsg = createMessage("user", text)
    const assistantMsg = createMessage("assistant", "", true)
    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setLoading(true)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const allMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          agent: selectedAgent,
          ...(orgId ? { orgId } : {}),
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: { message: "Request failed" } }))
        const errText = errData?.error?.message ?? `Error ${res.status}`
        setMessages((prev) =>
          prev.map((m) => m.id === assistantMsg.id ? { ...m, content: errText, streaming: false } : m),
        )
        return
      }

      if (!res.body) {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantMsg.id ? { ...m, content: "No response received.", streaming: false } : m),
        )
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const snapshot = accumulated
        setMessages((prev) =>
          prev.map((m) => m.id === assistantMsg.id ? { ...m, content: snapshot } : m),
        )
      }

      setMessages((prev) =>
        prev.map((m) => m.id === assistantMsg.id ? { ...m, content: accumulated, streaming: false } : m),
      )
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      const errText = err instanceof Error ? err.message : "Unknown error"
      setMessages((prev) =>
        prev.map((m) => m.id === assistantMsg.id ? { ...m, content: errText, streaming: false } : m),
      )
    } finally {
      setLoading(false)
    }
  }, [messages, selectedAgent, orgId])

  if (!open) return null

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-40 flex h-full w-96 flex-col",
        "border-l border-[var(--mn-border)] bg-[var(--mn-surface)]",
        "shadow-xl transition-transform duration-200",
        className,
      )}
      aria-label={CHAT_TITLE}
    >
      <MnSectionCard
        title={CHAT_TITLE}
        collapsible={false}
        noPadding
        variant="flat"
        className="flex h-full flex-col border-0 rounded-none"
        action={{ label: "", onClick: onClose }}
      >
        {/* Toolbar: agent selector + close */}
        <div className="flex items-center justify-between border-b border-[var(--mn-border)] px-3 py-2">
          <AgentSelector agents={agents} selected={selectedAgent} onSelect={setSelectedAgent} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="rounded-md p-1 text-[var(--mn-text-muted)] hover:bg-[var(--mn-hover-bg)] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-0">
          <MnChat
            messages={messages}
            loading={loading}
            placeholder={PLACEHOLDER}
            onSend={handleSend}
            className="h-full border-0 rounded-none"
          />
        </div>
      </MnSectionCard>
    </aside>
  )
}

export { ChatPanel }
export type { ChatPanelProps, AgentOption }
