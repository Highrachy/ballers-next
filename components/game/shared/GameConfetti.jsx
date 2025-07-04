import { useEffect, useRef, forwardRef } from 'react';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';

export default function GameConfetti({ duration = 9000, speed = 0.3 }) {
  return <Realistic autorun={{ speed, duration }} />;
}
