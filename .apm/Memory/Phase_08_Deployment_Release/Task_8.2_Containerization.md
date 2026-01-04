# Task 8.2: Containerization Strategy

## Goal
Containerize the NestJS backend and Next.js frontend applications, and orchestrate them alongside MongoDB using Docker Compose for a consistent development and deployment environment.

## Requirements

### 1. Backend Containerization
*   **Context**: `backend/`
*   **Technology**: Node.js (Alpine variant recommended for size).
*   **Strategy**: Multi-stage build.
    *   `development`: For local dev (optional, if using dev containers).
    *   `builder`: Installs dependencies and builds the NestJS app (`npm run build`).
    *   `production`: Minimal image, copies `dist` and `node_modules` (or installs only prod dependencies).
*   **Exposed Port**: 3001.
*   **Environment Variables**: `MONGO_URI`, `PORT`, `OPENAI_API_KEY`.

### 2. Frontend Containerization
*   **Context**: `frontend/`
*   **Technology**: Node.js (Alpine variant).
*   **Strategy**: Multi-stage build with Next.js Standalone Output.
    *   **Prerequisite**: Update `next.config.ts` to include `output: "standalone"`.
    *   `deps`: Install dependencies.
    *   `builder`: Build the Next.js app.
    *   `runner`: Minimal production image, copies `.next/standalone` and `public/static` assets.
*   **Exposed Port**: 3000.
*   **Environment Variables**: `MONGO_URI`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `BACKEND_URL`.

### 3. Orchestration (Docker Compose)
*   **File**: `compose.yaml` (Update existing).
*   **Services**:
    *   `mongodb`: (Existing) Mongo:7.
    *   `mongo-express`: (Existing) Admin UI.
    *   `backend`: Builds from `./backend`. Depends on `mongodb`.
    *   `frontend`: Builds from `./frontend`. Depends on `backend` and `mongodb`.
*   **Networking**:
    *   Shared network `vibestudy-network`.
    *   Service-to-service communication via hostname (e.g., `mongodb`, `backend`).
*   **Volumes**:
    *   Persist MongoDB data (existing).

## Implementation Steps

1.  **Prepare Frontend Config**:
    *   Edit `frontend/next.config.ts` to add `output: "standalone"`.

2.  **Create Backend Dockerfile**:
    *   Create `backend/Dockerfile` implementing the multi-stage build pattern.

3.  **Create Frontend Dockerfile**:
    *   Create `frontend/Dockerfile` implementing the multi-stage build pattern optimized for Next.js standalone mode.

4.  **Update Orchestration**:
    *   Modify `compose.yaml` to include the new services.
    *   Define necessary environment variables and port mappings.
    *   Ensure `depends_on` order is correct (DB -> Backend -> Frontend).

5.  **Verification**:
    *   Run `docker compose up --build`.
    *   Verify Frontend acts accessible at `http://localhost:3000`.
    *   Verify Backend acts accessible at `http://localhost:3001`.
    *   Confirm database connectivity from both services.