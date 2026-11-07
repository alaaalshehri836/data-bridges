// Island definitions. Positions are in "stage units" for two layouts.
// Landscape stage: 1200 x 720. Portrait stage: 600 x 1080.
// Every island artwork box is 270 x 230 (see Island.jsx).

export const ISLAND_W = 270;
export const ISLAND_H = 230;

export const STAGES = {
  landscape: { w: 1200, h: 720 },
  portrait: { w: 600, h: 1080 },
};

export const ISLANDS = [
  {
    id: 'airport',
    color: '#5BCDE0',
    shade: '#3a9fb3',
    pos: { landscape: { x: 40, y: 160 }, portrait: { x: 10, y: 190 } },
  },
  {
    id: 'tourism',
    color: '#9878D9',
    shade: '#7356b5',
    pos: { landscape: { x: 470, y: 20 }, portrait: { x: 320, y: 10 } },
  },
  {
    id: 'crowd',
    color: '#78C99B',
    shade: '#56a379',
    pos: { landscape: { x: 900, y: 220 }, portrait: { x: 320, y: 420 } },
  },
  {
    id: 'police',
    color: '#F2AD70',
    shade: '#c9864c',
    pos: { landscape: { x: 290, y: 450 }, portrait: { x: 10, y: 620 } },
  },
  {
    id: 'expo',
    color: '#8FD3FF',
    shade: '#5fa6d9',
    pos: { landscape: { x: 740, y: 470 }, portrait: { x: 320, y: 810 } },
  },
];

export const ISLAND_BY_ID = Object.fromEntries(ISLANDS.map((i) => [i.id, i]));
