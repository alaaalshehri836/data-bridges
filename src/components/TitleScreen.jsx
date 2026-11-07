import { useI18n } from '../i18n/I18nContext.jsx';
import GameWorld from './GameWorld.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { ToggleButtons } from './HUD.jsx';

const DEMO_BRIDGES = [
  { id: 'demo1', from: 'arrival_bot', to: 'event_cat', status: 'shared' },
  { id: 'demo2', from: 'road_guard', to: 'expo_coordinator', status: 'shared' },
];

export default function TitleScreen({ onStart, onHowTo, best, toggles }) {
  const { t, lang } = useI18n();
  return (
    <div className="screen title-screen">
      <div className="title-world" aria-hidden="true">
        <GameWorld bridges={DEMO_BRIDGES} />
      </div>
      <div className="title-top">
        <LanguageSwitcher />
        <div className="title-toggles">
          <ToggleButtons {...toggles} />
        </div>
      </div>
      <div className="title-center">
        <div className="title-block pop-in">
          <h1 className="game-title" aria-label="DATA BRIDGES" dir="ltr">
            <span className="gt-word">DATA</span>
            <span className="gt-bridge" aria-hidden="true" />
            <span className="gt-word">BRIDGES</span>
          </h1>
          {lang === 'ar' ? <div className="game-title-ar">{t('title.game')}</div> : null}
          <p className="game-subtitle">{t('title.subtitle')}</p>
          <p className="game-hint">{t('title.hint')}</p>
          <div className="title-buttons">
            <button type="button" className="px-btn px-btn-primary px-btn-xl" onClick={onStart}>
              ▶ {t('title.start')}
            </button>
            <button type="button" className="px-btn px-btn-secondary" onClick={onHowTo}>
              ? {t('title.howto')}
            </button>
          </div>
          {best > 0 ? (
            <div className="best-score">
              {t('title.best')}: <bdi>{best}</bdi>
            </div>
          ) : null}
        </div>
      </div>
      <footer className="title-footer">{t('title.footer')}</footer>
    </div>
  );
}
