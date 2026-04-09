// hooks/useExitIntent.js
import { useEffect, useRef } from 'react';

const useExitIntent = ({
  onExit,
  enabled = true,
  delay = 300,
  inactivityTime = 10000,
}) => {
  const triggered = useRef(false);
  const inactivityTimer = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const triggerExit = (reason) => {
      if (triggered.current) return;

      triggered.current = true;

      // sessionStorage.setItem('ball_exit_intent_shown', 'true');

      setTimeout(() => {
        onExit(reason); // 👈 pass reason
      }, delay);
    };

    // ---------------------------
    // 1. MOUSE LEAVE (REAL EXIT)
    // ---------------------------
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        triggerExit('exit');
      }
    };

    // ---------------------------
    // 2. TAB SWITCH / CLOSE
    // ---------------------------
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerExit('exit');
      }
    };

    // ---------------------------
    // 3. INACTIVITY
    // ---------------------------
    const resetInactivity = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      inactivityTimer.current = setTimeout(() => {
        triggerExit('inactivity');
      }, inactivityTime);
    };

    // EVENTS
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', resetInactivity);
    document.addEventListener('scroll', resetInactivity);
    document.addEventListener('keydown', resetInactivity);

    // start timer immediately
    resetInactivity();

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', resetInactivity);
      document.removeEventListener('scroll', resetInactivity);
      document.removeEventListener('keydown', resetInactivity);

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [onExit, enabled, delay, inactivityTime]);
};

export default useExitIntent;
