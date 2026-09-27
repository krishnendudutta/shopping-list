# Student Shopping List

A simple MERN shopping list app for students.

## Phase 1

This phase sets up the project structure, frontend, backend, environment files, and a basic health endpoint.

## Folder Structure

- `client/` - React frontend with Vite
- `server/` - Node.js and Express backend

### Frontend component layout

- `client/src/components/<ComponentName>/<ComponentName>.jsx`
- `client/src/components/<ComponentName>/<ComponentName>.css`

### Backend MVC layout

- `server/src/models/` - database models
- `server/src/controllers/` - request handlers
- `server/src/routes/` - API routes
- `server/src/services/` - business logic
- `server/src/config/` - app and database configuration
- `server/src/middleware/` - reusable middleware

## Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Health Check

When the backend is running, open:

```text
GET /api/health
```

Expected response:

```json
{
	"success": true,
	"message": "Shopping List API is running"
}
```

## Phase 5

The frontend now includes search, filters, summary cards, a custom delete confirmation dialog, loading states, and client-side validation for the shopping item form.
