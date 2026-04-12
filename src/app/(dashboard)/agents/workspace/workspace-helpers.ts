/**
 * Helper types and utilities for Agent Workspace bidirectional communication.
 */

export interface CommandEntry {
  id: string;
  message: string;
  reply: string | null;
  error: string | null;
  ts: number;
}

export function makeEntry(message: string): CommandEntry {
  return { id: crypto.randomUUID(), message, reply: null, error: null, ts: Date.now() };
}
