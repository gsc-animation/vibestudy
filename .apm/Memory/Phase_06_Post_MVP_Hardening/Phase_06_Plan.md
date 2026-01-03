# Phase 6: Post-MVP Hardening & Polish

## Overview
Phase 6 shifts focus from feature development to stability, quality assurance, and code maturity. The goal is to ensure the VibeStudy platform is robust, performant, and maintainable.

## Objectives
- Eliminate technical debt (linting errors, unused code).
- Establish a reliable testing strategy (Unit & E2E).
- Optimize performance for the Phaser simulation and React rendering.
- Ensure accessibility for diverse learners.
- Finalize documentation.

## Task List

### Task 6.1: Codebase Hygiene
**Status:** Pending
**Goal:** Fix all linting warnings/errors and standardize formatting.
- Fix 8 frontend ESLint errors (unescaped JSX).
- Fix 6 backend ESLint errors (unused vars, unsafe assignments).
- Address usage of `any` types where possible.

### Task 6.2: Unit Testing Framework
**Status:** Pending
**Goal:** Establish Jest testing for backend services and core frontend logic.
- Set up Jest for NestJS (Backend).
- Write tests for `ExperimentsService` and `AiService`.
- Set up Jest/Testing Library for Next.js (Frontend).
- Write tests for `SentenceBuilder` logic.

### Task 6.3: End-to-End (E2E) Testing
**Status:** Pending
**Goal:** Automate the "Happy Path" verification.
- Set up Cypress or Playwright.
- Automate the `Predict -> Experiment -> Reflect` loop test.

### Task 6.4: Performance Optimization
**Status:** Pending
**Goal:** Ensure 60 FPS in simulations and fast page loads.
- Profile `MagnetsScene` physics calculations.
- Optimize React re-renders in `LabNotebook`.
- Verify dynamic imports for heavy components.

### Task 6.5: Accessibility (a11y) Audit
**Status:** Pending
**Goal:** Ensure WCAG 2.1 compliance, especially for CLIL tools.
- Add ARIA labels to drag-and-drop interfaces.
- Ensure keyboard navigability for the `SentenceBuilder`.

### Task 6.6: APM Documentation Cleanup
**Status:** In Progress
**Goal:** Update APM structure to reflect the finished MVP state.
- Archive old plans.
- Create Phase 6 structure.