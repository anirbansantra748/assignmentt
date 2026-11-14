import axios from 'axios';

/**
 * Axios instance configured with base URL and interceptors.
 * In development, Vite's proxy forwards /api requests to the backend.
 */
/**
 * Compute normalized base API URL:
 * - If VITE_API_URL is provided, normalize and use it.
 * - In production (Vercel), default directly to your live Render backend URL.
 * - In local development, default to '/api' (handled by Vite dev proxy).
 */
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    let url = envUrl.trim().replace(/\/+$/, '');
    if (url.startsWith('http') && !url.endsWith('/api')) {
      url += '/api';
    }
    return url;
  }
  // Production fallback directly to live Render service
  if (import.meta.env.PROD) {
    return 'https://assignmentt-tcva.onrender.com/api';
  }
  // Local development fallback
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45s to allow for Render free-tier cold start on initial request
});

/* ===== Request Interceptor ===== */
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/* ===== Response Interceptor ===== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    console.error('[API Error Details]', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message,
    });

    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

/* ===== API Functions ===== */

/**
 * Fetch all tasks.
 * GET /api/tasks
 */
export const fetchAllTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

/**
 * Fetch tasks for a specific week.
 * GET /api/tasks/week?weekStart=YYYY-MM-DD
 * @param {string} weekStart - ISO date string for the week's start (Monday)
 */
export const fetchTasksByWeek = async (weekStart) => {
  const { data } = await api.get('/tasks/week', {
    params: { weekStart },
  });
  return data;
};

/**
 * Fetch weekly summary (completed / pending counts).
 * GET /api/tasks/weekly-summary
 */
export const fetchWeeklySummary = async () => {
  const { data } = await api.get('/tasks/weekly-summary');
  return data;
};

/**
 * Search tasks by query string.
 * GET /api/tasks/search?q=...
 * @param {string} query - Search term
 */
export const searchTasks = async (query) => {
  const { data } = await api.get('/tasks/search', {
    params: { q: query },
  });
  return data;
};

/**
 * Create a new task.
 * POST /api/tasks
 * @param {Object} taskData - Task payload
 */
export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

/**
 * Update an existing task.
 * PUT /api/tasks/:id
 * @param {string} id - Task ID
 * @param {Object} taskData - Updated task payload
 */
export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data;
};

/**
 * Delete a task.
 * DELETE /api/tasks/:id
 * @param {string} id - Task ID
 */
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

/**
 * Toggle a task's completion status.
 * PATCH /api/tasks/:id/toggle
 * @param {string} id - Task ID
 */
export const toggleTaskStatus = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/toggle`);
  return data;
};

export default api;
