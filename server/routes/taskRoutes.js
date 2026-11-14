const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
  getWeeklySummary,
  getTasksByWeek,
  toggleTaskStatus,
} = require('../controllers/taskController');

// --- Static routes MUST come before parameterized :id routes ---

// GET /api/tasks/search?q=keyword — Search tasks by title/description
router.get('/search', searchTasks);

// GET /api/tasks/weekly-summary — Weekly summary with open/completed counts
router.get('/weekly-summary', getWeeklySummary);

// GET /api/tasks/week?weekStart=2024-01-01 — Get tasks for a specific week
router.get('/week', getTasksByWeek);

// --- Standard CRUD routes ---

// GET /api/tasks — Get all tasks
router.get('/', getAllTasks);

// POST /api/tasks — Create a new task
router.post('/', createTask);

// GET /api/tasks/:id — Get a single task by ID
router.get('/:id', getTaskById);

// PUT /api/tasks/:id — Update a task
router.put('/:id', updateTask);

// PATCH /api/tasks/:id/toggle — Toggle task status (open ↔ completed)
router.patch('/:id/toggle', toggleTaskStatus);

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
