import { useMemo } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import GameWorld from './GameWorld.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { ToggleButtons } from './HUD.jsx';
import { MISSIONS } from '../data/missions.js';

const BADGES = [
  { id: 'sharing', icon: '⇄', color: '#62E8E0' },
  { id: 'builder', icon: '▦', color: '#FFD166' },
  { id: 'interop', icon: '✓', color: '#8BE5A1' },
];

const CONFETTI = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 12) * 0.35,
  dur: 3.5 + (i % 5) * 0.6,
  color: ['#62E8E0', '#FFD166', '#8BE5A1', '#9878D9', '#F2AD70', '#FF7777'][i % 6],
}));

export default function CompletionScreen({ score, best, built, mappings, onAgain, onMenu, toggles }) {
  const { t } = useI18n();
  const bridges = useMemo(
    () =>
      built.map((b) => ({
        ...b,
        status: MISSIONS.find((m) => m.id === b.missionId)?.category === 'interop' ? 'interop' : 'shared',
      })),
    [built]
  );
  const bridgesBuilt = built.length + mappings.length;

  return (
    <div className="screen complete-screen">
      <div className="confetti" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <span key={i} style={{ left: `${c.left}%`, background: c.color, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }} />
        ))}
      </div>
      <div className="complete-world">
        <GameWorld bridges={bridges} celebrate />
      </div>
      <aside className="complete-panel pop-in">
        <div className="complete-tools">
          <LanguageSwitcher compact />
          <ToggleButtons {...toggles} />
        </div>
        <h1 className="final-title">{t('final.title')}</h1>
        <div className="final-stats">
          <div className="fstat big">
            <span className="fstat-label">{t('final.total')}</span>
            <span className="fstat-value">
              <bdi>{score}</bdi>
            </span>
          </div>
          <div className="fstat">
            <span className="fstat-label">{t('final.missions')}</span>
            <span className="fstat-value">
              <bdi>
                {MISSIONS.length}/{MISSIONS.length}
              </bdi>
            </span>
          </div>
          <div className="fstat">
            <span className="fstat-label">{t('final.bridges')}</span>
            <span className="fstat-value">
              <bdi>{bridgesBuilt}</bdi>
            </span>
            <span className="fstat-sub">{t('final.bridgesDetail', { b: built.length, f: mappings.length })}</span>
          </div>
        </div>
        <div className="ach-head">{t('final.achievements')}</div>
        <ul className="achievements">
          {BADGES.map((b, i) => (
            <li key={b.id} className="badge pop-in" style={{ '--badge': b.color, animationDelay: `${0.3 + i * 0.2}s` }}>
              <span className="badge-icon" aria-hidden="true">{b.icon}</span>
              <span>
                <strong>{t(`final.ach.${b.id}.name`)}</strong>
                <small>{t(`final.ach.${b.id}.desc`)}</small>
              </span>
            </li>
          ))}
        </ul>
        <div className="recap">
          <p>
            <span className="dot dot-sharing" /> {t('final.recapSharing')}
          </p>
          <p>
            <span className="dot dot-interop" /> {t('final.recapInterop')}
          </p>
        </div>
        <p className="final-message">{t('final.message')}</p>
        <div className="best-line">
          {t('final.best')}: <bdi>{best}</bdi>
        </div>
        <div className="card-actions">
          <button type="button" className="px-btn px-btn-primary" onClick={onAgain}>
            ⟲ {t('final.again')}
          </button>
          <button type="button" className="px-btn px-btn-secondary" onClick={onMenu}>
            ⌂ {t('final.menu')}
          </button>
        </div>
      </aside>
    </div>
  );
}
