import { memo } from 'react';
import PixelSprite from './PixelSprite.jsx';
import { PROP_PAL } from './sprites.js';

// deterministic pseudo-random so the sky doesn't reshuffle on re-render
function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const r = rand(42);
const STARS = Array.from({ length: 60 }, () => ({
  x: r() * 100,
  y: r() * 70,
  s: r() > 0.85 ? 4 : 2,
  d: r() * 4,
  c: r() > 0.8 ? '#62E8E0' : r() > 0.6 ? '#FFD166' : '#F4F4FA',
}));
const PARTICLES = Array.from({ length: 22 }, () => ({
  x: r() * 100,
  d: r() * 12,
  t: 10 + r() * 10,
  c: ['#62E8E0', '#9878D9', '#78C99B', '#F2AD70', '#5BCDE0'][Math.floor(r() * 5)],
}));

function Cloud({ w = 1 }) {
  // pixel cloud on a 24x8 grid
  const rows = ['.......xxxxx............', '.....xxxxxxxxx...xxxx...', '..xxxxxxxxxxxxxxxxxxxxx.', 'xxxxxxxxxxxxxxxxxxxxxxxx', '.xxxxxxxxxxxxxxxxxxxxxx.'];
  return (
    <svg width={24 * 6 * w} height={5 * 6 * w} viewBox="0 0 24 5" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) => [...row].map((ch, x) => (ch === 'x' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={y < 2 ? '#2c355e' : '#232b4f'} /> : null)))}
    </svg>
  );
}

function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-stars">
        {STARS.map((s, i) => (
          <span key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, background: s.c, animationDelay: `${s.d}s` }} />
        ))}
      </div>
      <div className="cloud c1"><Cloud w={1.2} /></div>
      <div className="cloud c2"><Cloud w={0.8} /></div>
      <div className="cloud c3"><Cloud w={1} /></div>
      <div className="cloud c4"><Cloud w={0.6} /></div>
      <div className="sky-plane p1"><PixelSprite name="plane" pal={PROP_PAL.plane} scale={3} /></div>
      <div className="sky-plane p2"><PixelSprite name="plane" pal={{ ...PROP_PAL.plane, b: '#F2AD70' }} scale={2} /></div>
      {PARTICLES.map((p, i) => (
        <span key={i} className="float-particle" style={{ left: `${p.x}%`, background: p.c, animationDelay: `${-p.d}s`, animationDuration: `${p.t}s` }} />
      ))}
      <div className="water">
        <div className="water-waves" />
        <div className="water-waves w2" />
      </div>
    </div>
  );
}

export default memo(Background);
