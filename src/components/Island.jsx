import { memo } from 'react';
import PixelSprite from './PixelSprite.jsx';
import { PROP_PAL } from './sprites.js';
import { ISLAND_W, ISLAND_H } from '../data/islands.js';

const R = (x, y, w, h, fill, props = {}) => <rect x={x} y={y} width={w} height={h} fill={fill} {...props} />;

function Tree({ x, y, color }) {
  return (
    <g className="tree-sway" style={{ transformOrigin: `${x + 7}px ${y}px` }}>
      {R(x + 5, y - 10, 4, 10, '#5a3a1c')}
      {R(x, y - 24, 14, 14, color)}
      {R(x + 2, y - 28, 10, 4, color)}
      {R(x + 2, y - 24, 4, 4, '#ffffff', { opacity: 0.25 })}
      {R(x, y - 12, 14, 2, '#000', { opacity: 0.18 })}
    </g>
  );
}

function Base({ color, shade }) {
  const dirt = [
    [10, 130, 250, 12, '#544774'],
    [22, 142, 226, 12, '#4a3e68'],
    [40, 154, 190, 12, '#41365d'],
    [62, 166, 146, 12, '#382f52'],
    [88, 178, 94, 12, '#302847'],
    [108, 190, 54, 12, '#28223d'],
    [124, 202, 22, 10, '#211c33'],
  ];
  return (
    <g>
      {dirt.map(([x, y, w, h, f], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={f} />
      ))}
      {/* stones */}
      {R(10, 130, 250, 3, '#000', { opacity: 0.25 })}
      {R(40, 136, 6, 4, '#6f6496')}
      {R(180, 146, 8, 4, '#6f6496')}
      {R(96, 160, 6, 4, '#4a4068')}
      {R(150, 182, 4, 4, '#4a4068')}
      {/* grass */}
      {R(4, 120, 262, 10, shade)}
      {R(8, 116, 254, 6, color)}
      {R(8, 116, 254, 2, '#ffffff', { opacity: 0.3 })}
      {/* drips */}
      {R(28, 130, 6, 6, shade)}
      {R(78, 130, 4, 10, shade)}
      {R(148, 130, 6, 5, shade)}
      {R(222, 130, 4, 9, shade)}
      {R(250, 130, 4, 5, shade)}
      {/* glowing crystal */}
      <g className="crystal-glow">
        {R(130, 212, 10, 10, color)}
        {R(132, 222, 6, 4, color)}
        {R(132, 214, 3, 3, '#ffffff', { opacity: 0.6 })}
      </g>
    </g>
  );
}

function Airport() {
  return (
    <g>
      {/* control tower */}
      {R(226, 30, 14, 86, '#e6eef8')}
      {R(226, 60, 14, 4, '#5BCDE0')}
      {R(226, 84, 14, 4, '#5BCDE0')}
      {R(216, 16, 34, 16, '#5BCDE0')}
      {R(219, 20, 28, 8, '#9ff3ff', { className: 'win-glow' })}
      {R(220, 12, 26, 4, '#2a4d6e')}
      {R(232, 4, 2, 8, '#F4F4FA')}
      {R(231, 0, 4, 4, '#FF7777', { className: 'blink' })}
      {/* terminal */}
      {R(14, 72, 112, 44, '#d4ecf5')}
      {R(10, 64, 120, 9, '#5BCDE0')}
      {R(10, 72, 120, 2, '#3a9fb3')}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          {R(20 + i * 17, 80, 12, 12, '#1d2b4d')}
          {R(22 + i * 17, 82, 8, 8, '#9ff3ff', { className: 'win-glow', style: { animationDelay: `${i * 0.4}s` } })}
        </g>
      ))}
      {R(62, 98, 16, 18, '#1d2b4d')}
      {R(69, 98, 2, 18, '#5BCDE0')}
      {/* arrivals board */}
      {R(140, 60, 72, 36, '#101426')}
      {R(140, 60, 72, 7, '#5BCDE0')}
      {R(144, 62, 3, 3, '#101426')}
      {R(150, 62, 30, 3, '#101426')}
      {[0, 1, 2].map((i) => (
        <g key={i} className={i === 1 ? 'board-flicker' : undefined}>
          {R(144, 71 + i * 8, 22, 4, '#FFD166')}
          {R(170, 71 + i * 8, 16, 4, '#8BE5A1')}
          {R(190, 71 + i * 8, 18, 4, '#F4F4FA', { opacity: 0.7 })}
        </g>
      ))}
      {R(152, 96, 3, 20, '#2b3150')}
      {R(197, 96, 3, 20, '#2b3150')}
      {/* runway */}
      {R(120, 112, 146, 5, '#2b3150')}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => R(126 + i * 17, 114, 8, 1, '#F4F4FA', { key: i }))}
      <g className="plane-taxi">
        <g transform="translate(130,98)">
          <PixelSprite name="plane" pal={PROP_PAL.plane} scale={1} />
        </g>
      </g>
    </g>
  );
}

