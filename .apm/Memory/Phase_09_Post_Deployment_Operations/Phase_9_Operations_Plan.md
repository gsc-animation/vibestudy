# Phase 9: Post-Deployment Operations & Maintenance

**Status:** Planned
**Prerequisites:** Phase 8 (Deployment) complete

## Overview
Phase 9 focuses on the "Day 2" operations of VibeStudy. After the MVP deployment, the priority shifts to maintaining system stability, observing application behavior in the wild, securing user data, and establishing feedback loops to inform future development (e.g., Phase 7 Content Expansion).

## Objectives
-   **Observability:** Gain visibility into application performance and errors.
-   **Reliability:** Ensure data safety through backups and recovery plans.
-   **User Insight:** Collect quantitative (analytics) and qualitative (feedback) data.
-   **Security & Maintenance:** Establish a routine for keeping dependencies and infrastructure secure.

## Task List

### Task 9.1: Observability & Monitoring Setup
*   **Goal:** Detect and diagnose issues before users report them.
*   **Activities:**
    *   **Error Tracking:** Integrate Sentry (or similar) for Frontend (Next.js) and Backend (NestJS) to capture unhandled exceptions.
    *   **Structured Logging:** Ensure backend logs (NestJS `Logger`) are formatted (JSON in prod) and aggregated (e.g., CloudWatch, Datadog, or simple file rotation if self-hosted).
    *   **Health Checks:** Configure external uptime monitoring (e.g., UptimeRobot) hitting the `/api/health` endpoints established in Phase 8.

### Task 9.2: Data Safety & Backup Strategy
*   **Goal:** Prevent data loss.
*   **Activities:**
    *   **Database Backups:**
        *   If using MongoDB Atlas: Verify automated snapshot schedule.
        *   If self-hosted: Implement `mongodump` cron job to S3/offsite storage.
    *   **Disaster Recovery Drill:** Perform a dry-run restoration of the database to a dev environment to verify backup integrity.

### Task 9.3: Feedback & Analytics Loops
*   **Goal:** Understand how the MVP is being used.
*   **Activities:**
    *   **Product Analytics:** Integrate a privacy-focused analytics tool (e.g., PostHog, Plausible) to track:
        *   Quest completion rates.
        *   Time spent in "The Lab".
        *   Drop-off points in the "Predict -> Experiment -> Reflect" flow.
    *   **In-App Feedback:** Add a simple "Report Issue" or "Feedback" widget in the Dashboard and Lab UI for users to report bugs or suggestions directly.

### Task 9.4: Routine Maintenance Schedule
*   **Goal:** Keep technical debt low and security high.
*   **Activities:**
    *   **Weekly:** Review error logs and triage critical bugs.
    *   **Monthly:** Run `npm audit` and update minor dependency versions.
    *   **Quarterly:** Review database performance indices and storage costs.

### Task 9.5: Incident Response Plan
*   **Goal:** Define how to handle production outages.
*   **Activities:**
    *   Create a simple `RUNBOOK.md` detailing:
        *   How to restart services.
        *   How to rollback a bad deployment.
        *   Who to contact (if team expands).

## Success Criteria
1.  Critical errors trigger notifications to the dev team.
2.  Database is backed up daily with at least 7 days retention.
3.  Basic usage metrics (DAU, Quest Completions) are visible on a dashboard.
4.  A feedback channel exists for end-users.