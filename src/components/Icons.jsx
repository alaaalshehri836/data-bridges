// 9x9 pixel icons drawn with SVG rects.
const ICONS = {
  soundOn: ['....x....', '...xx..x.', 'xxxxx...x', 'xxxxx.x.x', 'xxxxx.x.x', 'xxxxx.x.x', 'xxxxx...x', '...xx..x.', '....x....'],
  soundOff: ['....x....', '...xx....', 'xxxxx.x.x', 'xxxxx..x.', 'xxxxx..x.', 'xxxxx.x.x', 'xxxxx....', '...xx....', '....x....'],
  music: ['...xxxxxx', '...xxxxxx', '...x....x', '...x....x', '...x....x', '.xxx..xxx', 'xxxx.xxxx', 'xxxx.xxxx', '.xx...xx.'],
  musicOff: ['x..xxxxxx', '.x.xxxxxx', '..xx....x', '...x....x', '...xx...x', '.xxx.x.xx', 'xxxx..xxx', 'xxxx.xxxx', '.xx...xx.'],
  fullscreen: ['xxx...xxx', 'x.......x', 'x.......x', '.........', '.........', '.........', 'x.......x', 'x.......x', 'xxx...xxx'],
  exitFull: ['..x...x..', '..x...x..', 'xxx...xxx', '.........', '.........', '.........', 'xxx...xxx', '..x...x..', '..x...x..'],
  pause: ['.........', '.xx...xx.', '.xx...xx.', '.xx...xx.', '.xx...xx.', '.xx...xx.', '.xx...xx.', '.xx...xx.', '.........'],
  play: ['.x.......', '.xxx.....', '.xxxxx...', '.xxxxxxx.', '.xxxxxxxx', '.xxxxxxx.', '.xxxxx...', '.xxx.....', '.x.......'],
  globe: ['..xxxxx..', '.x..x..x.', 'x..x.x..x', 'xxxxxxxxx', 'x..x.x..x', 'xxxxxxxxx', 'x..x.x..x', '.x..x..x.', '..xxxxx..'],
};

export default function Icon({ name, size = 18 }) {
  const rows = ICONS[name];
  return (
    <svg className="px-icon" width={size} height={size} viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((r, y) =>
        [...r].map((ch, x) => (ch === 'x' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null))
      )}
    </svg>
  );
}
