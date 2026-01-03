# VibeStudy – APM Implementation Plan
**Memory Strategy:** Dynamic-MD
**Last Modification:** Plan creation by the Setup Agent.
**Project Overview:** VibeStudy is an integrated homeschooling platform for Grade 3 ESL students, featuring a Kid-Agile Dashboard, Virtual Labs (VRA), and AI-driven support. MVP includes User Mgmt, Kanban Board, and one VRA Lab (Magnets), built with Next.js (TS) and NestJS (Node).

## Phase 1: Foundation & Scaffold
**Objective:** Initialize the Monorepo structure (Next.js + NestJS), configure strict TypeScript/Linters, and establish the Database connection.

### Task 1.1 – Workspace & Repository Initialization - Agent_Architect
- **Objective:** Establish the root project structure, git initialization, and .gitignore.
- **Output:** Clean git repo with frontend/backend folders and README.
- **Guidance:** Ensure clear separation for the "Separate Terminal" workflow.
- **Steps:**
  - Initialize git repository and create standard Node.js `.gitignore` (ignoring node_modules, .env, etc.).
  - Create root directories: `frontend/` and `backend/`.
  - Create `README.md` explicitly documenting the required workflow: "Run frontend and backend in separate terminals".

### Task 1.2 – Backend Service Initialization (NestJS) - Agent_Architect
- **Objective:** Initialize NestJS application and configure MongoDB connection.
- **Output:** Running NestJS app connected to MongoDB.
- **Guidance:** Use Zod for validation.
- **Steps:**
  1. Scaffold NestJS project in `backend/` using `npx @nestjs/cli new`.
  2. Install core dependencies: `npm install --save @nestjs/mongoose mongoose zod nestjs-zod @nestjs/config`.
  3. Create `.env` file with `MONGO_URI` placeholder.
  4. Configure `ConfigModule.forRoot({ isGlobal: true })` in `AppModule`.
  5. Configure `AppModule` to connect to MongoDB using `MongooseModule.forRootAsync` (injecting ConfigService).
- **Guidance:**
  - **Depends on: Task 1.1 Output**

### Task 1.3 – Frontend Application Initialization (Next.js) - Agent_Architect
- **Objective:** Initialize Next.js app with TypeScript and Tailwind.
- **Output:** Clean Next.js app ready for development.
- **Guidance:** Use Next.js App Router.
- **Steps:**
  1. Scaffold Next.js App (App Router, TS, Tailwind, ESLint) in `frontend/`.
  2. Clean up default boilerplate: Delete all CSS in `globals.css` except Tailwind directives; Empty `page.tsx`.
  3. Install `next-auth` and `axios` (for API calls).
- **Guidance:**
  - **Depends on: Task 1.1 Output**

### Task 1.4 – Global Type Safety & Linter Standardization - Agent_Architect
- **Objective:** Ensure strict TypeScript and consistent linting across stack.
- **Output:** Updated tsconfig and eslint files.
- **Guidance:** Strict mode is mandatory.
- **Steps:**
  - Update `backend/tsconfig.json` and `frontend/tsconfig.json` to ensure `strict: true`.
  - Verify `prettier` configuration is consistent across both projects.
  - Verify `.gitignore` correctly handles nested `node_modules` in both roots.
- **Guidance:**
  - **Depends on: Task 1.2 Output**
  - **Depends on: Task 1.3 Output**

## Phase 2: User Identity & Core Dashboard
**Objective:** Implement Authentication, User Profiles, and the visual Kanban Board (Agile for Kids).

### Task 2.1 – Domain Modeling & Database Schemas - Agent_Backend
- **Objective:** Define Mongoose schemas and Zod DTOs for Users and Quests.
- **Output:** Schema files and exported models in NestJS.
- **Guidance:** Ensure schemas support the "Kid-Agile" fields (e.g., Quest status: 'Backlog' | 'Todo' | 'Doing' | 'Done').
- **Steps:**
  1. Define `User` schema (Fields: email, password_hash, role: 'parent'|'student', name).
  2. Define `Quest` schema (Fields: title, description, status, difficulty, subject_tag, sprint_week: number).
  3. Create Zod DTOs for both schemas to ensure Type Safety.
  4. Export Mongoose models in `backend/src/database` module.
