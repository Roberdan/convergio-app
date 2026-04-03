'use client';

import { useState, useCallback } from 'react';
import {
  MnDateRangePicker,
  MnFilterPanel,
  MnSearchDrawer,
  MnGridLayout,
  MnGridItem,
  MnSectionCard,
  MnDashboardRenderer,
  MnLogin,
  MnAsyncSelect,
  MnDatePicker,
  MnFormField,
  MnProfile,
} from '@/components/maranello';
import type { ActiveFilters, SearchDrawerResult, AsyncSelectItem } from '@/components/maranello';
import { filterSections, mockSearchResults } from './showcase-interactive-data';

/** Sub-section: Forms, Navigation & Layout interactive components. */
export function ShowcaseInteractiveControls() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({});

  const handleSearch = useCallback(
    async (query: string): Promise<SearchDrawerResult[]> => {
      const q = query.toLowerCase();
      return mockSearchResults.filter(
        r => r.title.toLowerCase().includes(q) || r.subtitle?.toLowerCase().includes(q),
      );
    },
    [],
  );

  const agentProvider = useCallback(
    async (query: string): Promise<AsyncSelectItem[]> => {
      const agents = [
        { id: 'orch', label: 'Orchestrator' },
        { id: 'plan', label: 'Planner' },
        { id: 'code', label: 'Code Generator' },
        { id: 'review', label: 'Reviewer' },
        { id: 'deploy', label: 'Deployer' },
        { id: 'monitor', label: 'Monitor' },
      ];
      return agents.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));
    },
    [],
  );

  return (
    <>
      {/* Date Range Picker */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnDateRangePicker</h3>
        <MnDateRangePicker placeholder="Pick a date range" />
      </div>

      {/* Filter Panel */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnFilterPanel</h3>
        <MnFilterPanel
          sections={filterSections}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {/* Search Drawer */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnSearchDrawer</h3>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-3 py-1.5 rounded border text-sm"
        >
          Open Search Drawer
        </button>
        <MnSearchDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title="Search Platform"
          onSearch={handleSearch}
        />
      </div>

      {/* Section Card */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnSectionCard</h3>
        <MnSectionCard title="Agent Configuration" badge={3} collapsible>
          <p className="text-sm text-muted-foreground">
            Configure orchestration parameters, model routing rules, and cost guardrails for each agent in the mesh.
          </p>
        </MnSectionCard>
      </div>

      {/* Grid Layout */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnGridLayout</h3>
        <MnGridLayout columns={3} gap="md" aria-label="Sample grid">
          <MnGridItem className="rounded border border-border bg-muted p-3 text-sm">Cell A</MnGridItem>
          <MnGridItem className="rounded border border-border bg-muted p-3 text-sm">Cell B</MnGridItem>
          <MnGridItem span={1} className="rounded border border-border bg-muted p-3 text-sm">Cell C</MnGridItem>
        </MnGridLayout>
      </div>

      {/* Dashboard Renderer */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnDashboardRenderer</h3>
        <MnDashboardRenderer
          schema={{
            rows: [
              {
                columns: [
                  { type: 'stat-card', dataKey: 'agents' },
                  { type: 'stat-card', dataKey: 'tasks' },
                  { type: 'stat-card', dataKey: 'uptime' },
                ],
              },
            ],
          }}
          data={{
            agents: { label: 'Active Agents', value: 12 },
            tasks: { label: 'Tasks Today', value: 487 },
            uptime: { label: 'Uptime', value: '99.7%' },
          }}
        />
      </div>

      {/* Login */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnLogin</h3>
        <div className="max-w-sm mx-auto">
          <MnLogin
            title="Convergio"
            titleAccent="Platform"
            subtitle="Sign in to your workspace"
            version="v20.8.0"
            env="staging"
            onSubmit={() => {}}
            checks={[
              { name: 'API', status: 'healthy' },
              { name: 'Mesh', status: 'degraded' },
              { name: 'Database', status: 'healthy' },
            ]}
          />
        </div>
      </div>

      {/* Async Select */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnAsyncSelect</h3>
        <MnAsyncSelect provider={agentProvider} placeholder="Search agents..." onSelect={() => {}} />
      </div>

      {/* Date Picker */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnDatePicker</h3>
        <MnDatePicker placeholder="Select deployment date" />
      </div>

      {/* Form Field */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnFormField</h3>
        <MnFormField fieldId="agent-name" label="Agent Name" hint="Alphanumeric, 3–32 characters" required>
          <input type="text" defaultValue="Orchestrator-Prime" className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm" />
        </MnFormField>
        <MnFormField fieldId="max-tokens" label="Max Tokens" error="Value must be between 1 and 128000">
          <input type="number" defaultValue="200000" className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm" />
        </MnFormField>
      </div>

      {/* Profile */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnProfile</h3>
        <MnProfile
          name="Elena Vasquez"
          email="elena@convergio.dev"
          sections={[
            { title: 'Account', items: [{ label: 'Settings' }, { label: 'API Keys', badge: 3 }] },
            { items: [{ label: 'Sign out', danger: true }] },
          ]}
        />
      </div>
    </>
  );
}
