import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Island from './Island.jsx';
import Character from './Character.jsx';
import Bridge, { bridgeGeometry } from './Bridge.jsx';
import { ISLANDS, ISLAND_BY_ID, STAGES, ISLAND_W } from '../data/islands.js';
import { CHARACTERS, CHAR_BY_ID } from '../data/characters.js';
import { useI18n } from '../i18n/I18nContext.jsx';

const FOOT_OFFSET = 118; // grass top inside the island box
const BEND = { m3c1: 0.06, m1c3: 0.12 };

function useStageFit(ref) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  // pick whichever layout lets the world be drawn largest
  const fit = (st) => (box.w && box.h ? Math.min(box.w / st.w, box.h / st.h) : 0);
  const layout = fit(STAGES.portrait) > fit(STAGES.landscape) ? 'portrait' : 'landscape';
  const stage = STAGES[layout];
  const scale = fit(stage);
  return { layout, stage, scale, box };
}

export function charPoint(id, layout) {
  const c = CHAR_BY_ID[id];
  const isl = ISLAND_BY_ID[c.island].pos[layout];
  const x = isl.x + c.slot;
  const footY = isl.y + FOOT_OFFSET;
  return { x, footY, cx: x, cy: footY - 30 };
}

/**
 * The floating-island world. Renders islands, bridges and characters on a
 * fixed-size stage that is scaled to fit its container.
 *
 * bridges: [{ id, from, to, status }]
 */
export default function GameWorld({
  bridges = [],
  selected = null,
  onSelect,
  interactive = false,
  event = null,
  celebrate = false,
  paused = false,
  linkedIds = [],
}) {
  const { t } = useI18n();
  const wrapRef = useRef(null);
  const { layout, stage, scale, box } = useStageFit(wrapRef);

  const [bubbles, setBubbles] = useState({}); // charId -> { kind, connId, nonce }
  const [charStates, setCharStates] = useState({}); // charId -> 'celebrate' | 'shake' | 'confused'
  const [fresh, setFresh] = useState(null); // bridge id just built
  const [flash, setFlash] = useState(null); // { a, b, nonce }
  const [floaters, setFloaters] = useState([]); // { nonce, x, y, text }
  const timers = useRef([]);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // One-shot animations driven by game events.
  useEffect(() => {
    if (!event) return;
    const n = event.nonce;
    const setState = (ids, s, ms) => {
      setCharStates((prev) => ({ ...prev, ...Object.fromEntries(ids.map((i) => [i, `${s}`])) }));
      later(
        () =>
          setCharStates((prev) => {
            const next = { ...prev };
            ids.forEach((i) => {
              if (next[i] === s) delete next[i];
            });
            return next;
          }),
        ms
      );
    };
    const floater = (from, to, text) => {
      const a = charPoint(from, layout);
      const b = charPoint(to, layout);
      const { mid } = bridgeGeometry({ x: a.cx, y: a.cy }, { x: b.cx, y: b.cy }, BEND[event.connId]);
      setFloaters((f) => [...f, { nonce: n, x: mid.x, y: mid.y, text }]);
      later(() => setFloaters((f) => f.filter((x) => x.nonce !== n)), 1600);
    };

    if (event.type === 'correct' || event.type === 'warn') {
      setFresh(event.connId);
      later(() => setFresh((f) => (f === event.connId ? null : f)), 1400);
      later(() => {
        setBubbles((b) => ({ ...b, [event.to]: { kind: event.type === 'warn' ? 'warn' : 'ok', connId: event.connId, nonce: n } }));
        later(
          () =>
            setBubbles((b) => {
              if (b[event.to]?.nonce !== n) return b;
              const next = { ...b };
              delete next[event.to];
              return next;
            }),
          event.type === 'warn' ? 3200 : 3600
        );
      }, 900);
      if (event.type === 'correct') {
        setState([event.from, event.to], 'celebrate', 1300);
        if (event.points) floater(event.from, event.to, `+${event.points}`);
      } else {
        later(() => setState([event.to], 'confused', 2600), 900);
      }
    } else if (event.type === 'interopDone') {
      setState([event.from, event.to], 'celebrate', 1600);
      floater(event.from, event.to, `+${event.points}`);
    } else if (event.type === 'wrong') {
      setFlash({ a: event.a, b: event.b, nonce: n });
      later(() => setFlash((f) => (f && f.nonce === n ? null : f)), 900);
      setState([event.a, event.b], 'shake', 600);
    } else if (event.type === 'dup') {
      setState([event.a, event.b], 'shake', 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.nonce]);

  const bridgeEls = useMemo(
    () =>
      bridges.map((br) => {
        const a = charPoint(br.from, layout);
        const b = charPoint(br.to, layout);
        return (
          <Bridge
            key={br.id}
            a={{ x: a.cx, y: a.cy }}
            b={{ x: b.cx, y: b.cy }}
            status={br.status}
            bend={BEND[br.id]}
            fresh={fresh === br.id}
          />
        );
      }),
    [bridges, layout, fresh]
  );

  const flashEl = flash
    ? (() => {
        const a = charPoint(flash.a, layout);
        const b = charPoint(flash.b, layout);
        return (
          <line key={flash.nonce} className="wrong-flash" x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} />
        );
      })()
    : null;

  return (
    <div ref={wrapRef} className={`world-wrap ${paused ? 'is-paused' : ''} ${celebrate ? 'is-celebrating' : ''}`}>
      {scale > 0 ? (
        <div
          className={`stage layout-${layout}`}
          style={{
            width: stage.w,
            height: stage.h,
            transform: `scale(${scale})`,
            left: (box.w - stage.w * scale) / 2,
            top: (box.h - stage.h * scale) / 2,
          }}
        >
          {ISLANDS.map((isl, i) => {
            const p = isl.pos[layout];
            return (
              <div
                key={isl.id}
                className={`island island-${isl.id}`}
                style={{ left: p.x, top: p.y, animationDelay: `${-i * 1.3}s` }}
              >
                <Island island={isl} glow={celebrate && isl.id === 'expo'} />
                <div className="island-label" style={{ width: ISLAND_W, '--isl': isl.color }}>
                  <span>{t(`islands.${isl.id}`)}</span>
                </div>
              </div>
            );
          })}

          <svg className="bridge-layer" viewBox={`0 0 ${stage.w} ${stage.h}`} width={stage.w} height={stage.h} aria-hidden="true">
            {bridgeEls}
            {flashEl}
          </svg>

          {CHARACTERS.map((c, i) => {
            const p = charPoint(c.id, layout);
            const bub = bubbles[c.id];
            return (
              <Character
                key={c.id}
                char={c}
                x={p.x}
                footY={p.footY}
                selected={selected === c.id}
                state={celebrate ? 'party' : charStates[c.id]}
                linked={linkedIds.includes(c.id)}
                interactive={interactive}
                onSelect={onSelect}
                bubble={bub ? { kind: bub.kind, nonce: bub.nonce, text: t(`payload.${bub.connId}`) } : null}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            );
          })}

          {floaters.map((f) => (
            <div key={f.nonce} className="floater" style={{ left: f.x, top: f.y }}>
              {f.text}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
