import { useEffect, useRef } from 'react';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';

export default function GameConfetti({ duration = 9000, speed = 0.3 }) {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current();
    }
  }, []);

  return <Realistic autorun={{ speed, duration }} ref={confettiRef} />;
}
