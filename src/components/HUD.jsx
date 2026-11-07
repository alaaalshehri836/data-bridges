import { useI18n } from '../i18n/I18nContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import Icon from './Icons.jsx';

export function ToggleButtons({ settings, onToggleSound, onToggleMusic, onToggleFullscreen, isFullscreen, showLabels = false }) {
  const { t } = useI18n();
  return (
    <>
      <button
        type="button"
        className={`icon-btn ${settings.sound ? '' : 'is-off'}`}
        onClick={onToggleSound}
        aria-pressed={settings.sound}
        aria-label={`${t('ui.sound')}: ${settings.sound ? t('ui.on') : t('ui.off')}`}
        title={`${t('ui.sound')}: ${settings.sound ? t('ui.on') : t('ui.off')}`}
      >
        <Icon name={settings.sound ? 'soundOn' : 'soundOff'} />
        {showLabels ? <span>{t('ui.sound')}</span> : null}
      </button>
      <button
        type="button"
        className={`icon-btn ${settings.music ? '' : 'is-off'}`}
        onClick={onToggleMusic}
        aria-pressed={settings.music}
        aria-label={`${t('ui.music')}: ${settings.music ? t('ui.on') : t('ui.off')}`}
        title={`${t('ui.music')}: ${settings.music ? t('ui.on') : t('ui.off')}`}
      >
        <Icon name={settings.music ? 'music' : 'musicOff'} />
        {showLabels ? <span>{t('ui.music')}</span> : null}
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? t('ui.exitFullscreen') : t('ui.fullscreen')}
        title={isFullscreen ? t('ui.exitFullscreen') : t('ui.fullscreen')}
      >
        <Icon name={isFullscreen ? 'exitFull' : 'fullscreen'} />
        {showLabels ? <span>{t('ui.fullscreen')}</span> : null}
      </button>
    </>
  );
}

export default function HUD({ missionIndex, missionCount, score, linksDone, linksTotal, onPause, toggles }) {
  const { t } = useI18n();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <header className="hud">
      <div className="hud-brand" aria-hidden="true">
        <span className="brand-dot" />
        <span className="brand-text">DATA BRIDGES</span>
      </div>
      <div className="hud-stats">
        <div className="stat">
          <span className="stat-label">{t('ui.mission')}</span>
          <span className="stat-value">
            <bdi>{missionIndex + 1}/{missionCount}</bdi>
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('ui.score')}</span>
          <span className="stat-value score-value" key={score}>
            <bdi>{String(score).padStart(3, '0')}</bdi>
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('ui.links')}</span>
          <span className="stat-value">
            <bdi>{pad(linksDone)}/{pad(linksTotal)}</bdi>
          </span>
        </div>
      </div>
      <div className="hud-actions">
        <LanguageSwitcher compact />
        <ToggleButtons {...toggles} />
        <button type="button" className="icon-btn pause-btn" onClick={onPause} aria-label={t('ui.pause')} title={t('ui.pause')}>
          <Icon name="pause" />
        </button>
      </div>
    </header>
  );
}
