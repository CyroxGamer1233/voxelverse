# VOXELVERSE — All Phases

This archive expands the Phase 1 project into a single runnable build covering the requested 40-phase architecture.

## Run
```bash
npm install
npm run dev
```

For static single-player:
```bash
npm run build:static
```

For the Node/WebSocket host:
```bash
npm start
```

The server exposes `/ws` and `/health`.

## Notes
- Original procedural/simple materials only; no game-brand assets are included.
- The project is structured so later systems can be split into dedicated workers/modules as the game grows.
- Test on Android Chrome and desktop Chrome.
- `npm run check` performs JavaScript syntax checks.
