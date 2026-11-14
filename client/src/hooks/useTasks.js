import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  fetchTasksByWeek,
  fetchWeeklySummary,
  searchTasks as searchTasksAPI,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../utils/api';
import { getWeekStart, toAPIDateString } from '../utils/dateHelpers';

/**
 * useTasks – Custom hook managing all task state and CRUD operations.
 *
 * The backend wraps every response in { success, data, ... }.
 * API utils already call response.data, so we receive { success, data, ... } directly.
 * We extract the inner `data` field for tasks.
 *
 * Returns state (tasks, weeklySummary, loading) and handlers for all operations.
 */
const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState({
    completedCount: 0,
    openCount: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load tasks for a specific week (date determines which Mon–Sun range).
   * The /api/tasks/week endpoint returns { data: [...tasks], completedCount, openCount, progress }.
   */
  const loadTasksByWeek = useCallback(async (date = new Date()) => {
    setLoading(true);
    setError(null);
    try {
      const weekStart = getWeekStart(date);
      const result = await fetchTasksByWeek(toAPIDateString(weekStart));
      // result = { success, count, weekStart, weekEnd, progress, completedCount, openCount, data: [tasks] }
      const taskList = result.data || [];
      setTasks(taskList);
      setWeeklySummary({
        completedCount: result.completedCount || 0,
        openCount: result.openCount || 0,
        progress: result.progress || 0,
      });
      return taskList;
    } catch (err) {
      const msg = err.message || 'Failed to load tasks';
      setError(msg);
      setTasks([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reload weekly summary independently (used after CRUD operations).
   */
  const loadWeeklySummary = useCallback(async (date = new Date()) => {
    try {
      const weekStart = getWeekStart(date);
      const result = await fetchTasksByWeek(toAPIDateString(weekStart));
      setWeeklySummary({
        completedCount: result.completedCount || 0,
        openCount: result.openCount || 0,
        progress: result.progress || 0,
      });
    } catch {
      // Silent fail — summary is secondary
    }
  }, []);

  /**
   * Create a task → add to local state → refresh summary.
   */
  const handleCreate = useCallback(
    async (taskData, currentDate) => {
      setLoading(true);
      try {
        const result = await createTask(taskData);
        const newTask = result.data; // { success, data: newTask }
        toast.success('Task created successfully!');
        // Refresh the full week to keep everything in sync
        await loadTasksByWeek(currentDate || new Date());
        return newTask;
      } catch (err) {
        toast.error(err.message || 'Failed to create task');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadTasksByWeek]
  );

  /**
   * Update a task → replace in local state → refresh summary.
   */
  const handleUpdate = useCallback(
    async (id, taskData, currentDate) => {
      setLoading(true);
      try {
        const result = await updateTask(id, taskData);
        const updated = result.data;
        toast.success('Task updated successfully!');
        await loadTasksByWeek(currentDate || new Date());
        return updated;
      } catch (err) {
        toast.error(err.message || 'Failed to update task');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadTasksByWeek]
  );

  /**
   * Delete a task → remove from local state → refresh summary.
   */
  const handleDelete = useCallback(
    async (id, currentDate) => {
      try {
        await deleteTask(id);
        // Optimistic removal for instant UI feedback
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success('Task deleted!');
        await loadWeeklySummary(currentDate || new Date());
      } catch (err) {
        toast.error(err.message || 'Failed to delete task');
        // Revert by reloading
        await loadTasksByWeek(currentDate || new Date());
      }
    },
    [loadWeeklySummary, loadTasksByWeek]
  );

  /**
   * Toggle task status (open ↔ completed) with optimistic UI update.
   */
  const handleToggle = useCallback(
    async (id, currentDate) => {
      // Optimistic toggle
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, status: t.status === 'open' ? 'completed' : 'open' }
            : t
        )
      );

      try {
        const result = await toggleTaskStatus(id);
        const toggled = result.data;
        // Replace with server truth
        setTasks((prev) => prev.map((t) => (t._id === id ? toggled : t)));
        await loadWeeklySummary(currentDate || new Date());
      } catch (err) {
        // Revert on failure
        setTasks((prev) =>
          prev.map((t) =>
            t._id === id
              ? { ...t, status: t.status === 'open' ? 'completed' : 'open' }
              : t
          )
        );
        toast.error(err.message || 'Failed to update status');
      }
    },
    [loadWeeklySummary]
  );

  /**
   * Search tasks by keyword → returns results (doesn't set main task list).
   */
  const handleSearch = useCallback(async (query) => {
    if (!query || !query.trim()) return [];
    setLoading(true);
    try {
      const result = await searchTasksAPI(query.trim());
      return result.data || [];
    } catch (err) {
      toast.error(err.message || 'Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    weeklySummary,
    loading,
    error,
    loadTasksByWeek,
    loadWeeklySummary,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggle,
    handleSearch,
  };
};

export default useTasks;
