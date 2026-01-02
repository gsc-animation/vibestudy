# Product Requirement Document (PRD): VibeStudy - Integrated Homeschooling Platform

## 1. Executive Summary
**VibeStudy** is a specialized educational platform designed for Vietnamese Grade 3 students (approx. 8-9 years old) following the Cambridge Primary curriculum. It addresses the critical challenge of the language barrier in learning Math and Science by integrating **CLIL** (Content and Language Integrated Learning), **CPA** (Concrete-Pictorial-Abstract), and **Agile** management methodologies. The platform empowers parents to manage their child's homeschooling journey and provides a gamified, interactive environment for students to master both subject knowledge and English proficiency.

## 2. Problem Statement
*   **Language Barrier:** Students struggle to understand Math and Science concepts due to limited English vocabulary (Tier 2 & 3 words), leading to "wasted weeks" of learning.
*   **Cognitive Overload:** Processing complex concepts and a foreign language simultaneously overwhelms working memory.
*   **Parental Management:** Parents lack effective tools to track progress, customize curriculum based on school schedules, and support their children without being fluent in English or the curriculum themselves.
*   **Abstract Concepts:** Traditional methods fail to effectively teach abstract concepts (like friction, photosynthesis) without visual and interactive aids.

## 3. Target Audience
*   **Primary Users (Learners):** Vietnamese Grade 3 students (8-9 years old) studying the Cambridge Primary curriculum. They need engaging, visual, and scaffolded learning experiences.
*   **Secondary Users (Admins/Parents):** Parents or Tutors acting as facilitators. They need tools to configure learning paths, track "stuck" points, and customize content.
*   **Tertiary Users (System Administrators):** Super-users who manage parent accounts, associate students, and configure global system settings (like AI API keys).

## 4. Product Vision & Principles
*   **Data-Driven Education:** Content is decoupled from the application logic, allowing dynamic updates.
*   **VRA (Virtual-Representational-Abstract):** Digital evolution of CPA to make abstract concepts tangible.
*   **Agile for Kids:** Using eduScrum and Kanban to teach self-regulation and executive function.
*   **BICS to CALP Bridge:** Guiding students from basic communication to academic language proficiency using sentence frames and scaffolded logic.

## 5. Core Features

### 5.1. The Agile Dashboard (Management Core)
*   **Kid-Kanban Board:** A gamified board with columns: *Quest Log (Backlog), My Mission (To Do), In Action (Doing - Limit 1), Victory (Done)*.
*   **Sprint Planner:** A wizard for parents and students to select weekly tasks from the curriculum backlog.
*   **Retro Minigame:** A weekly review tool for students to reflect on feelings, achievements, and blockers (Metacognition).

### 5.2. The Scientist's Workbench (Science & Math Focus)
*   **Virtual Labs (VRA):** Interactive simulations for Physics (Forces, Magnets), Biology (Plants, Human Body), and Chemistry (States of Matter).
    *   *Features:* "Transparency Slider" for anatomy, "Physics Engine" for friction/magnets.
*   **Prediction Engine:** A mandatory step before simulations where students must predict outcomes, fostering the "Thinking and Working Scientifically" (TWS) skill.
*   **Data Logging:** Digital tools for recording observations (tables, charts) during experiments.

### 5.3. The Language Lab (ESL & CLIL Focus)
*   **Context-Aware Glossary:** Interactive "Word Catcher" for Tier 3 vocabulary. Clicking a word shows a simple definition, image, and plays audio.
*   **Sentence Builder:** Drag-and-drop interface to construct scientific conclusions using scaffolded sentence frames (e.g., "The [car] moved [slower] because [surface] was [rough]").
*   **Text Simplifier (AI):** Toggle to simplify complex text using AI, maintaining key terminology while reducing grammatical complexity.

