import { memo } from 'react';
import PixelSprite from './PixelSprite.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';

export const CHAR_SCALE = 4;
export const CHAR_W = 12 * CHAR_SCALE; // 48
export const CHAR_H = 14 * CHAR_SCALE; // 56

/**
 * A clickable/tappable character standing on an island.
 * (x, footY) are stage coordinates of the character's feet.
 */
function Character({ char, x, footY, selected, state, bubble, interactive, onSelect, linked }) {
  const { t } = useI18n();
  const name = t(`chars.${char.id}.name`);
  const data = t(`chars.${char.id}.data`);
  const cls = ['character', selected && 'is-selected', state && `is-${state}`, linked && 'is-linked', !interactive && 'is-static']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={cls}
      data-char={char.id}
      style={{ left: x - 46, top: footY - CHAR_H - 14 }}
      onClick={interactive ? () => onSelect(char.id) : undefined}
      tabIndex={interactive ? 0 : -1}
      aria-pressed={interactive ? !!selected : undefined}
      aria-label={`${name}: ${data}`}
      title={`${name} — ${data}`}
    >
      <span className="char-shadow" />
      <span className="char-body">
        <PixelSprite name={char.sprite} pal={char.pal} scale={CHAR_SCALE} />
      </span>
      <span className="char-name">{name}</span>
      {selected ? <span className="select-ring" aria-hidden="true" /> : null}
      {bubble ? (
        <span className={`char-bubble bubble-${bubble.kind}`} key={bubble.nonce} aria-live="polite">
          {bubble.kind === 'warn' ? <span className="bubble-icon">⚠</span> : <span className="bubble-icon">✉</span>}
          <span className="bubble-text" dir="auto">{bubble.text}</span>
        </span>
      ) : null}
    </button>
  );
}

export default memo(Character);
