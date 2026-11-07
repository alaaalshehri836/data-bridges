# DATA BRIDGES

**Connect the Islands. Share the Data. Understand Each Other.**
**اربط الجزر، وشارك البيانات.**

DATA BRIDGES is a short (3–4 minute), bilingual (English / العربية) pixel-art browser game that teaches two ideas through play:

| Concept | What the player learns |
| --- | --- |
| **Data Sharing** | Organizations exchange *relevant* data with other organizations that need it. |
| **Interoperability** | Different systems can exchange, **interpret**, and **use** that shared data correctly. Data arriving is not enough: the receiver must understand it. |

> The game is about data sharing and interoperability, **not** data integration. There is no central dashboard or data warehouse. Expo Coordination is one organization among others that exchanges and uses information.

## The world

Five floating islands, each an organization involved in running a major Expo. Every character is a data source or system:

| Island | Characters |
| --- | --- |
| ✈️ Airport (cyan) | ARRIVAL BOT (flight numbers & arrival times) · FLIGHT BOT (aggregate expected passengers) |
| 🎡 Tourism Authority (purple) | EVENT CAT (event schedules) · VISITOR FOX (expected visitors) |
| 📊 Crowd Management (green) | CROWD MONITOR (density by location) · CAPACITY BOT (occupancy & capacity) |
| 🚓 Police (orange) | ROAD GUARD (closures & alternative routes) · INCIDENT BOT (incidents & alerts) |
| 📡 Expo Coordination (light blue) | EXPO COORDINATOR · DATA ANALYST |

## Missions

1. **ARRIVAL RUSH** (Data Sharing, +100): connect the airport's arrival and passenger data to the Tourism Authority and Crowd Management.
2. **TRAFFIC TROUBLE** (Data Sharing, +150): the Police share road closures and incident alerts with Crowd Management and Expo Coordination.
3. **THE COMPATIBILITY CHALLENGE** (Interoperability, +250): the bridge is built, but the data is *not understood*. The player maps `flight_id → flight_number`, `arrival → arrival_time`, and `passengers → expected_passengers` (by tap or drag-and-drop) until both systems understand each other. An educational note explains that real interoperability also depends on common standards, shared definitions, compatible formats and protocols, clear data structures, and appropriate access permissions.

Final result: **500 points · 3/3 missions · 10 bridges** (7 data bridges + 3 field links) plus three achievements.

All data in the game is fictional and aggregate. There is no personal passenger information.

## Features

- Hand-built 16-bit-style pixel art (SVG rectangles, no image assets), with animated water, clouds, planes, particles, glowing bridges with flowing data packets, and character celebrations
- Full **Arabic (RTL)** and **English (LTR)** support with a centralized i18n system. The language can be switched at any time without losing progress, and the choice is saved in `localStorage`
- Educational feedback for every wrong pair (same island, wrong recipient, or useful-but-not-now), with no point penalties
- HUD with mission, score and link counters; pause menu (resume, restart mission or game, how to play, menu); fullscreen; sound and music toggles
- Chiptune sound effects and a soft music loop, synthesized with the Web Audio API. Nothing plays before the first user interaction
- Works with mouse, keyboard (Esc pauses) and touch. The world switches between a landscape and a portrait island layout to fit phones and tablets
- Best score saved in `localStorage`

## Tech stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- Plain CSS (no UI framework)
- Fonts: Press Start 2P, VT323, and Inter for English; Tajawal and IBM Plex Sans Arabic for Arabic
- No backend. It is a fully static single-page app

## Project structure

```
src/
  App.jsx                    # screen flow, sounds, auto-progression, pause/fullscreen
  game/
    gameReducer.js           # pure game logic (connections, scoring, missions)
    audio.js                 # Web Audio chiptune SFX + music
  data/
    islands.js               # island colours & positions (landscape/portrait)
    characters.js            # characters, sprites, palettes
    missions.js              # mission configs, required connections, field mappings
  i18n/
    en.js, ar.js             # translation dictionaries
    I18nContext.jsx          # t(), lang, dir, localStorage persistence
  components/
    GameWorld, Island, Character, Bridge, MissionCard, HUD,
    LanguageSwitcher, HowToPlay, InteroperabilityChallenge,
    CompletionScreen, TitleScreen, PauseMenu, Background, PixelSprite, Icons
```

Game logic, character IDs, mission IDs and connection rules never depend on the display language.

## Run locally

Requirements: Node.js 18+.

```bash
git clone https://github.com/alaaalshehri836/data-bridges.git
cd data-bridges
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the build locally
```

## Deployment (Vercel)

The repo includes `vercel.json`:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite of all routes to `index.html`

Import the GitHub repository in Vercel (or push to the connected branch) and it deploys automatically.

---

*Different Systems. Shared Data. Better Understanding.*
*أنظمة مختلفة، بيانات مشتركة، وفهم أفضل.*
