'use client';

import { useMemo } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import type { MeshPeer, MeshStatus, NodeReadiness } from '@/lib/types';
import { meshPeers, meshStatus, nodeReadiness } from '@/lib/api-ext';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge } from '@/components/maranello/data-display';
import { MnHubSpoke, type HubSpokeHub, type HubSpokeSpoke } from '@/components/maranello/agentic';
import { MnStateScaffold } from '@/components/maranello/feedback';
import { useMeshLocale } from './mesh-i18n';

const STATUS_TONE: Record<string, 'success' | 'danger'> = {
  online: 'success', offline: 'danger',
};

export default function MeshPage() {
  const t = useMeshLocale();

  const { data: peers, loading, error, refetch } = useApiQuery<MeshPeer[]>(
    meshPeers, { pollInterval: 15_000 },
  );
  const { data: status } = useApiQuery<MeshStatus>(
    meshStatus, { pollInterval: 15_000 },
  );
  const { data: readiness } = useApiQuery<NodeReadiness>(
    nodeReadiness, { pollInterval: 30_000 },
  );

  const peerCols: DataTableColumn[] = useMemo(() => [
    { key: 'peer', label: 'Peer', sortable: true },
    { key: 'version', label: 'Version', sortable: true },
    { key: 'status', label: t.online, type: 'status' as const },
    { key: 'last_seen_str', label: 'Last Seen', sortable: true },
  ], [t]);

  const tableData = useMemo(
    () => (peers ?? []).map((p) => ({
      ...p,
      last_seen_str: new Date(p.last_seen * 1000).toLocaleString(),
    })),
    [peers],
  );

  const hub: HubSpokeHub = { label: t.thisNode, status: 'online' };
  const spokes: HubSpokeSpoke[] = useMemo(
    () => (peers ?? []).map((p) => ({
      label: p.peer,
      status: p.status === 'online' ? ('online' as const) : ('offline' as const),
      connected: p.status === 'online',
    })),
    [peers],
  );

  const onlinePeers = (peers ?? []).filter((p) => p.status === 'online').length;
  const totalPeers = (peers ?? []).length;

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <MnBadge tone={(peers ?? []).some((p) => p.status === 'offline') ? 'warning' : 'success'}>
          {t.onlineCount(onlinePeers, totalPeers)}
        </MnBadge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label={t.totalPeers} value={totalPeers} />
        <KpiCard label={t.online} value={onlinePeers} />
        <KpiCard label={t.offline} value={totalPeers - onlinePeers}
          warn={totalPeers > 0 && onlinePeers < totalPeers} />
        <KpiCard label={t.totalSynced} value={status?.total_synced ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.networkTopology} collapsible defaultOpen>
          <div className="flex items-center justify-center p-4">
            <MnHubSpoke hub={hub} spokes={spokes} />
          </div>
        </MnSectionCard>

        <MnSectionCard title={t.nodeReadiness} collapsible defaultOpen>
          <div className="space-y-2 p-4">
            {readiness ? (
              <>
                <div className="flex items-center gap-2 pb-2">
                  <MnBadge tone={readiness.ready ? 'success' : 'danger'}>
                    {readiness.ready ? t.ready : t.notReady}
                  </MnBadge>
                </div>
                {(Array.isArray(readiness.checks)
                  ? readiness.checks
                  : Object.entries(readiness.checks ?? {}).map(([k, v]) => ({
                      name: k,
                      ok: v === 'ok' || v === true || (typeof v === 'number' && v > 0),
                      message: typeof v === 'string' ? v : String(v),
                    }))
                ).map((c) => (
                  <div key={c.name} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                    <span className="text-sm font-medium">{c.name}</span>
                    <div className="flex items-center gap-2">
                      {c.message && <span className="text-xs text-muted-foreground">{c.message}</span>}
                      <MnBadge tone={c.ok ? 'success' : 'danger'}>{c.ok ? 'OK' : 'FAIL'}</MnBadge>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t.loading}</p>
            )}
          </div>
        </MnSectionCard>
      </div>

      <MnSectionCard title={t.allPeers} badge={totalPeers} collapsible defaultOpen>
        <MnDataTable columns={peerCols}
          data={tableData as unknown as Record<string, unknown>[]}
          emptyMessage={t.noPeers} />
      </MnSectionCard>

      <MnSectionCard title={t.recentActivity} collapsible defaultOpen>
        <div className="space-y-2 p-4">
          {(peers ?? []).sort((a, b) => b.last_seen - a.last_seen).map((p) => (
            <div key={p.peer} className="flex items-center gap-3 border-b border-border py-2 last:border-0">
              <MnBadge tone={STATUS_TONE[p.status] ?? 'danger'}>{p.status}</MnBadge>
              <span className="text-sm font-medium">{p.peer}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(p.last_seen * 1000).toLocaleString()}
              </span>
              {p.version && <span className="font-mono text-xs text-muted-foreground">{p.version}</span>}
            </div>
          ))}
          {(peers ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">{t.noPeerActivity}</p>
          )}
        </div>
      </MnSectionCard>
    </div>
  );
}

function KpiCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${warn ? 'text-destructive' : ''}`}>{value}</p>
    </div>
  );
}
