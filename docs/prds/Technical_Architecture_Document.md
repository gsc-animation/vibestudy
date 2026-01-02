# Technical Architecture Document: VibeStudy Platform

## 1. System Overview
The VibeStudy platform utilizes a **Jamstack** architecture (JavaScript, APIs, Markup) to deliver a high-performance, secure, and scalable educational application. It decouples the frontend learning interface from the content management system, using **Git-based JSON** as the single source of truth.

### Key Technology Stack
*   **Frontend:** ReactJS (SPA)
*   **Content Management:** Decap CMS (formerly Netlify CMS)
*   **Database:** Local JSON Files (Content), LocalStorage (User Progress)
*   **Identity & User Mgmt:** Netlify Identity (RBAC: Admin, Parent, Student)
*   **Hosting/CI/CD:** Netlify
*   **AI Integration:** Multi-Provider Support (Configurable)
    *   **OpenAI Compatible API** (e.g., GPT-4, Local LLMs)
    *   **Google Generative AI** (Gemini Pro)
*   **Text-to-Speech:** Web Speech API / `react-speech-kit`

## 2. Architecture Diagram
```mermaid
graph TD
    User[Student] -->|Interacts| ReactApp[ReactJS Application]
    Parent[Parent] -->|Manages| CMS[Decap CMS / Admin Panel]
    SysAdmin[System Admin] -->|Configures| AuthConfig[Netlify Identity & Env Vars]
    
    subgraph "Data Layer (Git Repository)"
        JSON_Vocab[Vocabulary JSON]
        JSON_Units[Curriculum Units JSON]
        JSON_Users[User Association JSON]
    end

    subgraph "Local Client"
        ReactApp -->|Reads/Writes| LocalStore[LocalStorage (Scores/Progress)]
        ReactApp -->|Fetches| JSON_Vocab
    end

    CMS -->|Commits| JSON_Units
    CMS -->|Commits| JSON_Users
    
    subgraph "AI Services (Serverless Functions)"
        Parent -->|Request Summary| AIService[AI Service Adapter]
        AIService -->|Queries| OpenAI[OpenAI API]
        AIService -->|Queries| GoogleAI[Google Gemini API]
        AIService -->|Returns| Summary[Daily Report & Suggestions]
    end
    
    JSON_Drafts -->|Import| CMS
```

## 3. Data-Driven Design & JSON Schema
The application logic is generic "Engines" that render content based on strict JSON Schemas.

### 3.1. Vocabulary Entity
```json
{
  "id": "voc_science_photosynthesis_01",
  "term": "Photosynthesis",
  "definition_en": "Process by which plants make food.",
  "definition_vi": "Quá trình quang hợp.",
  "audio_src": "/assets/audio/photosynthesis.mp3",
  "image_src": "/assets/images/photo_diag.png",
  "tier": 3,
  "tags": ["biology", "plants"]
}
```

### 3.2. Curriculum Unit Entity
```json
{
  "id": "unit_y3_sci_forces",
  "title": "Forces and Magnets",
  "week": "Term 1, Week 5",
  "modules": [
    { "type": "vocab_list", "refs": ["voc_force_push", "voc_force_pull"] },
    { "type": "virtual_lab", "config_id": "lab_magnets_01" },
    { "type": "quiz", "config_id": "quiz_magnets_basic" }
  ]
}
```

### 3.3. Game Configuration (Generic Engine)
```json
{
  "id": "game_match_magnets",
  "engine": "matching_pairs",
  "data": [
    { "left": "North-North", "right": "Repel" },
    { "left": "North-South", "right": "Attract" }
  ]
}
```

### 3.4. User & Role Association Schema
Stored in a secure/restricted path (e.g., `/_config/users.json`) or managed via Identity Metadata.
```json
{
  "users": [
    {
      "id": "usr_parent_01",
      "email": "parent@example.com",
      "role": "parent",
      "associated_students": ["stu_01_tommy"]
    },
    {
      "id": "stu_01_tommy",
      "display_name": "Tommy",
      "role": "student",
      "grade": 3
    }
  ]
}
```

## 4. Frontend Implementation Details

### 4.1. Component Structure
*   **`src/components/Admin/`**: 
    *   `UserManagement.jsx`: Admin view to create parents/students.
    *   `PerformanceReport.jsx`: Detailed charts (Recharts/Chart.js) for test analysis.
*   **`src/components/GameEngines/`**: Contains generic logic for different activity types.
*   **`src/components/Dashboard/`**:
    *   `KanbanBoard.jsx`: Manages the drag-and-drop state of tasks.
    *   `DailySummary.jsx`: Fetches and displays the AI-generated insight.

### 4.2. State Management
*   **Content State:** Static, fetched from JSON files.
*   **User State (Progress):** Persisted in `LocalStorage`.
*   **Analytics State:** Detailed test logs (timestamp, question_id, chosen_answer, correct_answer) are stored in `LocalStorage` and optionally synced to a secure endpoint for the Parent Dashboard.

## 5. AI Content & Summary Pipeline
To support configurable AI providers:

### 5.1. The AI Adapter Pattern
A Serverless Function (Netlify Function) acts as the gateway.
*   **Config:** Environment variables set the active provider (`AI_PROVIDER=OPENAI` or `AI_PROVIDER=GOOGLE`).
*   **Input:** JSON of student's daily logs (Tasks completed, Quiz scores).
*   **System Prompt:** "You are an educational assistant. Analyze the student's logs. Identify weak points. Suggest 1 specific review task."
*   **Output:** JSON `{ "summary": "...", "suggestion": "...", "sentiment": "positive" }`.

### 5.2. Content Generation
*   **Input:** Parent pastes text.
*   **Processing:** AI extracts and formats to JSON Schema.
*   **Output:** Ready-to-use content block.

### 5.3. Speaking Prompt Generation Service
*   **Input:** List of selected Unit IDs.
*   **Process:**
    1.  Fetch Unit details (Vocab list, Q&A patterns, Learning Objects) from `JSON_Units`.
    2.  Construct a Meta-Prompt: "Create a system instruction for an AI to act as a Cambridge Primary Examiner. The student knows [Vocab list]. Focus questions on [Learning Objects]. Check for [Grammar Structures]."
    3.  Send to Internal LLM (OpenAI/Gemini).
*   **Output:** A block of text (The System Prompt) displayed to the user for use in ChatGPT Live / Gemini Live.

## 6. Deployment & CI/CD
*   **Platform:** Netlify.
*   **Trigger:** Git commits.
*   **Security:** API Keys for OpenAI/Google are stored as encrypted Environment Variables in Netlify, never exposed to the client.

## 7. Security & Privacy
*   **No PII on Server:** Student data resides on device or encrypted backups.
*   **RBAC:** Netlify Identity JWTs enforce role boundaries. Only 'Admin' role can access the User Management view.