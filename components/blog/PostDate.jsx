import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatString, formatDate } from '@/utils/date-helpers';

const PostDate = ({ date }) => {
  const renderDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  const month = formatDate(date, dateFormatString.monthShortWords);
  const day = formatDate(date, dateFormatString.dayDigits);

  return (
    <div className="post-date flex-column d-inline-flex align-items-center justify-content-center">
      <div className="mt-1">{month}</div>
      <div className="fw-bold text-lg mt-n2">{day}</div>
    </div>
  );
};

PostDate.propTypes = {
  date: PropTypes.string.isRequired,
};

export default PostDate;
