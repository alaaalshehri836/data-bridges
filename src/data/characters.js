// Characters = data sources / systems living on each island.
// Display names & descriptions live in the i18n dictionaries (chars.<id>.*).
// `slot` is the x position (inside the 270-wide island box) where the
// character stands. `sprite` picks a pixel template, `pal` its colours.

export const CHARACTERS = [
  {
    id: 'arrival_bot',
    island: 'airport',
    slot: 72,
    sprite: 'robot',
    pal: { m: '#5BCDE0', d: '#1f3f5c', a: '#FFD166', w: '#F4F4FA', e: '#101426', s: '#1f3f5c', l: '#FFD166' },
  },
  {
    id: 'flight_bot',
    island: 'airport',
    slot: 196,
    sprite: 'robotWing',
    pal: { m: '#d9f3fb', d: '#2a4d6e', a: '#FF7777', w: '#5BCDE0', e: '#101426', s: '#2a4d6e', l: '#5BCDE0' },
  },
  {
    id: 'event_cat',
    island: 'tourism',
    slot: 74,
    sprite: 'cat',
    pal: { m: '#FFD166', d: '#5a3a1c', e: '#101426', p: '#FF7777', l: '#fff3cf', t: '#5a3a1c', b: '#9878D9' },
  },
  {
    id: 'visitor_fox',
    island: 'tourism',
    slot: 196,
    sprite: 'fox',
    pal: { m: '#F2AD70', d: '#6b3317', e: '#101426', p: '#101426', l: '#F4F4FA', t: '#6b3317', b: '#9878D9' },
  },
  {
    id: 'crowd_monitor',
    island: 'crowd',
    slot: 72,
    sprite: 'humanHeadset',
    pal: { h: '#2a2440', s: '#e8b48f', e: '#101426', r: '#a8574a', c: '#78C99B', b: '#F4F4FA', p: '#2b3150', k: '#101426', g: '#62E8E0' },
  },
  {
    id: 'capacity_bot',
    island: 'crowd',
    slot: 196,
    sprite: 'robotTank',
    pal: { m: '#78C99B', d: '#1d4a33', a: '#8BE5A1', w: '#F4F4FA', e: '#101426', s: '#1d4a33', l: '#FFD166' },
  },
  {
    id: 'road_guard',
    island: 'police',
    slot: 74,
    sprite: 'humanCap',
    pal: { h: '#2b3a7a', s: '#c98c64', e: '#101426', r: '#7a3b30', c: '#3b4fa8', b: '#FFD166', p: '#232a52', k: '#101426', v: '#F2AD70' },
  },
  {
    id: 'incident_bot',
    island: 'police',
    slot: 196,
    sprite: 'robotSiren',
    pal: { m: '#F2AD70', d: '#5a2e14', a: '#FF7777', w: '#F4F4FA', e: '#101426', s: '#5a2e14', l: '#5BCDE0' },
  },
  {
    id: 'expo_coordinator',
    island: 'expo',
    slot: 72,
    sprite: 'humanHeadset',
    pal: { h: '#3a2a1c', s: '#d9a07a', e: '#101426', r: '#8a4a3a', c: '#8FD3FF', b: '#62E8E0', p: '#2b3150', k: '#101426', g: '#FFD166' },
  },
  {
    id: 'data_analyst',
    island: 'expo',
    slot: 198,
    sprite: 'humanGlasses',
    pal: { h: '#101426', s: '#e2b08a', e: '#101426', r: '#8a4a3a', c: '#9878D9', b: '#F4F4FA', p: '#2b3150', k: '#101426', g: '#62E8E0' },
  },
];

export const CHAR_BY_ID = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]));
