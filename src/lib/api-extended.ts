/**
 * Extended daemon API client — security, scheduler, reports,
 * deploy, doctor, chain, capabilities, notifications.
 *
 * Complements the base api.ts client with additional endpoint families.
 */

import { ApiError } from '@/hooks/use-api-query';
import type {
  ChainStatus,
  ChainBumpRequest,
  ChainBumpResult,
  SecurityPolicy,
  SecurityScan,
  SecurityFinding,
  ScheduledJob,
  JobRun,
  Report,
  ReportGenerateInput,
  Deployment,
  DiagnosticReport,
  Capability,
  Notification,
} from './types';

const BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL ?? '/daemon')
    : (process.env.API_URL ?? 'http://localhost:8420');

const AUTH_TOKEN =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_AUTH_TOKEN ?? '')
    : (process.env.AUTH_TOKEN ?? '');

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (AUTH_TOKEN) headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(res.status, text);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function get<T>(path: string) { return request<T>('GET', path); }
function post<T>(path: string, body?: unknown) { return request<T>('POST', path, body); }

function qs(params: Record<string, string | number | boolean | undefined>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

/* ── Chain ── */

export const chainStatus = () => get<ChainStatus>('/api/chain/status');
export const chainBump = (input: ChainBumpRequest) =>
  post<ChainBumpResult>('/api/chain/bump', input);

/* ── Security ── */

export const securityPolicies = () =>
  get<SecurityPolicy[]>('/api/security/policies');
export const securityScans = (p?: { limit?: number }) =>
  get<SecurityScan[]>(`/api/security/scans${qs(p ?? {})}`);
export const securityScanTrigger = () =>
  post<SecurityScan>('/api/security/scans/trigger');
export const securityFindings = (p?: {
  scan_id?: string;
  severity?: string;
  resolved?: boolean;
}) => get<SecurityFinding[]>(`/api/security/findings${qs(p ?? {})}`);
export const securityFindingResolve = (id: string) =>
  post<void>(`/api/security/findings/${encodeURIComponent(id)}/resolve`);

/* ── Scheduler ── */

export const schedulerJobs = () =>
  get<ScheduledJob[]>('/api/scheduler/jobs');
export const schedulerJobRuns = (jobId: string, p?: { limit?: number }) =>
  get<JobRun[]>(`/api/scheduler/jobs/${encodeURIComponent(jobId)}/runs${qs(p ?? {})}`);
export const schedulerJobTrigger = (jobId: string) =>
  post<JobRun>(`/api/scheduler/jobs/${encodeURIComponent(jobId)}/trigger`);
export const schedulerJobToggle = (jobId: string, enabled: boolean) =>
  post<void>(`/api/scheduler/jobs/${encodeURIComponent(jobId)}/toggle`, { enabled });

/* ── Reports ── */

export const reportList = (p?: { limit?: number }) =>
  get<Report[]>(`/api/reports${qs(p ?? {})}`);
export const reportGet = (id: string) =>
  get<Report>(`/api/reports/${encodeURIComponent(id)}`);
export const reportGenerate = (input: ReportGenerateInput) =>
  post<Report>('/api/reports/generate', input);

/* ── Deploy ── */

export const deployList = (p?: { limit?: number }) =>
  get<Deployment[]>(`/api/deploy${qs(p ?? {})}`);
export const deployTrigger = (target: string, version: string) =>
  post<Deployment>('/api/deploy', { target, version });
export const deployRollback = (id: string) =>
  post<Deployment>(`/api/deploy/${encodeURIComponent(id)}/rollback`);

/* ── Doctor ── */

export const doctorRun = () => get<DiagnosticReport>('/api/doctor');

/* ── Capabilities ── */

export const capabilities = () =>
  get<Capability[]>('/api/capabilities');

/* ── Notifications ── */

export const notificationList = (p?: { limit?: number; unread?: boolean }) =>
  get<Notification[]>(`/api/notify${qs(p ?? {})}`);
export const notificationMarkRead = (id: string) =>
  post<void>(`/api/notify/${encodeURIComponent(id)}/read`);
export const notificationMarkAllRead = () =>
  post<void>('/api/notify/read-all');
