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
import Humanize from 'humanize-plus';
/**
 * Date and Time
 * @param {*} date
 */
// https://date-fns.org/v2.29.3/docs/format
export const getDate = (date) =>
  isValidDate(date) ? format(parseISO(date), 'LLLL do, yyyy') : date;
export const getDateTime = (date) =>
  format(parseISO(date), 'do, LLLL yyyy h:mm b');
export const getShortDateTime = (date) =>
  format(parseISO(date), 'do LLL yyyy h:mm b');
export const getShortDate = (date) => format(parseISO(date), 'do LLL yyyy');
export const getTinyDate = (date) =>
  isValidDate(date) && format(parseISO(date), 'LLL e, yyyy');
export const getLongDate = (date) =>
  format(parseISO(date), 'EEEE, do LLLL yyyy');
export const getYear = (date) => format(parseISO(date), 'yyyy');
export const getTime = (date) => format(parseISO(date), 'h:mm b');
export const subtractDays = (date, numOfDays) =>
  getElapsedTime(subDays(date, numOfDays));
export const getTimeOfDay = (date) => {
  const hour = getHours(date);
  return (
    (hour < 12 && 'Morning') ||
    (hour < 16 && 'Afternoon') ||
    (hour < 19 && 'Evening') ||
    'Night'
  );
};
export const isPastDate = (date) => isPast(parseISO(date));
export const differenceInDays = (date) =>
  differenceInCalendarDays(Date.now(), parseISO(date));

export const formatFilterDate = (date) => format(parseISO(date), 'YYYY-L-D');
export const convertToUTC = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
export const isValidDate = (date) => isValid(parseISO(date));

export const getDateStatus = (date, successColor = '') => {
  const days = Math.abs(differenceInDays(date)) || 0;
  const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
  const isOverdueDate = isPastDate(date);
  const statusColor = isOverdueDate ? 'danger' : successColor || 'success';
  const statusName = `${isOverdueDate ? 'Overdue' : 'Due'}: ${daysInWords}`;
  return { statusColor, statusName };
};
