'use client';

import { useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import * as extApi from '@/lib/api-ext';
import type { ExtensionInfo, DepGraph, AuditEntry, VersionInfo, Capability } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import {
  MnDataTable, type DataTableColumn, MnBadge,
} from '@/components/maranello/data-display';
import { MnStateScaffold } from '@/components/maranello/feedback';
import { MnHubSpoke, type HubSpokeHub, type HubSpokeSpoke } from '@/components/maranello/agentic';
import { useLanguage, type SupportedLocale } from '@/lib/i18n/language-provider';
import { useSettingsLocale } from './settings-i18n';
import { DaemonSwitcher } from './daemon-switcher';

const LOCALES: { value: SupportedLocale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'it', label: 'Italiano' },
  { value: 'es', label: 'Espanol' },
  { value: 'zh', label: '中文' },
];

export default function SettingsPage() {
  const t = useSettingsLocale();
  const { locale, setLocale } = useLanguage();
  const [tab, setTab] = useState<'config' | 'extensions' | 'depgraph' | 'security'>('config');

  const { data: extensions, loading, error, refetch } = useApiQuery<ExtensionInfo[]>(api.extensionList);
  const { data: depgraph } = useApiQuery<DepGraph>(api.depgraph);
  const { data: depValidation } = useApiQuery(api.depgraphValidate);
  const { data: audit } = useApiQuery<AuditEntry[]>(() => api.tenancyAudit({ limit: 50 }));
  const { data: versionInfo } = useApiQuery<VersionInfo>(extApi.doctorVersion);
  const { data: caps } = useApiQuery<Capability[]>(extApi.capabilities);

  const extCols: DataTableColumn[] = useMemo(() => [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'status', label: t.configuration, type: 'status' },
    { key: 'capabilities', label: t.capabilities },
  ], [t]);

  const auditCols: DataTableColumn[] = useMemo(() => [
    { key: 'timestamp', label: t.time, sortable: true },
    { key: 'action', label: t.action, sortable: true },
    { key: 'actor', label: t.actor, sortable: true },
    { key: 'org_id', label: t.org },
  ], [t]);

  const capCols: DataTableColumn[] = useMemo(() => [
    { key: 'name', label: t.capabilities, sortable: true },
    { key: 'enabled_display', label: t.configuration, type: 'status' },
    { key: 'description', label: 'Description' },
  ], [t]);

  const depHub: HubSpokeHub = { label: 'Core', status: 'online' };
  const depSpokes: HubSpokeSpoke[] = useMemo(
    () => (depgraph?.nodes ?? []).slice(0, 12).map((n) => ({
      label: n.label, status: 'online' as const, connected: true,
    })),
    [depgraph],
  );

  const healthyExts = (extensions ?? []).filter(
    (e) => e.status === 'healthy' || e.status === 'active',
  ).length;

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  const tabLabels: Record<string, string> = {
    config: t.configuration,
    extensions: t.extensions,
    depgraph: t.dependencies,
    security: t.security,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>

      <div className="flex gap-2">
        {(['config', 'extensions', 'depgraph', 'security'] as const).map((key) => (
          <button key={key} onClick={() => setTab(key)}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: tab === key ? 'var(--mn-accent)' : 'var(--mn-surface-sunken)',
              color: tab === key ? 'var(--mn-accent-text)' : 'var(--mn-text-muted)',
            }}>
            {tabLabels[key]}
          </button>
        ))}
      </div>

      {tab === 'config' && (
        <>
          <DaemonSwitcher />

          <MnSectionCard title={t.platformConfig} collapsible defaultOpen>
            <div className="space-y-4 p-4">
              <ConfigRow label={t.daemonUrl} value="http://localhost:8420" tag={t.hotReload} tone="success" />
              <ConfigRow label={t.sseEndpoint} value="/api/events/stream" tag={t.hotReload} tone="success" />
              <ConfigRow label={t.authMode} value="JWT" tag={t.restartRequired} tone="warning" />
              <ConfigRow label={t.maxConcurrentAgents} value="50" tag={t.restartRequired} tone="warning" />
              <ConfigRow label={t.rateLimit} value="100 req/min" tag={t.hotReload} tone="success" />
              <div className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--mn-border-subtle)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--mn-text)' }}>{t.language}</span>
                <select value={locale} onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="rounded-md px-2 py-1 text-sm font-mono"
                  style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}>
                  {LOCALES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </MnSectionCard>

          {versionInfo && (
            <MnSectionCard title={t.versionInfo} collapsible defaultOpen>
              <div className="space-y-2 p-4">
                <ConfigRow label={t.version} value={versionInfo.version} />
                <ConfigRow label={t.build} value={versionInfo.build} />
                <ConfigRow label={t.commit} value={versionInfo.commit.slice(0, 8)} />
                <ConfigRow label={t.rustVersion} value={versionInfo.rust_version} />
              </div>
            </MnSectionCard>
          )}

          {caps && caps.length > 0 && (
            <MnSectionCard title={t.capabilities} badge={caps.length} collapsible defaultOpen>
              <MnDataTable
                columns={capCols}
                data={caps.map((c) => ({
                  ...c, enabled_display: c.enabled ? 'active' : 'inactive',
                })) as unknown as Record<string, unknown>[]}
              />
            </MnSectionCard>
          )}
        </>
      )}

      {tab === 'extensions' && (
        <MnSectionCard title={t.extensions} badge={(extensions ?? []).length} collapsible defaultOpen
          action={{ label: t.refresh, onClick: refetch }}>
          <div className="mb-3 px-4">
            <MnBadge tone={healthyExts === (extensions ?? []).length ? 'success' : 'warning'}>
              {healthyExts}/{(extensions ?? []).length} {t.healthy}
            </MnBadge>
          </div>
          <MnDataTable
            columns={extCols}
            data={(extensions ?? []).map((e) => ({
              ...e, capabilities: e.capabilities.join(', '),
            })) as unknown as Record<string, unknown>[]}
            emptyMessage={t.noExtensions}
          />
        </MnSectionCard>
      )}

      {tab === 'depgraph' && (
        <div className="space-y-6">
          <MnSectionCard title={t.depGraph} collapsible defaultOpen>
            <div className="flex items-center justify-center p-4">
              <MnHubSpoke hub={depHub} spokes={depSpokes} />
            </div>
            <div className="px-4 py-3" style={{ borderTop: '1px solid var(--mn-border-subtle)' }}>
              <p className="text-sm" style={{ color: 'var(--mn-text)' }}>
                <strong>{depgraph?.nodes.length ?? 0}</strong> {t.nodes},{' '}
                <strong>{depgraph?.edges.length ?? 0}</strong> {t.edges}
              </p>
            </div>
          </MnSectionCard>
          <MnSectionCard title={t.validation} collapsible defaultOpen>
            <div className="p-4">
              {depValidation && (
                <div className="flex items-center gap-3">
                  <MnBadge tone={depValidation.valid ? 'success' : 'danger'}>
                    {depValidation.valid ? t.valid : t.invalid}
                  </MnBadge>
                  {depValidation.errors.length > 0 && (
                    <ul className="list-inside list-disc text-sm" style={{ color: 'var(--mn-error)' }}>
                      {depValidation.errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </MnSectionCard>
        </div>
      )}

      {tab === 'security' && (
        <MnSectionCard title={t.auditTrail} badge={(audit ?? []).length} collapsible defaultOpen>
          <MnDataTable
            columns={auditCols}
            data={(audit ?? []) as unknown as Record<string, unknown>[]}
            emptyMessage={t.noAudit}
          />
        </MnSectionCard>
      )}
    </div>
  );
}

function ConfigRow({ label, value, tag, tone }: {
  label: string;
  value: string;
  tag?: string;
  tone?: 'success' | 'warning';
}) {
  return (
    <div className="flex items-center justify-between py-2"
      style={{ borderBottom: '1px solid var(--mn-border-subtle)' }}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium" style={{ color: 'var(--mn-text)' }}>{label}</span>
        {tag && <MnBadge tone={tone ?? 'info'}>{tag}</MnBadge>}
      </div>
      <span className="font-mono text-sm" style={{ color: 'var(--mn-text-muted)' }}>{value}</span>
    </div>
  );
}
