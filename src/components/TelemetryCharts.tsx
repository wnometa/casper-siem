import { memo } from 'react';
import { SEVERITY_STYLE } from '@/lib/format';
import type { Severity, SiemEvent } from '@/types';

interface Bucket {
  key: string;
  label: string;
  count: number;
  barClass: string;
}

function buildBuckets(events: SiemEvent[]): { time: Bucket[]; severity: Bucket[] } {
  const now = new Date();
  const windows = [6, 5, 4, 3, 2, 1, 0].map((back) => {
    const end = new Date(now.getTime() - back * 60 * 60_000);
    const start = new Date(end.getTime() - 60 * 60_000);
    return { label: `${String(start.getHours()).padStart(2, '0')}:00`, start: start.getTime(), end: end.getTime(), count: 0 };
  });
  for (const e of events) {
    const t = new Date(e['@timestamp']).getTime();
    for (const w of windows) if (t >= w.start && t < w.end) w.count++;
  }
  const order: Severity[] = ['critical', 'high', 'medium', 'low'];
  const sevCounts = order.reduce<Record<string, number>>((acc, s) => ((acc[s] = 0), acc), {});
  for (const e of events) sevCounts[e.severity] = (sevCounts[e.severity] ?? 0) + 1;
  return {
    time: windows.map((w) => ({ key: w.label, label: w.label, count: w.count, barClass: 'bg-green-300' })),
    severity: order.map((s) => ({
      key: s,
      label: SEVERITY_STYLE[s].label,
      count: sevCounts[s],
      barClass: SEVERITY_STYLE[s].bar,
    })),
  };
}

function BucketChart({ buckets }: { buckets: Bucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return (
    <div className="flex h-48 items-end gap-3">
      {buckets.map((b, i) => (
        <div key={b.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className="rounded-full border-2 border-slate-950 bg-slate-800 px-2 py-px font-display text-xs font-bold text-white transition-colors group-hover:bg-green-300 group-hover:text-slate-950">
            {b.count}
          </span>
          <div className="flex h-full w-full items-end">
            <div
              className={`w-full rounded-t-2xl rounded-b-md border-2 border-slate-950 transition-all duration-500 group-hover:animate-bounce-soft ${b.barClass}`}
              style={{ height: `${Math.max(6, (b.count / max) * 100)}%`, animationDelay: `${i * 30}ms` }}
            />
          </div>
          <span className="font-mono text-[10px] font-bold text-slate-400">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export const TelemetryCharts = memo(function TelemetryCharts({ events }: { events: SiemEvent[] }) {
  const { time, severity } = buildBuckets(events);
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section className="card-toon p-5">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-green-300">Threat Volume — Last 6 Hours</h3>
        <BucketChart buckets={time} />
      </section>
      <section className="card-toon p-5">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-green-300">Alerts by Severity</h3>
        <BucketChart buckets={severity} />
      </section>
    </div>
  );
});
