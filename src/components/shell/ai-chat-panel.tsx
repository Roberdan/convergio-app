"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import { MnChat } from "@/components/maranello";
import type { ChatMessage } from "@/components/maranello/agentic/mn-chat";
import { orgAsk } from "@/lib/api-ext";

const ORG_ID = "convergio-io";
const STORAGE_KEY = "ai-chat-panel-open";

function loadOpen(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export interface AiChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiChatPanel({ open, onOpenChange }: AiChatPanelProps) {
  const t = useLocale("aiChatPanel");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Persist open state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(open));
    }
  }, [open]);

  const handleSend = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await orgAsk(ORG_ID, text);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: result.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: "assistant",
        content: t.errorSending,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Cmd+J / Ctrl+J keyboard shortcut — handled by parent AppShell
  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[8999] bg-black/30 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Sliding panel */}
      <div
        role="dialog"
        aria-label={t.title}
        aria-modal="true"
        className={cn(
          "fixed right-0 top-0 z-[9000] flex h-full w-full max-w-sm flex-col border-l bg-[var(--mn-surface)] shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--mn-border)] px-4 py-3">
          <span className="text-base font-semibold text-[var(--mn-text)]">{t.title}</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={t.close}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--mn-text-muted)] hover:bg-[var(--mn-hover-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mn-border-focus)]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-hidden p-3">
          <MnChat
            messages={messages}
            loading={loading}
            placeholder={t.placeholder}
            onSend={handleSend}
            className="h-full"
          />
        </div>
      </div>
    </>
  );
}

/** Restore open state from localStorage on first mount. */
export function useAiChatPanelState() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(loadOpen());
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return { open, setOpen, toggle };
}
