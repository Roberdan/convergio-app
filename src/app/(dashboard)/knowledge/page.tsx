'use client';

import { useCallback, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import type { KnowledgeEntry, KnowledgeWriteInput } from '@/lib/types';
import { knowledgeSearch, knowledgeWrite } from '@/lib/api-ext';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnBadge } from '@/components/maranello/data-display';
import { MnStateScaffold } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { useKnowledgeLocale } from './knowledge-i18n';

export default function KnowledgePage() {
  const t = useKnowledgeLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [writeForm, setWriteForm] = useState<KnowledgeWriteInput>({
    key: '', value: '', namespace: 'default',
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const { data: results, loading, error } = useApiQuery<KnowledgeEntry[]>(
    () => searchQuery.length >= 2
      ? knowledgeSearch(searchQuery, 50)
      : Promise.resolve([]),
    { enabled: searchQuery.length >= 2 },
  );

  const handleWrite = useCallback(async () => {
    if (!writeForm.key || !writeForm.value) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await knowledgeWrite(writeForm);
      setSaveMsg(t.writeSuccess);
      setWriteForm({ key: '', value: '', namespace: 'default' });
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }, [writeForm, t]);

  if (error) return <MnStateScaffold state="error" message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.search} collapsible defaultOpen>
          <div className="space-y-4 p-4">
            <MnFormField label={t.search}>
              <input type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder={t.searchPlaceholder} />
            </MnFormField>
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <p className="text-xs text-muted-foreground">{t.searchHint}</p>
            )}
          </div>
        </MnSectionCard>

        <MnSectionCard title={t.writeEntry} collapsible defaultOpen>
          <div className="space-y-3 p-4">
            <MnFormField label={t.key} required
              error={!writeForm.key && saving ? t.required : undefined}>
              <input type="text" value={writeForm.key}
                onChange={(e) => setWriteForm((f) => ({ ...f, key: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder={t.keyPlaceholder} />
            </MnFormField>
            <MnFormField label={t.value} required
              error={!writeForm.value && saving ? t.required : undefined}>
              <textarea value={writeForm.value}
                onChange={(e) => setWriteForm((f) => ({ ...f, value: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                rows={4} placeholder={t.valuePlaceholder} />
            </MnFormField>
            <MnFormField label={t.namespace}>
              <input type="text" value={writeForm.namespace ?? ''}
                onChange={(e) => setWriteForm((f) => ({ ...f, namespace: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder={t.namespacePlaceholder} />
            </MnFormField>
            <div className="flex items-center gap-3">
              <button onClick={handleWrite} disabled={saving}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {saving ? t.submitting : t.submit}
              </button>
              {saveMsg && (
                <MnBadge tone={saveMsg === t.writeSuccess ? 'success' : 'danger'}>
                  {saveMsg}
                </MnBadge>
              )}
            </div>
          </div>
        </MnSectionCard>
      </div>

      <MnSectionCard title={t.searchResults}
        badge={loading ? undefined : (results ?? []).length} collapsible defaultOpen>
        <div className="space-y-2 p-4">
          {loading && <MnStateScaffold state="loading" message={t.loading} />}
          {!loading && (results ?? []).length > 0 ? (
            (results ?? []).map((entry) => (
              <div key={entry.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">{entry.key}</span>
                  <MnBadge tone="info">{entry.namespace}</MnBadge>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {entry.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.updated}: {new Date(entry.updated_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : !loading ? (
            <p className="text-sm text-muted-foreground">
              {searchQuery.length >= 2 ? t.noResults : t.searchHint}
            </p>
          ) : null}
        </div>
      </MnSectionCard>
    </div>
  );
}
