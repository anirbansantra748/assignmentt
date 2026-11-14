import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ClipboardList } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import useTasks from '../hooks/useTasks';

/**
 * SearchPage – Full-screen search reproducing Figma Screen 4.
 *
 * Responsiveness:
 *  - Fills the 430px mobile viewport cleanly across all screen sizes.
 */
const SearchPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    loading,
    handleSearch,
    handleToggle,
    handleDelete,
    handleUpdate,
  } = useTasks();

  // Focus search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await handleSearch(query);
      setResults(data);
      setSearched(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Toggle status in search results
  const onToggle = useCallback(
    async (id) => {
      // Optimistic update
      setResults((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, status: t.status === 'completed' ? 'open' : 'completed' }
            : t
        )
      );
      await handleToggle(id);
    },
    [handleToggle]
  );

  // Delete task from search results
  const onDelete = useCallback(
    async (id) => {
      await handleDelete(id);
      setResults((prev) => prev.filter((t) => t._id !== id));
    },
    [handleDelete]
  );

  // Edit task from search results
  const onEdit = useCallback((task) => {
    setEditingTask(task);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingTask(null);
  }, []);

  const handleModalSubmit = useCallback(
    async (formData) => {
      if (editingTask) {
        const updated = await handleUpdate(editingTask._id, formData);
        setResults((prev) =>
          prev.map((t) => (t._id === editingTask._id ? updated : t))
        );
      }
      closeModal();
    },
    [editingTask, handleUpdate, closeModal]
  );

  return (
    <div className="flex-1 flex flex-col bg-white px-5 py-3 w-full">
      {/* Top Header: Back Arrow */}
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="stroke-[2.2]" />
        </button>
        <h2 className="text-base font-bold text-gray-900">Search Tasks</h2>
      </div>

      {/* Search input bar matching Figma Screen 4 */}
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a task"
          className="w-full pl-4 pr-11 py-3.5 text-sm bg-white border border-gray-200
            rounded-2xl placeholder-gray-400 shadow-sm focus:outline-none focus:border-primary
            focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <Search
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 pointer-events-none stroke-[2.2]"
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Search Results */}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium px-1">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <div className="divide-y divide-gray-50">
            <AnimatePresence mode="popLayout">
              {results.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty state: searched but no results */}
      {!loading && searched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-center">
          <ClipboardList size={44} strokeWidth={1.5} className="mb-2 text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">No tasks found</p>
          <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
            No tasks matched "{query}". Try checking your spelling or using different keywords.
          </p>
        </div>
      )}

      {/* Initial state: no search query entered yet */}
      {!loading && !searched && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
          <Search size={44} strokeWidth={1.5} className="mb-2 text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">Find your tasks</p>
          <p className="text-xs text-gray-400 mt-1">
            Search by title or description keywords
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        editingTask={editingTask}
      />
    </div>
  );
};

export default SearchPage;
