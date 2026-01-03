# Task 5.1 - Representational Layer (Overlay Mode)

## Goal
Allow students to visualize invisible forces (vectors) on top of the magnet simulation.

## Requirements
- Add "Spectacles" (Overlay) toggle button in the VRA Lab UI
- When active, render dynamic arrows representing:
  - Magnetic Force (attraction/repulsion) - color coded
  - Velocity vectors for moving magnets
- Overlay should update in real-time as magnets move

## Technical Implementation
- Create `OverlayScene.ts` as a parallel Phaser scene
- Use Phaser Graphics to draw vector arrows
- Calculate force vectors based on magnet positions and poles
- Subscribe to MagnetsScene events for position updates

## Files
- `frontend/components/game/scenes/OverlayScene.ts` (New)
- `frontend/app/lab/[id]/page.tsx` (Update - add toggle)
- `frontend/components/game/PhaserGame.tsx` (Update - launch overlay scene)

## Status: Completed

## Verification
- ✅ OverlayScene runs in parallel with MagnetsScene
- ✅ Force vectors appear when toggle is activated
- ✅ Vectors are color-coded (green=attract, red=repel)
- ✅ Vectors update in real-time as magnets move
- ✅ "Spectacles" toggle button added with Glasses icon

## Files Modified
- `frontend/components/game/scenes/OverlayScene.ts` - Created new parallel scene for force visualization
- `frontend/components/game/scenes/MagnetsScene.ts` - Added `getMagnetData()` method and event emission
- `frontend/components/game/PhaserGame.tsx` - Added OverlayScene import and registration
- `frontend/components/lab/LabLayout.tsx` - Enhanced Forces button with Glasses icon
