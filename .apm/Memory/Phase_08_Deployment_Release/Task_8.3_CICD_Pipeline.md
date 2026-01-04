# Task 8.3: CI/CD Pipeline Setup

## Goal
Establish a robust Continuous Integration (CI) pipeline using GitHub Actions to automate testing, linting, and building of the VibeStudy application (Frontend and Backend) to ensure code quality and prevent regressions.

## Requirements

### 1. Platform
*   **Provider:** GitHub Actions.
*   **Configuration:** `.github/workflows/ci.yml`.

### 2. Workflow Scope
*   **Triggers:**
    *   `push` to `main`.
    *   `pull_request` to `main`.

### 3. Pipeline Steps (Jobs)
The pipeline should run the following steps. To ensure fast feedback, we can parallelize where possible, but for simplicity in the initial setup, we will organize them logically by function.

#### Global Setup
*   **Checkout Code:** Use `actions/checkout@v4`.
*   **Setup Node.js:** Use `actions/setup-node@v4` with Node.js v20 (LTS).
*   **Cache Dependencies:** Leverage `npm` caching to speed up builds.

#### Job 1: Quality Checks (Lint & Type)
*   **Install Dependencies:** `npm ci` (clean install).
*   **Linting:**
    *   Frontend: `cd frontend && npm run lint`
    *   Backend: `cd backend && npm run lint`
*   **Type Checking:**
    *   Frontend: `cd frontend && tsc --noEmit` (ensure script exists or run direct command)
    *   Backend: `cd backend && tsc --noEmit`

#### Job 2: Testing
*   **Install Dependencies:** `npm ci`.
*   **Unit/Integration Tests:**
    *   Frontend: `cd frontend && npm run test`
    *   Backend: `cd backend && npm run test`

#### Job 3: Build Verification
*   **Install Dependencies:** `npm ci`.
*   **Build:**
    *   Frontend: `cd frontend && npm run build`
    *   Backend: `cd backend && npm run build`

## Implementation Steps

1.  **Create Workflow File:**
    *   Create `.github/workflows/ci.yml`.

2.  **Define YAML Structure:**
    ```yaml
    name: VibeStudy CI

    on:
      push:
        branches: [ "main" ]
      pull_request:
        branches: [ "main" ]

    jobs:
      quality:
        name: Lint & Type Check
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: '20'
              cache: 'npm'
              cache-dependency-path: '**/package-lock.json'
          
          # Install Backend
          - name: Install Backend Dependencies
            run: npm ci
            working-directory: ./backend
          
          # Install Frontend
          - name: Install Frontend Dependencies
            run: npm ci
            working-directory: ./frontend

          # Linting
          - name: Backend Lint
            run: npm run lint
            working-directory: ./backend
          - name: Frontend Lint
            run: npm run lint
            working-directory: ./frontend
            
          # Type Checking (assuming tsc is available via npx if not in scripts)
          - name: Backend Type Check
            run: npx tsc --noEmit
            working-directory: ./backend
          - name: Frontend Type Check
            run: npx tsc --noEmit
            working-directory: ./frontend

      test:
        name: Unit Tests
        runs-on: ubuntu-latest
        needs: quality
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: '20'
              cache: 'npm'
              cache-dependency-path: '**/package-lock.json'
          
          - name: Install Backend Dependencies
            run: npm ci
            working-directory: ./backend
          
          - name: Install Frontend Dependencies
            run: npm ci
            working-directory: ./frontend

          - name: Backend Tests
            run: npm run test
            working-directory: ./backend
          
          - name: Frontend Tests
            run: npm run test
            working-directory: ./frontend

      build:
        name: Build Verification
        runs-on: ubuntu-latest
        needs: test
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: '20'
              cache: 'npm'
              cache-dependency-path: '**/package-lock.json'
          
          - name: Install Backend Dependencies
            run: npm ci
            working-directory: ./backend
          
          - name: Install Frontend Dependencies
            run: npm ci
            working-directory: ./frontend

          - name: Backend Build
            run: npm run build
            working-directory: ./backend
          
          - name: Frontend Build
            run: npm run build
            working-directory: ./frontend
    ```

3.  **Commit & Push:**
    *   Push the workflow file to the repository to trigger the first run.

4.  **Verify:**
    *   Check GitHub Actions tab to ensure the pipeline passes.