# VibeStudy MVP

This project is an educational platform (MVP) featuring a Kanban-style quest board and a virtual science lab. It consists of a NestJS backend and a Next.js frontend.

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB**: Must be installed and running locally on port `27017` (or configured in `.env`).

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

## Demo Script

For a guided tour of the MVP features, please refer to [MVP_DEMO_SCRIPT.md](./MVP_DEMO_SCRIPT.md).
