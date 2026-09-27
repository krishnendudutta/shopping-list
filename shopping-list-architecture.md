# Shopping List Application — MERN Architecture

## 1. Project Overview

A simple student-focused Shopping List application built with the MERN stack:

- **MongoDB** — database
- **Express.js** — backend REST API
- **React** — frontend UI
- **Node.js** — backend runtime

The application should allow a student to create and manage shopping items organized by day, week, or month.

The first version should prioritize simplicity, clean code, beginner-friendly structure, and a working end-to-end application over advanced features.

---

## 2. Core Features

### Shopping Item

Each shopping item should support:

- Item name
- Quantity
- Unit
- Estimated cost
- Priority: Low / Medium / High
- Shop/vendor name
- Planning period: Day / Week / Month
- Relevant date
- Purchased status
- Created/updated timestamps

### List Management

The user should be able to:

1. Add an item
2. View all items
3. Edit an item
4. Delete an item
5. Mark an item as purchased
6. Mark a purchased item as pending again
7. View pending items
8. View purchased items
9. Filter by day/week/month
10. Filter by priority
11. Filter by vendor
12. Search by item name
13. See total planned cost
14. See total purchased cost
15. See total pending cost

---

## 3. Recommended Architecture

Use a simple monorepo-style structure:

```text
shopping-list/
│
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/                     # Node + Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json                # Optional root scripts
└── README.md
```

Do not introduce TypeScript unless explicitly requested.

---

## 4. Frontend Architecture

React should be responsible for:

- Rendering the user interface
- Managing form state
- Managing filter state
- Calling the backend API
- Displaying loading/error states
- Updating the UI after CRUD operations
- Calculating/displaying summary information

Suggested components:

```text
components/
├── ShoppingItemForm.jsx
├── ShoppingItemCard.jsx
├── ShoppingItemList.jsx
├── ShoppingFilters.jsx
├── SummaryCards.jsx
├── PriorityBadge.jsx
├── EmptyState.jsx
├── LoadingState.jsx
└── ConfirmDialog.jsx
```

Suggested pages:

```text
pages/
└── ShoppingListPage.jsx
```

The first version can use a single main page.

---

## 5. Backend Architecture

Use Express with a REST API.

Suggested flow:

```text
React
  |
  | HTTP/JSON
  v
Express Routes
  |
  v
Controllers
  |
  v
Services
  |
  v
Mongoose Models
  |
  v
MongoDB
```

Keep responsibilities separated:

### Routes

Define HTTP endpoints and connect them to controllers.

### Controllers

Handle:

- Request validation/input extraction
- Calling services
- HTTP response status codes
- Returning JSON responses

### Services

Contain business logic such as:

- Creating shopping items
- Updating items
- Calculating/filtering data
- Marking items purchased

### Models

Define MongoDB/Mongoose schemas.

---

## 6. MongoDB Data Model

Use a `ShoppingItem` collection.

Example document:

```json
{
  "_id": "ObjectId",
  "name": "Rice",
  "quantity": 5,
  "unit": "kg",
  "cost": 350,
  "priority": "high",
  "vendor": "Local Store",
  "period": "week",
  "date": "2026-09-27",
  "purchased": false,
  "createdAt": "2026-09-27T10:00:00.000Z",
  "updatedAt": "2026-09-27T10:00:00.000Z"
}
```

### Suggested Mongoose schema

```text
name
  String
  required
  trimmed

quantity
  Number
  required
  min: 0

unit
  String
  required

cost
  Number
  required
  min: 0

priority
  String
  enum: low, medium, high
  default: medium

vendor
  String
  optional
  trimmed

period
  String
  enum: day, week, month
  required

date
  Date
  required

purchased
  Boolean
  default: false

timestamps
  createdAt
  updatedAt
```

---

## 7. Date/Period Design

For the first version, keep the date model simple.

Store one `date` representing the relevant shopping date.

The `period` determines how the item is grouped:

```text
period = day
period = week
period = month
```

The frontend can use the selected date to determine the relevant day/week/month view.

Do not create separate Day, Week, and Month collections.

---

## 8. REST API

Base URL:

```text
/api/items
```

### Get items

```http
GET /api/items
```

Optional query parameters:

```text
/api/items?period=week
/api/items?purchased=false
/api/items?priority=high
/api/items?vendor=Local%20Store
/api/items?search=rice
/api/items?date=2026-09-27
```

The backend should support combinations where practical.

---

### Get one item

```http
GET /api/items/:id
```

---

### Create item

```http
POST /api/items
```

Example request:

```json
{
  "name": "Rice",
  "quantity": 5,
  "unit": "kg",
  "cost": 350,
  "priority": "high",
  "vendor": "Local Store",
  "period": "week",
  "date": "2026-09-27"
}
```

---

### Update item

```http
PUT /api/items/:id
```

---

### Delete item

```http
DELETE /api/items/:id
```

---

### Toggle purchased status

```http
PATCH /api/items/:id/purchased
```

Example:

```json
{
  "purchased": true
}
```

This endpoint is optional if the normal PUT endpoint is used, but a dedicated endpoint makes the UI action simple.

---

## 9. Summary Calculation

The application should display:

### Total planned cost

Sum of all relevant item costs.

### Total purchased cost

Sum where:

```text
purchased === true
```

### Total pending cost

Sum where:

```text
purchased === false
```

### Total item count

Number of relevant items.

The summary should respect the active filters where appropriate.

Example:

