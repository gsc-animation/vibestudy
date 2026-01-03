# Task 6.4 - Performance Optimization

## Goal
Ensure the application runs smoothly on a wide range of devices, targeting 60 FPS for simulations and fast initial page loads.

## Objectives
1.  **Phaser Optimization**:
    -   Profile `MagnetsScene` during heavy interaction (rapid dragging, collisions).
    -   Optimize physics step if necessary.
    -   Ensure texture memory is managed (textures destroyed when scene changes).

2.  **React Optimization**:
    -   Audit `LabNotebook` and `LabLayout` for unnecessary re-renders.
    -   Use `React.memo` and `useCallback` where appropriate.
    -   Verify that the Phaser game instance is not being re-created unnecessarily.

3.  **Bundle Optimization**:
    -   Confirm that `phaser` is being lazily loaded (via dynamic import) to avoid blocking the initial chunk.
    -   Analyze bundle size using `next/bundle-analyzer` (optional).

## Acceptance Criteria
- [ ] Lighthouse Performance score > 90 on Desktop.
- [ ] Consistent 60 FPS in `MagnetsScene` on average hardware.
- [ ] No simulation stuttering during modal open/close animations.