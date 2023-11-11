import React from 'react';

const StatusBadge = ({ color = 'danger', children }) => {
  return <span className={`badge badge-dot text-${color}`}>{children}</span>;
};

export default StatusBadge;
