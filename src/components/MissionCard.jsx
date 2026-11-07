import { useI18n } from '../i18n/I18nContext.jsx';
import { CHAR_BY_ID } from '../data/characters.js';
import PixelSprite from './PixelSprite.jsx';

const pad = (n) => String(n).padStart(2, '0');

function CategoryTag({ category }) {
  const { t } = useI18n();
  return <span className={`cat-tag cat-${category}`}>{t(`category.${category}`)}</span>;
}

/** Full mission briefing shown before each mission starts. */
export function MissionBriefing({ mission, index, onBegin }) {
  const { t } = useI18n();
  return (
    <div className="overlay overlay-soft">
      <section className="pixel-card briefing-card pop-in" role="dialog" aria-modal="true" aria-labelledby="brief-title">
        <div className="card-top">
          <span className="mission-no">
            {t('play.briefing')} · <bdi>{pad(index + 1)}</bdi>
          </span>
          <CategoryTag category={mission.category} />
        </div>
        <h2 id="brief-title" className="card-title">{t(`missions.${mission.id}.title`)}</h2>
        <p className="card-story">{t(`missions.${mission.id}.story`)}</p>
        <p className="card-goal">
          <span className="goal-arrow" aria-hidden="true">▶</span> {t(`missions.${mission.id}.goal`)}
        </p>
        <div className="card-actions">
          <button type="button" className="px-btn px-btn-primary" onClick={onBegin} autoFocus>
            {t('play.begin')}
          </button>
        </div>
      </section>
    </div>
  );
}

function feedbackText(t, fb) {
  if (!fb) return null;
  if (fb.kind === 'correct') return { tone: 'ok', title: t('feedback.correctTitle'), body: t(`feedback.correct.${fb.connId}`) };
  if (fb.kind === 'warn') return { tone: 'warn', title: t('feedback.warnTitle'), body: t(`feedback.correct.${fb.connId}`) };
  if (fb.kind === 'dup') return { tone: 'info', title: t('feedback.dupTitle'), body: t('feedback.dup') };
  if (fb.kind === 'wrong') {
    let body;
    if (fb.reason === 'sameIsland') body = t('feedback.sameIsland', { island: t(`islands.${fb.island}`) });
    else if (fb.reason === 'otherMission') body = t('feedback.otherMission');
    else
      body = t('feedback.wrongPair', {
        a: t(`chars.${fb.a}.name`),
        b: t(`chars.${fb.b}.name`),
        dataA: t(`chars.${fb.a}.data`),
      });
    return { tone: 'bad', title: t('feedback.wrongTitle'), body, extra: [fb.hint ? t(`feedback.${fb.hint}`) : null, t('feedback.tryAgain')].filter(Boolean) };
  }
  return null;
}

/** Compact side panel visible during play. */
export function MissionPanel({ mission, index, connections, mappingsDone, interopDone, selected, feedback, onDismiss }) {
  const { t } = useI18n();
  const fb = feedbackText(t, feedback);
  const sel = selected ? CHAR_BY_ID[selected] : null;

  return (
    <aside className="mission-panel" aria-live="polite">
      <div className="panel-head">
        <span className="mission-no">
          {t('ui.mission')} <bdi>{pad(index + 1)}</bdi>
        </span>
        <CategoryTag category={mission.category} />
      </div>
      <h2 className="panel-title">{t(`missions.${mission.id}.title`)}</h2>
      <p className="panel-short">{t(`missions.${mission.id}.short`)}</p>

      <div className="objectives">
        <div className="obj-head">{t('play.objectives')}</div>
        <ul>
          {connections.map((c) => (
            <li key={c.id} className={c.done ? (c.interop && !interopDone ? 'is-warn' : 'is-done') : ''}>
              <span className="obj-box" aria-hidden="true">{c.done ? (c.interop && !interopDone ? '!' : '✓') : ''}</span>
              <span className="obj-text">
                {c.done ? (
                  <strong>
                    {t(`chars.${c.from}.name`)} ↔ {t(`chars.${c.to}.name`)}
                  </strong>
                ) : null}
                <span className="obj-clue">{t(`missions.${mission.id}.clues.${c.id}`)}</span>
              </span>
            </li>
          ))}
          {mission.mapping ? (
            <li className={interopDone ? 'is-done' : ''}>
              <span className="obj-box" aria-hidden="true">{interopDone ? '✓' : ''}</span>
              <span className="obj-text">
                <span className="obj-clue">{t(`missions.${mission.id}.clues.map`)}</span>
                <span className="obj-count">
                  <bdi>
                    {mappingsDone}/{mission.mapping.fields.length}
                  </bdi>
                </span>
              </span>
            </li>
          ) : null}
        </ul>
      </div>

      {sel ? (
        <div className="sel-box">
          <PixelSprite name={sel.sprite} pal={sel.pal} scale={3} />
          <div>
            <div className="sel-label">{t('play.selected')}</div>
            <div className="sel-name">{t(`chars.${sel.id}.name`)}</div>
            <div className="sel-org">{t(`islands.${sel.island}`)}</div>
            <div className="sel-data">{t(`chars.${sel.id}.data`)}</div>
            <div className="sel-hint">{t('play.pickSecond')}</div>
          </div>
        </div>
      ) : !fb ? (
        <p className="panel-prompt">{t('play.selectPrompt')}</p>
      ) : null}

      {fb ? (
        <div className={`feedback fb-${fb.tone}`} key={feedback.connId || `${feedback.kind}-${feedback.a}-${feedback.b}`}>
          <div className="fb-title">{fb.title}</div>
          <p className="fb-body">{fb.body}</p>
          {fb.extra ? fb.extra.map((x) => <p key={x} className="fb-extra">{x}</p>) : null}
          <button type="button" className="fb-close" onClick={onDismiss} aria-label={t('ui.close')}>
            ×
          </button>
        </div>
      ) : null}
    </aside>
  );
}

/** Shown when a mission's goals are all met. */
export function MissionComplete({ mission, isLast, onNext }) {
  const { t } = useI18n();
  return (
    <div className="overlay overlay-soft">
      <section className="pixel-card done-card pop-in" role="dialog" aria-modal="true" aria-labelledby="done-title">
        <div className="done-stars" aria-hidden="true">
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <div className="card-top center">
          <CategoryTag category={mission.category} />
        </div>
        <h2 id="done-title" className="card-title center">{t('play.complete')}</h2>
        <p className="done-msg">“{t(`missions.${mission.id}.done`)}”</p>
        <div className="learning">
          <div className="learning-head">{t('play.learning')}</div>
          <p>{t(`missions.${mission.id}.learning`)}</p>
        </div>
        <div className="reward">
          {t('play.reward')}: <bdi className="reward-pts">+{mission.reward}</bdi> {t('ui.pts')}
        </div>
        <div className="card-actions">
          <button type="button" className="px-btn px-btn-primary" onClick={onNext} autoFocus>
            {isLast ? t('play.results') : t('play.next')}
          </button>
        </div>
      </section>
    </div>
  );
}
