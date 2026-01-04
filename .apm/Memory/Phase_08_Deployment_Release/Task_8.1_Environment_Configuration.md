# Task 8.1: Environment Configuration & Security Audit

**Objective:** Ensure the application is securely configured for production by auditing environment variables and removing any hardcoded secrets.

## Context
As we move to deployment, we must transition from convenient development settings to secure production settings. This involves strictly separating configuration from code and ensuring secrets are managed via environment variables only.

## Action Items

### 1. Audit Frontend Environment
*   [x] Review `frontend/.env` (and `.env.local` if exists) to identify all required variables.
*   [x] Check `frontend/next.config.js` or `next.config.mjs` for any exposed public runtime config that shouldn't be public.
*   [x] Create `frontend/.env.production.example`:
    *   Include keys like `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
    *   **DO NOT** include actual values for secrets.
    *   Ensure all `NEXT_PUBLIC_` variables are actually safe to be exposed to the browser.

### 2. Audit Backend Environment
*   [x] Review `backend/.env` to identify all required variables.
*   [x] Check `backend/src/app.module.ts` (ConfigModule) to see which variables are required.
*   [x] Create `backend/.env.production.example`:
    *   Include keys like `DATABASE_URI`, `JWT_SECRET`, `CLERK_SECRET_KEY`, `OPENAI_API_KEY`, `PORT`, `CORS_ORIGIN`.
    *   **DO NOT** include actual values.
    *   Add comments explaining the format/requirements for each variable.

### 3. Codebase Security Scan
*   [x] Search for hardcoded API keys or secrets in the codebase using regex or tools like `trufflehog` or simple `grep`.
    *   Keywords: `key`, `secret`, `password`, `token`, `sk-`, `mongodb+srv`.
*   [x] Remove any found secrets and replace them with `ConfigService` calls (NestJS) or `process.env` (Next.js).

### 4. Secret Rotation (If needed)
*   [x] If any production-grade secrets were committed to git history, they must be rotated immediately.
*   [x] Add `.env` patterns to `.gitignore` if not already strictly enforced (check global `.gitignore` and package specific ones).

## Deliverables
*   `frontend/.env.production.example`
*   `backend/.env.production.example`
*   Clean codebase with no hardcoded secrets.