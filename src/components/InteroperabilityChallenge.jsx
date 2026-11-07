import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { CHAR_BY_ID } from '../data/characters.js';
import PixelSprite from './PixelSprite.jsx';
import { sfx } from '../game/audio.js';

const PAIR_COLORS = ['#5BCDE0', '#9878D9', '#F2AD70'];

/**
 * Mission 3 field-mapping challenge.
 * Tap a sender field then a receiver field (either order), or drag a sender
 * field onto a receiver field.
 */
export default function InteroperabilityChallenge({ mission, mappings, event, onMap, onFinish }) {
  const { t } = useI18n();
  const { fields, targetOrder } = mission.mapping;
  const conn = mission.connections[0];
  const sender = CHAR_BY_ID[conn.from];
  const receiver = CHAR_BY_ID[conn.to];

  const [pickSrc, setPickSrc] = useState(null);
  const [pickDst, setPickDst] = useState(null);
  const [msg, setMsg] = useState(null); // { tone, text }
  const [shake, setShake] = useState(null); // { src, dst, n }
  const [drag, setDrag] = useState(null); // { src, x, y }
  const dragRef = useRef(null);

  const allDone = mappings.length === fields.length;
  const colorOf = (src) => PAIR_COLORS[fields.findIndex((f) => f.src === src)];
  const matchedDst = (dst) => fields.find((f) => f.dst === dst && mappings.includes(f.src));

  // React to reducer verdicts.
  useEffect(() => {
    if (!event) return;
    if (event.type === 'mapWrong') {
      const f = fields.find((x) => x.src === event.src);
      setMsg({ tone: 'bad', key: 'wrong', src: event.src, dst: event.dst, value: f?.value });
      setShake({ src: event.src, dst: event.dst, n: event.nonce });
    } else if (event.type === 'mapRight') {
      setMsg({ tone: 'ok', key: 'right', src: event.src, dst: event.dst });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.nonce]);

  const tryMap = (src, dst) => {
    setPickSrc(null);
    setPickDst(null);
    onMap(src, dst);
  };

  const clickSrc = (src) => {
    if (mappings.includes(src)) return;
    sfx('select');
    if (pickDst) tryMap(src, pickDst);
    else setPickSrc((p) => (p === src ? null : src));
  };
  const clickDst = (dst) => {
    if (matchedDst(dst)) return;
    sfx('select');
    if (pickSrc) tryMap(pickSrc, dst);
    else setPickDst((p) => (p === dst ? null : dst));
  };

  // --- drag & drop with pointer events (mouse + touch) ---
  const onPointerDown = (e, src) => {
    if (mappings.includes(src)) return;
    dragRef.current = { src, x0: e.clientX, y0: e.clientY, moved: false, id: e.pointerId };
  };
  useEffect(() => {
    const move = (e) => {
      const d = dragRef.current;
      if (!d || d.id !== e.pointerId) return;
      if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 8) d.moved = true;
      if (d.moved) {
        e.preventDefault();
        setDrag({ src: d.src, x: e.clientX, y: e.clientY });
      }
    };
    const up = (e) => {
      const d = dragRef.current;
      dragRef.current = null;
      if (!d || !d.moved) return;
      setDrag(null);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const target = el && el.closest('[data-dst]');
      if (target) tryMap(d.src, target.getAttribute('data-dst'));
    };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const msgText = msg
    ? msg.key === 'wrong'
      ? t('interop.wrong', { src: msg.src, dst: msg.dst, value: msg.value })
      : t('interop.right', { src: msg.src, dst: msg.dst })
    : t('interop.instructions');

  return (
    <div className="overlay">
      <section className={`pixel-card interop-card pop-in ${allDone ? 'is-success' : ''}`} role="dialog" aria-modal="true" aria-labelledby="interop-title">
        <div className="card-top">
          <span className="cat-tag cat-interop">{t('category.interop')}</span>
          <span className="mission-no">
            {t('interop.progress')}: <bdi>{mappings.length}/{fields.length}</bdi>
          </span>
        </div>
        <h2 id="interop-title" className="card-title">{allDone ? t('interop.successTitle') : t('interop.title')}</h2>

        {/* mini scene: sender — link — receiver */}
        <div className="interop-scene" aria-hidden="true">
          <div className={`scene-char ${allDone ? 'is-celebrate' : ''}`}>
            <PixelSprite name={sender.sprite} pal={sender.pal} scale={4} />
            <span>{t(`chars.${sender.id}.name`)}</span>
          </div>
          <div className={`scene-link ${allDone ? 'ok' : 'warn'}`}>
            <span className="packet" />
            <span className="packet" />
            <span className="packet" />
            <span className="scene-badge">{allDone ? '✓' : '!'}</span>
          </div>
          <div className={`scene-char ${allDone ? 'is-celebrate' : 'is-confused'}`}>
            <PixelSprite name={receiver.sprite} pal={receiver.pal} scale={4} />
            <span>{t(`chars.${receiver.id}.name`)}</span>
          </div>
        </div>

        {!allDone ? (
          <>
            <p className="interop-problem">
              <span className="warn-icon" aria-hidden="true">⚠</span> {t('interop.problem')}
            </p>
            <div className="interop-columns">
              <div className="sys-col">
                <div className="sys-head">
                  {t('interop.sender')} <small>· {t('interop.senderSub')}</small>
                </div>
                <pre className="json" dir="ltr">
                  {'{'}
                  {fields.map((f, i) => (
                    <span key={f.src} className="json-line">
                      {'  '}"{f.src}": {f.value}
                      {i < fields.length - 1 ? ',' : ''}
                    </span>
                  ))}
                  {'}'}
                </pre>
                <div className="field-list">
                  {fields.map((f) => {
                    const done = mappings.includes(f.src);
                    return (
                      <button
                        key={f.src}
                        type="button"
                        dir="ltr"
                        className={`field-chip src ${pickSrc === f.src ? 'is-picked' : ''} ${done ? 'is-matched' : ''} ${shake && shake.src === f.src ? 'is-shake' : ''}`}
                        style={done ? { '--pair': colorOf(f.src) } : undefined}
                        onClick={() => clickSrc(f.src)}
                        onPointerDown={(e) => onPointerDown(e, f.src)}
                        disabled={done}
                      >
                        <span className="chip-name">{f.src}</span>
                        <span className="chip-val">{f.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sys-arrow" aria-hidden="true">
                <span>⇢</span>
              </div>

              <div className="sys-col">
                <div className="sys-head">
                  {t('interop.receiver')} <small>· {t('interop.receiverSub')}</small>
                </div>
                <div className="field-list">
                  {targetOrder.map((dst) => {
                    const m = matchedDst(dst);
                    return (
                      <button
                        key={dst}
                        type="button"
                        dir="ltr"
                        data-dst={dst}
                        className={`field-chip dst ${pickDst === dst ? 'is-picked' : ''} ${m ? 'is-matched' : ''} ${shake && shake.dst === dst ? 'is-shake' : ''} ${drag ? 'is-droppable' : ''}`}
                        style={m ? { '--pair': colorOf(m.src) } : undefined}
                        onClick={() => clickDst(dst)}
                        disabled={!!m}
                      >
                        <span className="chip-name">{dst}</span>
                        <span className="chip-val">{m ? `✓ ${m.value}` : `⚠ ${t('interop.unknown')}`}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="reads-head">{t('interop.readsAs')}</div>
                <pre className="json json-receiver" dir="ltr">
                  {'{'}
                  {targetOrder.map((dst, i) => {
                    const m = matchedDst(dst);
                    return (
                      <span key={dst} className={`json-line ${m ? 'ok' : 'bad'}`}>
                        {'  '}"{dst}": {m ? m.value : '???'}
                        {i < targetOrder.length - 1 ? ',' : ''}
                      </span>
                    );
                  })}
                  {'}'}
                </pre>
              </div>
            </div>
            <p className={`interop-msg ${msg ? `tone-${msg.tone}` : ''}`} key={msg ? `${msg.key}${msg.src}${msg.dst}${shake?.n}` : 'i'} aria-live="polite">
              {msgText}
            </p>
          </>
        ) : (
          <div className="interop-success">
            <p className="success-line">✓ {t('interop.success')}</p>
            <pre className="json json-receiver all-ok" dir="ltr">
              {'{'}
              {fields.map((f, i) => (
                <span key={f.dst} className="json-line ok">
                  {'  '}"{f.dst}": {f.value}
                  {i < fields.length - 1 ? ',' : ''}
                </span>
              ))}
              {'}'}
            </pre>
            <div className="edu-note">
              <div className="edu-head">{t('interop.noteTitle')}</div>
              <p>{t('interop.noteIntro')}</p>
              <ul>
                {t('interop.noteItems').map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="card-actions">
              <button type="button" className="px-btn px-btn-primary" onClick={onFinish} autoFocus>
                {t('interop.finish')}
              </button>
            </div>
          </div>
        )}
      </section>
      {drag ? (
        <div className="drag-ghost" dir="ltr" style={{ left: drag.x, top: drag.y }}>
          {drag.src}
        </div>
      ) : null}
    </div>
  );
}