- **Guidance:**
  - **Depends on: Task 1.2 Output**

### Task 2.2 – Authentication System (NextAuth) - Agent_Architect
- **Objective:** Implement NextAuth with Credentials Provider and MongoDB Adapter.
- **Output:** Working Login/Logout flow and protected routes.
- **Guidance:** Use Credentials Provider for MVP simplicity (no external API keys needed).
- **Steps:**
  1. Configure `MongoDBAdapter` in `frontend/lib/auth.ts` connecting to the same DB as NestJS.
  2. Set up NextAuth `CredentialsProvider` for simple username/password login.
  3. Implement `middleware.ts` to protect `/dashboard` routes from unauthenticated access.
  4. Create a custom, kid-friendly "Sign In" page at `/login`.
  5. Ad-Hoc Delegation – Test login flow manually to verify session persistence.
- **Guidance:**
  - **Depends on: Task 1.3 Output**

### Task 2.3 – Backend CRUD API for Quests - Agent_Backend
- **Objective:** Create NestJS endpoints to manage Quests.
- **Output:** Swagger/API endpoints for Quest CRUD.
- **Guidance:** Use standard NestJS patterns (Controller-Service-Repository). **Enable CORS**.
- **Steps:**
  1. Enable CORS in `main.ts` to allow requests from the Frontend URL (localhost:3000).
  2. Generate `QuestsModule` (Controller, Service).
  3. Implement `GET /quests` (findAll with filters) and `POST /quests` (create) endpoints.
  4. Implement `PATCH /quests/:id/status` endpoint for moving cards between columns.
  5. Apply Zod Validation Pipes to all request bodies.
- **Guidance:**
  - **Depends on: Task 2.1 Output**

### Task 2.4 – Dashboard UI & Layout - Agent_Frontend
- **Objective:** Build the visual shell of the Dashboard and basic components.
- **Output:** React components for Layout, Column, and Card.
- **Guidance:** Use Tailwind for styling.
- **Steps:**
  - Create `DashboardLayout` component (Sidebar/Navbar with User Avatar).
  - Create `KanbanColumn` component (Header, Drop Area placeholder).
  - Implement `QuestCard` component (Title, Icon, Difficulty Badge).
- **Guidance:**
  - **Depends on: Task 2.2 Output by Agent_Architect**

### Task 2.5 – Interactive Kanban Board Implementation - Agent_Frontend
- **Objective:** Implement Drag & Drop logic and API integration.
- **Output:** Fully functional Kanban board.
- **Guidance:** Use @dnd-kit for drag and drop. Enforce WIP Limit = 1 for "Doing".
- **Steps:**
  1. Install and configure `@dnd-kit/core` and sortable presets.
  2. Implement `DragContext` wrapping the columns.
  3. Wire up `onDragEnd` handler to call the `PATCH /quests/:id/status` API (Task 2.3).
  4. Implement Optimistic UI updates (update state immediately, revert if API fails).
  5. Enforce "WIP Limit = 1" rule: Prevent dropping into "In Action" if it's not empty.
- **Guidance:**
  - **Depends on: Task 2.4 Output**
  - **Depends on: Task 2.3 Output by Agent_Backend**

## Phase 3: The Scientist's Workbench (VRA)
**Objective:** Integrate Phaser.js, build the Virtual Lab layout, and implement the "Magnets" simulation logic.

### Task 3.1 – Phaser Game Engine Integration - Agent_Simulation
- **Objective:** Initialize Phaser 3 within the Next.js React context safely.
- **Output:** `PhaserGame` component that renders a canvas.
- **Guidance:** Handle React StrictMode double-mounts correctly to avoid duplicate canvases.
- **Steps:**
  - Install `phaser` package.
  - Create `components/game/PhaserGame.tsx` wrapper component.
  - Implement `useEffect` to initialize `new Phaser.Game()`: Use a `useRef` to track if game is already created to prevent double-instantiation in StrictMode.
  - Implement `game.destroy(true)` on unmount.
  - Create a basic `BootScene` to verify rendering (e.g., just a background color).

