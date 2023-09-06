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
const f = {
  year: 'yyyy',
  monthDigits: 'M',
  monthTwoDigits: 'MM',
  monthOrdinal: 'Mo',
  monthShortWords: 'MMM',
  monthLongWords: 'MMMM',
  day: 'd',
  dayDigitss: 'dd',
  dayOrdinal: 'do',
  dayOfWeek: 'EEEE',
  dayOfWeekShort: 'E',
  am: 'aaa',
  hours: 'h',
  hoursOrdinal: 'ho',
  hoursTwoDigits: 'hh',
  minutes: 'm',
  minutesOrdinal: 'mo',
  minutesTwoDigits: 'mm',
  seconds: 's',
  secondsOrdinal: 'so',
  secondsTwoDigits: 'ss',
};

export const getDate = (date) =>
  isValidDate(date)
    ? format(parseISO(date), `${f.monthLongWords} ${f.day}, ${f.year}`)
    : date;
export const getDateTime = (date) =>
  format(
    parseISO(date),
    `${f.dayOfWeek}, ${f.monthShortWords} ${f.day}, ${f.year} ${f.hours}:${f.minutesTwoDigits} ${f.am}`
  );
export const getShortDateTime = (date) =>
  format(
    parseISO(date),
    `${f.dayOfWeek} ${f.monthShortWords} ${f.year} ${f.hours}:${f.minutesTwoDigits} ${f.am}`
  );
export const getShortDate = (date) =>
  format(
    parseISO(date),
    `${f.dayOfWeekShort}, ${f.monthShortWords} ${f.day}, ${f.year}`
  );
export const getTinyDate = (date) =>
  isValidDate(date) &&
  format(parseISO(date), `${f.monthShortWords} ${f.day}, ${f.year}`);
export const getLongDate = (date) =>
  format(
    parseISO(date),
    `${dayOfWeek}, ${f.dayOrdinal} ${f.monthLongWords} ${f.year}`
  );
export const getYear = (date) => format(parseISO(date), `${f.year}`);
export const getTime = (date) =>
  format(parseISO(date), `${f.hours}:${f.minutesTwoDigits} ${f.am}`);
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

export const getMonthYear = (date) =>
  format(parseISO(date), `${f.monthLongWords}, ${f.year}`);
export const isPastDate = (date) => isPast(parseISO(date));
export const differenceInDays = (date) =>
  differenceInCalendarDays(Date.now(), parseISO(date));

export const formatFilterDate = (date) =>
  format(parseISO(date), `${f.year}-${f.monthDigits}-${f.dayDigits}`);
export const convertToUTC = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
export const isValidDate = (date) => isValid(parseISO(date));

export const getDateStatus = (
  date,
  successColor = 'success',
  dangerColor = 'danger'
) => {
  const days = Math.abs(differenceInDays(date)) || 0;
  const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
  const isOverdueDate = isPastDate(date);
  const statusColor = isOverdueDate ? dangerColor : successColor;
  const statusName = `${isOverdueDate ? 'Overdue' : 'Due'}: ${daysInWords}`;
  return { statusColor, statusName };
};
