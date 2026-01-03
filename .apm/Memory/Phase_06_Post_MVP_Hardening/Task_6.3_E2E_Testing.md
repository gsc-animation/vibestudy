# Task 6.3 - End-to-End (E2E) Testing

## Goal
Automate the verification of critical user journeys to ensure the "Happy Path" remains unbroken during future updates.

## Objectives
1.  **Setup Testing Framework**:
    -   Install Playwright (preferred for Next.js) or Cypress.
    -   Configure base URL and environment variables for testing.

2.  **Define Critical Paths**:
    -   **Path A (The Educational Loop):**
        1.  User enters Lab.
        2.  User opens Prediction Modal.
        3.  User constructs sentence: "I predict...".
        4.  User submits (Simulation unlocks).
        5.  User interacts with magnets (Drag/Drop).
        6.  User clicks "Complete Experiment".
        7.  User reflects in Notebook.
        8.  User receives completion badge.

3.  **Implementation**:
    -   Write `lab-flow.spec.ts`.
    -   Ensure Phaser canvas interactions can be simulated (click/drag coordinates).

## Acceptance Criteria
- [ ] E2E test suite runs successfully in CI/local environment.
- [ ] The full Predict -> Experiment -> Reflect loop is covered.