### Task 3.2 – Scientist's Workbench Layout (VRA UI) - Agent_Frontend
- **Objective:** Create the specific split-screen layout for Virtual Labs.
- **Output:** Responsive Page Layout for `/lab/:id`.
- **Guidance:** Ensure the Phaser canvas container takes up available space but preserves aspect ratio.
- **Steps:**
  - Create `LabLayout` component (distinct from Dashboard).
  - Implement "Toolbar" area (Reset, Tools) and "Notebook" side-panel.
  - Integrate `PhaserGame` component (Task 3.1) into the main view area.
- **Guidance:**
  - **Depends on: Task 3.1 Output by Agent_Simulation**

### Task 3.3 – Magnet Simulation Physics & Interaction - Agent_Simulation
- **Objective:** Implement the core interactive physics for the Magnets Lab.
- **Output:** Playable simulation with drag-and-drop magnets and forces.
- **Guidance:** Use Manual Velocity Calculations (Arcade Physics is too rigid for custom magnetic forces).
- **Steps:**
  1. Create `MagnetsScene.ts` class.
  2. Use `this.add.graphics()` to draw two Bar Magnets (Red/North, Blue/South).
  3. Enable Dragging interaction on the magnet sprites.
  4. Implement `update()` loop: Calculate distance between the poles of the two magnets.
  5. Apply Forces: Manually set `sprite.body.velocity` based on distance/angle (Attract vs Repel logic) rather than using built-in physics engines.
- **Guidance:**
  - **Depends on: Task 3.1 Output**

## Phase 4: Educational Logic & Integration
**Objective:** Implement the "Prediction Engine", connect the VRA lab to the Backend, and finalize the MVP loop.

### Task 4.1 – Prediction Engine & Data Logging API - Agent_Backend
- **Objective:** Create endpoints to store experiment predictions and results.
- **Output:** `ExperimentsModule` in NestJS.
- **Guidance:** Link logs to User and Quest IDs.
- **Steps:**
  1. Define `ExperimentLog` schema (Fields: user_id, quest_id, prediction_text, result_data, reflection_text, timestamp).
  2. Create `ExperimentsModule` (Controller, Service).
  3. Implement `POST /experiments/predict` (starts a session) and `POST /experiments/result` (completes it).
- **Guidance:**
  - **Depends on: Task 2.1 Output**

### Task 4.2 – AI Service Integration (LLM Gateway) - Agent_Backend
- **Objective:** Create a generic service to communicate with OpenAI or Gemini.
- **Output:** `AiService` with text generation capabilities.
- **Guidance:** Abstract the provider so we can switch easily.
- **Steps:**
  - Install `openai` or `@google/generative-ai`.
  - Create `AiService` with a `generateText(prompt)` method.
  - Ad-Hoc Delegation – User to provide API Key in `.env`.
- **Guidance:**
  - **Depends on: Task 1.2 Output**

### Task 4.3 – Educational Loop Integration - Agent_Frontend
- **Objective:** Connect the Prediction UI, Game Events, and Backend Storage.
- **Output:** Complete "Predict -> Play -> Reflect" workflow.
- **Guidance:** Use a React State Setter passed into the Phaser Game config to bridge events.
- **Steps:**
  1. Implement `PredictionModal` component (blocks access to Lab).
  2. Wire `PredictionModal` submit to `POST /experiments/predict` (Task 4.1).
  3. Pass a `onGameComplete` callback prop into `PhaserGame` component.
  4. In `MagnetsScene` (Task 3.3), call this callback when the experiment succeeds (e.g., magnets snap together).
  5. Trigger `ReflectionModal` on callback to capture student thoughts.
  6. Save final data to `POST /experiments/result`.
- **Guidance:**
  - **Depends on: Task 4.1 Output by Agent_Backend**
  - **Depends on: Task 3.3 Output by Agent_Simulation**
  - **Depends on: Task 3.2 Output**

### Task 4.4 – MVP Quality Assurance & Launch Prep - Agent_Architect
- **Objective:** Final build verification and documentation.
- **Output:** Production-ready build artifacts and run instructions.
- **Guidance:** Verify the "Separate Terminals" workflow works as documented.
- **Steps:**
  1. Run `npm run build` in `frontend/` and `backend/` to catch strict TS errors.
  2. Update `README.md` with explicit "How to Run MVP" instructions.
  3. Create `MVP_DEMO_SCRIPT.md` outlining the happy path for the User to test.
- **Guidance:**
  - **Depends on: Task 4.3 Output by Agent_Frontend**