function Tourism() {
  const cabins = [0, 1, 2, 3, 4, 5, 6, 7];
  const colors = ['#FFD166', '#FF7777', '#5BCDE0', '#8BE5A1'];
  return (
    <g>
      {/* ferris wheel */}
      <path d="M206 62 L190 116 L196 116 L210 66 Z M224 62 L240 116 L234 116 L220 66 Z" fill="#c9b8f0" />
      <g className="spin" style={{ transformOrigin: '215px 62px' }}>
        <circle cx="215" cy="62" r="40" fill="none" stroke="#F4F4FA" strokeWidth="3" />
        <circle cx="215" cy="62" r="30" fill="none" stroke="#9878D9" strokeWidth="2" />
        {cabins.map((i) => {
          const a = (i / cabins.length) * Math.PI * 2;
          return (
            <g key={i}>
              <line x1="215" y1="62" x2={215 + Math.cos(a) * 40} y2={62 + Math.sin(a) * 40} stroke="#c9b8f0" strokeWidth="1.5" />
              {R(215 + Math.cos(a) * 40 - 5, 62 + Math.sin(a) * 40 - 4, 10, 8, colors[i % 4])}
            </g>
          );
        })}
        {R(211, 58, 8, 8, '#F4F4FA')}
      </g>
      {/* bunting */}
      <path d="M100 52 Q140 70 182 56" fill="none" stroke="#F4F4FA" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          className="flag-wave"
          style={{ animationDelay: `${i * 0.2}s` }}
          d={`M${106 + i * 11} ${56 + (i < 4 ? i * 2 : (6 - i) * 2 + 2)} l8 0 l-4 7 z`}
          fill={colors[i % 4]}
        />
      ))}
      {/* tourism centre */}
      {R(14, 70, 100, 46, '#efe4ff')}
      {R(10, 66, 108, 6, '#9878D9')}
      {R(44, 52, 40, 14, '#9878D9')}
      {R(50, 46, 28, 6, '#9878D9')}
      {R(58, 40, 12, 6, '#9878D9')}
      {R(52, 48, 8, 3, '#ffffff', { opacity: 0.35 })}
      {R(63, 24, 2, 16, '#F4F4FA')}
      {R(65, 24, 12, 7, '#FFD166', { className: 'flag-wave' })}
      {[0, 1, 3, 4].map((i) => (
        <g key={i}>
          {R(20 + i * 20, 80, 12, 16, '#3b2a66')}
          {R(22 + i * 20, 82, 8, 12, '#FFD166', { className: 'win-glow', style: { animationDelay: `${i * 0.5}s` } })}
        </g>
      ))}
      {R(56, 94, 16, 22, '#3b2a66')}
      {R(52, 90, 24, 4, '#FF7777')}
      {/* star sign */}
      {R(124, 86, 3, 30, '#A6B0CC')}
      {R(116, 74, 20, 14, '#FFD166')}
      {R(124, 77, 4, 8, '#9878D9')}
      {R(121, 80, 10, 2, '#9878D9')}
    </g>
  );
}

