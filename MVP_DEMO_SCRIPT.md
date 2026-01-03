# MVP Demo Script

This script outlines the "Happy Path" for demonstrating the VibeStudy MVP.

## Prerequisites
1.  **Backend**: Running on `http://localhost:3001` (or configured port).
2.  **Frontend**: Running on `http://localhost:3000`.
3.  **Database**: MongoDB is running and accessible.

## Demo Steps

### 1. Login
- **Action**: Navigate to `http://localhost:3000/login`.
- **Action**: Enter credentials (or use the provided mock login if auth is in development mode).
    - *Note: If no user exists, register a new user or use a seed user.*
- **Verification**: User is redirected to the Dashboard.

### 2. Dashboard (Kanban Board)
- **Action**: Observe the Kanban board with columns (To Do, Doing, Done).
- **Action**: Locate a Quest card in the "To Do" column.
- **Action**: Drag the Quest card to the "Doing" column.
- **Verification**: The card stays in the "Doing" column, and the status update is persisted.

### 3. Enter the Lab
- **Action**: Click on the Quest card in the "Doing" column (or click the "Start" button on the card).
- **Verification**: The application navigates to the Lab interface (`/lab/[id]`).

### 4. Make a Prediction
- **Action**: Observe the "Hypothesis/Prediction" prompt.
- **Action**: Enter a prediction about how the magnets will interact (e.g., "North and South will attract").
- **Action**: Submit the prediction.
- **Verification**: The prediction is logged, and the simulation area becomes active.

### 5. Magnet Simulation
- **Action**: Interact with the magnets in the simulation area.
    - Drag magnets around.
    - Observe the field lines (if visualized) and forces.
    - Bring two magnets close together to see attraction or repulsion.
- **Verification**: The physics simulation behaves as expected (attraction/repulsion).

### 6. Complete Experiment & Reflect
- **Action**: Complete the required interactions or click "Finish Experiment".
- **Action**: Enter a reflection on the experiment (e.g., "My prediction was correct").
- **Action**: Submit the reflection.
- **Verification**: The experiment is marked as complete.

### 7. Return to Dashboard
- **Action**: Click the "Back to Dashboard" or "Home" button.
- **Verification**: The user is returned to the Dashboard. The Quest might be moved to "Done" automatically or require manual movement (depending on implementation).
