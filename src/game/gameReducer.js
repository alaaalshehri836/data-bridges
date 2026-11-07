// Pure game logic. No language-dependent strings are stored in state:
// feedback is stored as keys + ids, and rendered through i18n by the UI.

import { MISSIONS, ALL_CONNECTIONS, pairKey } from '../data/missions.js';
import { CHAR_BY_ID } from '../data/characters.js';

const BEST_KEY = 'databridges.best';

export function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(v) {
  try {
    localStorage.setItem(BEST_KEY, String(v));
  } catch {
    /* ignore */
  }
}

export const initialState = {
  screen: 'title', // title | howto | game | complete
  howtoReturn: 'title',
  mission: 0,
  phase: 'briefing', // briefing | playing | interop | missionDone
  paused: false,
  selected: null,
  built: [], // { id, from, to, missionId }
  mappings: [], // src field names matched in mission 3
  interopDone: false,
  earned: [], // { missionId, points, tag }
  feedback: null, // { kind, ... }
  event: null, // { type, nonce, ... } — drives one-shot animations & sounds
  best: readBest(),
};

let nonce = 0;
const ev = (type, extra = {}) => ({ type, nonce: ++nonce, ...extra });

export const scoreOf = (state) => state.earned.reduce((s, e) => s + e.points, 0);

export function missionConnections(state, mi = state.mission) {
  const m = MISSIONS[mi];
  return m.connections.map((c) => ({ ...c, done: state.built.some((b) => b.id === c.id) }));
}

export function isMissionComplete(state, mi = state.mission) {
  const m = MISSIONS[mi];
  const allBuilt = m.connections.every((c) => state.built.some((b) => b.id === c.id));
  if (!m.mapping) return allBuilt;
  return allBuilt && state.interopDone;
}

function evaluatePair(state, a, b) {
  const mission = MISSIONS[state.mission];
  const key = pairKey(a, b);

  // Duplicate?
  if (state.built.some((x) => pairKey(x.from, x.to) === key)) {
    return { ...state, selected: null, feedback: { kind: 'dup', a, b }, event: ev('dup', { a, b }) };
  }

  const conn = mission.connections.find((c) => pairKey(c.from, c.to) === key);
  if (conn) {
    const built = [...state.built, { id: conn.id, from: conn.from, to: conn.to, missionId: mission.id }];
    const earned = conn.points
      ? [...state.earned, { missionId: mission.id, points: conn.points, tag: conn.id }]
      : state.earned;
    return {
      ...state,
      built,
      earned,
      selected: null,
      feedback: { kind: conn.interop ? 'warn' : 'correct', connId: conn.id },
      event: ev(conn.interop ? 'warn' : 'correct', { connId: conn.id, from: conn.from, to: conn.to, points: conn.points }),
    };
  }

  // Wrong — work out the most helpful explanation.
  const ca = CHAR_BY_ID[a];
  const cb = CHAR_BY_ID[b];
  let reason;
  if (ca.island === cb.island) reason = { kind: 'wrong', reason: 'sameIsland', island: ca.island };
  else if (ALL_CONNECTIONS.some((c) => c.key === key)) reason = { kind: 'wrong', reason: 'otherMission' };
  else {
    // Explain from the perspective of the character holding the data.
    reason = { kind: 'wrong', reason: 'wrongPair', a, b };
  }
  if (mission.mapping) reason.hint = 'm3Hint';
  return { ...state, selected: null, feedback: { ...reason, a, b }, event: ev('wrong', { a, b }) };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'SHOW_HOWTO':
      return { ...state, screen: 'howto', howtoReturn: action.from || 'title', paused: false };
    case 'BACK_FROM_HOWTO':
      return { ...state, screen: state.howtoReturn === 'game' ? 'game' : 'title' };
    case 'START_GAME':
    case 'RESTART_GAME':
      return {
        ...initialState,
        best: state.best,
        screen: 'game',
        event: ev('start'),
      };
    case 'TO_MENU':
      return { ...initialState, best: state.best, screen: 'title' };
    case 'BEGIN_MISSION':
      return { ...state, phase: 'playing', feedback: null, event: ev('begin') };
    case 'SELECT': {
      if (state.paused || state.phase !== 'playing') return state;
      const id = action.id;
      if (!state.selected) return { ...state, selected: id, feedback: null, event: ev('select', { id }) };
      if (state.selected === id) return { ...state, selected: null, event: ev('deselect') };
      return evaluatePair(state, state.selected, id);
    }
    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: null };
    case 'OPEN_INTEROP':
      if (state.phase !== 'playing') return state;
      return { ...state, phase: 'interop', event: ev('interopOpen') };
    case 'MAP_FIELD': {
      const mission = MISSIONS[state.mission];
      if (!mission.mapping || state.paused) return state;
      const f = mission.mapping.fields.find((x) => x.src === action.src);
      if (!f || state.mappings.includes(f.src)) return state;
      if (f.dst !== action.dst) return { ...state, event: ev('mapWrong', { src: action.src, dst: action.dst }) };
      return {
        ...state,
        mappings: [...state.mappings, f.src],
        earned: [...state.earned, { missionId: mission.id, points: f.points, tag: f.src }],
        event: ev('mapRight', { src: f.src, dst: f.dst, points: f.points }),
      };
    }
    case 'INTEROP_DONE': {
      const mission = MISSIONS[state.mission];
      if (!mission.mapping || state.interopDone) return state;
      if (state.mappings.length !== mission.mapping.fields.length) return state;
      const c = mission.connections[0];
      return {
        ...state,
        interopDone: true,
        phase: 'playing',
        feedback: null,
        earned: [...state.earned, { missionId: mission.id, points: mission.mapping.completionPoints, tag: 'interop' }],
        event: ev('interopDone', { from: c.from, to: c.to, points: mission.mapping.completionPoints }),
      };
    }
    case 'MISSION_DONE': {
      if (!isMissionComplete(state) || state.phase === 'missionDone') return state;
      return { ...state, phase: 'missionDone', selected: null, event: ev('missionDone') };
    }
    case 'NEXT_MISSION': {
      if (state.phase !== 'missionDone') return state;
      if (state.mission >= MISSIONS.length - 1) {
        const score = scoreOf(state);
        const best = Math.max(state.best, score);
        saveBest(best);
        return { ...state, screen: 'complete', best, event: ev('final') };
      }
      return { ...state, mission: state.mission + 1, phase: 'briefing', feedback: null, selected: null };
    }
    case 'RESTART_MISSION': {
      const mid = MISSIONS[state.mission].id;
      return {
        ...state,
        paused: false,
        phase: 'briefing',
        selected: null,
        feedback: null,
        built: state.built.filter((b) => b.missionId !== mid),
        earned: state.earned.filter((e) => e.missionId !== mid),
        mappings: MISSIONS[state.mission].mapping ? [] : state.mappings,
        interopDone: MISSIONS[state.mission].mapping ? false : state.interopDone,
      };
    }
    case 'PAUSE':
      return state.screen === 'game' ? { ...state, paused: true } : state;
    case 'RESUME':
      return { ...state, paused: false };
    default:
      return state;
  }
}
