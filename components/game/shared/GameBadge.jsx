import React from 'react';
import GameButton from './GameButton';
import { FaDownload } from 'react-icons/fa6';

export default function GameBadge({ captureRef, id }) {
  // Helper to hide elements during capture
  const withHidden = async (fn) => {
    const els = captureRef.current?.querySelectorAll('[data-hide-on-capture]');
    const cache = [];
    els?.forEach((el) => {
      cache.push([el, el.style.display]);
      el.style.display = 'none';
    });
    await fn();
    cache.forEach(([el, d]) => (el.style.display = d));
  };

  const downloadBadge = async () => {
    const html2canvas = (await import('html2canvas')).default;
    await withHidden(async () => {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#fff',
        scale: 2,
      });
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BALL Badge.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    });
  };

  return (
    <GameButton color="navy-light" onClick={downloadBadge} data-hide-on-capture>
      DOWNLOAD BADGE
      <FaDownload />
    </GameButton>
  );
}
