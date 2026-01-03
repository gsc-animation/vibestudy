# Phase 3: Scientists Workbench (VRA) - Remaining Implementation Plan

## Overview
Phase 3 focuses on the **VRA (Virtual-Representational-Abstract)** framework.
- **Virtual (Done):** The Phaser physics simulation (`MagnetsScene`).
- **Representational (Pending):** Visualizing invisible forces (Vectors/Overlay).
- **Abstract (Pending):** Language scaffolding (CLIL Sentence Frames).

## Remaining Tasks

### Task 3.4: Representational Layer (Force Visualization)
**Objective:** Allow students to "see" the magnetic forces through an overlay, bridging the gap between the virtual interaction and abstract concepts.

1.  **Update `LabLayout.tsx`**:
    -   Add a toggle switch or button in the toolbar for "Show Forces" / "Magnetic Field".
    -   Manage this state (`showOverlay`) in the parent `LabPage`.

2.  **Update `PhaserGame.tsx`**:
    -   Accept `showOverlay` as a prop.
    -   Pass this state to the Phaser Scene (via `registry` or `events`).

3.  **Update `MagnetsScene.ts`**:
    -   Create a `Graphics` object for drawing vectors.
    -   Implement `drawForceVectors()`:
        -   Calculate the center point of interaction between poles.
        -   Draw arrows indicating direction and magnitude (scaled down) of the force.
        -   Color code: Red for Repel (pushing away), Green/Blue for Attract (pulling together).
    -   In `update()`, clear and redraw these graphics if the overlay is active.

### Task 3.5: Abstract Layer (CLIL Sentence Frames)
**Objective:** Support ESL students in expressing scientific thoughts using academic language (Tier 2/3 vocabulary).

1.  **Create `SentenceBuilder.tsx`**:
    -   A reusable component that constructs sentences from dropdowns/chips.
    -   Structure: `I predict that [Magnet 1] will [Action] [Magnet 2] because [Reason].`
    -   Options:
        -   Action: *attract*, *repel*, *do nothing*.
        -   Reason: *they have same poles*, *they have opposite poles*.

2.  **Refactor `PredictionModal.tsx`**:
    -   Replace the raw `textarea` with `SentenceBuilder`.
    -   On submit, concatenate the parts into a full string for the existing backend API.

3.  **Refactor `ReflectionModal.tsx`**:
    -   Implement a similar builder: `I observed that the magnets [Action] because...`
    -   Add a "Vocabulary Bank" sidebar in the modal if needed.

### Task 3.6: Verification & Polish
**Objective:** Ensure the full loop (Predict -> Experiment -> Reflect) feels cohesive.

1.  **Backend Verification**:
    -   Ensure `experiments.controller.ts` receives the constructed sentences correctly.
    -   Check database persistence.
2.  **UI Polish**:
    -   Ensure the Phaser canvas resizes correctly within the flex layout when the Notebook is toggled.
    -   Add simple sound effects (using Phaser Audio) for the "Click" when magnets connect (Virtual reinforcement).

## Execution Order
1.  **Task 3.4** (Visuals first, as it modifies the core game loop).
2.  **Task 3.5** (UI overlay work, independent of Phaser).
3.  **Task 3.6** (Integration).