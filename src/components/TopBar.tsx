import { Database, Radio, RefreshCw, Sparkles, Upload, Wifi, WifiOff } from 'lucide-react';
import { HEALTH_STYLE } from '@/lib/format';
import { CasperGhost } from './CasperGhost';
import { Willy } from './Willy';
import type { ConnectionMode, HealthStatus } from '@/types';

interface Props {
  endpoint: string;
  onEndpointChange: (v: string) => void;
  mode: ConnectionMode;
  onModeChange: (m: ConnectionMode) => void;
  health: HealthStatus;
  checking: boolean;
  onRecheck: () => void;
  indices: string[];
  activeIndex: string;
  onIndexChange: (i: string) => void;
  onSeed: () => void;
  seeding: boolean;
}

export function TopBar({
  endpoint, onEndpointChange, mode, onModeChange, health, checking, onRecheck,
  indices, activeIndex, onIndexChange, onSeed, seeding,
}: Props) {
  const h = HEALTH_STYLE[health];
  const HealthIcon = health === 'unreachable' ? WifiOff : health === 'demo' ? Radio : Wifi;

  return (
    <header className="sticky top-0 z-30 border-b-4 border-slate-700 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-block animate-float-soft rounded-3xl border-[3px] border-slate-950 bg-green-300 p-1.5 shadow-pop-green">
            <CasperGhost size={34} mood={health === 'demo' ? 'happy' : health === 'unreachable' ? 'sleepy' : 'alert'} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-none tracking-wide text-white">
              CASPER <span className="text-green-300">SIEM</span>
            </h1>
            <span className="mt-1 inline-block rounded-full border-2 border-slate-950 bg-pink-500 px-2 py-px text-[10px] font-extrabold uppercase tracking-wider text-white shadow-pop-sm">
              Powered by Wiltecon
            </span>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 rounded-full border-[3px] border-slate-700 bg-slate-900 px-3 py-1.5 transition-colors focus-within:border-green-300">
            <Database size={13} className="shrink-0 text-slate-500" />
            <input
              value={endpoint}
              onChange={(e) => onEndpointChange(e.target.value)}
              spellCheck={false}
              className="w-56 bg-transparent font-mono text-xs text-slate-100 outline-none placeholder:text-slate-600"
              placeholder="http://localhost:9200"
              aria-label="Elasticsearch endpoint URL"
            />
          </label>

          <select
            value={activeIndex}
            onChange={(e) => onIndexChange(e.target.value)}
            className="cursor-pointer rounded-full border-[3px] border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs font-bold text-slate-100 outline-none transition-colors hover:border-green-300"
            aria-label="Data index"
          >
            {indices.length === 0 && <option value="casper-siem-logs">casper-siem-logs</option>}
            {indices.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>

          <button
            onClick={onRecheck}
            disabled={checking || mode === 'demo'}
            title="Re-check cluster health"
            className="rounded-full border-[3px] border-slate-700 bg-slate-900 p-2 text-slate-400 transition-all hover:-translate-y-0.5 hover:animate-wiggle hover:border-green-300 hover:text-green-300 disabled:opacity-40"
          >
            <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={onSeed}
            disabled={seeding}
            title="Seed sample threats via _bulk"
            className="inline-flex items-center gap-1.5 rounded-full border-[3px] border-slate-950 bg-green-300 px-3.5 py-2 font-display text-xs font-extrabold uppercase tracking-wide text-slate-950 shadow-pop-green transition-all hover:-translate-y-0.5 hover:bg-green-200 active:translate-y-0 active:shadow-none disabled:opacity-50"
          >
            {seeding ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            {seeding ? 'Seeding…' : 'Seed Sample Threats'}
          </button>

          <div className="flex items-center overflow-hidden rounded-full border-[3px] border-slate-700" role="group" aria-label="Connection mode">
            {(['demo', 'live'] as ConnectionMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`px-3.5 py-2 font-display text-xs font-extrabold uppercase tracking-wide transition-all ${
                  mode === m
                    ? m === 'demo'
                      ? 'bg-green-300 text-slate-950'
                      : 'bg-pink-500 text-white'
                      : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                {m === 'demo' ? 'Demo Mode' : 'Live ES'}
              </button>
            ))}
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border-[3px] border-slate-950 px-2.5 py-1.5 font-display text-[11px] font-extrabold uppercase tracking-wider shadow-pop-sm ${h.badge}`}
          >
            <HealthIcon size={13} className={h.dot} />
            {h.label}
          </span>

          <Willy size={56} className="animate-float-soft" />
        </div>
      </div>
    </header>
  );
}
