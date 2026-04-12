"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { useSse } from "@/hooks/use-sse";
import * as api from "@/lib/api";
import type { RuntimeView, RuntimeWorker, IpcEvent } from "@/lib/types";
import { MnSectionCard } from "@/components/maranello/layout";
import { MnStateScaffold } from "@/components/maranello/feedback";
import { MnFormField } from "@/components/maranello/forms";
import { useWorkspaceLocale } from "./workspace-i18n";
import type { CommandEntry } from "./workspace-helpers";
import { makeEntry } from "./workspace-helpers";
import { AgentDetail, AgentRow, CommandEntryView } from "./workspace-components";
import { Activity, Cpu, DollarSign, Send } from "lucide-react";

const ORG_ID = "convergio-io";

export default function AgentWorkspacePage() {
  const t = useWorkspaceLocale();
  const [selected, setSelected] = useState<RuntimeWorker | null>(null);
  const [events, setEvents] = useState<IpcEvent[]>([]);
  const [commandLog, setCommandLog] = useState<CommandEntry[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: runtime, loading, error, refetch } = useApiQuery<RuntimeView>(
    api.agentRuntime,
    { pollInterval: 5_000 },
  );

  useSse({
    onMessage: useCallback((e: IpcEvent) => {
      setEvents((prev) => [e, ...prev].slice(0, 50));
    }, []),
  });

  const agents = useMemo(() => runtime?.active_agents ?? [], [runtime]);

  const agentEvents = useMemo(() => {
    if (!selected) return events.slice(0, 10);
    return events
      .filter((e) => e.from === selected.agent_name || e.to === selected.agent_name)
      .slice(0, 10);
  }, [events, selected]);

  const handleSend = useCallback(async () => {
    const msg = message.trim();
    if (!msg || sending) return;
    const entry = makeEntry(msg);
    setCommandLog((prev) => [entry, ...prev].slice(0, 30));
    setMessage("");
    setSending(true);
    try {
      const res = await api.orgAsk(ORG_ID, msg, "agent-workspace");
      setCommandLog((prev) =>
        prev.map((c) => c.id === entry.id ? { ...c, reply: res.reply } : c),
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      setCommandLog((prev) =>
        prev.map((c) => c.id === entry.id ? { ...c, error: errMsg } : c),
      );
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [message, sending]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (loading) return <MnStateScaffold state="loading" message="Loading workspace..." />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      {runtime && (
        <div className="grid grid-cols-3 gap-3">
          <KpiTile icon={<Cpu size={16} />} label={t.active} value={agents.length} />
          <KpiTile icon={<Activity size={16} />} label={t.queueDepth} value={runtime.queue_depth} />
          <KpiTile icon={<DollarSign size={16} />} label={t.totalSpent}
            value={`$${runtime.total_spent_usd.toFixed(2)}`} />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <MnSectionCard title={t.agentList} badge={agents.length} collapsible defaultOpen>
          {agents.length === 0 ? (
            <p className="p-4" style={{ color: "var(--mn-text-muted)" }}>{t.noAgents}</p>
          ) : (
            <div className="divide-y">
              {agents.map((a) => (
                <AgentRow key={a.id} agent={a} selected={selected?.id === a.id}
                  onSelect={() => setSelected(a)} t={t} />
              ))}
            </div>
          )}
        </MnSectionCard>

        <MnSectionCard title={selected ? selected.agent_name : t.agentDetail} collapsible defaultOpen>
          {selected ? (
            <AgentDetail agent={selected} events={agentEvents} t={t} />
          ) : (
            <p className="p-4" style={{ color: "var(--mn-text-muted)" }}>{t.selectAgent}</p>
          )}
        </MnSectionCard>
      </div>

      {/* Bidirectional command panel — SSE inbound + POST outbound */}
      <MnSectionCard title={t.commandPanel} collapsible defaultOpen>
        <div className="flex flex-col gap-3 p-4">
          <MnFormField label="">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.commandPlaceholder}
                disabled={sending}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
                style={{
                  background: "var(--mn-surface-input)",
                  borderColor: "var(--mn-border)",
                  color: "var(--mn-text)",
                }}
              />
              <button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                style={{ background: "var(--mn-accent)", color: "var(--mn-accent-text)" }}
              >
                <Send size={14} />
                {sending ? t.sending : t.sendCommand}
              </button>
            </div>
          </MnFormField>

          <div>
            <p className="mb-2 text-sm font-medium">{t.responses}</p>
            {commandLog.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--mn-text-muted)" }}>{t.noResponses}</p>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {commandLog.map((entry) => (
                  <CommandEntryView key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        </div>
      </MnSectionCard>
    </div>
  );
}

function KpiTile({ icon, label, value }: {
  icon: React.ReactNode; label: string; value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <span style={{ color: "var(--mn-text-muted)" }}>{icon}</span>
      <div>
        <p className="text-xs" style={{ color: "var(--mn-text-muted)" }}>{label}</p>
        <p className="text-lg font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
