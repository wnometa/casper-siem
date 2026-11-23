import { useEffect, useState } from 'react';

type Face = 'grin' | 'tongue' | 'wow' | 'wink' | 'dizzy';

const FACES: Face[] = ['grin', 'tongue', 'wow', 'wink', 'dizzy'];

const SKIN = '#7a4a21';
const SKIN_DARK = '#5e3716';
const INK = '#0b0b0b';

function Eyes({ face }: { face: Face }) {
  if (face === 'dizzy') {
    return (
      <g stroke={INK} strokeWidth="2.4" strokeLinecap="round">
        <path d="M27 39l7 7M34 39l-7 7" />
        <path d="M46 39l7 7M53 39l-7 7" />
      </g>
    );
  }
  if (face === 'wink') {
    return (
      <g>
        <circle cx="30.5" cy="42.5" r="5.5" fill="#fff" stroke={INK} strokeWidth="2" />
        <circle cx="30.5" cy="42.5" r="2.4" fill={INK} />
        <path d="M46 42.5q3.5-3.5 7 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  const pupil = face === 'wow' ? 2 : 2.6;
  const dy = face === 'grin' ? -1 : 0;
  return (
    <g>
      <circle cx="30.5" cy="42.5" r="5.5" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx="49.5" cy="42.5" r="5.5" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx="30.5" cy={42.5 + dy} r={pupil} fill={INK} />
      <circle cx="49.5" cy={42.5 + dy} r={pupil} fill={INK} />
    </g>
  );
}

function Brows({ face }: { face: Face }) {
  if (face === 'wow') {
    return (
      <g stroke={INK} strokeWidth="2.4" strokeLinecap="round">
        <path d="M26 33q4.5-3 9-0.5" fill="none" />
        <path d="M45 32.5q4.5-2.5 9 0.5" fill="none" />
      </g>
    );
  }
  if (face === 'dizzy') {
    return (
      <g stroke={INK} strokeWidth="2.4" strokeLinecap="round">
        <path d="M26 34.5h9" />
        <path d="M45 34.5h9" />
      </g>
    );
  }
  return (
    <g stroke={INK} strokeWidth="2.4" strokeLinecap="round">
      <path d="M26 35.5q4.5-2.5 9-0.5" fill="none" />
      <path d="M45 35q4.5-2 9 0.5" fill="none" />
    </g>
  );
}

function Mouth({ face }: { face: Face }) {
  switch (face) {
    case 'grin':
    case 'wink':
      return (
        <g>
          <rect x="29" y="53" width="22" height="10" rx="5" fill={INK} />
          <rect x="31.5" y="54.5" width="17" height="4" rx="2" fill="#fff" />
          {face === 'wink' && <ellipse cx="40" cy="63.5" rx="5" ry="3" fill="#f472b6" stroke={INK} strokeWidth="1.4" />}
        </g>
      );
    case 'tongue':
      return (
        <g>
          <path d="M30 54q10 7 20 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M35 58q5 7 10 0l-1.5 6q-3.5 2.5-7 0Z" fill="#f472b6" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        </g>
      );
    case 'wow':
      return <circle cx="40" cy="57.5" r="5" fill={INK} stroke={SKIN_DARK} strokeWidth="1.5" />;
    case 'dizzy':
      return <path d="M30 57q3.5 3.5 7 0t7 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
  }
}

export function Willy({ size = 72, className = '' }: { size?: number; className?: string }) {
  const [face, setFace] = useState<Face>('grin');

  useEffect(() => {
    const t = window.setInterval(() => {
      setFace((f) => FACES[(FACES.indexOf(f) + 1) % FACES.length]);
    }, 2400);
    return () => window.clearInterval(t);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setFace((f) => FACES[(FACES.indexOf(f) + 1) % FACES.length])}
      title="Click Willy for a new face!"
      className={`inline-block cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 ${className}`}
      aria-label="Cartoon character making funny faces — click to change expression"
    >
      <svg width={size} height={size * 1.1} viewBox="0 0 80 88" fill="none" aria-hidden="true">
        {/* dreadlocks */}
        <g stroke={INK} strokeWidth="7" strokeLinecap="round">
          <path d="M28 30L17 13" />
          <path d="M40 25L40 6" />
          <path d="M52 30L63 13" />
          <path d="M20 38L4 28" />
          <path d="M60 38L76 28" />
        </g>
        {/* ears */}
        <circle cx="16" cy="49" r="5.5" fill={SKIN} stroke={INK} strokeWidth="2" />
        <circle cx="64" cy="49" r="5.5" fill={SKIN} stroke={INK} strokeWidth="2" />
        {/* head */}
        <circle cx="40" cy="47" r="23" fill={SKIN} stroke={INK} strokeWidth="2.5" />
        <path d="M20 40a23 23 0 0 1 40 0" fill={SKIN_DARK} stroke="none" />
        {/* hairline dreads */}
        <g stroke={INK} strokeWidth="6" strokeLinecap="round">
          <path d="M25 32q4-5 10-6" fill="none" />
          <path d="M40 26v-1" />
          <path d="M55 32q-4-5-10-6" fill="none" />
        </g>
        <Brows face={face} />
        <Eyes face={face} />
        <circle cx="25" cy="52" r="3" fill="#f472b6" opacity="0.35" />
        <circle cx="55" cy="52" r="3" fill="#f472b6" opacity="0.35" />
        <Mouth face={face} />
        {/* shirt */}
        <path d="M12 88q0-16 28-16t28 16Z" fill="#86efac" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M33 74.5q7 5 14 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  );
}
