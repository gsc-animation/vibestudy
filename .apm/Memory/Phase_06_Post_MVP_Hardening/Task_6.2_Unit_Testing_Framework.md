# Task 6.2 - Unit Testing Framework

## Goal
Establish a reliable unit testing strategy for both backend services and core frontend logic.

## Objectives

1.  **Backend (NestJS) Testing**:
    -   Configure Jest in `backend/package.json` (if not already fully set up).
    -   Create unit tests for `ExperimentsService` (mocking the Mongoose model).
    -   Create unit tests for `AiService` (mocking the OpenAI client).
    -   Ensure standard `npm run test` command works.

2.  **Frontend (Next.js) Testing**:
    -   Install `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.
    -   Configure `jest.config.js` and `jest.setup.js`.
    -   Create unit tests for `SentenceBuilder` logic (ensuring it parses templates correctly).
    -   Create unit tests for utility functions (e.g., `lib/cloze-exercises.ts`).

## Acceptance Criteria
- [ ] Backend tests pass with >80% coverage for targeted services.
- [ ] Frontend tests pass for core logic components.
- [ ] CI pipeline (if present) or local script runs both test suites.