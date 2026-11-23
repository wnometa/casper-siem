import { CATEGORY_LABEL, SEVERITY_STYLE, formatTimestamp } from '@/lib/format';
import type { Category, SiemEvent } from '@/types';

const SEV_TOON: Record<SiemEvent['severity'], string> = {
  critical: 'bg-rose-500 text-white border-slate-950 shadow-pop-sm',
  high: 'bg-amber-400 text-slate-950 border-slate-950 shadow-pop-sm',
  medium: 'bg-yellow-300 text-slate-950 border-slate-950 shadow-pop-sm',
  low: 'bg-green-300 text-slate-950 border-slate-950 shadow-pop-sm',
};

export function SeverityBadge({ severity, big = false }: { severity: SiemEvent['severity']; big?: boolean }) {
  const s = SEVERITY_STYLE[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 font-display font-bold uppercase tracking-wider ${SEV_TOON[severity]} ${
        big ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-[11px]'
      }`}
    >
      <span className={`h-2 w-2 rounded-full border border-slate-950/60 ${s.dot}`} />
      {s.label}
    </span>
  );
}

const CAT_TOON: Record<Category, string> = {
  auth: 'bg-sky-400/20 text-sky-200 border-sky-400/50',
  firewall: 'bg-orange-400/20 text-orange-200 border-orange-400/50',
  network: 'bg-green-300/20 text-green-200 border-green-300/50',
  endpoint: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
};

export function CategoryPill({ category }: { category: Category }) {
  return (
    <span className={`inline-flex rounded-full border-2 px-2.5 py-0.5 font-display text-[11px] font-bold ${CAT_TOON[category]}`}>
      {CATEGORY_LABEL[category]}
    </span>
  );
}

export function TimestampCell({ value }: { value: string }) {
  return <span className="font-mono text-xs text-slate-400">{formatTimestamp(value)}</span>;
}
