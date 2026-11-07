import { memo } from 'react';
import { SPRITES } from './sprites.js';

/** Renders a pixel template as crisp SVG rectangles. */
function PixelSprite({ name, pal, scale = 4, className = '', style, title }) {
  const rows = SPRITES[name];
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const rects = [];
  rows.forEach((row, y) => {
    // merge horizontal runs of the same colour to keep the DOM light
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.' || !pal[ch]) {
        x++;
        continue;
      }
      let run = 1;
      while (row[x + run] === ch) run++;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={pal[ch]} />);
      x += run;
    }
  });
  return (
    <svg
      className={`pixel-sprite ${className}`}
      style={style}
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {rects}
    </svg>
  );
}

export default memo(PixelSprite);
