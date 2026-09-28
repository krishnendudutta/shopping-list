# Your Shopping List

A simple MERN shopping list app for anyone.

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

## Environment Variables

### Backend

- `PORT` - server port, defaults to `5000`
- `MONGODB_URI` - MongoDB connection string
- `CLIENT_URL` - frontend origin used by CORS

### Frontend

- `VITE_API_URL` - backend API base URL
- In local development, the frontend can use `/api` through the Vite proxy.

## Render Deployment

Use two Render services:

1. Backend as a Web Service
    - Root directory: `server`
    - Build command: `npm install`
    - Start command: `npm start`
    - Set `MONGODB_URI` to your Atlas connection string.
    - Set `CLIENT_URL` to the deployed frontend URL.

2. Frontend as a Static Site
    - Root directory: `client`
    - Build command: `npm install && npm run build`
    - Publish directory: `dist`
    - Set `VITE_API_URL` to the deployed backend URL ending in `/api`.

If you change the backend URL later, update the frontend environment variable and redeploy the static site.

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
