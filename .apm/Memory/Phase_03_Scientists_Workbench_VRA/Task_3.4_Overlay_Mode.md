# Task 3.4: Representational Layer (Overlay Mode)

## Status
- [x] Create LabContext for global overlay state
- [x] Add overlay toggle button to LabLayout toolbar
- [x] Emit overlay event to Phaser game
- [x] Implement force vector visualization in MagnetsScene

## Implementation Details

### LabContext (`frontend/contexts/LabContext.tsx`)
- Created React context for managing lab-wide state
- Provides `showOverlay` boolean and `setShowOverlay` function
- Used by `LabLayout` and `PhaserGame` components

### LabLayout Toolbar (`frontend/components/lab/LabLayout.tsx`)
- Added "Forces" toggle button in bottom toolbar (lines 79-89)
- Uses Eye/EyeOff icons from Lucide React
- Button highlights when overlay is active (indigo color scheme)
- Toggles `showOverlay` state via LabContext

### Phaser Integration (`frontend/components/game/PhaserGame.tsx`)
- Accepts `showOverlay` prop (line 11)
- Emits `toggle-overlay` event to game when prop changes (lines 26-31)
- Sets `showOverlay` in game registry for scene access

### Force Vector Visualization (`frontend/components/game/scenes/MagnetsScene.ts`)
- Listens for `toggle-overlay` event from game (lines 28-30)
- Implements `drawForceVectors()` method (lines 102-118)
- Draws colored lines between magnet poles:
  - Red lines: N-N and S-S (repelling forces)
  - Green lines: N-S and S-N (attracting forces)
- Called in update loop when overlay is enabled (lines 97-99)

## Key Features
- Toggle button provides visual feedback (active state styling)
- Force lines show real-time pole interactions
- Color coding helps students understand attraction vs repulsion
- Non-intrusive overlay that doesn't interfere with simulation

## Files Modified/Created
- `frontend/contexts/LabContext.tsx` - New context for lab state
- `frontend/components/lab/LabLayout.tsx` - Added overlay toggle button
- `frontend/components/game/PhaserGame.tsx` - Prop and event emission
- `frontend/components/game/scenes/MagnetsScene.ts` - Force visualization
