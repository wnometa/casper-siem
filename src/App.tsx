import { useEffect, useMemo, useState } from 'react';
import { AlertOctagon, Ban, Database, ShieldCheck } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { CasperGhost } from '@/components/CasperGhost';
import { Willy } from '@/components/Willy';
import { KpiCard } from '@/components/KpiCard';
import { TelemetryCharts } from '@/components/TelemetryCharts';
import { FilterBar } from '@/components/FilterBar';
import { LogTable } from '@/components/LogTable';
import { EventInspector } from '@/components/EventInspector';
import { buildDemoEvents, buildSeedDocs } from '@/lib/sampleEvents';
import { bulkSeedEvents, fetchClusterHealth, fetchIndices, searchEvents } from '@/lib/esClient';
import { matchesFilters, severityRank } from '@/lib/format';
import type { Category, ConnectionMode, HealthStatus, Severity, SiemEvent } from '@/types';

const DEFAULT_ENDPOINT = 'http://localhost:9200';
const DEFAULT_INDEX = 'casper-siem-logs';

export default function App() {
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
  const [mode, setMode] = useState<ConnectionMode>('demo');
  const [health, setHealth] = useState<HealthStatus>('demo');
  const [checking, setChecking] = useState(false);
  const [indices, setIndices] = useState<string[]>([DEFAULT_INDEX]);
  const [activeIndex, setActiveIndex] = useState(DEFAULT_INDEX);
  const [events, setEvents] = useState<SiemEvent[]>(() => buildDemoEvents());
  const [liveError, setLiveError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<SiemEvent | null>(null);

  const refreshLive = async (ep: string, index: string) => {
    setChecking(true);
    setLiveError(null);
    try {
      const h = await fetchClusterHealth(ep);
      setHealth((h.status as HealthStatus) ?? 'red');
      const idx = await fetchIndices(ep);
      const names = idx.length > 0 ? idx.map((i) => i.index) : [DEFAULT_INDEX];
      setIndices(names);
      if (!names.includes(index)) setActiveIndex(names[0]);
      const found = await searchEvents(ep, index, '');
      setEvents(found);
    } catch (err) {
      setHealth('unreachable');
      setLiveError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (mode === 'live') void refreshLive(endpoint, activeIndex);
    else {
      setHealth('demo');
      setLiveError(null);
      setEvents(buildDemoEvents());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, endpoint]);

  const handleSeed = async () => {
    if (mode === 'demo') {
      setSeedNotice('Demo Mode active — switch to Live Elasticsearch to bulk-index into your cluster.');
      window.setTimeout(() => setSeedNotice(null), 4000);
      return;
    }
    setSeeding(true);
    setSeedNotice(null);
    try {
      const count = await bulkSeedEvents(endpoint, activeIndex, buildSeedDocs());
      setSeedNotice(`Seeded ${count} sample threat events into ${activeIndex}.`);
      await refreshLive(endpoint, activeIndex);
    } catch (err) {
      setSeedNotice(`Seed failed: ${err instanceof Error ? err.message : 'request error'}`);
    } finally {
      setSeeding(false);
      window.setTimeout(() => setSeedNotice(null), 6000);
    }
  };

  const filtered = useMemo(() => {
    const rows = events.filter((e) => matchesFilters(e, query, severityFilter, categoryFilter));
    return rows.sort(
      (a, b) => new Date(b['@timestamp']).getTime() - new Date(a['@timestamp']).getTime() || severityRank(b.severity) - severityRank(a.severity),
    );
  }, [events, query, severityFilter, categoryFilter]);

  const kpis = useMemo(() => {
    const criticalHigh = events.filter((e) => e.severity === 'critical' || e.severity === 'high').length;
    const blocked = new Set(events.filter((e) => e.severity === 'critical' || e.severity === 'high').map((e) => e.sourceIp)).size;
    return { total: events.length, criticalHigh, blocked };
  }, [events]);

  return (
    <div className="min-h-screen text-slate-200">
      <TopBar
        endpoint={endpoint}
        onEndpointChange={setEndpoint}
        mode={mode}
        onModeChange={setMode}
        health={health}
        checking={checking}
        onRecheck={() => void refreshLive(endpoint, activeIndex)}
        indices={indices}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
        onSeed={() => void handleSeed()}
        seeding={seeding}
      />

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        {seedNotice && (
          <div className="animate-pop-in rounded-2xl border-[3px] border-slate-950 bg-green-300 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-pop-green">
            {seedNotice}
          </div>
        )}
        {mode === 'live' && liveError && (
          <div className="animate-pop-in rounded-2xl border-[3px] border-slate-950 bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-pop-amber">
            Elasticsearch unreachable ({liveError}) — verify the endpoint and that the cluster allows browser CORS requests.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total Events" value={String(kpis.total)} icon={Database} tone="green" />
          <KpiCard label="Critical & High Alerts" value={String(kpis.criticalHigh)} icon={AlertOctagon} tone="red" />
          <KpiCard label="Blocked Attackers (Unique IPs)" value={String(kpis.blocked)} icon={Ban} tone="amber" />
          <KpiCard
            label="Cluster Health"
            value={health.toUpperCase()}
            icon={ShieldCheck}
            tone="pink"
            health={mode === 'demo' ? 'demo' : health}
          />
        </div>

        <TelemetryCharts events={filtered} />

        <section className="space-y-3">
          <FilterBar
            query={query}
            onQueryChange={setQuery}
            severity={severityFilter}
            onSeverityChange={setSeverityFilter}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            resultCount={filtered.length}
          />
          <LogTable events={filtered} selectedId={selected?.id ?? null} onSelect={setSelected} />
        </section>
      </main>

      <footer className="mt-8 border-t-4 border-slate-700 bg-slate-900/60 py-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <CasperGhost size={22} mood="happy" />
          <p className="font-display text-sm font-extrabold text-white">
            CASPER SIEM <span className="text-green-300">by Wiltecon</span>
          </p>
          <Willy size={26} />
        </div>
        <p className="mt-1 font-display text-xs font-bold uppercase tracking-widest text-slate-400">
          Founded by Wilson Nometa
        </p>
        <p className="mt-1.5 font-display text-[11px] font-bold lowercase italic text-pink-400">
          ~ Willy Baby ~
        </p>
      </footer>

      <EventInspector event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
