import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import TaskItem from './TaskItem';

/**
 * TaskList – Container for task items with section header and "View All" button.
 *
 * Props:
 *  - tasks        : Task[]
 *  - onToggle     : (id: string) => void
 *  - onDelete     : (id: string) => void
 *  - onEdit       : (task: Object) => void
 *  - title        : string
 *  - onViewAll    : () => void
 *  - isViewingAll : boolean
 */
const TaskList = ({
  tasks = [],
  onToggle,
  onDelete,
  onEdit,
  title = 'Tasks Today',
  onViewAll,
  isViewingAll = false,
}) => {
  return (
    <div className="py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          {title}
        </h3>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            {isViewingAll ? 'Show Today Only' : 'View All'}
          </button>
        )}
      </div>

      {/* Task list or empty state */}
      {tasks.length > 0 ? (
        <div className="divide-y divide-gray-50">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200 my-2">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2.5 text-gray-400">
            <ClipboardList size={24} strokeWidth={1.8} />
          </div>
          <p className="text-sm font-semibold text-gray-700">No tasks found</p>
          <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
            {isViewingAll
              ? 'No tasks scheduled for this week yet.'
              : 'No tasks scheduled for this day. Tap + to add one!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(TaskList);
