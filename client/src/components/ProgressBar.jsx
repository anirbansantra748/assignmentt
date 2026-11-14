import { memo, useMemo } from 'react';

/**
 * ProgressBar – Visual progress indicator for weekly task completion.
 *
 * Matching Figma design:
 *  - Bold "Weekly Progress" heading
 *  - Wide horizontal pill bar with deep rich blue fill and soft periwinkle background
 *  - Percentage and count display
 *
 * Props:
 *  - completed : number
 *  - total     : number
 */
const ProgressBar = ({ completed = 0, total = 0 }) => {
  const percentage = useMemo(() => {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round((completed / total) * 100));
  }, [completed, total]);

  return (
    <div className="py-3">
      {/* Header with section title & percentage */}
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          Weekly Progress
        </h3>
        <span className="text-xs font-semibold text-gray-500">
          {percentage}% ({completed}/{total})
        </span>
      </div>

      {/* Pill Progress Bar */}
      <div className="w-full h-4 bg-[#DEE2FD] rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="h-full bg-[#274396] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default memo(ProgressBar);
