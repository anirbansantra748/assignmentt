import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Pencil, Clock } from 'lucide-react';

/**
 * TaskItem – Single task item row.
 *
 * Requirements:
 *  - Checkbox: unchecked = blue outline square, checked = blue filled square with checkmark
 *  - Title: strikethrough text when completed
 *  - Edit & Delete buttons
 *  - Swipe left to reveal Delete button (User Flow 4.4)
 *  - Priority badge (Low, Medium, High)
 *  - Scheduled time display (Start - End)
 *
 * Props:
 *  - task     : { _id, title, description, status, priority, startTime, endTime, date }
 *  - onToggle : (id: string) => void
 *  - onDelete : (id: string) => void
 *  - onEdit   : (task: Object) => void
 */
const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const isCompleted = task.status === 'completed';

  // Priority color styles
  const priorityStyles = {
    high: 'bg-red-50 text-red-600 border border-red-200',
    medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    low: 'bg-green-50 text-green-700 border border-green-200',
  };

  const priorityLabel = task.priority
    ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    : null;

  return (
    <div className="relative overflow-hidden my-1 rounded-xl group">
      {/* ─── Swipe-to-delete background action ─────────────────────── */}
      <div className="absolute inset-y-0 right-0 w-20 bg-red-500 rounded-r-xl flex items-center justify-center">
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          className="w-full h-full flex flex-col items-center justify-center text-white text-[11px] font-semibold"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>

      {/* ─── Draggable task foreground item ────────────────────────── */}
      <motion.div
        layout
        drag="x"
        dragConstraints={{ left: -75, right: 0 }}
        dragElastic={0.1}
        className="relative bg-white flex items-center gap-3 py-3.5 px-2 border-b border-gray-100 transition-colors"
      >
        {/* Checkbox button */}
        <button
          type="button"
          onClick={() => onToggle(task._id)}
          className="flex-shrink-0 transition-transform active:scale-90"
          aria-label={isCompleted ? 'Mark as open' : 'Mark as completed'}
        >
          {isCompleted ? (
            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <Check size={14} className="text-white stroke-[3]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-md border-2 border-primary hover:border-primary-dark transition-colors" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0 pr-1">
          <p
            className={`text-sm font-medium tracking-tight truncate transition-all duration-200 ${
              isCompleted
                ? 'line-through text-gray-400'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </p>

          {/* Time & Priority metadata */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {(task.startTime || task.endTime) && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                <Clock size={11} />
                {task.startTime || 'Anytime'}
                {task.endTime && ` - ${task.endTime}`}
              </span>
            )}

            {priorityLabel && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                  priorityStyles[task.priority] || 'bg-gray-100 text-gray-500'
                }`}
              >
                {priorityLabel}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons (Delete & Edit) */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Delete Icon */}
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={17} className="stroke-[1.8]" />
          </button>

          {/* Edit Icon */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-light transition-colors"
            title="Edit task"
            aria-label="Edit task"
          >
            <Pencil size={17} className="stroke-[1.8]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(TaskItem);
