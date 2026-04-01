import { useEffect, useRef } from 'react';

const useExitIntent = ({ onExit, enabled = true, delay = 300 }) => {
  const triggered = useRef(false);
  const hasInteracted = useRef(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const markInteraction = () => {
      hasInteracted.current = true;
    };

    const handleMouseLeave = (e) => {
      const timeSpent = Date.now() - startTime.current;

      // CONDITIONS FOR TRIGGER
      if (
        e.clientY <= 0 && // moving to top
        !triggered.current &&
        hasInteracted.current && // user has engaged
        timeSpent > 5000 // at least 5 seconds on page
      ) {
        // if (sessionStorage.getItem('ball_exit_intent_shown')) return;

        triggered.current = true;

        setTimeout(() => {
          sessionStorage.setItem('ball_exit_intent_shown', 'true');
          onExit();
        }, delay);
      }
    };

    document.addEventListener('mousemove', markInteraction);
    document.addEventListener('scroll', markInteraction);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', markInteraction);
      document.removeEventListener('scroll', markInteraction);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [onExit, enabled, delay]);
};

export default useExitIntent;
