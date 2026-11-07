import { useI18n } from '../i18n/I18nContext.jsx';
import PixelSprite from './PixelSprite.jsx';
import { CHAR_BY_ID } from '../data/characters.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const C = (id) => CHAR_BY_ID[id];

function StepArt({ n }) {
  if (n === 0)
    return (
      <div className="step-art art-card">
        <span className="mini-card">
          <span className="mc-tag" />
          <span className="mc-line w80" />
          <span className="mc-line w60" />
          <span className="mc-line w70" />
        </span>
      </div>
    );
  if (n === 1)
    return (
      <div className="step-art art-select">
        <span className="art-char is-picked">
          <PixelSprite name={C('arrival_bot').sprite} pal={C('arrival_bot').pal} scale={3} />
        </span>
        <span className="art-cursor">▲</span>
        <span className="art-char">
          <PixelSprite name={C('event_cat').sprite} pal={C('event_cat').pal} scale={3} />
        </span>
      </div>
    );
  if (n === 2)
    return (
      <div className="step-art art-bridge">
        <span className="mini-isl cyan" />
        <svg className="mini-bridge" viewBox="0 0 100 40" aria-hidden="true">
          <path d="M8 30 Q50 0 92 30" fill="none" stroke="#62E8E0" strokeWidth="4" strokeDasharray="5 3" />
          <rect x="-3" y="-3" width="6" height="6" fill="#F4F4FA">
            <animateMotion dur="1.6s" repeatCount="indefinite" path="M8 30 Q50 0 92 30" />
          </rect>
        </svg>
        <span className="mini-isl purple" />
      </div>
    );
  return (
    <div className="step-art art-interop">
      <PixelSprite name={C('flight_bot').sprite} pal={C('flight_bot').pal} scale={3} />
      <span className="art-fields" dir="ltr">
        <span>id → number</span>
        <span className="ok">✓</span>
      </span>
      <PixelSprite name={C('capacity_bot').sprite} pal={C('capacity_bot').pal} scale={3} />
    </div>
  );
}

export default function HowToPlay({ onBack, onPlay, fromGame }) {
  const { t } = useI18n();
  const steps = t('howto.steps');
  return (
    <div className="screen howto-screen">
      <div className="howto-top">
        <button type="button" className="px-btn px-btn-ghost" onClick={onBack}>
          <span className="flip-rtl" aria-hidden="true">◀</span> {t('ui.back')}
        </button>
        <LanguageSwitcher />
      </div>
      <h1 className="screen-title">{t('howto.title')}</h1>
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={i} className="step pop-in" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="step-no">
              <bdi>{i + 1}</bdi>
            </span>
            <StepArt n={i} />
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </li>
        ))}
      </ol>
      <h2 className="concepts-title">{t('howto.conceptsTitle')}</h2>
      <div className="concepts">
        <div className="concept concept-sharing">
          <div className="concept-icon" aria-hidden="true">⇄</div>
          <div>
            <h3>{t('howto.sharingH')}</h3>
            <p>{t('howto.sharingP')}</p>
          </div>
        </div>
        <div className="concept concept-interop">
          <div className="concept-icon" aria-hidden="true">✓</div>
          <div>
            <h3>{t('howto.interopH')}</h3>
            <p>{t('howto.interopP')}</p>
          </div>
        </div>
      </div>
      <div className="card-actions">
        <button type="button" className="px-btn px-btn-primary" onClick={fromGame ? onBack : onPlay}>
          {fromGame ? t('ui.continue') : t('howto.play')}
        </button>
      </div>
    </div>
  );
}
