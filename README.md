# VibeStudy MVP

This project is an educational platform (MVP) featuring a Kanban-style quest board and a virtual science lab. It consists of a NestJS backend and a Next.js frontend.

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB**: Must be installed and running locally on port `27017` (or configured in `.env`).

## Environment Configuration

Before running the application, ensure your environment variables are set up.

### Backend
1. Copy the example file: `cp backend/.env.production.example backend/.env`
2. Update the values in `backend/.env`:
   - `MONGO_URI`: Your MongoDB connection string.
   - `OPENAI_API_KEY`: Your OpenAI API key for AI features.

### Frontend
1. Copy the example file: `cp frontend/.env.production.example frontend/.env.local`
2. Update the values in `frontend/.env.local`:
   - `NEXT_PUBLIC_API_URL`: URL of the backend API (default: `http://localhost:3001`).

## How to Run MVP

Open two terminal windows/tabs.

### Terminal 1: Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start:dev
   ```
   The backend will start on `http://localhost:3001` (default).

### Terminal 2: Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`.

## Accessing the App

Open your browser and navigate to `http://localhost:3000`.

## Production Deployment

To run the application in a production-like environment using Docker Compose:

1.  **Run with Docker Compose**:
    ```bash
    docker compose -f compose.prod.yaml up -d --build
    ```
    This command builds the optimized production images (multi-stage builds) and orchestrates the containers.

2.  **Health Checks**:
    The system includes health check endpoints used by Docker Compose to ensure services are ready:
    *   **Backend**: `http://localhost:3001/api/health`
    *   **Frontend**: `http://localhost:3000/api/health`
    *   **MongoDB**: Internal ping check.

## Demo Script

For a guided tour of the MVP features, please refer to [MVP_DEMO_SCRIPT.md](./MVP_DEMO_SCRIPT.md).
