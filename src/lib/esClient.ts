import type { Category, ClusterHealth, EsIndexInfo, Severity, SiemEvent } from '@/types';
import type { RawEventSpec } from './sampleEvents';

const ES_7_HEADERS = { 'Content-Type': 'application/json' } as const;

async function esFetch(endpoint: string, path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8000);
  try {
    return await fetch(`${endpoint.replace(/\/+$/, '')}${path}`, {
      ...init,
      headers: { ...ES_7_HEADERS, ...(init?.headers ?? {}) },
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchClusterHealth(endpoint: string): Promise<ClusterHealth> {
  const res = await esFetch(endpoint, '/_cluster/health');
  if (!res.ok) throw new Error(`Cluster health returned ${res.status}`);
  return (await res.json()) as ClusterHealth;
}

export async function fetchIndices(endpoint: string): Promise<EsIndexInfo[]> {
  const res = await esFetch(endpoint, '/_cat/indices?format=json&h=index,docs.count,health');
  if (!res.ok) throw new Error(`Index listing returned ${res.status}`);
  const data = (await res.json()) as Array<{ index?: string; 'docs.count'?: string; health?: string }>;
  return data
    .filter((row) => row.index && !row.index.startsWith('.'))
    .map((row) => ({
      index: row.index as string,
      docs: Number(row['docs.count'] ?? 0) || 0,
      health: row.health ?? 'unknown',
    }))
    .sort((a, b) => a.index.localeCompare(b.index));
}

function hitToEvent(hitId: string, src: Record<string, unknown>): SiemEvent {
  const ev = (src.event ?? {}) as { type?: string; action?: string };
  const srcIp = (src.source ?? {}) as { ip?: string };
  const dst = (src.destination ?? {}) as { host?: string; ip?: string };
  const severity = String(src.severity ?? 'low').toLowerCase();
  const category = String(src.category ?? 'network').toLowerCase();
  return {
    id: hitId,
    '@timestamp': String(src['@timestamp'] ?? new Date().toISOString()),
    severity: (['critical', 'high', 'medium', 'low'].includes(severity) ? severity : 'low') as Severity,
    category: (['auth', 'firewall', 'network', 'endpoint'].includes(category) ? category : 'network') as Category,
    eventType: String(ev.type ?? (src.rule as { name?: string } | undefined)?.name ?? 'unknown'),
    sourceIp: String(srcIp.ip ?? dst.ip ?? '—'),
    targetHost: String(dst.host ?? dst.ip ?? '—'),
    user: src.user ? String(typeof src.user === 'string' ? src.user : (src.user as { name?: string }).name) : undefined,
    message: String(src.message ?? ''),
    raw: src,
  };
}

export async function searchEvents(
  endpoint: string,
  index: string,
  query: string,
  size = 200,
): Promise<SiemEvent[]> {
  const body = query.trim()
    ? { query: { query_string: { query, fields: ['message', 'source.ip', 'destination.host', 'event.type', 'severity', 'user'] } } }
    : { query: { match_all: {} } };
  const res = await esFetch(endpoint, `/${encodeURIComponent(index)}/_search`, {
    method: 'POST',
    body: JSON.stringify({ ...body, size, sort: [{ '@timestamp': { order: 'desc' } }] }),
  });
  if (!res.ok) throw new Error(`Search returned ${res.status}`);
  const data = (await res.json()) as { hits?: { hits?: Array<{ _id: string; _source: Record<string, unknown> }> } };
  return (data.hits?.hits ?? []).map((h) => hitToEvent(h._id, h._source));
}

export async function bulkSeedEvents(endpoint: string, index: string, docs: RawEventSpec[]): Promise<number> {
  const ndjson = docs.map((d) => `${JSON.stringify({ index: { _index: index } })}\n${JSON.stringify(d)}`).join('\n') + '\n';
  const res = await esFetch(endpoint, '/_bulk', { method: 'POST', body: ndjson });
  if (!res.ok) throw new Error(`Bulk request returned ${res.status}`);
  const data = (await res.json()) as { errors?: boolean; items?: unknown[] };
  if (data.errors) throw new Error('Bulk request completed with item-level errors');
  return data.items?.length ?? 0;
}
