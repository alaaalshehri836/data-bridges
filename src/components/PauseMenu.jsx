import { useI18n } from '../i18n/I18nContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { ToggleButtons } from './HUD.jsx';

export default function PauseMenu({ onResume, onRestartMission, onRestartGame, onHowTo, onMenu, toggles }) {
  const { t } = useI18n();
  return (
    <div className="overlay">
      <section className="pixel-card pause-card pop-in" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <h2 id="pause-title" className="card-title center blink-text">{t('pause.title')}</h2>
        <div className="pause-buttons">
          <button type="button" className="px-btn px-btn-primary" onClick={onResume} autoFocus>
            ▶ {t('pause.resume')}
          </button>
          <button type="button" className="px-btn px-btn-secondary" onClick={onRestartMission}>
            ↺ {t('pause.restartMission')}
          </button>
          <button type="button" className="px-btn px-btn-secondary" onClick={onRestartGame}>
            ⟲ {t('pause.restartGame')}
          </button>
          <button type="button" className="px-btn px-btn-ghost" onClick={onHowTo}>
            ? {t('title.howto')}
          </button>
          <button type="button" className="px-btn px-btn-ghost" onClick={onMenu}>
            ⌂ {t('pause.menu')}
          </button>
        </div>
        <div className="pause-settings">
          <LanguageSwitcher />
          <div className="pause-toggles">
            <ToggleButtons {...toggles} showLabels />
          </div>
        </div>
      </section>
    </div>
  );
}
