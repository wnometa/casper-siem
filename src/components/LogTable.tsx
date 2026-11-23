import { ChevronRight, Ghost, PartyPopper } from 'lucide-react';
import { memo } from 'react';
import { CategoryPill, SeverityBadge, TimestampCell } from './Badges';
import type { SiemEvent } from '@/types';

interface Props {
  events: SiemEvent[];
  selectedId: string | null;
  onSelect: (e: SiemEvent) => void;
}

export const LogTable = memo(function LogTable({ events, selectedId, onSelect }: Props) {
  if (events.length === 0) {
    return (
      <div className="card-toon flex flex-col items-center justify-center gap-3 border-dashed py-16 text-slate-400">
        <Ghost size={36} className="animate-float-soft text-green-300" />
        <p className="font-display text-sm font-bold">No events match — even the ghost found nothing!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border-[3px] border-slate-700 bg-slate-900/60 shadow-pop">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b-[3px] border-slate-700 bg-slate-900 font-display text-[11px] uppercase tracking-widest text-green-300">
            <th className="px-4 py-3 font-extrabold">Timestamp</th>
            <th className="px-4 py-3 font-extrabold">Severity</th>
            <th className="px-4 py-3 font-extrabold">Event Type</th>
            <th className="px-4 py-3 font-extrabold">Source IP</th>
            <th className="px-4 py-3 font-extrabold">Target Host</th>
            <th className="px-4 py-3 font-extrabold">Summary</th>
            <th className="px-4 py-3 font-extrabold">Category</th>
            <th className="px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr
              key={e.id}
              onClick={() => onSelect(e)}
              tabIndex={0}
              onKeyDown={(ev) => ev.key === 'Enter' && onSelect(e)}
              className={`cursor-pointer border-b-2 border-slate-800/70 transition-all last:border-0 hover:bg-slate-800/70 focus:bg-slate-800/70 focus:outline-none ${
                selectedId === e.id ? 'bg-green-300/10' : ''
              }`}
            >
              <td className="whitespace-nowrap px-4 py-2.5"><TimestampCell value={e['@timestamp']} /></td>
              <td className="px-4 py-2.5"><SeverityBadge severity={e.severity} /></td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-bold text-slate-200">{e.eventType}</td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-bold text-green-300">{e.sourceIp}</td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-400">{e.targetHost}</td>
              <td className="max-w-[280px] px-4 py-2.5">
                <p className="truncate text-xs font-semibold text-slate-300" title={e.message}>{e.message}</p>
              </td>
              <td className="px-4 py-2.5"><CategoryPill category={e.category} /></td>
              <td className="px-2 py-2.5 text-green-300 transition-transform group-hover:translate-x-1"><ChevronRight size={15} strokeWidth={3} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 border-t-2 border-slate-800/70 bg-slate-900/80 px-4 py-2 text-[11px] text-slate-500">
        <PartyPopper size={13} className="text-pink-400" />
        Click any row to open the Event Inspector
      </div>
    </div>
  );
});
