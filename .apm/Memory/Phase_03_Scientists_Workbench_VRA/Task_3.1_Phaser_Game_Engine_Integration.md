# Task 3.1 - Phaser Game Engine Integration

## Objective
Initialize Phaser 3 within the Next.js React context safely.

## Progress Log
- [x] Installed Phaser 3 (`npm install --prefix frontend phaser`)
- [x] Created `frontend/components/game/scenes/BootScene.ts` with basic preload/create methods.
- [x] Created `frontend/components/game/PhaserGame.tsx` with React `useEffect` and `useRef` for safe instantiation.
- [x] Implemented proper cleanup in `useEffect` return to destroy game instance.

## Implementation Details
- **PhaserGame Component**: 
  - Uses `useRef` to hold the game instance (`gameRef`) and the container div (`containerRef`).
  - Initializes Phaser game only if `gameRef.current` is null, preventing double initialization in React Strict Mode.
  - Destroys game instance with `destroy(true)` on component unmount.
  - Accepts optional `config` prop to override defaults.
- **BootScene**:
  - Extends `Phaser.Scene`.
  - Sets background color to `#2d2d2d`.
  - Adds "VibeStudy Lab" text centered on screen.

## Next Steps
- Task 3.2: Scientist's Workbench Layout (VRA UI)