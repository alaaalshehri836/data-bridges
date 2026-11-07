import { useI18n } from '../i18n/I18nContext.jsx';
import { sfx } from '../game/audio.js';

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, t } = useI18n();
  const choose = (l) => {
    if (l !== lang) sfx('click');
    setLang(l);
  };
  return (
    <div className={`lang-switch ${compact ? 'is-compact' : ''}`} role="group" aria-label={t('ui.language')}>
      <button type="button" lang="ar" className={`lang-btn ar ${lang === 'ar' ? 'active' : ''}`} aria-pressed={lang === 'ar'} onClick={() => choose('ar')}>
        {compact ? 'ع' : 'العربية'}
      </button>
      <button type="button" lang="en" className={`lang-btn en ${lang === 'en' ? 'active' : ''}`} aria-pressed={lang === 'en'} onClick={() => choose('en')}>
        {compact ? 'EN' : 'English'}
      </button>
    </div>
  );
}
