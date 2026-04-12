'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import type { Prompt, PromptInput, Skill } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import {
  MnDataTable, type DataTableColumn, MnBadge,
} from '@/components/maranello/data-display';
import { MnModal, MnStateScaffold } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { usePromptsLocale } from './prompts-i18n';

export default function PromptsPage() {
  const t = usePromptsLocale();
  const [tab, setTab] = useState<'prompts' | 'skills'>('prompts');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<PromptInput>({ name: '', template: '' });
  const [saving, setSaving] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');

  const { data: prompts, loading, error, refetch } = useApiQuery<Prompt[]>(() => api.promptList());
  const { data: skills } = useApiQuery<Skill[]>(() =>
    skillSearch ? api.skillSearch(skillSearch) : api.skillList(),
  );

  const promptCols: DataTableColumn[] = useMemo(() => [
    { key: 'name', label: t.name, sortable: true },
    { key: 'version', label: t.version, sortable: true },
    { key: 'active', label: t.active, type: 'status' },
    { key: 'created_at', label: t.created, sortable: true },
  ], [t]);

  const skillCols: DataTableColumn[] = useMemo(() => [
    { key: 'name', label: t.skill, sortable: true },
    { key: 'description', label: t.description },
    { key: 'category', label: t.category, sortable: true },
  ], [t]);

  const tokenEstimate = useMemo(() => {
    if (!selectedPrompt?.template) return 0;
    return Math.ceil(selectedPrompt.template.length / 4);
  }, [selectedPrompt]);

  const handleCreate = useCallback(async () => {
    if (!formData.name || !formData.template) return;
    setSaving(true);
    try {
      await api.promptCreate(formData);
      setShowCreate(false);
      setFormData({ name: '', template: '' });
      refetch();
    } finally {
      setSaving(false);
    }
  }, [formData, refetch]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
    await api.promptDelete(id);
    setSelectedPrompt(null);
    refetch();
  }, [refetch, t]);

  if (loading) return <MnStateScaffold state="loading" message={t.title} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>
        <button onClick={() => setShowCreate(true)}
          className="rounded-md px-4 py-2 text-sm font-medium"
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
          {t.newPrompt}
        </button>
      </div>

      <div className="flex gap-2">
        {(['prompts', 'skills'] as const).map((key) => (
          <button key={key} onClick={() => setTab(key)}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: tab === key ? 'var(--mn-accent)' : 'var(--mn-surface-sunken)',
              color: tab === key ? 'var(--mn-accent-text)' : 'var(--mn-text-muted)',
            }}>
            {key === 'prompts' ? t.prompts : t.skills}
          </button>
        ))}
      </div>

      {tab === 'prompts' && (
        <>
          <MnSectionCard title={t.promptTemplates} badge={(prompts ?? []).length} collapsible defaultOpen>
            <MnDataTable
              columns={promptCols}
              data={(prompts ?? []) as unknown as Record<string, unknown>[]}
              onRowClick={(row) => setSelectedPrompt(row as unknown as Prompt)}
              emptyMessage={t.noPrompts}
            />
          </MnSectionCard>
          {selectedPrompt && (
            <MnSectionCard title={selectedPrompt.name} collapsible defaultOpen
              action={{ label: t.delete, onClick: () => handleDelete(selectedPrompt.id) }}>
              <div className="space-y-4 p-4">
                <div className="flex items-center gap-3">
                  <MnBadge tone={selectedPrompt.active ? 'success' : 'neutral'}>
                    {selectedPrompt.active ? t.active : t.inactive}
                  </MnBadge>
                  <span className="text-xs" style={{ color: 'var(--mn-text-muted)' }}>
                    v{selectedPrompt.version}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--mn-text-muted)' }}>
                    ~{tokenEstimate} {t.estimatedTokens}
                  </span>
                </div>
                <div className="rounded-md p-4" style={{ background: 'var(--mn-surface-sunken)' }}>
                  <pre className="whitespace-pre-wrap text-sm">{selectedPrompt.template}</pre>
                </div>
              </div>
            </MnSectionCard>
          )}
        </>
      )}

      {tab === 'skills' && (
        <MnSectionCard title={t.skillRegistry} badge={(skills ?? []).length} collapsible defaultOpen>
          <div className="px-4 pb-3">
            <input type="text" value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.searchSkills} />
          </div>
          <MnDataTable
            columns={skillCols}
            data={(skills ?? []).map((s) => ({
              ...s, capabilities: s.capabilities.join(', '),
            })) as unknown as Record<string, unknown>[]}
            emptyMessage={t.noSkills}
          />
        </MnSectionCard>
      )}

      <MnModal open={showCreate} onOpenChange={setShowCreate} title={t.newPrompt}>
        <div className="space-y-4 p-4">
          <MnFormField label={t.name} required>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.namePlaceholder} />
          </MnFormField>
          <MnFormField label={t.template} required>
            <textarea value={formData.template}
              onChange={(e) => setFormData((f) => ({ ...f, template: e.target.value }))}
              className="h-40 w-full rounded-md px-3 py-2 text-sm font-mono"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.templatePlaceholder} />
          </MnFormField>
          <p className="text-xs" style={{ color: 'var(--mn-text-muted)' }}>
            ~{Math.ceil((formData.template?.length ?? 0) / 4)} {t.estimatedTokens}
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)}
              className="rounded-md px-4 py-2 text-sm"
              style={{ border: '1px solid var(--mn-border)' }}>
              {t.cancel}
            </button>
            <button onClick={handleCreate} disabled={saving}
              className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
              {saving ? t.creating : t.create}
            </button>
          </div>
        </div>
      </MnModal>
    </div>
  );
}