function Crowd() {
  const bars = [0, 1, 2, 3, 4];
  const barColors = ['#8BE5A1', '#8BE5A1', '#FFD166', '#FF7777', '#8BE5A1'];
  return (
    <g>
      {/* operations building */}
      {R(14, 58, 116, 58, '#d8f0e2')}
      {R(10, 52, 124, 7, '#78C99B')}
      {R(10, 58, 124, 2, '#56a379')}
      {/* dish */}
      {R(98, 40, 18, 4, '#F4F4FA')}
      {R(102, 36, 10, 4, '#F4F4FA')}
      {R(106, 44, 3, 8, '#A6B0CC')}
      {R(112, 30, 2, 8, '#62E8E0', { className: 'blink' })}
      {/* screen 1: bars */}
      {R(20, 64, 48, 30, '#101426')}
      {bars.map((i) => (
        <rect
          key={i}
          className="bar-anim"
          style={{ animationDelay: `${i * 0.3}s`, transformOrigin: `0 90px` }}
          x={24 + i * 9}
          y={70}
          width={6}
          height={20}
          fill={barColors[i]}
        />
      ))}
      {/* screen 2: heat grid */}
      {R(74, 64, 50, 30, '#101426')}
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => (
          <rect
            key={`${r}-${c}`}
            className={(r + c) % 3 === 0 ? 'blink-slow' : undefined}
            style={{ animationDelay: `${(r * 6 + c) * 0.15}s` }}
            x={78 + c * 7.5}
            y={68 + r * 6}
            width={6}
            height={5}
            fill={['#8BE5A1', '#FFD166', '#FF7777', '#56a379'][(r * 2 + c) % 4]}
          />
        ))
      )}
      {R(56, 98, 22, 18, '#2b3150')}
      {R(66, 98, 2, 18, '#78C99B')}
      {/* crowd gauge */}
      {R(150, 62, 66, 30, '#101426')}
      {R(150, 62, 66, 6, '#78C99B')}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          key={i}
          className="gauge-dot"
          style={{ animationDelay: `${i * 0.18}s` }}
          x={155 + i * 7.3}
          y={74}
          width={5}
          height={12}
          fill={i < 4 ? '#8BE5A1' : i < 6 ? '#FFD166' : '#FF7777'}
        />
      ))}
      {R(160, 92, 3, 24, '#2b3150')}
      {R(204, 92, 3, 24, '#2b3150')}
      {/* tiny walking crowd */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="walker" style={{ animationDelay: `${-i * 1.7}s`, animationDuration: `${6 + i}s` }}>
          <g transform={`translate(${130 + i * 6},${108})`}>
            <PixelSprite name="person" pal={{ s: '#e8b48f', c: ['#FFD166', '#5BCDE0', '#FF7777', '#9878D9'][i], p: '#2b3150' }} scale={2} />
          </g>
        </g>
      ))}
      <Tree x={238} y={116} color="#56a379" />
    </g>
  );
}

function Police() {
  return (
    <g>
      {/* station */}
      {R(10, 66, 120, 50, '#f7e6d6')}
      {R(6, 58, 128, 9, '#F2AD70')}
      {R(10, 74, 120, 6, '#3b4fa8')}
      {R(54, 48, 12, 10, '#FF7777', { className: 'siren-r' })}
      {R(66, 48, 12, 10, '#5BCDE0', { className: 'siren-b' })}
      {R(50, 56, 32, 3, '#232a52')}
      {/* badge */}
      {R(62, 84, 16, 4, '#FFD166')}
      {R(64, 88, 12, 6, '#FFD166')}
      {R(66, 94, 8, 3, '#FFD166')}
      {R(68, 87, 4, 6, '#c9864c')}
      {[0, 1].map((i) => (
        <g key={i}>
          {R(18 + i * 82, 86, 18, 14, '#232a52')}
          {R(20 + i * 82, 88, 14, 10, '#9fc8ff', { className: 'win-glow', style: { animationDelay: `${i}s` } })}
        </g>
      ))}
      {R(60, 100, 20, 16, '#232a52')}
      {/* road */}
      {R(136, 112, 130, 5, '#2b3150')}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => R(142 + i * 18, 114, 9, 1, '#FFD166', { key: i }))}
      {/* car */}
      <g className="car-idle">
        <g transform="translate(140,92)">
          <PixelSprite name="car" pal={PROP_PAL.car} scale={2.6} />
        </g>
        {R(150, 92, 5, 4, '#5BCDE0', { className: 'siren-b' })}
        {R(156, 92, 5, 4, '#FF7777', { className: 'siren-r' })}
      </g>
      {/* road sign — detour arrow */}
      {R(240, 56, 3, 60, '#A6B0CC')}
      {R(222, 40, 38, 22, '#FFD166')}
      {R(224, 42, 34, 18, '#101426', { opacity: 0.0 })}
      {R(228, 49, 18, 4, '#101426')}
      {R(242, 45, 4, 12, '#101426')}
      {R(246, 47, 3, 8, '#101426')}
      {R(249, 49, 2, 4, '#101426')}
      {/* cones */}
      {[0, 1].map((i) => (
        <g key={i}>
          {R(204 + i * 14, 108, 8, 8, '#FF7777')}
          {R(206 + i * 14, 102, 4, 6, '#FF7777')}
          {R(204 + i * 14, 110, 8, 2, '#F4F4FA')}
        </g>
      ))}
    </g>
  );
}

