import { memo } from 'react';

const COLORS = {
  shared: '#62E8E0',
  warning: '#FFD166',
  interop: '#8BE5A1',
  wrong: '#FF7777',
};

export function bridgeGeometry(a, b, bend = 0.2) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular, always bending "upwards" on screen
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const off = Math.min(90, len * bend);
  const c = { x: mx + nx * off, y: my + ny * off };
  const mid = { x: 0.25 * a.x + 0.5 * c.x + 0.25 * b.x, y: 0.25 * a.y + 0.5 * c.y + 0.25 * b.y };
  return { d: `M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`, mid };
}

/**
 * A glowing pixel bridge between two stage points, with data particles
 * flowing from `a` (sender) to `b` (receiver).
 */
function Bridge({ a, b, status = 'shared', bend, fresh = false, particles = true }) {
  const color = COLORS[status] || COLORS.shared;
  const { d, mid } = bridgeGeometry(a, b, bend);
  const drawCls = fresh ? 'bridge-draw' : '';

  return (
    <g className={`bridge bridge-${status}`}>
      <path d={d} className={`bridge-glow ${drawCls}`} pathLength="1" stroke={color} />
      <path d={d} className={`bridge-deck ${drawCls}`} pathLength="1" />
      <path d={d} className={`bridge-planks ${fresh ? 'bridge-fadein' : ''}`} stroke={color} />
      <path d={d} className={`bridge-rail ${fresh ? 'bridge-fadein' : ''}`} />
      {particles
        ? [0, 1, 2].map((i) => (
            <rect
              key={i}
              className={`bridge-particle ${fresh ? 'bridge-fadein' : ''}`}
              x="-4"
              y="-4"
              width="8"
              height="8"
              fill={status === 'warning' ? '#FFD166' : '#F4F4FA'}
            >
              <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${i * 0.8}s`} path={d} />
            </rect>
          ))
        : null}
      {status === 'warning' || status === 'interop' ? (
        <g className={`bridge-badge ${status === 'warning' ? 'badge-warn' : 'badge-ok'}`} transform={`translate(${mid.x} ${mid.y})`}>
          <rect x="-16" y="-16" width="32" height="32" fill="#101426" stroke={color} strokeWidth="3" />
          <text x="0" y="8" textAnchor="middle" fontSize="22" fill={color}>
            {status === 'warning' ? '!' : '✓'}
          </text>
        </g>
      ) : null}
    </g>
  );
}

export default memo(Bridge);
