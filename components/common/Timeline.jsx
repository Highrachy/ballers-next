import React from 'react';
import { getDateTime } from 'utils/date-helpers';

const Timeline = ({ children }) => <div className="timeline">{children}</div>;

export const LogTimeline = ({ log }) => {
  const updatedDate = getDateTime(log.updatedAt);
  let lists = [];
  for (const property in log) {
    if (property !== '_id' && property !== 'updatedAt')
      lists.push(
        <SingleTimeLineItem
          title={property}
          key={property}
          content={
            <>
              <div className="text-success small">+ {log[property]?.new}</div>
              <div className="text-danger small">- {log[property]?.old}</div>
            </>
          }
        />
      );
  }
  return (
    <>
      <h6 className="timeline-head">{updatedDate}</h6>
      <ul className="timeline-list">{lists}</ul>
    </>
  );
};

export const SingleTimeLineItem = ({ title, content }) => (
  <li className="timeline-item">
    <div className="timeline-status bg-secondary" />
    <div className="timeline-data">
      <h6 className="timeline-title">{title}</h6>
      {content}
    </div>
  </li>
);

export default Timeline;
