/**
 * Extended API functions for plan-db and mesh endpoints.
 * Kept separate to avoid exceeding the 250-line file limit on api.ts.
 */

import type {
  PlanDb, ExecutionTree, MeshPeer, MeshStatus,
  TrustLevel, SecretFilter, NodeReadiness,
  KnowledgeEntry, KnowledgeWriteInput,
  Report, ReportGenerateInput,
  DeployStatus, DeployHistoryEntry,
  RetentionRule,
  DoctorSummary, DoctorIssue, DoctorFullResult,
  SchedulerPolicy, SchedulerDecision, SchedulerDecideInput, SchedulerUpdateInput,
  VersionInfo, Capability,
  Notification, NotifySendInput,
  BillingAlert, BillingAlertInput,
} from './types';

// Client-side: proxy via Next.js route handler (same-origin, no CORS)
// Server-side: direct connection to daemon
const BASE =
  typeof window !== 'undefined'
    ? ''
    : (process.env.API_URL ?? 'http://localhost:8420');

// Dev token is the default — override via env vars in production
const AUTH_TOKEN =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_AUTH_TOKEN ?? '')
    : (process.env.AUTH_TOKEN ?? '');

async function get<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (AUTH_TOKEN) headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(`${BASE}${path}`, { method: 'GET', headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.slice(0, 120)}`);
  }
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (AUTH_TOKEN) headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.slice(0, 120)}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function qs(params: Record<string, string | undefined>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries as [string, string][]).toString();
}

/* ── Plan DB ── */

export const planDbList = (p?: { status?: string; project_id?: string }) =>
  get<PlanDb[]>(`/api/plan-db/list${qs(p ?? {})}`);

export const planDbExecutionTree = (id: number) =>
  get<ExecutionTree>(`/api/plan-db/execution-tree/${id}`);

export const planDbCreate = (name: string, project_id = 'default') =>
  post<{ id: number }>('/api/plan-db/create', { name, project_id });

/* ── Mesh ── */

export const meshPeers = () => get<MeshPeer[]>('/api/mesh/peers');

export const meshStatus = () => get<MeshStatus>('/api/mesh');

/* ── Node ── */

export const nodeReadiness = () => get<NodeReadiness>('/api/node/readiness');

/* ── Security ── */

export const securityTrust = () => get<TrustLevel[]>('/api/security/trust');

export const securitySecretsFilter = () =>
  get<SecretFilter[]>('/api/security/secrets/filter');

export const securityConfig = () =>
  get<Record<string, unknown>>('/api/security/config');

export const securityUpdateConfig = (update: Record<string, unknown>) =>
  post<{ ok: boolean }>('/api/security/config', update);

/* ── Knowledge ── */

export const knowledgeSearch = (q: string, limit?: number) =>
  post<{ results: { entry: KnowledgeEntry }[] } | KnowledgeEntry[]>(
    '/api/knowledge/search',
    { query: q, limit },
  ).then((r) =>
    Array.isArray(r) ? r : (r?.results ?? []).map((x) => x.entry),
  );

export const knowledgeWrite = (input: KnowledgeWriteInput) =>
  post<{ id: string }>('/api/knowledge/write', input);

/* ── Reports ── */

export const reportList = () =>
  get<{ reports: Report[] }>('/api/reports').then((r) => r.reports);

export const reportGenerate = (input: ReportGenerateInput) =>
  post<{ id: string }>('/api/reports/generate', input);

export const reportGet = (id: string) =>
  get<Report>(`/api/reports/${encodeURIComponent(id)}`);

/* ── Deploy ── */

export const deployStatus = () => get<DeployStatus>('/api/deploy/status');

export const deployHistory = () =>
  get<{ count: number; upgrades: DeployHistoryEntry[] }>('/api/deploy/history')
    .then((r) => r.upgrades ?? []);

export const deployUpgrade = () =>
  post<{ ok: boolean }>('/api/deploy/upgrade', {});

export const deployRollback = (version: string) =>
  post<{ ok: boolean }>('/api/deploy/rollback', { version });

/* ── Backup (extended) ── */

export const backupRetentionRules = () =>
  get<{ rules: RetentionRule[] } | RetentionRule[]>('/api/backup/retention/rules')
    .then((r) => (Array.isArray(r) ? r : r?.rules ?? []));

export const backupVerify = (id: string) =>
  post<{ ok: boolean; message: string }>(`/api/backup/snapshots/${encodeURIComponent(id)}/verify`, {});

export const backupRestore = (id: string) =>
  post<{ ok: boolean }>(`/api/backup/snapshots/${encodeURIComponent(id)}/restore`, {});

export const backupDelete = (id: string) =>
  post<{ ok: boolean }>(`/api/backup/snapshots/${encodeURIComponent(id)}/delete`, {});

export const backupRetentionUpdate = (id: string, patch: Partial<RetentionRule>) =>
  post<RetentionRule>(`/api/backup/retention/rules/${encodeURIComponent(id)}/update`, patch);

export const backupPurge = () =>
  post<{ deleted: number }>('/api/backup/purge', {});

/* ── Doctor ── */

export const doctorFull = () =>
  get<DoctorFullResult>('/api/doctor/full');

export const doctorSummary = () =>
  get<DoctorSummary>('/api/doctor/summary');

export const doctorIssues = () =>
  get<{ issues: DoctorIssue[] } | DoctorIssue[]>('/api/doctor/issues')
    .then((r) => (Array.isArray(r) ? r : r?.issues ?? []));

/* ── Scheduler ── */

export const schedulerPolicy = () =>
  get<SchedulerPolicy>('/api/scheduler/policy');

export const schedulerHistory = (p?: { limit?: number }) =>
  get<SchedulerDecision[]>(`/api/scheduler/history${qs(p ? { limit: String(p.limit) } : {})}`);

export const schedulerDecide = (input: SchedulerDecideInput) =>
  post<SchedulerDecision>('/api/scheduler/decide', input);

export const schedulerUpdatePolicy = (input: SchedulerUpdateInput) =>
  post<SchedulerPolicy>('/api/scheduler/policy', input);

/* ── Settings ── */

export const doctorVersion = () =>
  get<VersionInfo>('/api/doctor/version');

export const capabilities = () =>
  get<{ capabilities: Capability[] } | Capability[]>('/api/capabilities')
    .then((r) => (Array.isArray(r) ? r : r?.capabilities ?? []));

/* ── Notifications ── */

export const notifyQueue = () =>
  get<{ notifications: Notification[] }>('/api/notify/queue').then((r) => r.notifications);

export const notifySend = (input: NotifySendInput) =>
  post<{ id: string }>('/api/notify', input);

export const notifyTelegramTest = () =>
  post<{ ok: boolean }>('/api/notify', {
    channel: 'telegram',
    subject: 'Test',
    body: 'Convergio test notification',
  });

export const notifyDismiss = (id: string) =>
  post<{ ok: boolean }>(`/api/notify/dismiss/${encodeURIComponent(id)}`, {});

export const orgAsk = (orgId: string, message: string, context?: string) =>
  post<{ reply: string }>(`/api/orgs/${encodeURIComponent(orgId)}/ask`, { message, context });

/* ── Billing Alerts ── */

export const billingAlertList = (orgId: string) =>
  get<BillingAlert[]>(`/api/billing/alerts${qs({ org_id: orgId })}`);

export const billingAlertCreate = (input: BillingAlertInput) =>
  post<BillingAlert>('/api/billing/alerts', input);

/* ── Reports (extended) ── */

export const reportDownload = async (id: string): Promise<Blob> => {
  const headers: Record<string, string> = {};
  if (AUTH_TOKEN) headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(`${BASE}/api/reports/${encodeURIComponent(id)}/download`, {
    method: 'GET',
    headers,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.slice(0, 120)}`);
  }
  return res.blob();
};
