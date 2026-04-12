"use client";

import type { IpcEvent, RuntimeWorker } from "@/lib/types";
import { MnBadge } from "@/components/maranello/data-display";
import { Server } from "lucide-react";
import type { CommandEntry } from "./workspace-helpers";

type StageTone = "success" | "warning" | "danger" | "info" | "neutral";
const STAGE_TONE: Record<string, StageTone> = {
  running: "success",
  idle: "neutral",
  spawning: "info",
  error: "danger",
  stale: "warning",
};

export function stageTone(stage: string): StageTone {
  return STAGE_TONE[stage] ?? "neutral";
}

export function CommandEntryView({ entry }: { entry: CommandEntry }) {
  return (
    <div className="rounded-md border p-3 text-sm space-y-1"
      style={{ borderColor: "var(--mn-border-subtle)", background: "var(--mn-surface-raised)" }}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium break-all" style={{ color: "var(--mn-text)" }}>
          {entry.message}
        </span>
        <span className="shrink-0 text-xs tabular-nums" style={{ color: "var(--mn-text-muted)" }}>
          {new Date(entry.ts).toLocaleTimeString()}
        </span>
      </div>
      {entry.reply && (
        <p className="text-xs break-all" style={{ color: "var(--mn-text-muted)" }}>
          {entry.reply}
        </p>
      )}
      {entry.error && (
        <p className="text-xs break-all" style={{ color: "var(--mn-error)" }}>
          {entry.error}
        </p>
      )}
      {!entry.reply && !entry.error && (
        <p className="text-xs" style={{ color: "var(--mn-text-muted)" }}>...</p>
      )}
    </div>
  );
}

export function AgentRow({ agent, selected, onSelect, t }: {
  agent: RuntimeWorker; selected: boolean;
  onSelect: () => void; t: { org: string };
}) {
  return (
    <button onClick={onSelect} className={`flex w-full items-center justify-between p-3 text-left
      hover:bg-muted/50 ${selected ? "bg-muted/30" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{agent.agent_name}</p>
        <p className="text-xs" style={{ color: "var(--mn-text-muted)" }}>
          {t.org}: {agent.org_id}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs tabular-nums" style={{ color: "var(--mn-text-muted)" }}>
          ${agent.spent_usd.toFixed(2)}
        </span>
        <MnBadge tone={stageTone(agent.stage)}>{agent.stage}</MnBadge>
      </div>
    </button>
  );
}

export function AgentDetail({ agent, events, t }: {
  agent: RuntimeWorker; events: IpcEvent[];
  t: { model: string; node: string; budget: string; spent: string;
       stage: string; priority: string; currentTask: string; noTask: string;
       events: string; noEvents: string; org: string; lastActivity: string };
}) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <MnBadge tone={stageTone(agent.stage)}>{agent.stage}</MnBadge>
        <span className="text-sm" style={{ color: "var(--mn-text-muted)" }}>
          {agent.model ?? "unknown"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Field label={t.org} value={agent.org_id} />
        <Field label={t.node} value={agent.node} />
        <Field label={t.budget} value={`$${agent.budget_usd.toFixed(2)}`} />
        <Field label={t.spent} value={`$${agent.spent_usd.toFixed(2)}`} />
        <Field label={t.priority} value={String(agent.priority)} />
        <Field label={t.currentTask}
          value={agent.task_id != null ? `#${agent.task_id}` : t.noTask} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">{t.events}</p>
        {events.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--mn-text-muted)" }}>{t.noEvents}</p>
        ) : (
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {events.map((e, i) => (
              <div key={`${e.ts}-${i}`}
                className="flex items-start gap-2 rounded px-2 py-1 text-xs hover:bg-muted/30">
                <Server size={12} className="mt-0.5 shrink-0" style={{ color: "var(--mn-text-muted)" }} />
                <span className="flex-1 break-all">{e.content.slice(0, 120)}</span>
                <span className="shrink-0 tabular-nums" style={{ color: "var(--mn-text-muted)" }}>
                  {new Date(e.ts).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs" style={{ color: "var(--mn-text-muted)" }}>{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
