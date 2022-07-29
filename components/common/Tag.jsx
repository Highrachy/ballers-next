import React from 'react';

const Tag = ({ color, text }) => {
  return (
    <div className="tag tag--default">
      <span className={`tag__marker bg-${color}`} />
      <span className="tag__text">{text}</span>
    </div>
  );
};

export default Tag;
