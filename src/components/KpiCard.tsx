import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import type { HealthStatus } from '@/types';
import { HEALTH_STYLE } from '@/lib/format';

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: 'green' | 'red' | 'amber' | 'pink';
  health?: HealthStatus;
}

const TONES = {
  green: { ring: 'border-green-300 bg-green-300/10', chip: 'bg-green-300 text-slate-950 shadow-pop-sm', hover: 'hover:border-green-200' },
  red: { ring: 'border-rose-400 bg-rose-500/10', chip: 'bg-rose-400 text-slate-950 shadow-pop-sm', hover: 'hover:border-rose-300' },
  amber: { ring: 'border-amber-400 bg-amber-500/10', chip: 'bg-amber-400 text-slate-950 shadow-pop-sm', hover: 'hover:border-amber-300' },
  pink: { ring: 'border-pink-500 bg-pink-500/10', chip: 'bg-pink-500 text-white shadow-pop-pink', hover: 'hover:border-pink-400' },
} as const;

export const KpiCard = memo(function KpiCard({ label, value, icon: Icon, tone, health }: Props) {
  const t = TONES[tone];
  const h = health ? HEALTH_STYLE[health] : undefined;
  return (
    <div className={`card-toon card-toon-hover p-4 ${t.ring} ${t.hover} animate-pop-in`}>
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-slate-300">{label}</span>
        <span className={`rounded-2xl border-2 border-slate-950 p-2 ${t.chip}`}>
          <Icon size={16} strokeWidth={2.5} />
        </span>
      </div>
      {h ? (
        <div className="mt-2 flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full border-2 border-slate-950 ${h.dot}`} />
          <span className="font-display text-2xl font-extrabold text-white">{h.label}</span>
        </div>
      ) : (
        <p className="mt-1 font-display text-3xl font-extrabold text-white">{value}</p>
      )}
    </div>
  );
});
