// Extended types for Security, Knowledge, Reports, Mesh

export interface TrustLevel {
  entity_id: string;
  entity_type: string;
  trust_score: number;
  level: 'high' | 'medium' | 'low' | 'untrusted';
  last_evaluated: string;
}
export interface SecretFilter {
  id: string;
  pattern: string;
  scope: string;
  action: 'redact' | 'block' | 'warn';
  enabled: boolean;
}

/* ── Knowledge ── */
export interface KnowledgeEntry {
  id: string;
  key: string;
  value: string;
  namespace: string;
  created_at: string;
  updated_at: string;
}
export interface KnowledgeWriteInput {
  key: string;
  value: string;
  namespace?: string;
}

/* ── Reports ── */
export interface Report {
  id: string;
  name: string;
  report_type: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  format: string;
  created_at: string;
  content?: string;
}
export interface ReportGenerateInput {
  report_type: string;
  depth: 'summary' | 'detailed' | 'full';
  format: 'markdown' | 'json' | 'html';
}

/* ── Node ── */
export interface NodeReadiness {
  ready: boolean;
  checks: { name: string; ok: boolean; message?: string }[];
}

/* ── SSE Domain Events ── */
export interface IpcEvent { from: string; to?: string; content: string; event_type: string; ts: string }
export type DomainEventType =
  | 'PlanCreated' | 'TaskAssigned' | 'TaskCompleted'
  | 'MessageSent' | 'DelegationStarted'
  | 'AgentOnline' | 'AgentOffline'
  | 'HealthDegraded' | 'BudgetAlert' | 'ExtensionLoaded';

/* ── Deploy ── */
export interface DeployStatus {
  version: string;
  status?: 'running' | 'stopped' | 'upgrading' | 'error';
  uptime_secs?: number;
  last_deploy?: string;
  last_upgrade?: string | null;
  environment?: string;
  platform?: string;
}
export interface DeployHistoryEntry {
  id: string;
  version: string;
  status: 'success' | 'failed' | 'rolled_back';
  deployed_at: string;
  duration_secs: number;
  triggered_by: string;
}

/* ── Backup (extended) ── */
export interface RetentionRule {
  id: string;
  name: string;
  keep_count: number;
  max_age_days: number;
  enabled: boolean;
}

/* ── Doctor ── */
export interface DoctorSummary {
  total_checks: number;
  passed: number;
  warned: number;
  failed: number;
  last_run: string;
}
export interface DoctorIssue {
  id: string;
  check_name: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  detected_at: string;
}
export interface DoctorFullResult {
  summary: DoctorSummary;
  issues: DoctorIssue[];
}

/* ── Scheduler ── */
export interface SchedulerPolicy {
  id: string;
  name: string;
  strategy: string;
  max_concurrent: number;
  priority_boost: Record<string, number>;
  enabled: boolean;
}
export interface SchedulerDecision {
  id: string;
  agent_id: string;
  model: string;
  reason: string;
  decided_at: string;
  cost_estimate: number;
}
export interface SchedulerDecideInput {
  prompt: string;
  agent_id?: string;
  tier?: string;
}
export interface SchedulerUpdateInput {
  name?: string;
  strategy?: string;
  max_concurrent?: number;
  priority_boost?: Record<string, number>;
  enabled?: boolean;
}

/* ── Settings ── */
export interface VersionInfo {
  version: string;
  build: string;
  commit: string;
  rust_version: string;
}
export interface Capability {
  name: string;
  enabled: boolean;
  description: string;
}

/* ── Notifications ── */
export interface Notification {
  id: string;
  channel: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}
export interface NotifySendInput {
  channel: string;
  subject: string;
  body: string;
  recipient?: string;
}

/* ── Billing Alerts ── */
export interface BillingAlert {
  id: string;
  org_id: string;
  threshold_usd: number;
  notification_channel: string;
  created_at: string;
}

export interface BillingAlertInput {
  org_id: string;
  threshold_usd: number;
  notification_channel: string;
}
