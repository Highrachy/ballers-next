import Humanize from 'humanize-plus';
import {
  format,
  parseISO,
  getTime as getElapsedTime,
  subDays,
  getHours,
  isPast,
  differenceInCalendarDays,
  isValid,
} from 'date-fns';

/**
 * Date and Time
 * @param {*} date
 */
export const getDate = (date) =>
  isValidDate(date) ? format(parseISO(date), 'MMMM dd, yyyy') : date;
export const getDateTime = (date) =>
  format(parseISO(date), 'ddd, MMM d, yyyy h:mm A');
export const getShortDateTime = (date) =>
  format(parseISO(date), 'Do MMM yyyy h:mm A');
export const getShortDate = (date) => format(parseISO(date), 'E, MMM d, yyyy');
export const getTinyDate = (date) =>
  isValidDate(date) && format(parseISO(date), 'MMM d, yyyy');
export const getLongDate = (date) =>
  format(parseISO(date), 'dddd, Do MMMM yyyy');
export const getYear = (date) => format(parseISO(date), 'yyyy');
export const getTime = (date) => format(parseISO(date), 'h:mm A');
export const subtractDays = (date, numOfDays) =>
  getElapsedTime(subDays(parseISO(date), numOfDays));
export const getTimeOfDay = (date) => {
  const hour = getHours(parseISO(date));
  return (
    (hour < 12 && 'Morning') ||
    (hour < 16 && 'Afternoon') ||
    (hour < 19 && 'Evening') ||
    'Night'
  );
};

export const getMonthYear = (date) => format(parseISO(date), 'MMMM, yyyy');
export const isPastDate = (date) => isPast(parseISO(date));
export const differenceInDays = (date) =>
  differenceInCalendarDays(Date.now(), parseISO(date));

export const formatFilterDate = (date) => format(parseISO(date), 'yyyy-MM-DD');
export const convertToUTC = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
export const isValidDate = (date) => isValid(parseISO(date));

export const getDateStatus = (date, successColor = 'success') => {
  const days = Math.abs(differenceInDays(date)) || 0;
  const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
  const isOverdueDate = isPastDate(date);
  const statusColor = isOverdueDate ? 'danger' : successColor;
  const statusName = `${isOverdueDate ? 'Overdue' : 'Due'}: ${daysInWords}`;
  return { statusColor, statusName };
};
