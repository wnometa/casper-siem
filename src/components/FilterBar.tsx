import { Search } from 'lucide-react';
import { CATEGORY_LABEL } from '@/lib/format';
import type { Category, Severity } from '@/types';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  severity: Severity | 'all';
  onSeverityChange: (s: Severity | 'all') => void;
  category: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  resultCount: number;
}

const SEV_PILLS: Array<Severity | 'all'> = ['all', 'critical', 'high', 'medium', 'low'];
const CAT_PILLS: Array<Category | 'all'> = ['all', 'auth', 'firewall', 'network', 'endpoint'];

const SEV_ACTIVE: Record<string, string> = {
  all: 'bg-white text-slate-950 border-slate-950 shadow-pop-sm',
  critical: 'bg-rose-500 text-white border-slate-950 shadow-pop-sm',
  high: 'bg-amber-400 text-slate-950 border-slate-950 shadow-pop-sm',
  medium: 'bg-yellow-300 text-slate-950 border-slate-950 shadow-pop-sm',
  low: 'bg-green-300 text-slate-950 border-slate-950 shadow-pop-sm',
};

export function FilterBar({ query, onQueryChange, severity, onSeverityChange, category, onCategoryChange, resultCount }: Props) {
  const pill = (active: boolean, extra: string) =>
    `rounded-full border-[3px] px-3 py-1 font-display text-xs font-bold transition-all hover:-translate-y-0.5 ${
      active ? extra : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-slate-200'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border-[3px] border-slate-700 bg-slate-900 px-4 py-2 transition-colors focus-within:border-green-300">
        <Search size={15} className="shrink-0 text-green-300" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search events, IPs, hosts, users…"
          className="w-full bg-transparent font-mono text-xs text-slate-200 outline-none placeholder:text-slate-600"
          aria-label="Search events"
        />
        <span className="shrink-0 rounded-full border-2 border-slate-950 bg-pink-500 px-2 py-px font-mono text-[10px] font-bold text-white">
          {resultCount} hits
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {SEV_PILLS.map((s) => (
          <button key={s} onClick={() => onSeverityChange(s)} className={pill(severity === s, `border-slate-950 ${SEV_ACTIVE[s]}`)}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="mx-1 h-5 w-1 rounded-full bg-slate-700" />
        {CAT_PILLS.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={pill(category === c, 'border-slate-950 bg-green-300 text-slate-950 shadow-pop-sm')}
          >
            {c === 'all' ? 'All Categories' : CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
    </div>
  );
}
