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
];

const Calendar = ({ scheduledVisits }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCurrentMonthLink, setShowCurrentMonthLink] = useState(false);
  const visitations = scheduledVisits?.map((event) => {
    const { visitDate, propertyInfo, visitorName } = event;

    const { name } = propertyInfo[0]; // Assuming there's only one property info object

    const username = visitorName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('');

    return {
      date: visitDate.split('T')[0],
      label: name,
      user: {
        name: visitorName,
        avatar: username.toUpperCase(),
      },
    };
  });

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
    return visitations.filter(
      (item) => item.date === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="container mt-4">
      <div className="row align-items-center">
        <div className="col-4 text-start">
          {showCurrentMonthLink && (
            <button
              className="btn btn-secondary-light me-2"
              onClick={() => setCurrentMonth(new Date())}
            >
              Back to Current Month
            </button>
          )}
          <button className="btn btn-secondary-light" onClick={prevMonth}>
            <BsChevronLeft />
          </button>
        </div>
        <div className="col-4 text-center">
          <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        </div>
        <div className="col-4 text-end">
          <button className="btn btn-secondary-light" onClick={nextMonth}>
            <BsChevronRight />
          </button>
        </div>
      </div>
      <div className="row mt-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="col text-center bg-light p-4">
            <strong>{day}</strong>
          </div>
        ))}
      </div>
      {Array.from({ length: Math.ceil(monthDays.length / 7) }, (_, i) => (
        <div key={i} className="row">
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
                className={`col calendar-single-day text-center ${
                  !isDayInCurrentMonth ? 'text-muted' : ''
                } p-3 border ${isToday ? 'border-secondary' : ''}`}
              >
                <div className="d-flex flex-column">
                  <span
                    className={`${
                      isToday ? 'fw-bold text-md text-secondary' : ''
                    } text-sm`}
                  >
                    {format(day, dateFormat)}
                  </span>
                  {isDayBeforeCurrentMonth && (
                    <span className="text-gray text-sm">
                      {' '}
                      {format(day, 'MMM')}
                    </span>
                  )}
                  {eventsForDay.map((event, index) => (
                    <span
                      key={index}
                      className={`badge-dim ${
                        index > 0 ? 'badge-dim-primary' : 'badge-dim-danger'
                      } mt-2`}
                      title={event.label}
                    >
                      {event.user.name}
                    </span>
                  ))}
                  {eventsForDay.length > 2 && (
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
