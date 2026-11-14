# 📝 TaskFlow — Production-Ready MERN Stack To-Do List Application

> **SDE-1 Full-Stack Assignment Solution**  
> A mobile-first, responsive To-Do List web application built strictly to the Figma design specification using the **MERN Stack** (MongoDB, Express.js, React, Node.js) with production-quality engineering practices.

---

## 🌟 Table of Contents
1. [Product Overview](#-product-overview)
2. [Figma UI Compliance & Features](#-figma-ui-compliance--features)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Folder Structure](#-folder-structure)
5. [Prerequisites & Installation](#-prerequisites--installation)
6. [Environment Variables](#-environment-variables)
7. [Running the Application](#-running-the-application)
8. [Database Schema & Design](#-database-schema--design)
9. [REST API Documentation](#-rest-api-documentation)
10. [Key Technical Decisions & Interview Guide](#-key-technical-decisions--interview-guide)
11. [Deployment Guide](#-deployment-guide)

---

## 📋 Product Overview

**TaskFlow** allows users to organize and track their daily and weekly productivity. Key highlights:
- **Weekly Organization:** Group tasks into Monday–Sunday weeks.
- **Visual Progress Feedback:** Dynamic progress bar reflecting the percentage of completed tasks for the current week.
- **Task Summary Cards:** Instant visual count of Open vs. Completed tasks with one-tap filtering.
- **Day-by-Day Scheduling:** Interactive 7-day strip (Mon–Sun) with two-digit date badges and active indicators.
- **Comprehensive Task Attributes:** Title (required), date (required), start & end times, priority (Low/Medium/High), and description.
- **Search:** Real-time debounced keyword search across titles and descriptions with inline edit/delete.
- **Mobile Gesture Support:** Swipe left on any task item to reveal a quick-delete action.

---

## 🎨 Figma UI Compliance & Features

The interface closely reproduces all 4 visual states provided in the Figma design:

| Screen | Design Reference | Implementation Details |
| :--- | :--- | :--- |
| **1. Landing / Splash Page** | `design/image.png` | Deep blue hero section (`#4C6EF5`), custom vector zigzag decorative patterns, bold "Manage What To Do" headline, and "Get Started" CTA navigating to `/home`. |
| **2. Home Dashboard** | `design/image copy.png` | Top search bar, Monday–Sunday day strip, blue/pink summary cards ("Task Complete" / "Task Pending"), weekly progress bar, "Tasks Today" list with custom checkboxes, strikethrough text, delete/edit icons, and floating `+` button. |
| **3. Add/Edit Task Modal** | `design/image copy 2.png` | Bottom-sheet modal with dark backdrop blur, title input, dual clock-icon time inputs ("Start" & "Ends"), calendar date input, priority badge selector, description textarea, and full-width "Create task" button. |
| **4. Search Screen** | `design/image copy 3.png` | Header with back arrow (`←`), live search input with search icon (`🔍`), real-time debounced results with checkbox toggle, inline edit, and delete. |

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **React 18**: Component-based UI with functional components and React Hooks.
- **Vite 5**: Blazing-fast development server, HMR, and optimized Rollup production builds.
- **Tailwind CSS 3**: Utility-first CSS framework configured with custom primary brand colors (`#4C6EF5`, `#EEF2FF`, `#FFF1F0`).
- **Responsive Phone Frame (`PhoneContainer`)**: Mobile-first design that takes full viewport on mobile devices (< 640px) and presents a centered ~430px smartphone container with realistic frame styling, subtle notch, and shadow on tablets and desktops—strictly preventing awkward wide stretching.
- **React Router DOM v6**: Client-side routing (`/` Landing, `/home` Dashboard, `/search` Search).
- **Framer Motion 11**: Fluid physics-based animations for modal slide-up, list transitions, and swipe-to-delete gestures.
- **Lucide React**: Clean, consistent vector icon set.
- **Axios**: HTTP client with base URL configuration and interceptors.
- **date-fns 4**: Robust, lightweight date manipulation and Monday–Sunday ISO week interval calculations.
- **React Hot Toast**: Unobtrusive user notifications for CRUD feedback.

### Backend
- **Node.js & Express.js**: Modular RESTful API architecture following controller-service-route separation.
- **MongoDB & Mongoose 8**: Document database with schema validation, indexes, and aggregation pipelines.
- **Morgan & CORS**: HTTP request logging and cross-origin resource sharing middleware.
- **Dotenv**: Centralized environment variable management.

---

## 📁 Folder Structure

```
assigment/
├── client/                          # React + Vite Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, SVGs
│   │   ├── components/              # Modular UI components
│   │   │   ├── FloatingActionButton.jsx  # Floating '+' button
│   │   │   ├── ProgressBar.jsx           # Weekly progress bar
│   │   │   ├── SummaryCards.jsx          # Open vs Closed count cards
│   │   │   ├── TaskItem.jsx              # Individual task row with swipe-to-delete
│   │   │   ├── TaskList.jsx              # Task list container with View All toggle
│   │   │   ├── TaskModal.jsx             # Bottom-sheet modal for create/edit
│   │   │   ├── TopBar.jsx                # Header icons (settings, search, bell)
│   │   │   └── WeekStrip.jsx             # Mon-Sun day selector with week navigation
│   │   ├── hooks/
│   │   │   └── useTasks.js               # Custom hook managing task state & API calls
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Main dashboard screen
│   │   │   ├── LandingPage.jsx           # Splash / Get Started page
│   │   │   └── SearchPage.jsx            # Real-time search screen
│   │   ├── utils/
│   │   │   ├── api.js                    # Axios instance & API client functions
│   │   │   └── dateHelpers.js            # date-fns week calculations & formatting
│   │   ├── App.jsx                       # Route definitions
│   │   ├── index.css                     # Tailwind directives & global utility classes
│   │   └── main.jsx                      # React DOM mounting & Toast provider
│   ├── index.html                        # HTML entry point with viewport configuration
│   ├── package.json                      # Client dependencies & scripts
│   ├── postcss.config.js                 # PostCSS configuration for Tailwind
│   ├── tailwind.config.js                # Tailwind color palette & font configuration
│   └── vite.config.js                    # Vite configuration with API reverse proxy
│
├── server/                          # Express + MongoDB Backend
│   ├── config/
│   │   └── db.js                         # Mongoose connection with error handling
│   ├── controllers/
│   │   └── taskController.js             # Business logic for all 9 API operations
│   ├── middleware/
│   │   └── errorHandler.js               # Centralized Express error handler
│   ├── models/
│   │   └── Task.js                       # Mongoose model schema, virtuals & indexes
│   ├── routes/
│   │   └── taskRoutes.js                 # Express router mapping endpoints to controllers
│   ├── .env                              # Backend environment variables
│   ├── .env.example                      # Template for environment configuration
│   ├── package.json                      # Backend dependencies & npm scripts
│   ├── seed.js                           # Seed script with realistic Figma sample data
│   ├── server.js                         # Express application entry point & graceful shutdown
│   └── test-api.js                       # Automated end-to-end API test suite
│
├── design/                          # Figma visual reference screenshots
├── .gitignore                       # Git ignore rules for node_modules, dist, .env
├── package.json                     # Root orchestrator (runs dev/test/seed concurrently)
├── problemstatement.md              # Original assignment requirements document
└── README.md                        # Complete project documentation
```

---

## ⚙️ Prerequisites & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance running on port 27017 or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

### 1. Clone & Install Dependencies
You can install dependencies for both frontend and backend using the root orchestrator:

```bash
# Clone the repository
git clone <your-repo-url>
cd assigment

# Install all dependencies (root, backend, and frontend)
npm run install:all
```

Alternatively, install individually:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🔐 Environment Variables

Create a `server/.env` file (or copy from `server/.env.example`):

```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todoApp
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

*Note for MongoDB Atlas: replace `MONGODB_URI` with your connection string:  
`mongodb+srv://<username>:<password>@cluster.mongodb.net/todoApp?retryWrites=true&w=majority`*

---

## 🚀 Running the Application

### Option A: Run Both Client & Server Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

### Option B: Run Individually
In terminal 1 (Backend):
```bash
cd server
npm run dev
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### Option C: Populate Sample Data (Matching Figma UI)
Run the seed script to populate realistic sample tasks:
```bash
npm run seed
# or: cd server && npm run seed
```

### Option D: Run Automated End-to-End API Test Suite
Run the 10-step automated backend test suite:
```bash
npm test
# or: cd server && npm test
```

---

## 🗄️ Database Schema & Design

### Task Schema (`server/models/Task.js`)

| Field | Type | Validation / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `title` | `String` | Required, trimmed, max 100 chars | Name of the task |
| `description` | `String` | Optional, trimmed, max 500 chars | Additional details |
| `date` | `Date` | Required | Scheduled date |
| `startTime` | `String` | Optional, regex format `HH:MM` | Scheduled start time |
| `endTime` | `String` | Optional, regex format `HH:MM` | Scheduled end time |
| `priority` | `String` | Enum: `['low', 'medium', 'high']`, default: `'medium'` | Task priority level |
| `status` | `String` | Enum: `['open', 'completed']`, default: `'open'` | Current task status |
| `createdAt` | `Date` | Auto-generated timestamp | Record creation date |
| `updatedAt` | `Date` | Auto-generated timestamp | Record last modified date |

### Virtuals & Indexes
- **Virtual `weekStart`**: Dynamically computes the Monday of the ISO week for any task date.
- **Indexes**:
  - `{ date: 1 }`: Optimized for date filtering and range queries.
  - `{ status: 1 }`: Accelerated open/completed counts.
  - `{ date: 1, status: 1 }`: Compound index for weekly progress aggregations.

---

## 📡 REST API Documentation

### Base URL
`http://localhost:5000/api/tasks`

| Method | Endpoint | Description | Query / Body Params | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check | None | 200 |
| `GET` | `/tasks` | Get all tasks (newest first) | None | 200 |
| `GET` | `/tasks/weekly-summary` | Aggregated weekly breakdown | None | 200 |
| `GET` | `/tasks/week` | Get tasks for a specific week | `weekStart=YYYY-MM-DD` (ISO Monday) | 200 |
| `GET` | `/tasks/search` | Search by keyword (title/desc) | `q=keyword` | 200 |
| `GET` | `/tasks/:id` | Get single task by ID | `id` route param | 200 / 404 |
| `POST` | `/tasks` | Create a new task | `{ title, date, startTime, endTime, priority, description }` | 201 / 400 |
| `PUT` | `/tasks/:id` | Update existing task | Partial or full task body | 200 / 404 |
| `PATCH`| `/tasks/:id/toggle` | Toggle status (open ↔ completed) | None | 200 / 404 |
| `DELETE`| `/tasks/:id` | Delete task by ID | `id` route param | 200 / 404 |

### Sample Response (`GET /api/tasks/week?weekStart=2026-11-09`)
```json
{
  "success": true,
  "count": 4,
  "weekStart": "2026-11-09T00:00:00.000Z",
  "weekEnd": "2026-11-15T23:59:59.999Z",
  "progress": 50,
  "completedCount": 2,
  "openCount": 2,
  "data": [
    {
      "_id": "6af83e5d37146096231cdebe",
      "title": "Finishing Wireframe",
      "description": "Complete mobile app wireframes in Figma",
      "date": "2026-11-12T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "11:00",
      "priority": "high",
      "status": "open",
      "createdAt": "2026-11-14T10:45:00.000Z",
      "weekStart": "2026-11-09T00:00:00.000Z"
    }
  ]
}
```

---

## 💡 Key Technical Decisions & Interview Guide

### 1. Weekly Grouping (Monday to Sunday)
- **Problem**: JavaScript's native `Date.prototype.getDay()` treats Sunday as index `0` and Monday as index `1`. Standard weekly views often erroneously split weekends across adjacent weeks.
- **Solution**:
  - In MongoDB aggregation (`getWeeklySummary`), we compute the ISO day offset:
    `isoDayOffset = dayOfWeek === 1 (Sunday) ? 6 : dayOfWeek - 2`.
    Subtracting this offset truncates any date precisely to the Monday of its week.
  - On the frontend (`dateHelpers.js`), `startOfWeek(date, { weekStartsOn: 1 })` guarantees strict Monday-to-Sunday grouping.

### 2. Optimistic UI Updates
- **Decision**: When toggling a task's status or deleting an item, the local React state updates immediately before awaiting the server response.
- **Why**: Eliminates perceived network latency, providing a snappy mobile experience. If the network call fails, the change is reverted and an error toast is displayed.

### 3. Separation of Concerns & Custom Hook (`useTasks`)
- **Decision**: All API interactions, caching, error handling, and state synchronization are encapsulated inside `useTasks.js`.
- **Why**: Keeps page components (`HomePage.jsx`, `SearchPage.jsx`) purely presentational, dramatically improving testability and code readability.

### 4. Debounced Live Search
- **Decision**: The search input uses a 300ms debounce timer before dispatching requests to `/api/tasks/search?q=...`.
- **Why**: Prevents flooding the database with queries on every keystroke while delivering instant feedback to the user.

### 5. Swipe-to-Delete Implementation
- **Decision**: Implemented with Framer Motion (`drag="x"` constrained between `-75px` and `0px`).
- **Why**: Satisfies requirement 4.4 natively on mobile touchscreens without bulky third-party swipe libraries. A static trash icon is also maintained for desktop mouse accessibility.

---

## 🌐 Deployment Guide

### Deploying Frontend (Vercel)
1. Push your code to GitHub.
2. In [Vercel](https://vercel.com), import your repository.
3. Set the **Root Directory** to `client`.
4. Configure environment variable:
   `VITE_API_URL=https://your-backend-api.onrender.com/api`
5. Click **Deploy**.

### Deploying Backend (Render / Railway)
1. In [Render](https://render.com), create a new **Web Service**.
2. Set the **Root Directory** to `server`.
3. Set the **Build Command** to `npm install`.
4. Set the **Start Command** to `node server.js`.
5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://...` (your MongoDB Atlas URI)
   - `CLIENT_URL=https://your-frontend.vercel.app`
6. Click **Create Web Service**.

---

## 👨‍💻 Author
- **Role**: SDE-1 (MERN Stack)
- **Assignment**: To-Do List Mobile Web App
