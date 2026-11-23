import type { Category, HealthStatus, Severity, SiemEvent } from '@/types';

export const SEVERITY_STYLE: Record<Severity, { label: string; badge: string; bar: string; dot: string }> = {
  critical: {
    label: 'Critical',
    badge: 'bg-red-500/10 text-red-400 border-red-500/40',
    bar: 'bg-red-500',
    dot: 'bg-red-500',
  },
  high: {
    label: 'High',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
  },
  medium: {
    label: 'Medium',
    badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/40',
    bar: 'bg-yellow-400',
    dot: 'bg-yellow-400',
  },
  low: {
    label: 'Low',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  },
};

export const CATEGORY_LABEL: Record<Category, string> = {
  auth: 'Auth',
  firewall: 'Firewall',
  network: 'Network',
  endpoint: 'Endpoint',
};

export const HEALTH_STYLE: Record<HealthStatus, { label: string; badge: string; dot: string }> = {
  green: { label: 'Green', badge: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', dot: 'bg-emerald-400' },
  yellow: { label: 'Yellow', badge: 'text-amber-400 border-amber-500/40 bg-amber-500/10', dot: 'bg-amber-400' },
  red: { label: 'Red', badge: 'text-red-400 border-red-500/40 bg-red-500/10', dot: 'bg-red-400' },
  unreachable: { label: 'Unreachable', badge: 'text-slate-400 border-slate-600/60 bg-slate-800/60', dot: 'bg-slate-500' },
  demo: { label: 'Demo Data', badge: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', dot: 'bg-cyan-400 animate-pulse' },
};

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function severityRank(s: Severity): number {
  return { critical: 3, high: 2, medium: 1, low: 0 }[s];
}

export function matchesFilters(
  event: SiemEvent,
  query: string,
  severityFilter: Severity | 'all',
  categoryFilter: Category | 'all',
): boolean {
  if (severityFilter !== 'all' && event.severity !== severityFilter) return false;
  if (categoryFilter !== 'all' && event.category !== categoryFilter) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [event.message, event.sourceIp, event.targetHost, event.eventType, event.severity, event.category, event.user ?? '']
    .join(' ')
    .toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
}
