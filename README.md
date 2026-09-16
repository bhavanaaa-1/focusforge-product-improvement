# FocusForge Productivity

FocusForge is a lightweight productivity application for managing daily tasks and tracking progress. Users can add tasks, view their task list, mark tasks as completed, and see an at-a-glance summary of their completion progress on the dashboard.

---

## Features

### Task Management
- Add tasks
- View tasks
- Mark tasks as completed

### Daily Progress Tracker
The dashboard sidebar now displays a Daily Progress Tracker ("Today's Progress") that shows:
- Completed tasks
- Remaining tasks
- Total tasks
- Completion percentage
- Visual progress bar (10-block bar that fills with completion percentage)
- Empty-task state ("No tasks yet. Add one above!" when there are no tasks)

The tracker uses the existing task data from the dashboard's `tasks` state and updates automatically whenever tasks are added or completed — no page refresh needed, no separate API call.

---

## Product Improvement

The original Motivation Mode displayed random hardcoded motivational quotes in the dashboard sidebar. It fetched a new quote from the backend every 5 seconds via `setInterval`, and the quotes were disconnected from task data — a random string from a hardcoded array of 8 quotes, unrelated to the user's actual tasks or workload.

It was replaced because the dashboard sidebar space could provide more actionable productivity information. The new Daily Progress Tracker directly reflects the user's actual task progress (completed / remaining / total with a visual progress bar) instead of passive, generic content.

---

## Tech Stack

Frontend:
- React
- Vite

Backend:
- Node.js
- Express

Database:
- PostgreSQL
- Prisma ORM

---

## Project Structure

```
client/
  src/
    api/          # API clients (taskApi.js)
    components/   # AddTask.jsx, TaskList.jsx, ProgressTracker.jsx
    pages/        # Dashboard.jsx
    App.jsx
    main.jsx
    index.css

server/
  config/         # prisma.js (shared Prisma client)
  controllers/    # taskController.js
  prisma/         # schema.prisma, migrations/
  routes/         # taskRoutes.js
  index.js        # Express entry point
```

Important files:
- `client/src/pages/Dashboard.jsx` — holds the `tasks` state; renders `AddTask`, `TaskList`, and `ProgressTracker`
- `client/src/components/ProgressTracker.jsx` — presentational component computing progress stats from the `tasks` prop
- `client/src/components/TaskList.jsx` — renders the task list with completion checkboxes
- `client/src/components/AddTask.jsx` — form for creating a new task
- `client/src/api/taskApi.js` — axios client for the task endpoints (`getTasks`, `createTask`, `updateTask`)
- `server/controllers/taskController.js` — `getTasks`, `createTask`, `updateTask` handlers
- `server/routes/taskRoutes.js` — task route definitions mounted at `/api/tasks`
- `server/prisma/schema.prisma` — Prisma schema with the `Task` model

---

## Getting Started

### Prerequisites

Before running the project, ensure the following tools are installed:

- Node.js (v16 or higher)
- PostgreSQL running locally
- npm

---

### 1. Clone the Repository

```bash
git clone <repo-url>
cd focusforge-productivity
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies.

```bash
cd server
npm install
```

Create a `server/.env` file containing a `DATABASE_URL` pointing to your local PostgreSQL FocusForge database:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/focusforge"
```

Run database migrations and generate the Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default (or the `PORT` set in `.env`).

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd client
npm install
npm run dev
```

Vite prints the local frontend URL in the terminal (typically `http://localhost:5173`). The application should now be running locally.

---

## API

Base URL: `http://localhost:5000`

### `GET /api/tasks`
- Purpose: retrieve all tasks, newest first (`createdAt` descending).
- Response: JSON array of task objects.

### `POST /api/tasks`
- Purpose: create a new task.
- Request body: `{ "title": "Task title" }` (`title` is required).
- Response: `201` with the created task object; `400` (`{ "error": "Title is required" }`) when `title` is missing.

### `PATCH /api/tasks/:id`
- Purpose: update a task's completion status.
- Request body: `{ "completed": true | false }`.
- Response: the updated task object.

The old `GET /api/motivation` endpoint was removed along with its controller and route.

---

## Data Model

`Task` model from `server/prisma/schema.prisma`:

```prisma
model Task {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

- `id` — auto-incrementing primary key identifying each task.
- `title` — the task's text content.
- `completed` — whether the task is done (`false` by default).
- `createdAt` — timestamp of when the task was created (defaults to now; used to order tasks newest first).

---

## Progress Tracker Data Flow

```
Dashboard
  ↓
tasks state
  ├── AddTask
  ├── TaskList
  └── ProgressTracker
```

- `Dashboard.jsx` owns the `tasks` state (fetched once via `getTasks`, then updated through `handleTaskAdded` / `handleTaskUpdated`).
- `AddTask` writes to that state by creating tasks through the API.
- `TaskList` reads the state and toggles completion through the API.
- `ProgressTracker` receives the same `tasks` array as a prop and derives completion statistics locally (`total`, `completed`, `remaining`, percentage). It requires no new API endpoint and no new database table.

---

## Testing

Manual verification performed on the final project:

- Prisma validation (`npx prisma validate` passes)
- Prisma client generation (`npx prisma generate` succeeds)
- Backend startup (server starts on port 5000 without errors)
- Frontend build (`npm run build` succeeds via Vite)
- Task creation (new tasks appear in the list and in progress stats)
- Task retrieval (tasks load from the database on dashboard mount)
- Task completion (toggling a checkbox updates the task)
- Progress updates (stats, percentage, and progress bar update on add/complete)
- Persistence after refresh (tasks survive a page reload)
- Browser console verification (no console errors from the changes)

---

## Product Improvement Summary

FocusForge moved from passive motivational content (random quotes on a 5-second timer) to actionable task-progress information (completed / remaining / total with a live progress bar). The Daily Progress Tracker reuses the existing task state, so no new endpoints or tables were needed, and all existing task-management functionality (create, read, update) is preserved.