### 5.4. Parent Admin Portal (CMS & Analytics)
*   **Curriculum Management:** Interface to input/edit Unit goals, vocabulary lists, and quiz questions.
*   **Detailed Performance Analytics:** Deep-dive reporting for every test.
    *   *Question-Level Breakdown:* Shows exactly which questions were missed (e.g., "Missed 3 questions on 'Magnetic Repulsion'").
    *   *Trend Analysis:* Visualizes scores over time to identify struggling topics.
*   **AI Content Converter:** Tool to parse unstructured data (teacher emails, PDFs) into structured JSON content for the app.

### 5.5. AI-Powered Daily Summary & Suggestions
*   **Daily Digest:** Parents can select an "AI Summary" activity for each day.
*   **Multi-LLM Support:** Configurable system backend to switch between **OpenAI Compatible APIs** and **Google Generative AI** endpoints.
*   **Intelligent Insights:**
    *   *Progress Summary:* "Today, [Student] mastered the concept of Friction but struggled with the vocabulary term 'Surface Area'."
    *   *Actionable Suggestions:* "Recommended for tomorrow: Review the 'Rough vs. Smooth' simulation again before starting the Quiz."

### 5.7. ESL Speaking Examiner (AI Roleplay Integration)
*   **Goal:** Provide realistic speaking practice by generating context-aware persona prompts for external LLM Apps (ChatGPT Live / Gemini Live).
*   **Workflow:**
    1.  **Select Content:** Parent/Student selects specific Chapters/Units (incorporating covered Vocabulary, Grammar, and Learning Objects).
    2.  **Generate Persona:** System calls the internal LLM API to construct a detailed "Teacher Persona" prompt.
    3.  **Practice:** User activates the external App (ChatGPT/Gemini) and inputs the generated prompt. The AI acts as the Examiner.
    4.  **Feedback:** The AI Examiner evaluates fluency, vocabulary usage, and grammar, providing a summary at the end.

### 5.6. User Management System
*   **Role-Based Access Control (RBAC):**
    *   *Admin:* Create/Delete Parent accounts, configure Global AI Settings.
    *   *Parent:* Create/Manage Student profiles, customize curriculum.
    *   *Student:* Access learning interface only.
*   **Parent-Student Association:** Admins can link specific Parent accounts to one or multiple Student profiles, ensuring data privacy and correct dashboard views.

## 6. User Journeys

### 6.1. The Student's "Mission"
1.  **Login:** Student sees their Kanban board.
2.  **Plan:** Picks a task (e.g., "Magnets") from "To Do" and moves it to "Doing".
3.  **Engage:** Enters the "Virtual Lab". System asks for a Prediction.
4.  **Experiment:** Student interacts with magnets. The "Glossary" highlights the word *Repel*.
5.  **Conclude:** Student uses "Sentence Builder" to write what happened.
6.  **Victory:** Task moves to "Done". Confetti animation.

### 6.2. The Parent's "Setup"
1.  **Receive Info:** Parent gets a weekly email from school about the topic "Light & Shadows".
2.  **Input:** Parent uses the Admin Portal, pastes the email content into the "AI Converter".
3.  **Review:** AI generates a vocabulary list and a mini-quiz. Parent approves.
4.  **Sync:** Content appears in the Student's "Quest Log" for the next Sprint.

### 6.3. The Parent's "Daily Review"
1.  **Check-in:** Parent logs into the portal in the evening.
2.  **AI Summary:** Clicks "Generate Daily Report". System queries the configured LLM (OpenAI/Google).
3.  **Insight:** Parent reads: "Student spent 15 mins on 'Friction' but failed the quiz twice. Suggest reviewing tomorrow."
4.  **Action:** Parent drags the "Review Friction" card from "Done" back to "To Do" on the kid's board.

## 7. Success Metrics
*   **Vocabulary Retention:** Improvement in Tier 3 vocabulary recall (measured via spaced repetition stats).
*   **Task Completion Rate:** % of planned Kanban tasks moved to "Done" weekly.
*   **Engagement:** Average time spent in "Virtual Labs".
*   **Parent Satisfaction:** Ease of content update and perceived reduction in "wasted weeks".
*   **AI Efficacy:** Relevance rating of daily suggestions as marked by parents.