import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday as dateFnsIsToday,
  isSameWeek,
  isSameDay,
} from 'date-fns';

/**
 * Get the start of the week (Monday) for a given date.
 * @param {Date} date - Reference date
 * @returns {Date} Monday of that week
 */
export const getWeekStart = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Get the end of the week (Sunday) for a given date.
 * @param {Date} date - Reference date
 * @returns {Date} Sunday of that week
 */
export const getWeekEnd = (date = new Date()) => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Get an array of day objects for the week containing the given date.
 * Week runs Monday → Sunday.
 *
 * @param {Date} date - Any date in the target week
 * @returns {Array<{day: string, date: number, fullDate: Date, isToday: boolean}>}
 */
export const getWeekDays = (date = new Date()) => {
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(date);

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return days.map((d) => ({
    day: format(d, 'EEE'),       // Mon, Tue, Wed ...
    date: d.getDate(),            // 1-31
    fullDate: d,
    isToday: dateFnsIsToday(d),
  }));
};

/**
 * Format a date as "Friday 14, January".
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDisplayDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, "EEEE dd, MMMM");
};

/**
 * Check if the given date falls in the current week (Mon-Sun).
 * @param {Date} date
 * @returns {boolean}
 */
export const isCurrentWeek = (date) => {
  return isSameWeek(date, new Date(), { weekStartsOn: 1 });
};

/**
 * Check if two dates are the same calendar day.
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export const isSameDate = (a, b) => {
  return isSameDay(a, b);
};

/**
 * Format a date for API consumption (YYYY-MM-DD).
 * @param {Date} date
 * @returns {string}
 */
export const toAPIDateString = (date) => {
  return format(date, 'yyyy-MM-dd');
};
