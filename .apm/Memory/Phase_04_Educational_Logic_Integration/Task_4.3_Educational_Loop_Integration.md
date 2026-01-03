# Task 4.3 - Educational Loop Integration

## Status
- [x] Create Modals
- [x] Integrate Prediction Step
- [x] Bridge Game Events
- [x] Integrate Reflection Step

## Context
This task integrates the educational loop into the lab experience. The user must predict the outcome of the experiment before playing, and reflect on the results after playing. This involves frontend changes to show modals and communicate with the backend `experiments` API.

## Implementation Details
1.  **Modals**:
    - `PredictionModal`: Collects hypothesis.
    - `ReflectionModal`: Collects observations.
2.  **State Management**:
    - Lab page (`frontend/app/lab/[id]/page.tsx`) manages the state: `predictionPending`, `playing`, `reflectionPending`.
    - It holds the `logId` returned from the prediction step to use in the reflection step.
3.  **Game Events**:
    - `PhaserGame` exposes `onGameComplete` callback via React props and passes it to Phaser Registry.
    - `MagnetsScene` triggers this callback when the "Complete" button is clicked.
4.  **API Integration**:
    - `POST /experiments/predict`: Sends `questId`, `prediction`, `userId`. Returns `logId`.
    - `POST /experiments/result`: Sends `logId`, `observation`.
    - Backend URL assumed `http://localhost:3001` (configurable via `NEXT_PUBLIC_API_URL` later).

## Final Notes
- The flow is blocked by the Prediction Modal.
- The "Complete" button in Phaser triggers the Reflection Modal.
- Data is saved to backend at both steps.
- Redirects to dashboard on completion.
