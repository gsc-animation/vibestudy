# Task 6.5 - Accessibility (a11y) Audit

## Goal
Ensure VibeStudy is accessible to diverse learners, complying with WCAG 2.1 Level AA standards.

## Objectives
1.  **Semantic HTML**:
    -   Verify that all buttons and inputs have accessible labels (especially icon-only buttons like the "Spectacles" toggle).
    -   Ensure proper heading hierarchy in `LabLayout` and modals.

2.  **Keyboard Navigation**:
    -   Ensure the `SentenceBuilder` component is fully navigable via Tab/Enter/Space.
    -   Add keyboard listeners to `MagnetsScene` (Arrow keys to move selected magnet) as an alternative to drag-and-drop.

3.  **Visual Accessibility**:
    -   Check color contrast ratios (especially the overlay vectors against the background).
    -   Ensure the application supports browser zoom up to 200% without breaking the layout.

## Acceptance Criteria
- [ ] No critical violations found in Axe DevTools scan.
- [ ] Full keyboard support for the educational loop (Predict -> Reflect).
- [ ] Alternative input method for the physics simulation.