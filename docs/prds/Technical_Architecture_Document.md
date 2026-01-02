# Technical Architecture Document: VibeStudy Platform

## 1. System Overview
The VibeStudy platform utilizes a **Jamstack** architecture (JavaScript, APIs, Markup) to deliver a high-performance, secure, and scalable educational application. It decouples the frontend learning interface from the content management system, using **Git-based JSON** as the single source of truth.

### Key Technology Stack
*   **Frontend:** ReactJS (SPA)
*   **Content Management:** Decap CMS (formerly Netlify CMS)
*   **Database:** Local JSON Files (Content) & LocalStorage (User Progress)
*   **Hosting/CI/CD:** Netlify
*   **AI Integration:** OpenAI API (for content generation/transformation)
*   **Text-to-Speech:** Web Speech API / `react-speech-kit`

## 2. Architecture Diagram
```mermaid
graph TD
    User[Student] -->|Interacts| ReactApp[ReactJS Application]
    Admin[Parent] -->|Manages| CMS[Decap CMS]
    
    subgraph "Data Layer (Git Repository)"
        JSON_Vocab[Vocabulary JSON]
        JSON_Units[Curriculum Units JSON]
        JSON_Game[Game Config JSON]
    end

    subgraph "Local Client"
        ReactApp -->|Reads/Writes| LocalStore[LocalStorage (Scores/Progress)]
        ReactApp -->|Fetches| JSON_Vocab
    end

    CMS -->|Commits| JSON_Units
    CMS -->|Commits| JSON_Vocab
    
    subgraph "AI Services"
        Admin -->|Uploads PDF/Text| AIPipeline[AI Content Processor]
        AIPipeline -->|Generates| JSON_Drafts[JSON Drafts]
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

## 4. Frontend Implementation Details

### 4.1. Component Structure
*   **`src/components/GameEngines/`**: Contains generic logic for different activity types.
    *   `MatchingGame.jsx`: Renders a matching game based on any key-value pair input.
    *   `VirtualLab.jsx`: A wrapper for interactive simulations (Canvas/WebGL).
    *   `QuizBuilder.jsx`: Renders multiple-choice or fill-in-the-blank questions.
*   **`src/components/Dashboard/`**:
    *   `KanbanBoard.jsx`: Manages the drag-and-drop state of tasks.
    *   `SprintWizard.jsx`: Interface for selecting weekly tasks.

### 4.2. State Management
*   **Content State:** Static, fetched from JSON files at build time or runtime.
*   **User State (Progress):** Persisted in `LocalStorage` to ensure privacy and offline capability.
    *   Structure: `{ "completed_tasks": [], "quiz_scores": {}, "xp_points": 150 }`
*   **Backup:** Feature to export `LocalStorage` data to a JSON file for backup/transfer.

## 5. AI Content Pipeline
To solve the "unstructured data" problem for parents:
1.  **Input:** Parent pastes text (email from teacher) or uploads an image (homework sheet).
2.  **Processing:** 
    *   **LLM Prompting:** System uses a predefined "System Prompt" to act as an Educational Data Architect.
    *   **Extraction:** Extracts keywords, definitions, and quiz questions.
    *   **Formatting:** Converts extracted data into the valid JSON Schema defined in Section 3.
3.  **Output:** JSON block is presented to the parent to copy-paste into Decap CMS (or auto-imported if API integration allows).

## 6. Deployment & CI/CD
*   **Platform:** Netlify.
*   **Trigger:** Any commit to the Git repository (via CMS or Code) triggers a build.
*   **Build Process:** 
    1.  Validate JSON Schemas.
    2.  Build React Application.
    3.  Optimize Assets.
    4.  Deploy to CDN.

## 7. Security & Privacy
*   **No PII on Server:** Student data resides solely on their device (LocalStorage).
*   **Authentication:** Decap CMS uses Netlify Identity to ensure only authorized parents can edit the curriculum content.
