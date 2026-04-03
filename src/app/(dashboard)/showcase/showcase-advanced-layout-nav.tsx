'use client';

import { useState, useCallback } from 'react';
import {
  MnDashboard,
  MnHeaderShell,
  MnBreadcrumb,
  MnCommandPalette,
  MnSectionNav,
  MnTabs,
  MnTabList,
  MnTab,
  MnTabPanel,
} from '@/components/maranello';
import type { CommandItem } from '@/components/maranello';

const commandItems: CommandItem[] = [
  { text: 'Deploy to production', group: 'Actions', shortcut: '⌘D' },
  { text: 'Run test suite', group: 'Actions', shortcut: '⌘T' },
  { text: 'Open agent config', group: 'Navigation' },
  { text: 'View audit log', group: 'Navigation' },
  { text: 'Search mesh nodes', group: 'Search' },
];

const sectionNavItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'agents', label: 'Agents' },
  { id: 'mesh', label: 'Mesh Network' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

/** Sub-section: Layout & Navigation components. */
export function ShowcaseAdvancedLayoutNav() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('agents');

  const handleCmdSelect = useCallback((item: CommandItem) => {
    void item;
  }, []);

  return (
    <>
      {/* Dashboard */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnDashboard</h3>
        <MnDashboard
          schema={{
            rows: [
              {
                columns: [
                  { type: 'stat-card', dataKey: 'agents', span: 3 },
                  { type: 'stat-card', dataKey: 'tasks', span: 3 },
                  { type: 'stat-card', dataKey: 'latency', span: 3 },
                  { type: 'stat-card', dataKey: 'cost', span: 3 },
                ],
              },
            ],
          }}
          data={{
            agents: { label: 'Active Agents', value: 8 },
            tasks: { label: 'Tasks / hour', value: 1247 },
            latency: { label: 'P95 Latency', value: '180ms' },
            cost: { label: 'Daily Cost', value: '$42.18' },
          }}
        />
      </div>

      {/* Header Shell */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnHeaderShell</h3>
        <MnHeaderShell
          sections={[
            { type: 'brand', label: 'Convergio' },
            { type: 'actions', role: 'pre', items: [
              { id: 'dashboard', label: 'Dashboard', active: true },
              { id: 'agents', label: 'Agents' },
              { id: 'mesh', label: 'Mesh' },
            ]},
            { type: 'spacer' },
            { type: 'search', placeholder: 'Search platform...', shortcut: '⌘K' },
            { type: 'divider' },
            { type: 'actions', role: 'post', items: [
              { id: 'notif', label: '🔔' },
              { id: 'settings', label: '⚙' },
            ]},
          ]}
        />
      </div>

      {/* Breadcrumb */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnBreadcrumb</h3>
        <MnBreadcrumb items={[
          { label: 'Home', href: '#' },
          { label: 'Agents', href: '#' },
          { label: 'Orchestrator', href: '#' },
          { label: 'Configuration' },
        ]} />
      </div>

      {/* Command Palette */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnCommandPalette</h3>
        <button onClick={() => setCmdOpen(true)} className="px-3 py-1.5 rounded border text-sm">
          Open Command Palette (⌘K)
        </button>
        <MnCommandPalette
          open={cmdOpen}
          onOpenChange={setCmdOpen}
          items={commandItems}
          onSelect={handleCmdSelect}
        />
      </div>

      {/* Section Nav */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnSectionNav</h3>
        <MnSectionNav items={sectionNavItems} current={currentSection} onNavigate={setCurrentSection} position="top" />
      </div>

      {/* Tabs */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnTabs</h3>
        <MnTabs defaultValue="overview">
          <MnTabList>
            <MnTab value="overview">Overview</MnTab>
            <MnTab value="metrics">Metrics</MnTab>
            <MnTab value="logs">Logs</MnTab>
          </MnTabList>
          <MnTabPanel value="overview">
            <p className="text-sm text-muted-foreground">Agent cluster health overview with real-time status indicators.</p>
          </MnTabPanel>
          <MnTabPanel value="metrics">
            <p className="text-sm text-muted-foreground">Latency percentiles, throughput, and cost-per-token metrics.</p>
          </MnTabPanel>
          <MnTabPanel value="logs">
            <p className="text-sm text-muted-foreground">Structured JSON logs from all mesh nodes and agents.</p>
          </MnTabPanel>
        </MnTabs>
      </div>
    </>
  );
}
