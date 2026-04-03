'use client';

import { useState } from 'react';
import {
  MnUserTable,
  MnSourceCards,
  MnSocialGraph,
  MnProgressRing,
  MnNotificationCenter,
  MnStreamingText,
  MnAgentTrace,
  MnApprovalChain,
  MnModal,
  MnStateScaffold,
  MnToast,
  toast,
} from '@/components/maranello';
import {
  adminUsers,
  sourceCards,
  socialNodes,
  socialEdges,
  socialGroups,
  notifications,
  traceSteps,
  approvalSteps,
} from './showcase-interactive-data';

/** Sub-section: Agents, Data & Visualization interactive components. */
export function ShowcaseInteractiveAgents() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* User Table */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnUserTable</h3>
        <MnUserTable users={adminUsers} searchable selectable={false} />
      </div>

      {/* Source Cards */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnSourceCards</h3>
        <MnSourceCards cards={sourceCards} layout="grid" ariaLabel="Knowledge base results" />
      </div>

      {/* Social Graph */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnSocialGraph</h3>
        <MnSocialGraph
          nodes={socialNodes}
          edges={socialEdges}
          groups={socialGroups}
          showLabels
        />
      </div>

      {/* Progress Ring */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnProgressRing</h3>
        <div className="flex items-center gap-4">
          <MnProgressRing value={87} size="lg" variant="primary" label="Completion" />
          <MnProgressRing value={42} size="md" variant="muted" label="Adoption" />
          <MnProgressRing value={100} size="sm" variant="success" label="Tests" />
        </div>
      </div>

      {/* Notification Center */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnNotificationCenter</h3>
        <button
          onClick={() => setNotifOpen(true)}
          className="px-3 py-1.5 rounded border text-sm"
        >
          Open Notifications ({notifications.filter(n => !n.read).length} unread)
        </button>
        <MnNotificationCenter
          open={notifOpen}
          onOpenChange={setNotifOpen}
          notifications={notifications}
        />
      </div>

      {/* Streaming Text */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnStreamingText</h3>
        <MnStreamingText
          text="The orchestration engine dispatched **3 agents** to handle the incoming request. Each agent processes a distinct subtask: *reasoning*, *tool invocation*, and *response synthesis*."
          streaming={false}
          typingCursor={false}
          processMarkdown
        />
      </div>

      {/* Agent Trace */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnAgentTrace</h3>
        <MnAgentTrace steps={traceSteps} ariaLabel="Agent execution trace" />
      </div>

      {/* Approval Chain */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnApprovalChain</h3>
        <MnApprovalChain steps={approvalSteps} orientation="horizontal" />
      </div>

      {/* Modal */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnModal</h3>
        <button onClick={() => setModalOpen(true)} className="px-3 py-1.5 rounded border text-sm">
          Open Modal
        </button>
        <MnModal open={modalOpen} onOpenChange={setModalOpen} title="Confirm Deployment">
          <p className="text-sm mb-4">Deploy agent <strong>Orchestrator v2.4</strong> to production? This will replace the current version across all mesh nodes.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded border text-sm">Cancel</button>
            <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm">Deploy</button>
          </div>
        </MnModal>
      </div>

      {/* State Scaffold */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnStateScaffold</h3>
        <div className="grid grid-cols-2 gap-2">
          <MnStateScaffold state="loading" className="border rounded p-2" />
          <MnStateScaffold state="empty" message="No agents found" className="border rounded p-2" />
          <MnStateScaffold state="error" message="Connection failed" onRetry={() => {}} className="border rounded p-2" />
          <MnStateScaffold state="ready" className="border rounded p-2">
            <p className="text-sm text-center py-4">Content loaded</p>
          </MnStateScaffold>
        </div>
      </div>

      {/* Toast */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">MnToast</h3>
        <MnToast />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => toast.success('Agent deployed successfully')} className="px-3 py-1.5 rounded border text-sm">Success</button>
          <button onClick={() => toast.error('Deployment failed: timeout')} className="px-3 py-1.5 rounded border text-sm">Error</button>
          <button onClick={() => toast.warning('High memory usage detected')} className="px-3 py-1.5 rounded border text-sm">Warning</button>
          <button onClick={() => toast.info('New model version available')} className="px-3 py-1.5 rounded border text-sm">Info</button>
        </div>
      </div>
    </>
  );
}
