import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { getWeekDays, isSameDate, getWeekStart, getWeekEnd } from '../utils/dateHelpers';

/**
 * WeekStrip – Horizontal strip showing Monday → Sunday for the active week.
 *
 * Requirements:
 *  - Weeks start on Monday and end on Sunday
 *  - Formatted with day abbreviation and 2-digit date (e.g. Mon 10, Wed 12)
 *  - Active/selected day highlighted with blue background and indicator dot
 *  - Previous/Next week navigation to browse any week's tasks
 *
 * Props:
 *  - selectedDate : Date – currently selected day
 *  - onSelectDate : (date: Date) => void
 */
const WeekStrip = ({ selectedDate, onSelectDate }) => {
  const weekDays = getWeekDays(selectedDate);
  const weekStart = getWeekStart(selectedDate);
  const weekEnd = getWeekEnd(selectedDate);

  const handlePrevWeek = () => {
    onSelectDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    onSelectDate(addWeeks(selectedDate, 1));
  };

  return (
    <div className="py-2">
      {/* ─── Week Range & Navigation ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Previous Week"
            aria-label="Previous Week"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onSelectDate(new Date())}
            className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-md hover:bg-primary-light transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handleNextWeek}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Next Week"
            aria-label="Next Week"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ─── Day Columns (Mon – Sun) ────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-1.5 justify-between">
        {weekDays.map((dayObj) => {
          const isSelected = isSameDate(dayObj.fullDate, selectedDate);
          const isToday = dayObj.isToday;
          const formattedDate = String(dayObj.date).padStart(2, '0');

          return (
            <button
              key={dayObj.fullDate.toISOString()}
              type="button"
              onClick={() => onSelectDate(dayObj.fullDate)}
              className={`
                flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl
                transition-all duration-200 ease-in-out select-none
                ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary/30 scale-[1.03]'
                    : isToday
                    ? 'bg-primary-light text-primary hover:bg-primary/10'
                    : 'text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              {/* Day name (Mon, Tue, etc.) */}
              <span
                className={`text-[11px] font-medium mb-1 ${
                  isSelected ? 'text-white/90' : 'text-gray-400'
                }`}
              >
                {dayObj.day}
              </span>

              {/* 2-digit Date number (09, 10, 11...) */}
              <span
                className={`text-sm font-bold leading-tight ${
                  isSelected ? 'text-white' : 'text-gray-800'
                }`}
              >
                {formattedDate}
              </span>

              {/* Indicator dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-colors ${
                  isSelected
                    ? 'bg-white'
                    : isToday
                    ? 'bg-primary'
                    : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(WeekStrip);