function Expo({ glow }) {
  return (
    <g className={glow ? 'expo-glow' : undefined}>
      {/* signal rings */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          className="ring-pulse"
          style={{ animationDelay: `${i * 0.8}s`, transformOrigin: '135px 9px' }}
          cx="135"
          cy="9"
          r="14"
          fill="none"
          stroke="#62E8E0"
          strokeWidth="2"
        />
      ))}
      {/* side panels */}
      {R(14, 74, 62, 42, '#e2f2ff')}
      {R(10, 70, 70, 5, '#8FD3FF')}
      {R(20, 80, 50, 22, '#101426')}
      <polyline className="graph-line" points="22,98 30,92 38,95 46,86 54,89 62,82 68,84" fill="none" stroke="#62E8E0" strokeWidth="2" />
      {R(194, 74, 62, 42, '#e2f2ff')}
      {R(190, 70, 70, 5, '#8FD3FF')}
      {R(200, 80, 50, 22, '#101426')}
      {[0, 1, 2, 3, 4].map((i) => R(204 + i * 9, 86 + (i % 2) * 6, 6, 6, ['#5BCDE0', '#9878D9', '#78C99B', '#F2AD70', '#62E8E0'][i], { key: i, className: 'blink-slow', style: { animationDelay: `${i * 0.3}s` } }))}
      {/* central tower */}
      {R(100, 80, 70, 36, '#cfe8ff')}
      {R(96, 76, 78, 5, '#8FD3FF')}
      {R(116, 40, 38, 36, '#bfe0ff')}
      {R(124, 16, 22, 24, '#a9d4ff')}
      {R(120, 38, 30, 3, '#5fa6d9')}
      {R(128, 2, 14, 14, '#62E8E0', { className: 'glow-pulse' })}
      {R(131, 5, 4, 4, '#ffffff', { opacity: 0.7 })}
      {R(110, 18, 2, 22, '#F4F4FA')}
      {R(109, 16, 4, 3, '#FFD166', { className: 'blink' })}
      {R(158, 22, 2, 18, '#F4F4FA')}
      {R(157, 20, 4, 3, '#FF7777', { className: 'blink', style: { animationDelay: '0.5s' } })}
      {[0, 1, 2].map((i) => R(124 + i * 9, 48, 6, 22, '#2b3150', { key: i }))}
      {[0, 1, 2].map((i) => R(125 + i * 9, 50, 4, 18, '#62E8E0', { key: `g${i}`, className: 'win-glow', style: { animationDelay: `${i * 0.4}s` } }))}
      {R(106, 88, 18, 12, '#101426')}
      {R(108, 93, 14, 2, '#62E8E0', { className: 'blink-slow' })}
      {R(146, 88, 18, 12, '#101426')}
      {R(148, 91, 6, 6, '#FFD166', { className: 'blink-slow', style: { animationDelay: '1s' } })}
      {R(126, 98, 18, 18, '#2b3150')}
      {R(134, 98, 2, 18, '#62E8E0')}
    </g>
  );
}

const ART = { airport: Airport, tourism: Tourism, crowd: Crowd, police: Police, expo: Expo };

function Island({ island, glow = false, className = '' }) {
  const Art = ART[island.id];
  return (
    <svg
      className={`island-art ${className}`}
      viewBox={`0 0 ${ISLAND_W} ${ISLAND_H}`}
      width={ISLAND_W}
      height={ISLAND_H}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <Base color={island.color} shade={island.shade} />
      <Art glow={glow} />
    </svg>
  );
}

export default memo(Island);
