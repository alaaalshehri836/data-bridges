// Tiny chiptune synth built on the Web Audio API.
// The AudioContext is only created from a user gesture (first sfx call),
// so nothing ever autoplays.

let ctx = null;
let master = null;
let sfxOn = true;
let musicOn = true;
let musicTimer = null;
let musicStep = 0;
let musicGain = null;

function ensure() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.32;
    musicGain.connect(master);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, { type = 'square', when = 0, vol = 0.5, slide = null, dest = null } = {}) {
  const c = ensure();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(dest || master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const N = (n) => 440 * Math.pow(2, (n - 69) / 12); // midi -> Hz

const SFX = {
  click: () => tone(N(84), 0.05, { vol: 0.25 }),
  select: () => {
    tone(N(76), 0.06, { vol: 0.3 });
    tone(N(83), 0.08, { when: 0.05, vol: 0.3 });
  },
  build: () => tone(N(60), 0.35, { type: 'triangle', slide: N(84), vol: 0.45 }),
  correct: () => [72, 76, 79, 84].forEach((n, i) => tone(N(n), 0.12, { when: 0.08 * i, vol: 0.32 })),
  wrong: () => {
    tone(N(52), 0.14, { type: 'sawtooth', vol: 0.2 });
    tone(N(47), 0.22, { type: 'sawtooth', when: 0.12, vol: 0.2 });
  },
  warn: () => [0, 0.18].forEach((w) => tone(N(81), 0.1, { when: w, vol: 0.25, type: 'square' })),
  match: () => {
    tone(N(79), 0.07, { vol: 0.3 });
    tone(N(86), 0.1, { when: 0.06, vol: 0.3 });
  },
  mission: () =>
    [60, 64, 67, 72, 67, 72, 76, 79].forEach((n, i) => tone(N(n), 0.14, { when: 0.1 * i, vol: 0.3 })),
  final: () => {
    [72, 76, 79, 84, 79, 84, 88, 91].forEach((n, i) => tone(N(n), 0.16, { when: 0.11 * i, vol: 0.3 }));
    [48, 55, 60, 64].forEach((n, i) => tone(N(n), 0.4, { when: 0.22 * i, type: 'triangle', vol: 0.35 }));
  },
};

export function sfx(name) {
  if (!sfxOn) return;
  const fn = SFX[name];
  if (fn) fn();
}

// --- Background music: a calm 4-chord loop -----------------------------
const CHORDS = [
  [57, 60, 64], // Am
  [53, 57, 60], // F
  [48, 52, 55], // C
  [55, 59, 62], // G
];
const ARP = [0, 1, 2, 1, 0, 2, 1, 2];

function musicTick() {
  if (!ctx) return;
  const bar = Math.floor(musicStep / 8) % CHORDS.length;
  const chord = CHORDS[bar];
  const s = musicStep % 8;
  tone(N(chord[ARP[s]] + 12), 0.2, { type: 'square', vol: 0.06, dest: musicGain });
  if (s === 0) tone(N(chord[0] - 12), 0.9, { type: 'triangle', vol: 0.22, dest: musicGain });
  if (s === 4) tone(N(chord[2] - 12), 0.5, { type: 'triangle', vol: 0.14, dest: musicGain });
  musicStep++;
}

export function startMusic() {
  if (!musicOn || musicTimer) return;
  if (!ensure()) return;
  musicTimer = setInterval(musicTick, 230);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
}

export function setSfxEnabled(v) {
  sfxOn = v;
}

export function setMusicEnabled(v) {
  musicOn = v;
  if (!v) stopMusic();
}
