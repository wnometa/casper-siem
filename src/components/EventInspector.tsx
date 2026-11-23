import { Check, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { CasperGhost } from './CasperGhost';
import { CategoryPill, SeverityBadge, TimestampCell } from './Badges';
import type { SiemEvent } from '@/types';

interface Props {
  event: SiemEvent | null;
  onClose: () => void;
}

export function EventInspector({ event, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const copyJson = async () => {
    if (!event) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(event.raw, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200 ${
          event ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col border-l-4 border-slate-800 bg-slate-950 transition-transform duration-300 ${
          event ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!event}
      >
        <header className="flex items-start justify-between gap-3 border-b-4 border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-3xl border-[3px] border-slate-950 bg-green-300 p-1.5 shadow-pop-green">
              <CasperGhost size={30} mood={event ? 'alert' : 'happy'} />
            </span>
            <div>
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-slate-100">Event Inspector</h3>
              {event && (
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={event.severity} />
                  <CategoryPill category={event.category} />
                  <TimestampCell value={event['@timestamp']} />
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-start gap-2">
            <button
              onClick={copyJson}
              disabled={!event}
              className="inline-flex items-center gap-1.5 rounded-full border-[3px] border-slate-950 bg-amber-400 px-3 py-1.5 font-display text-xs font-extrabold uppercase text-slate-950 shadow-pop-amber transition-all hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0 active:shadow-none disabled:opacity-40"
            >
              {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} strokeWidth={3} />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
            <button
              onClick={onClose}
              className="rounded-full border-[3px] border-slate-950 bg-rose-500 p-1.5 text-white shadow-pop-red transition-all hover:-translate-y-0.5 hover:bg-rose-400 active:translate-y-0 active:shadow-none"
              aria-label="Close inspector"
            >
              <X size={15} strokeWidth={3} />
            </button>
          </div>
        </header>

        {event && (
          <div className="flex-1 overflow-auto p-4">
            <dl className="mb-4 grid grid-cols-2 gap-3">
              {[
                ['Event Type', event.eventType],
                ['Source IP', event.sourceIp],
                ['Target Host', event.targetHost],
                ['Account', event.user ?? '—'],
              ].map(([k, v]) => (
                <div key={k} className="card-toon p-3">
                  <dt className="font-display text-[10px] font-extrabold uppercase tracking-widest text-green-300">{k}</dt>
                  <dd className="mt-1 break-words font-mono text-xs font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mb-4 rounded-2xl border-[3px] border-slate-800 bg-slate-900 p-3 text-sm font-semibold leading-relaxed text-slate-100">
              {event.message}
            </p>
            <h4 className="mb-2 font-display text-[11px] font-extrabold uppercase tracking-widest text-pink-400">Raw Document</h4>
            <pre className="overflow-auto rounded-2xl border-[3px] border-slate-700 bg-slate-900 p-3 font-mono text-xs leading-relaxed text-green-300">
              {JSON.stringify(event.raw, null, 2)}
            </pre>
          </div>
        )}
      </aside>
    </>
  );
}
