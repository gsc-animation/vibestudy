# Task 6.1 - Codebase Hygiene

## Goal
Fix all linting warnings/errors and standardize formatting to ensure a maintainable codebase.

## Current State
- **Frontend:** ~10 linting issues (primarily unescaped JSX characters in `LabNotebook.tsx`).
- **Backend:** ~7 linting issues (unused imports, unsafe assignments).

## Objectives
1.  **Fix Frontend ESLint Errors**:
    -   Resolve unescaped quotes/apostrophes in `components/lab/LabNotebook.tsx`.
    -   Remove unused variables (e.g., `router` in `app/lab/[id]/page.tsx`).
    -   Fix `react-hooks/exhaustive-deps` warning in `PhaserGame.tsx`.

2.  **Fix Backend ESLint Errors**:
    -   Clean up unused imports in `experiments.controller.ts`.
    -   Fix "Async factory has no await" in `app.module.ts`.
    -   Address unsafe destructuring in `experiments.service.ts`.
    -   Handle floating promise in `main.ts`.

3.  **Standardization**:
    -   Run `npm run format` (Prettier) across the entire codebase.

## Acceptance Criteria
- [ ] `npm run lint` passes with 0 errors and 0 warnings on Frontend.
- [ ] `npm run lint` passes with 0 errors and 0 warnings on Backend.