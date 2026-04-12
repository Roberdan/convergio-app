'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import type { Report, ReportGenerateInput } from '@/lib/types';
import { reportList, reportGenerate, reportGet, reportDownload } from '@/lib/api-ext';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge } from '@/components/maranello/data-display';
import { MnModal, MnStateScaffold, toast } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { useReportsLocale } from './reports-i18n';

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  completed: 'success', generating: 'warning', pending: 'info', failed: 'danger',
};

export default function ReportsPage() {
  const t = useReportsLocale();
  const [genForm, setGenForm] = useState<ReportGenerateInput>({
    report_type: 'system', depth: 'summary', format: 'markdown',
  });
  const [generating, setGenerating] = useState(false);
  const [viewReport, setViewReport] = useState<Report | null>(null);

  const { data: reports, loading, error, refetch } = useApiQuery<Report[]>(
    reportList, { pollInterval: 15_000 },
  );

  const reportCols: DataTableColumn[] = useMemo(() => [
    { key: 'name', label: t.name, sortable: true },
    { key: 'report_type', label: t.type, sortable: true },
    { key: 'status', label: t.status, type: 'status' as const },
    { key: 'format', label: t.format, sortable: true },
    { key: 'created_at', label: t.created, sortable: true },
    { key: '_actions', label: t.actions, type: 'action' as const },
  ], [t]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      await reportGenerate(genForm);
      refetch();
    } finally {
      setGenerating(false);
    }
  }, [genForm, refetch]);

  const handleView = useCallback(async (row: Record<string, unknown>) => {
    const id = row.id as string;
    try {
      const full = await reportGet(id);
      setViewReport(full);
    } catch {
      setViewReport({ id, name: '', report_type: '', status: 'failed', format: '', created_at: '' });
    }
  }, []);

  const handleDownload = useCallback(async (row: Record<string, unknown>) => {
    const id = row.id as string;
    const name = (row.name as string) || id;
    try {
      const blob = await reportDownload(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t.downloadFailed);
    }
  }, [t]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
      </div>

      <MnSectionCard title={t.generateReport} collapsible defaultOpen>
        <div className="flex flex-wrap items-end gap-4 p-4">
          <MnFormField label={t.reportType}>
            <select value={genForm.report_type}
              onChange={(e) => setGenForm((f) => ({ ...f, report_type: e.target.value }))}
              className="w-48 rounded-md border bg-background px-3 py-2 text-sm">
              <option value="system">System</option>
              <option value="cost">Cost</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="agents">Agents</option>
            </select>
          </MnFormField>
          <MnFormField label={t.depth}>
            <select value={genForm.depth}
              onChange={(e) => setGenForm((f) => ({
                ...f, depth: e.target.value as ReportGenerateInput['depth'],
              }))}
              className="w-36 rounded-md border bg-background px-3 py-2 text-sm">
              <option value="summary">{t.summary}</option>
              <option value="detailed">{t.detailed}</option>
              <option value="full">{t.full}</option>
            </select>
          </MnFormField>
          <MnFormField label={t.outputFormat}>
            <select value={genForm.format}
              onChange={(e) => setGenForm((f) => ({
                ...f, format: e.target.value as ReportGenerateInput['format'],
              }))}
              className="w-36 rounded-md border bg-background px-3 py-2 text-sm">
              <option value="markdown">{t.markdown}</option>
              <option value="json">{t.json}</option>
              <option value="html">{t.html}</option>
            </select>
          </MnFormField>
          <button onClick={handleGenerate} disabled={generating}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {generating ? t.generating : t.generate}
          </button>
        </div>
      </MnSectionCard>

      <MnSectionCard title={t.allReports} badge={(reports ?? []).length} collapsible defaultOpen>
        <MnDataTable columns={reportCols}
          data={(reports ?? []).map((r) => ({
            ...r,
            created_at: new Date(r.created_at).toLocaleString(),
            _actions: { actions: [{ id: 'download', label: t.download }] },
          })) as unknown as Record<string, unknown>[]}
          onRowClick={handleView}
          onAction={(actionId, row) => { if (actionId === 'download') handleDownload(row); }}
          emptyMessage={t.noReports} />
      </MnSectionCard>

      <MnModal open={!!viewReport} onOpenChange={(v) => !v && setViewReport(null)}
        title={viewReport?.name ?? t.viewReport}>
        <div className="space-y-3 p-4">
          {viewReport && (
            <>
              <div className="flex items-center gap-2">
                <MnBadge tone={STATUS_TONE[viewReport.status] ?? 'info'}>
                  {viewReport.status}
                </MnBadge>
                <span className="text-sm text-muted-foreground">{viewReport.report_type}</span>
                <span className="text-sm text-muted-foreground">{viewReport.format}</span>
              </div>
              {viewReport.content ? (
                <div className="max-h-96 overflow-y-auto rounded-md border bg-muted/30 p-4">
                  <pre className="whitespace-pre-wrap text-sm">{viewReport.content}</pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.noContent}</p>
              )}
              <div className="flex justify-end">
                <button onClick={() => setViewReport(null)}
                  className="rounded-md border px-4 py-2 text-sm">{t.close}</button>
              </div>
            </>
          )}
        </div>
      </MnModal>
    </div>
  );
}
