import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const tagStyles = [
  'tag--lavender',
  'tag--sky',
  'tag--mint',
  'tag--peach',
  'tag--rose',
  'tag--sand',
  'tag--aqua',
  'tag--sun',
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function GameLocation({ locations = [] }) {
  const shuffledStyles = shuffleArray(tagStyles).slice(0, locations.length);

  return (
    <div className="location-tags-wrapper">
      {locations.map((loc, index) => (
        <div key={loc} className={`location-tag ${shuffledStyles[index]}`}>
          <FaMapMarkerAlt className="tag-icon" />
          <span className="tag-text">{loc}</span>
        </div>
      ))}
    </div>
  );
}
