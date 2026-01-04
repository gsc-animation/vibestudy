# Incident Response Runbook

This runbook is the go-to guide for handling production incidents. Follow these procedures when alerts fire or issues are reported.

## 1. Severity Levels

| Level | Description | Examples | Response Time |
|-------|-------------|----------|---------------|
| **SEV-1** | **Critical / System Down** | Core service outage, data loss risk, security breach. Users cannot access the platform. | Immediate (< 15 mins) |
| **SEV-2** | **Major Feature Broken** | A key feature (e.g., Quest submission, Experiment logging) is failing, but the system is partially usable. | Urgent (< 1 hour) |
| **SEV-3** | **Minor Bug / Cosmetic** | Non-critical bugs, UI glitches, minor performance issues. | Normal Business Hours |

## 2. Escalation Policy

If you are the on-call engineer and cannot resolve the issue within the response time, escalate immediately.

*   **Primary Contact:** [Insert Name/Role] - `[Phone/Email/Slack]`
*   **Secondary Contact:** [Insert Name/Role] - `[Phone/Email/Slack]`
*   **Engineering Lead:** [Insert Name/Role] - `[Phone/Email/Slack]`

## 3. Incident Response Process

1.  **Acknowledge:** Mark the alert as "Ack" in the monitoring channel/dashboard to let the team know you are looking into it.
2.  **Assess:** Determine the Severity Level (SEV-1, SEV-2, or SEV-3) based on user impact.
3.  **Fix:**
    *   Consult the **Common Incidents & Playbooks** below.
    *   Apply a workaround or fix to restore service.
    *   If the fix is complex, roll back to the last known good state first.
4.  **Post-Mortem:** After the incident is resolved, schedule a review to discuss root cause and preventative measures.

## 4. Common Incidents & Playbooks

### Scenario 1: Database Connection Failure
**Symptoms:** Backend logs show connection timeouts to MongoDB; API returns 500 errors.
**Steps:**
1.  Check MongoDB Atlas status page for regional outages.
2.  Check backend logs for authentication errors or timeout messages.
3.  Restart the backend service to reset connection pools.
    ```bash
    # Example restart command (adjust for your deployment, e.g., Docker/PM2)
    docker compose restart backend
    ```

### Scenario 2: High Error Rate (Sentry Alerts)
**Symptoms:** Spike in 5xx errors reported in Sentry or monitoring dashboard.
**Steps:**
1.  Open the Sentry dashboard to identify the specific error and affected endpoint.
2.  Check if the errors started after a recent deployment.
3.  **If yes:** Rollback to the previous stable version immediately.
4.  **If no:** Investigate if an external dependency (AI Service, Database) is down.

### Scenario 3: Frontend White Screen
**Symptoms:** Users report a blank screen or the app fails to load.
**Steps:**
1.  Open the browser developer console to check for JavaScript errors.
2.  Check Sentry for React Error Boundary events.
3.  Verify if a recent frontend deployment introduced a breaking change (e.g., environment variable missing).

## 5. Useful Commands

### Backup Database
Run the backup script manually if you suspect data corruption or before attempting risky fixes.
```bash
./backend/scripts/backup_db.sh
```

### Health Check Endpoints
Verify service status:
*   **Backend:** `GET /health` (or equivalent)
*   **Frontend:** Visit the main landing page or dashboard.