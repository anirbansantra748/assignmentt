import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { formatDisplayDate } from '../utils/dateHelpers';

/**
 * TaskModal – Bottom sheet modal for creating and updating tasks.
 *
 * Matching Figma Screen 3:
 *  - "Add New Task" / "Edit Task" header with close X button
 *  - "Task title" input (mandatory)
 *  - "Set Time" with two inputs: "Start" and "Ends" (mandatory)
 *  - "Set Date" with date picker showing e.g. "Friday 14, January" and calendar icon (mandatory)
 *  - "Priority" pills (Low, Medium, High)
 *  - "Description" textarea (optional)
 *  - "Create task" / "Update task" full-width blue button
 *
 * Props:
 *  - isOpen      : boolean
 *  - onClose     : () => void
 *  - onSubmit    : (formData: Object) => Promise<void>
 *  - editingTask : task object | null
 */
const TaskModal = ({ isOpen, onClose, onSubmit, editingTask = null }) => {
  const isEditMode = editingTask !== null;

  /* ===== Form State ===== */
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Populate fields when editing ===== */
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setStartTime(editingTask.startTime || '');
      setEndTime(editingTask.endTime || '');
      setDate(
        editingTask.date
          ? format(new Date(editingTask.date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd')
      );
      setPriority(editingTask.priority || 'medium');
      setDescription(editingTask.description || '');
      setErrors({});
    } else {
      setTitle('');
      setStartTime('');
      setEndTime('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setPriority('medium');
      setDescription('');
      setErrors({});
    }
    setIsSubmitting(false);
  }, [editingTask, isOpen]);

  /* ===== Form Validation ===== */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, date]);

  /* ===== Submit Handler ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        date,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        priority,
        description: description.trim() || undefined,
      };

      await onSubmit(payload);
    } catch {
      // Error notification handled by caller
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== Formatted date display ===== */
  const displayDate = date
    ? formatDisplayDate(new Date(date + 'T00:00:00'))
    : 'Select a date';

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Bottom sheet modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] shadow-2xl
              max-w-md mx-auto max-h-[92vh] overflow-y-auto"
          >
            {/* Top pill bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-2 pb-4">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {isEditMode ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-4">
              {/* 1. Task Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Task title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Doing Homework"
                  maxLength={100}
                  className={`w-full px-4 py-3.5 text-sm bg-gray-50 border rounded-2xl
                    placeholder-gray-400 transition-all focus:bg-white focus:outline-none
                    ${
                      errors.title
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
                    }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* 2. Set Time (Start and Ends side-by-side) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Set Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Start time */}
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl
                        focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    />
                    {!startTime && (
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                        Start
                      </span>
                    )}
                  </div>

                  {/* End time */}
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl
                        focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    />
                    {!endTime && (
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                        Ends
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Set Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Set Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-4 pr-10 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl
                      focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                  <Calendar
                    size={17}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {date && (
                  <p className="text-xs text-primary font-medium mt-1">
                    {displayDate}
                  </p>
                )}
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              {/* 4. Priority Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map((p) => {
                    const isSelected = priority === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-semibold
                          border transition-all duration-150
                          ${
                            isSelected
                              ? 'border-primary bg-primary text-white shadow-sm shadow-primary/30'
                              : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-white' : p.color
                          }`}
                        />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add Description"
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl
                    placeholder-gray-400 resize-none focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-primary text-white text-base font-semibold rounded-2xl
                  shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-[0.98] transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update task'
                  : 'Create task'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
