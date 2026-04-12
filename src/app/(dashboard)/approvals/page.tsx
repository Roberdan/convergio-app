"use client";

import { useState, useCallback } from "react";
import { useApiQuery, ApiError } from "@/hooks/use-api-query";
import { MnSectionCard } from "@/components/maranello/layout";
import { MnBadge } from "@/components/maranello/data-display";
import { MnStateScaffold } from "@/components/maranello/feedback";
import { useApprovalsLocale } from "./approvals-i18n";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

interface Approval {
  id: string;
  action: string;
  requester: string;
  context: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

const AUTH_HEADERS = {
  "Authorization": `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN ?? ''}`,
  "Content-Type": "application/json",
};

async function fetchPendingApprovals(): Promise<Approval[]> {
  const res = await fetch("/api/approvals/pending", { headers: AUTH_HEADERS });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : (data.approvals ?? []);
}

async function respondApproval(id: string, verdict: "approved" | "rejected"): Promise<void> {
  const res = await fetch(`/api/approvals/${encodeURIComponent(id)}/respond`, {
    method: "POST",
    headers: AUTH_HEADERS,
    body: JSON.stringify({ verdict }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text);
  }
}

export default function ApprovalsPage() {
  const t = useApprovalsLocale();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingVerdict, setProcessingVerdict] = useState<"approved" | "rejected" | null>(null);

  const { data: approvals, loading, error, refetch } = useApiQuery<Approval[]>(
    fetchPendingApprovals,
    { pollInterval: 10_000 },
  );

  const isEndpointMissing = error?.includes("404") || error?.includes("Not Found");

  const handleRespond = useCallback(async (id: string, verdict: "approved" | "rejected") => {
    setProcessingId(id);
    setProcessingVerdict(verdict);
    try {
      await respondApproval(id, verdict);
      refetch();
    } catch {
      // error will show via refetch
    } finally {
      setProcessingId(null);
      setProcessingVerdict(null);
    }
  }, [refetch]);

  if (loading) return <MnStateScaffold state="loading" message={`${t.title}...`} />;

  if (isEndpointMissing) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <MnSectionCard title={t.pending}>
          <div className="flex items-center gap-3 p-6">
            <AlertTriangle size={20} style={{ color: "var(--mn-warning)" }} />
            <p style={{ color: "var(--mn-text-muted)" }}>{t.noEndpoint}</p>
          </div>
        </MnSectionCard>
      </div>
    );
  }

  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  const items = approvals ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <MnBadge tone={items.length > 0 ? "warning" : "success"}>
          {items.length} {t.pending.toLowerCase()}
        </MnBadge>
      </div>

      <MnSectionCard title={t.pending} badge={items.length} collapsible defaultOpen>
        {items.length === 0 ? (
          <div className="flex items-center gap-3 p-6">
            <CheckCircle size={20} style={{ color: "var(--mn-success)" }} />
            <p style={{ color: "var(--mn-text-muted)" }}>{t.noApprovals}</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <ApprovalRow
                key={item.id}
                item={item}
                processing={processingId === item.id}
                processingVerdict={processingVerdict}
                onApprove={() => handleRespond(item.id, "approved")}
                onReject={() => handleRespond(item.id, "rejected")}
                t={t}
              />
            ))}
          </div>
        )}
      </MnSectionCard>
    </div>
  );
}

function ApprovalRow({ item, processing, processingVerdict, onApprove, onReject, t }: {
  item: Approval;
  processing: boolean;
  processingVerdict: "approved" | "rejected" | null;
  onApprove: () => void;
  onReject: () => void;
  t: { action: string; requester: string; context: string; approve: string;
       reject: string; approving: string; rejecting: string };
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Clock size={14} style={{ color: "var(--mn-text-muted)" }} />
          <span className="text-sm font-medium">{item.action}</span>
        </div>
        <p className="text-xs" style={{ color: "var(--mn-text-muted)" }}>
          {t.requester}: {item.requester}
        </p>
        {item.context && (
          <p className="truncate text-xs" style={{ color: "var(--mn-text-muted)" }}>
            {item.context}
          </p>
        )}
        <p className="text-xs tabular-nums" style={{ color: "var(--mn-text-tertiary)" }}>
          {new Date(item.created_at).toLocaleString()}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={onApprove}
          disabled={processing}
          className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium
            hover:bg-muted/50 disabled:opacity-50"
          style={{ color: "var(--mn-success)" }}
        >
          <CheckCircle size={14} />
          {processing && processingVerdict === "approved" ? t.approving : t.approve}
        </button>
        <button
          onClick={onReject}
          disabled={processing}
          className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium
            hover:bg-muted/50 disabled:opacity-50"
          style={{ color: "var(--mn-error)" }}
        >
          <XCircle size={14} />
          {processing && processingVerdict === "rejected" ? t.rejecting : t.reject}
        </button>
      </div>
    </div>
  );
}