```text
Items       12
Planned     ₹2,450
Purchased   ₹1,600
Pending     ₹850
```

Do not store calculated totals in MongoDB. Calculate them from the item data.

---

## 10. Validation

### Frontend validation

Validate before submitting:

- Name cannot be empty
- Quantity must be greater than 0
- Cost must be 0 or greater
- Priority must be valid
- Period must be valid
- Date must be valid

### Backend validation

Never rely only on frontend validation.

The backend must validate all incoming data.

Invalid requests should return appropriate HTTP errors, preferably:

```text
400 Bad Request
```

---

## 11. Error Handling

Backend should have centralized error handling.

Example response:

```json
{
  "success": false,
  "message": "Shopping item not found"
}
```

Frontend should handle:

- API failure
- Network failure
- Validation errors
- Empty lists
- Loading states

Do not expose stack traces to the frontend in production.

---

## 12. UI Requirements

Keep the UI simple and student-friendly.

Main page:

```text
--------------------------------------------------
Shopping List

[ + Add Item ]

[ Today ] [ This Week ] [ This Month ]

[ All ] [ Pending ] [ Purchased ]

Search: [________________]

--------------------------------------------------

Summary

Items: 12
Planned: ₹2,450
Purchased: ₹1,600
Pending: ₹850

--------------------------------------------------

Shopping Items

Rice
5 kg | ₹350
Local Store
High
[ Pending ] [ Edit ] [ Delete ]

Notebook
5 pcs | ₹250
Stationery Shop
Medium
[ Purchased ] [ Edit ] [ Delete ]

--------------------------------------------------
```

Use responsive design so it works on desktop and mobile.

---

## 13. Initial Scope — Do NOT Add Yet

The first implementation should NOT include:

- User authentication
- Registration/login
- Social login
- Payment
- Subscription
- Notifications
- Email
- Push notifications
- AI features
- Admin dashboard
- Multiple users
- Real-time synchronization
- Complex state-management libraries
- Microservices
- Docker unless needed
- Kubernetes
- Redis
- GraphQL

These can be added later.

---

## 14. Future Architecture

Authentication can later be added:

```text
React
   |
   v
Express API
   |
   +---- Authentication
   |
   v
MongoDB
```

Then the ShoppingItem model can contain:

```text
userId
```

and every user's shopping list can be isolated.

Do not implement this in Version 1 unless authentication is specifically requested.

---

## 15. Potential Edge Cases

Handle at least these cases:

1. Empty item name
2. Quantity <= 0
3. Negative cost
4. Invalid priority
5. Invalid period
6. Invalid date
7. Non-existent item ID
8. Invalid MongoDB ObjectId
9. Attempt to update a deleted item
10. Empty shopping list
11. No search results
12. No pending items
13. No purchased items
14. Vendor left empty
15. Duplicate item names
16. User rapidly clicks Add/Save multiple times
17. API/server unavailable
18. MongoDB unavailable
19. Very long item/vendor names
20. Invalid JSON request body

Duplicate names should NOT automatically be rejected. For example, a student may legitimately have two entries for the same item.

---

## 16. Security Basics

Even though Version 1 has no authentication:

- Use environment variables for MongoDB connection strings.
- Never commit `.env`.
- Validate all API input.
- Do not trust client-provided values.
- Restrict CORS to the frontend origin when deploying.
- Use appropriate HTTP status codes.
- Do not return internal error details in production.

---

## 17. Environment Variables

Example:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping_list
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Frontend should use an environment variable for the API base URL.

For Vite:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 18. Development Setup

Recommended stack:

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- Mongoose
- JavaScript

### Database

- MongoDB

Optional frontend libraries can be introduced only when they provide clear value.

Avoid unnecessary dependencies.

---

## 19. Development Order

Build in this order:

### Phase 1 — Project setup

1. Create React/Vite frontend
2. Create Express backend
3. Connect MongoDB
4. Configure environment variables
5. Verify frontend ↔ backend ↔ MongoDB connection

### Phase 2 — CRUD

6. Create Mongoose model
7. Create GET endpoint
8. Create POST endpoint
9. Create PUT endpoint
10. Create DELETE endpoint
11. Test APIs

### Phase 3 — React UI

12. Create item form
13. Display item list
14. Add edit functionality
15. Add delete functionality
16. Add purchased toggle

### Phase 4 — Filters and calculations

17. Day/week/month filters
18. Pending/purchased filters
19. Priority filter
20. Vendor filter
21. Search
22. Cost summaries

### Phase 5 — Polish

23. Validation
24. Error handling
25. Loading states
26. Empty states
27. Responsive design
28. Confirmation dialog for deletion
29. README documentation

---

## 20. Definition of Done for Version 1

Version 1 is complete when a student can:

- Open the application
- Add a shopping item
- Specify quantity
- Specify cost
- Select priority
- Specify vendor
- Select day/week/month
- Select a date
- See the item immediately
- Edit the item
- Delete the item
- Mark it purchased
- Mark it pending again
- Filter pending/purchased items
- Filter by day/week/month
- Search items
- See total costs
- Refresh the browser without losing data
- Use the application comfortably on a mobile-sized screen

---

## 21. Guiding Principle

Keep the code understandable.

Prefer:

```text
simple code
+
clear naming
+
small components
+
small functions
+
REST API
+
MongoDB
```

over:

```text
complex abstractions
+
unnecessary libraries
+
premature optimization
```

The goal of Version 1 is to produce a complete, understandable MERN application that a beginner can read, run, debug, and extend.
