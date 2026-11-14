import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSameDay } from 'date-fns';
import { Search, Settings, Bell } from 'lucide-react';
import WeekStrip from '../components/WeekStrip';
import SummaryCards from '../components/SummaryCards';
import ProgressBar from '../components/ProgressBar';
import TaskList from '../components/TaskList';
import FloatingActionButton from '../components/FloatingActionButton';
import TaskModal from '../components/TaskModal';
import useTasks from '../hooks/useTasks';

/**
 * HomePage – Primary Dashboard reproducing Figma Screen 2.
 *
 * Responsiveness:
 *  - Fills the 430px mobile viewport cleanly across all screen sizes.
 *  - Retains all visual styling and interaction flows from the Figma specification.
 */
const HomePage = () => {
  const navigate = useNavigate();

  // Local UI State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isViewingAll, setIsViewingAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'pending'

  // Task state and operations from custom hook
  const {
    tasks,
    weeklySummary,
    loading,
    loadTasksByWeek,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggle,
  } = useTasks();

  // Load tasks on mount and whenever the selected week changes
  useEffect(() => {
    loadTasksByWeek(selectedDate);
  }, [selectedDate, loadTasksByWeek]);

  // ─── Filtered Tasks ──────────────────────────────────────────────
  const displayedTasks = useMemo(() => {
    let result = tasks;

    // Filter by card selection (completed vs pending) if set
    if (statusFilter === 'completed') {
      result = result.filter((t) => t.status === 'completed');
    } else if (statusFilter === 'pending') {
      result = result.filter((t) => t.status === 'open');
    } else if (!isViewingAll) {
      // By default (when filter is 'all' and not viewing all week), show tasks for selectedDate
      result = result.filter((task) => {
        if (!task.date) return false;
        return isSameDay(new Date(task.date), selectedDate);
      });
    }

    return result;
  }, [tasks, selectedDate, isViewingAll, statusFilter]);

  // Section title based on current filter
  const sectionTitle = useMemo(() => {
    if (statusFilter === 'completed') return 'Completed Tasks This Week';
    if (statusFilter === 'pending') return 'Pending Tasks This Week';
    if (isViewingAll) return 'All Tasks This Week';
    return 'Tasks Today';
  }, [statusFilter, isViewingAll]);

  // ─── Handlers ────────────────────────────────────────────────────
  const handleSelectDate = useCallback((date) => {
    setSelectedDate(date);
    setStatusFilter('all');
    setIsViewingAll(false);
  }, []);

  const handleCardFilterChange = useCallback((filter) => {
    setStatusFilter(filter);
    if (filter !== 'all') {
      setIsViewingAll(true);
    }
  }, []);

  const handleToggleViewAll = useCallback(() => {
    setIsViewingAll((prev) => !prev);
    setStatusFilter('all');
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingTask(null);
  }, []);

  const handleSubmit = useCallback(
    async (formData) => {
      if (editingTask) {
        await handleUpdate(editingTask._id, formData, selectedDate);
      } else {
        await handleCreate(formData, selectedDate);
      }
      closeModal();
    },
    [editingTask, handleUpdate, handleCreate, closeModal, selectedDate]
  );

  const onDelete = useCallback(
    (id) => {
      handleDelete(id, selectedDate);
    },
    [handleDelete, selectedDate]
  );

  const onToggle = useCallback(
    (id) => {
      handleToggle(id, selectedDate);
    },
    [handleToggle, selectedDate]
  );

  const completedCount = weeklySummary.completedCount ?? 0;
  const pendingCount = weeklySummary.openCount ?? 0;
  const totalCount = completedCount + pendingCount;

  return (
    <div className="flex-1 flex flex-col bg-white px-5 pt-2 pb-28 relative w-full">
      {/* ─── 1. Header (Settings & Notifications) ──────────────────── */}
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          aria-label="Settings"
        >
          <Settings size={22} />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Search"
          >
            <Search size={22} />
          </button>
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* ─── 2. Search Bar (Figma Screen 2 top element) ───────────── */}
      <div
        onClick={() => navigate('/search')}
        className="relative my-2.5 cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
        aria-label="Search for a task"
      >
        <div className="w-full pl-4 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl
          text-sm text-gray-400 group-hover:border-gray-300 group-hover:shadow-sm transition-all flex items-center">
          Search for a task
        </div>
        <Search
          size={19}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 pointer-events-none stroke-[2.2]"
        />
      </div>

      {/* ─── 3. Week Strip (Mon – Sun) ────────────────────────────── */}
      <WeekStrip
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      {/* ─── 4. Task Summary Cards ─────────────────────────────────── */}
      <SummaryCards
        completedCount={completedCount}
        pendingCount={pendingCount}
        activeFilter={statusFilter}
        onFilterChange={handleCardFilterChange}
      />

      {/* ─── 5. Weekly Progress Bar ───────────────────────────────── */}
      <ProgressBar completed={completedCount} total={totalCount} />

      {/* ─── 6. Tasks List (Today / Weekly / Filtered) ────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <TaskList
          tasks={displayedTasks}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={openEditModal}
          title={sectionTitle}
          onViewAll={handleToggleViewAll}
          isViewingAll={isViewingAll || statusFilter !== 'all'}
        />
      )}

      {/* ─── 7. Floating Action Button (+) ────────────────────────── */}
      <FloatingActionButton onClick={openCreateModal} />

      {/* ─── 8. Task Create/Edit Modal ────────────────────────────── */}
      <TaskModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingTask={editingTask}
      />
    </div>
  );
};

export default HomePage;
