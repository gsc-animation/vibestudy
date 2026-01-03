# Task 3.3: Magnet Simulation Physics & Interaction

## Status
- [x] Create `MagnetsScene.ts` with basic visualization
- [x] Implement dragging logic
- [x] Implement physics interaction (attract/repel)
- [x] Integrate with `PhaserGame.tsx`

## Details
- Created `MagnetsScene.ts` which initializes two magnets.
- Each magnet is a `Phaser.GameObjects.Container` consisting of a North (Red) and South (Blue) pole.
- Implemented Arcade Physics for the magnets.
- Added drag events:
    - `dragstart`: Stops velocity to allow smooth dragging.
    - `drag`: Updates position.
    - `dragend`: Release magnet.
- Implemented `applyMagneticForces` in `update()` loop:
    - Calculates forces between all 4 poles (N1-N2, S1-S2 repel; N1-S2, S1-N2 attract).
    - Uses inverse square law approximation for force magnitude.
    - Applies acceleration to physics bodies.
- Updated `PhaserGame.tsx` to include `MagnetsScene` and configured arcade physics.

## Next Steps
- Verify simulation behavior in the browser.
- Adjust force constants if necessary for better feel.