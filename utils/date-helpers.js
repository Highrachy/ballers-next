import Humanize from 'humanize-plus';
import {
  parseISO,
  getTime as getElapsedTime,
  subDays,
  getHours,
  isPast,
  differenceInCalendarDays,
  isValid,
  fromUnixTime,
  format,
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
  dayDigits: 'dd',
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

export const dateFormatString = f;

export const parseDate = (dateInput) => {
  let parsedDate;

  // Check if the input is a number (timestamp)
  if (typeof dateInput === 'number') {
    // Convert the timestamp to a Date object
    parsedDate = fromUnixTime(dateInput / 1000); // Convert milliseconds to seconds
  } else if (typeof dateInput === 'string') {
    // Parse the ISO date string
    parsedDate = parseISO(dateInput);
  } else {
    parsedDate = dateInput;
  }
  return parsedDate;
};

export const formatDate = (date, dateFormat) => {
  const parsedDate = parseDate(date);

  if (isValid(parsedDate)) {
    return format(parsedDate, dateFormat);
  } else {
    return date;
  }
};

export const getDate = (date) =>
  formatDate(date, `${f.monthLongWords} ${f.day}, ${f.year}`);

export const getDateTime = (date) =>
  formatDate(
    date,
    `${f.dayOfWeek}, ${f.monthShortWords} ${f.day}, ${f.year} ${f.hours}:${f.minutesTwoDigits} ${f.am}`
  );
export const getShortDateTime = (date) =>
  formatDate(
    date,
    `${f.dayOfWeek} ${f.monthShortWords} ${f.year} ${f.hours}:${f.minutesTwoDigits} ${f.am}`
  );
export const getShortDate = (date) =>
  formatDate(
    date,
    `${f.dayOfWeekShort}, ${f.monthShortWords} ${f.day}, ${f.year}`
  );

export const getTinyDate = (date) =>
  formatDate(date, `${f.monthShortWords} ${f.day}, ${f.year}`);

export const getLongDate = (date) =>
  formatDate(
    date,
    `${f.dayOfWeek}, ${f.dayOrdinal} ${f.monthLongWords} ${f.year}`
  );

export const getYear = (date) => formatDate(date, `${f.year}`);

export const getTime = (date) =>
  formatDate(date, `${f.hours}:${f.minutesTwoDigits} ${f.am}`);

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
  formatDate(date, `${f.monthLongWords}, ${f.year}`);

export const isPastDate = (date) => isPast(parseISO(date));

export const differenceInDays = (date) =>
  differenceInCalendarDays(Date.now(), parseISO(date));

export const formatFilterDate = (date) =>
  formatDate(date, `${f.year}-${f.monthDigits}-${f.dayDigits}`);

export const convertToUTC = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();

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

export const getYearMonthDayObject = (
  dateInput = new Date(new Date().setDate(new Date().getDate() + 1))
) => {
  const date = new Date(dateInput);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};
