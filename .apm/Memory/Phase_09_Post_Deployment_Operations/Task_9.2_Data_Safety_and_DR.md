# Task 9.2 Data Safety: Backup Scripts and Disaster Recovery Documentation

## 1. Atlas Backups

If using MongoDB Atlas (recommended for production):
1.  **Enable Cloud Backups**: In the Atlas Dashboard, go to your cluster > **Backups**. Ensure Cloud Backups are enabled.
2.  **Frequency**: Set snapshot frequency to at least daily, or hourly for high-traffic applications.
3.  **Retention**: Configure retention policy (e.g., 7 days for daily backups, 4 weeks for weekly backups).
4.  **Point-in-Time Recovery**: Consider enabling for granular recovery (requires Oplog access).

## 2. Manual Backups

A script is provided to perform manual backups using `mongodump`.

**Script Location:** `backend/scripts/backup_db.sh`

**Usage:**
1.  Navigate to the `backend` directory (or root, but script handles paths relative to `backend`):
    ```bash
    cd backend
    ./scripts/backup_db.sh
    ```
2.  **Output**: Backups are stored in `backend/backups/backup_YYYYMMDD_HHMMSS`.

**Prerequisites:**
*   `mongodump` tool must be installed on the system (part of MongoDB Database Tools).
*   `backend/.env` file must exist and contain `MONGO_URI`.

## 3. Disaster Recovery Drill

**Objective**: Simulate data loss and restore from a backup.

**Procedure:**

### Step 1: Create a "Pre-Disaster" State
1.  Ensure the application is running.
2.  Verify some data exists (e.g., user profiles, experiment logs).
3.  Run a manual backup:
    ```bash
    cd backend
    ./scripts/backup_db.sh
    ```
    *Note the backup folder name (e.g., `backups/backup_20240101_120000`).*

### Step 2: Simulate Disaster
1.  **WARNING**: This will delete data. ONLY do this in a development/testing environment.
2.  Connect to the database (e.g., using Compass or `mongosh`).
3.  Drop the database or delete critical collections.
    ```bash
    mongosh "mongodb://localhost:27017/vibestudy" --eval "db.dropDatabase()"
    ```
4.  Verify the application is broken or shows empty data.

### Step 3: Restore
1.  Locate the backup folder you created in Step 1.
2.  Use `mongorestore` to restore the data.
    ```bash
    # Replace <timestamp_folder> with your actual folder name
    mongorestore --uri="mongodb://localhost:27017/vibestudy" backend/backups/backup_<timestamp_folder>/vibestudy
    ```
    *(Note: The `mongodump` creates a folder structure inside the backup directory. Point `mongorestore` to the dump directory or the specific database folder inside it depending on how you want to restore).*

    **Refined Restore Command (if dumping specific DB):**
    If the backup folder contains a `vibestudy` directory:
    ```bash
    mongorestore --uri="mongodb://localhost:27017/vibestudy" backend/backups/backup_<timestamp_folder>/vibestudy
    ```

### Step 4: Verification
1.  Restart the backend (if necessary, though MongoDB changes are usually immediate).
2.  Check the application.
3.  Verify that the data (users, experiments) from Step 1 is present again.