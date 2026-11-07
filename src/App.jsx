import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useI18n } from './i18n/I18nContext.jsx';
import { gameReducer, initialState, scoreOf, missionConnections, isMissionComplete } from './game/gameReducer.js';
import { MISSIONS } from './data/missions.js';
import { sfx, startMusic, stopMusic, setMusicEnabled, setSfxEnabled } from './game/audio.js';
import Background from './components/Background.jsx';
import TitleScreen from './components/TitleScreen.jsx';
import HowToPlay from './components/HowToPlay.jsx';
import HUD from './components/HUD.jsx';
import GameWorld from './components/GameWorld.jsx';
import { MissionBriefing, MissionPanel, MissionComplete } from './components/MissionCard.jsx';
import InteroperabilityChallenge from './components/InteroperabilityChallenge.jsx';
import PauseMenu from './components/PauseMenu.jsx';
import CompletionScreen from './components/CompletionScreen.jsx';

const SETTINGS_KEY = 'databridges.settings';

function readSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return { sound: s.sound !== false, music: s.music !== false };
  } catch {
    return { sound: true, music: true };
  }
}

const EVENT_SOUNDS = {
  select: ['select'],
  deselect: ['click'],
  correct: ['build', 'correct'],
  warn: ['build', 'warn'],
  wrong: ['wrong'],
  dup: ['wrong'],
  mapRight: ['match'],
  mapWrong: ['wrong'],
  interopDone: ['build', 'correct'],
  missionDone: ['mission'],
  final: ['final'],
  begin: ['click'],
};

function useFullscreen() {
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const on = () => setIsFs(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener('fullscreenchange', on);
    document.addEventListener('webkitfullscreenchange', on);
    return () => {
      document.removeEventListener('fullscreenchange', on);
      document.removeEventListener('webkitfullscreenchange', on);
    };
  }, []);
  const toggle = useCallback(() => {
    const d = document;
    const el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen || d.webkitExitFullscreen)?.call(d);
    } else {
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) {
        const p = req.call(el);
        if (p && p.catch) p.catch(() => {});
      }
    }
  }, []);
  return [isFs, toggle];
}

