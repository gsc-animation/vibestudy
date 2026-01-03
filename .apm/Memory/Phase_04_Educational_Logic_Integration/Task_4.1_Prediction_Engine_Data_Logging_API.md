# Task 4.1 – Prediction Engine & Data Logging API

**Status:** Completed
**Date:** 2026-01-03

## Overview
Implemented the backend infrastructure for storing experiment predictions and results. This includes the database schema, a new NestJS module, service logic, and API endpoints.

## Implementation Details

### 1. Database Schema
- Created `ExperimentLog` schema in `backend/src/database/schemas/experiment-log.schema.ts`.
- Fields:
    - `user_id` (String): Links to the user performing the experiment.
    - `quest_id` (String): Links to the specific quest.
    - `prediction_text` (String): The user's initial prediction.
    - `result_data` (Mixed): JSON object to store arbitrary result data from the simulation.
    - `reflection_text` (String): The user's reflection after the experiment.
    - `timestamp` (Date): Automatically set to current time.
- Registered `ExperimentLogSchema` in `DatabaseModule`.

### 2. Experiments Module
- Generated `ExperimentsModule` using Nest CLI.
- Imported `DatabaseModule` to access the Mongoose model.

### 3. Service Layer (`experiments.service.ts`)
- `createLog(createExperimentDto)`: Creates a new `ExperimentLog` document with the initial prediction.
- `updateResult(updateExperimentDto)`: Updates an existing log entry with `result_data` and `reflection_text`. Returns the updated document. Throws `NotFoundException` if the log ID is invalid.

### 4. Controller Layer (`experiments.controller.ts`)
- `POST /experiments/predict`: Accepts `{ userId, questId, prediction }`. Calls `createLog` and returns `{ logId }`.
- `POST /experiments/result`: Accepts `{ logId, resultData, reflection }`. Calls `updateResult`.

## Key Files Created/Modified
- `backend/src/database/schemas/experiment-log.schema.ts`
- `backend/src/database/database.module.ts`
- `backend/src/experiments/experiments.module.ts`
- `backend/src/experiments/experiments.service.ts`
- `backend/src/experiments/experiments.controller.ts`
- `backend/src/experiments/dto/create-experiment.dto.ts`
- `backend/src/experiments/dto/update-experiment.dto.ts`

## Next Steps
- Frontend integration: The `MagnetsScene` (or other experiment scenes) will need to call these endpoints.
- **Task 4.2**: Integrate this logging into the UI (Prediction Modal & Result Summary).