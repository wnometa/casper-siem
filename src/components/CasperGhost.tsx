export function CasperGhost({ size = 44, mood = 'happy' }: { size?: number; mood?: 'happy' | 'alert' | 'sleepy' }) {
  const eye = mood === 'sleepy' ? 'M6 8h4' : 'M8 7.5v2.5M12 7.5v2.5';
  const mouth = mood === 'alert' ? 'M8.5 13.5h3' : 'M9 13c.8.9 2.2.9 3 0';
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className="drop-shadow-[2px_2px_0_rgba(2,6,23,0.9)]">
      <path
        d="M4 17V9a6 6 0 1 1 12 0v8l-2-1.4L12 17l-2-1.4L8 17l-2-1.4L4 17Z"
        fill="#e2f7ff"
        stroke="#0f172a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d={eye} stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
      <path d={mouth} stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" />
      {mood === 'alert' && <circle cx="16.4" cy="3.6" r="2.2" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.2" />}
    </svg>
  );
}