export default function App() {
  const { dir } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [settings, setSettings] = useState(readSettings);
  const [isFs, toggleFs] = useFullscreen();

  const mission = MISSIONS[state.mission];
  const score = scoreOf(state);

  // --- settings -----------------------------------------------------------
  useEffect(() => {
    setSfxEnabled(settings.sound);
    setMusicEnabled(settings.music);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const inPlay = (state.screen === 'game' || state.screen === 'complete') && !state.paused;
  useEffect(() => {
    if (settings.music && inPlay) startMusic();
    else stopMusic();
  }, [settings.music, inPlay]);

  const toggles = useMemo(
    () => ({
      settings,
      isFullscreen: isFs,
      onToggleSound: () => {
        setSettings((s) => {
          const next = { ...s, sound: !s.sound };
          setSfxEnabled(next.sound);
          if (next.sound) sfx('click');
          return next;
        });
      },
      onToggleMusic: () => {
        sfx('click');
        setSettings((s) => ({ ...s, music: !s.music }));
      },
      onToggleFullscreen: () => {
        sfx('click');
        toggleFs();
      },
    }),
    [settings, isFs, toggleFs]
  );

  // --- sounds for game events --------------------------------------------
  useEffect(() => {
    if (!state.event) return;
    const list = EVENT_SOUNDS[state.event.type];
    if (list) list.forEach((s, i) => (i === 0 ? sfx(s) : setTimeout(() => sfx(s), 320)));
  }, [state.event]);

  // --- automatic mission flow (respects pause) ---------------------------
  const complete = state.screen === 'game' && isMissionComplete(state);
  const needsInterop =
    state.screen === 'game' &&
    !!mission.mapping &&
    !state.interopDone &&
    state.phase === 'playing' &&
    mission.connections.every((c) => state.built.some((b) => b.id === c.id));

  useEffect(() => {
    if (state.paused) return undefined;
    if (complete && state.phase === 'playing') {
      const id = setTimeout(() => dispatch({ type: 'MISSION_DONE' }), 1900);
      return () => clearTimeout(id);
    }
    if (needsInterop) {
      const id = setTimeout(() => dispatch({ type: 'OPEN_INTEROP' }), 2400);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [complete, needsInterop, state.phase, state.paused]);

  // --- keyboard: Esc toggles pause ---------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && state.screen === 'game') dispatch({ type: state.paused ? 'RESUME' : 'PAUSE' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.screen, state.paused]);

  const click = (action) => () => {
    sfx('click');
    dispatch(action);
  };

  // --- derived data for the world ----------------------------------------
  const bridges = useMemo(
    () =>
      state.built.map((b) => {
        const m = MISSIONS.find((x) => x.id === b.missionId);
        const status = m.mapping ? (state.interopDone ? 'interop' : 'warning') : 'shared';
        return { ...b, status };
      }),
    [state.built, state.interopDone]
  );
  const conns = missionConnections(state);
  const linksTotal = conns.length + (mission.mapping ? mission.mapping.fields.length : 0);
  const linksDone = conns.filter((c) => c.done).length + (mission.mapping ? state.mappings.length : 0);
  const linkedIds = useMemo(() => [...new Set(state.built.flatMap((b) => [b.from, b.to]))], [state.built]);

  let content;
  if (state.screen === 'title') {
    content = (
      <TitleScreen
        best={state.best}
        toggles={toggles}
        onStart={click({ type: 'START_GAME' })}
        onHowTo={click({ type: 'SHOW_HOWTO', from: 'title' })}
      />
    );
  } else if (state.screen === 'howto') {
    content = (
      <HowToPlay
        fromGame={state.howtoReturn === 'game'}
        onBack={click({ type: 'BACK_FROM_HOWTO' })}
        onPlay={click({ type: 'START_GAME' })}
      />
    );
  } else if (state.screen === 'complete') {
    content = (
      <CompletionScreen
        score={score}
        best={state.best}
        built={state.built}
        mappings={state.mappings}
        toggles={toggles}
        onAgain={click({ type: 'RESTART_GAME' })}
        onMenu={click({ type: 'TO_MENU' })}
      />
    );
  } else {
    content = (
      <div className={`screen game-screen ${state.paused ? 'is-paused' : ''}`}>
        <HUD
          missionIndex={state.mission}
          missionCount={MISSIONS.length}
          score={score}
          linksDone={linksDone}
          linksTotal={linksTotal}
          toggles={toggles}
          onPause={click({ type: 'PAUSE' })}
        />
        <main className="game-main">
          <div className="world-area">
            <GameWorld
              bridges={bridges}
              selected={state.selected}
              onSelect={(id) => dispatch({ type: 'SELECT', id })}
              interactive={state.phase === 'playing' && !state.paused}
              event={state.event}
              paused={state.paused}
              linkedIds={linkedIds}
            />
          </div>
          <MissionPanel
            mission={mission}
            index={state.mission}
            connections={conns}
            mappingsDone={state.mappings.length}
            interopDone={state.interopDone}
            selected={state.selected}
            feedback={state.feedback}
            onDismiss={() => dispatch({ type: 'CLEAR_FEEDBACK' })}
          />
        </main>

        {state.phase === 'briefing' ? (
          <MissionBriefing mission={mission} index={state.mission} onBegin={click({ type: 'BEGIN_MISSION' })} />
        ) : null}
        {state.phase === 'interop' ? (
          <InteroperabilityChallenge
            mission={mission}
            mappings={state.mappings}
            event={state.event}
            onMap={(src, dst) => dispatch({ type: 'MAP_FIELD', src, dst })}
            onFinish={() => dispatch({ type: 'INTEROP_DONE' })}
          />
        ) : null}
        {state.phase === 'missionDone' ? (
          <MissionComplete mission={mission} isLast={state.mission === MISSIONS.length - 1} onNext={click({ type: 'NEXT_MISSION' })} />
        ) : null}
        {state.paused ? (
          <PauseMenu
            toggles={toggles}
            onResume={click({ type: 'RESUME' })}
            onRestartMission={click({ type: 'RESTART_MISSION' })}
            onRestartGame={click({ type: 'RESTART_GAME' })}
            onHowTo={click({ type: 'SHOW_HOWTO', from: 'game' })}
            onMenu={click({ type: 'TO_MENU' })}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className={`app dir-${dir}`} dir={dir}>
      <Background />
      {content}
    </div>
  );
}
