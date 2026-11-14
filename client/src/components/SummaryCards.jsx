import { memo } from 'react';
import { CheckSquare, XSquare } from 'lucide-react';

/**
 * SummaryCards – Displays open vs completed task counts for the week.
 *
 * Requirements:
 *  - Each week's card shows: Number of Open Tasks, Number of Completed Tasks
 *  - Clicking on a week's card expands/filters tasks for that week
 *  - Formatted with 2-digit numbers (e.g. 50, 08) matching Figma design
 *
 * Props:
 *  - completedCount : number
 *  - pendingCount   : number
 *  - activeFilter   : 'all' | 'completed' | 'pending'
 *  - onFilterChange : (filter: 'all' | 'completed' | 'pending') => void
 */
const SummaryCards = ({
  completedCount = 0,
  pendingCount = 0,
  activeFilter = 'all',
  onFilterChange = () => {},
}) => {
  // Format numbers to 2 digits matching Figma design ("50", "08", "00")
  const formatCount = (num) => String(num ?? 0).padStart(2, '0');

  return (
    <div className="grid grid-cols-2 gap-4 py-3">
      {/* ─── Task Complete Card (Blue tint) ────────────────────────── */}
      <button
        type="button"
        onClick={() =>
          onFilterChange(activeFilter === 'completed' ? 'all' : 'completed')
        }
        className={`bg-[#EEF2FF] rounded-2xl p-4 flex flex-col gap-1.5 text-left transition-all duration-200
          hover:shadow-md active:scale-[0.98] relative overflow-hidden
          ${
            activeFilter === 'completed'
              ? 'ring-2 ring-primary shadow-md bg-[#E4EAFF]'
              : 'hover:bg-[#E8EDFF]'
          }`}
        aria-label="Filter completed tasks this week"
      >
        {/* Checkbox icon inside white rounded square */}
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <CheckSquare size={20} className="text-primary stroke-[2.2]" />
        </div>

        <p className="text-xs text-gray-600 font-medium mt-1">Task Complete</p>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {formatCount(completedCount)}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">This Week</p>
          {activeFilter === 'completed' && (
            <span className="text-[10px] font-semibold text-primary bg-white/80 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
      </button>

      {/* ─── Task Pending Card (Pink tint) ─────────────────────────── */}
      <button
        type="button"
        onClick={() =>
          onFilterChange(activeFilter === 'pending' ? 'all' : 'pending')
        }
        className={`bg-[#FFF1F0] rounded-2xl p-4 flex flex-col gap-1.5 text-left transition-all duration-200
          hover:shadow-md active:scale-[0.98] relative overflow-hidden
          ${
            activeFilter === 'pending'
              ? 'ring-2 ring-red-400 shadow-md bg-[#FFE4E2]'
              : 'hover:bg-[#FFEAE8]'
          }`}
        aria-label="Filter pending tasks this week"
      >
        {/* X icon inside white rounded square */}
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <XSquare size={20} className="text-red-500 stroke-[2.2]" />
        </div>

        <p className="text-xs text-gray-600 font-medium mt-1">Task Pending</p>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {formatCount(pendingCount)}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">This Week</p>
          {activeFilter === 'pending' && (
            <span className="text-[10px] font-semibold text-red-500 bg-white/80 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default memo(SummaryCards);
