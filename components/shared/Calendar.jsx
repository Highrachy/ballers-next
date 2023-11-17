import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
} from 'date-fns';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const eventData = [
  {
    date: '2023-11-10',
    label: 'Meeting',
    user: { name: 'John Doe', avatar: 'JD' },
  },
  {
    date: '2023-11-15',
    label: 'Gym',
    user: { name: 'Alice Smith', avatar: 'AS' },
  },
  {
    date: '2023-11-15',
    label: 'Yoga',
    user: { name: 'Robert Johnson', avatar: 'RJ' },
  },
  {
    date: '2023-11-15',
    label: 'Dinner with Friends',
    user: { name: 'Michael Anderson', avatar: 'MA' },
  },
  {
    date: '2023-11-20',
    label: 'Doctor',
    user: { name: 'Emily Brown', avatar: 'EB' },
  },
  {
    date: '2023-11-20',
    label: 'Shopping',
    user: { name: 'Sophia Garcia', avatar: 'SG' },
  },
  {
    date: '2023-11-20',
    label: 'Movies',
    user: { name: 'William Wilson', avatar: 'WW' },
  },
  {
    date: '2023-11-25',
    label: 'Lunch',
    user: { name: 'Olivia Taylor', avatar: 'OT' },
  },
  {
    date: '2023-11-30',
    label: 'Long Event with a Very Long Name that Needs to be Truncated',
    user: { name: 'Christopher Clark', avatar: 'CC' },
  },
  {
    date: '2023-11-30',
    label: 'Another Long Event with a Very Long Name',
    user: { name: 'Emma Turner', avatar: 'ET' },
  },
  {
    date: '2023-11-30',
    label: 'Third Long Event Name for Example',
    user: { name: 'Daniel Moore', avatar: 'DM' },
  },
  // Add more events as needed
];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCurrentMonthLink, setShowCurrentMonthLink] = useState(false);

  const prevMonth = () => {
    setShowCurrentMonthLink(true);
    setCurrentMonth((prev) => addMonths(prev, -1));
  };

  const nextMonth = () => {
    setShowCurrentMonthLink(false);
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const monthDays = [];
  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfWeek(endOfMonth(currentMonth));

  let day = start;

  while (day <= end) {
    for (let i = 0; i < 7; i++) {
      monthDays.push(day);
      day = addDays(day, 1);
    }
  }

  const dateFormat = 'd';

  const getEventsForDay = (date) => {
    return eventData.filter((item) => item.date === format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="container mt-4">
      <div className="row align-items-center">
        <div className="col-4 text-start">
          {showCurrentMonthLink && (
            <button
              className="btn btn-secondary me-2"
              onClick={() => setCurrentMonth(new Date())}
            >
              Back to Current Month
            </button>
          )}
          <button className="btn btn-secondary" onClick={prevMonth}>
            <BsChevronLeft />
          </button>
        </div>
        <div className="col-4 text-center">
          <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        </div>
        <div className="col-4 text-end">
          <button className="btn btn-secondary" onClick={nextMonth}>
            <BsChevronRight />
          </button>
        </div>
      </div>
      <div className="row mt-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="col text-center bg-light p-2">
            <strong>{day}</strong>
          </div>
        ))}
      </div>
      {Array.from({ length: Math.ceil(monthDays.length / 7) }, (_, i) => (
        <div key={i} className="row mt-2">
          {monthDays.slice(i * 7, i * 7 + 7).map((day, idx) => {
            const isDayInCurrentMonth = isSameMonth(day, currentMonth);
            const isDayBeforeCurrentMonth = isBefore(
              day,
              startOfMonth(currentMonth)
            );
            const isToday = isSameDay(day, new Date());
            const eventsForDay = getEventsForDay(day);

            return (
              <div
                key={idx}
                className={`col text-center ${
                  !isDayInCurrentMonth ? 'text-muted' : ''
                } p-3 border ${isToday ? 'border-primary' : ''}`}
              >
                <div className="d-flex flex-column">
                  <span className={`${isToday ? 'fw-bold' : ''}`}>
                    {format(day, dateFormat)}
                  </span>
                  {isDayBeforeCurrentMonth && (
                    <span className="text-gray"> {format(day, 'MMM')}</span>
                  )}
                  {eventsForDay.map((event, index) => (
                    <span
                      key={index}
                      className={`badge ${
                        index > 0 ? 'bg-danger' : 'bg-warning'
                      } mt-2`}
                      title={event.label}
                    >
                      {event.user.avatar}
                    </span>
                  ))}
                  {eventsForDay.length > 1 && (
                    <span className="badge bg-info mt-2">
                      +{eventsForDay.length - 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
