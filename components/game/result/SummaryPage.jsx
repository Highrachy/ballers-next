/******************************************************************
 * components/game/result/SummaryPage.jsx
 ******************************************************************/
import { useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import GameButton from '../shared/GameButton';
import { FaDownload, FaShareAlt, FaRocket } from 'react-icons/fa';
import BallersLogo from '@/components/utils/BallersLogo';
import { MdLoop } from 'react-icons/md';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import getMinPricingByZone from '@/data/game/getMinPricingByZone';
import { locationsByZone } from '@/data/game/location';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import {
  getAffordabilityByLocation,
  getTierInfo,
} from '@/data/game/getAffordabilityByLocation';
import GameLocation from '../shared/GameLocation';
import GameShare from '../shared/GameShare';

export default function SummaryPage({ contact }) {
  // confetti
  const confettiRef = useRef(null);
  const [answers, setAnswers] = useLocalStorageState(
    'are-you-a-baller-answers',
    {}
  );

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current();
    }
  }, []);

  /* ── constants ───────────────────────────────────────────── */
  const badgeURL = '/img/game/summary/';
  const captureRef = useRef(null);
  const name = contact?.name || 'Baller'; // fallback name
  const minByZone = getMinPricingByZone();
  const affordability = getAffordabilityByLocation(
    minByZone,
    answers,
    locationsByZone
  );
  // Get the minimum number of years
  const minYears = Math.min(
    ...Object.entries(affordability).map(([_, data]) => data.years)
  );

  const userTier = getTierInfo(minYears, answers, name);

  /* little helper: remove elements *completely* while we snapshot */
  const withHidden = async (fn) => {
    const els = captureRef.current?.querySelectorAll('[data-hide-on-capture]');
    const cache = []; // save originals

    els?.forEach((el) => {
      cache.push([el, el.style.display]); // ← remember
      el.style.display = 'none'; // remove from layout
    });

    await fn(); // ⏬ snapshot

    cache.forEach(([el, d]) => (el.style.display = d)); // restore
  };
  /* ── download PNG ────────────────────────────────────────── */
  const downloadBadge = async () => {
    const html2canvas = (await import('html2canvas')).default;
    await withHidden(async () => {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#fff', // ⚪️ white background
        scale: 2,
      });
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BALL-summary.png';
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    });
  };

  /* ── share helper ────────────────────────────────────────── */
  const shareWin = async () => {
    const text =
      '🏆 I just became a Certified Baller! Ready to start my property journey.';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certified Baller',
          text,
          url: location.href,
        });
        return;
      } catch {
        /* ignore */
      }
    }
    const t = encodeURIComponent(`${text} ${location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${t}`, '_blank');
  };

  /* ── render ──────────────────────────────────────────────── */
  return (
    <>
      <Header />

      <section className="summary-container">
        <section className="summary-page">
          <div
            className="summary-content container text-center"
            ref={captureRef}
          >
            {/* BALL logo – captured */}
            <BallersLogo />

            {/* big badge – captured */}
            <div className="result-image my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${badgeURL}${userTier.emoji}`}
                alt="Certified Baller badge"
                width={300}
                className="img-fluid"
              />
            </div>

            <h2 className="mb-4 fw-bold">
              {userTier.label},&nbsp;
              <span className="baller-name">{name.split(' ')[0]}</span>! <br />
            </h2>
            <div className="diamond-divider my-3">
              <span />
              <span className="diamond" />
              <span />
            </div>

            <div
              className="display-6 my-4"
              dangerouslySetInnerHTML={{ __html: userTier.description }}
            />

            {/* summary card */}
            <div className="summary-win mx-auto mt-5 mb-5">
              <h3 className="summary-header">Summary</h3>
              <p className="summary-text">{userTier?.summary}</p>
              <GameButton className="mb-3" color="gold-light">
                View All Suggestions <FaRocket />
              </GameButton>
            </div>

            {/* CTA buttons (hidden in PNG) */}
            <div
              className="d-flex flex-wrap justify-content-center gap-3 mb-5"
              data-hide-on-capture
            >
              <GameButton
                color="navy-light"
                onClick={downloadBadge}
                data-hide-on-capture
              >
                DOWNLOAD BADGE&nbsp;
                <FaDownload />
              </GameButton>
              <GameShare
                text={`🏆 I just became a Certified Baller on BALL!`}
                title="Share your Badge"
                trigger={
                  <GameButton color="purple-light" data-hide-on-capture>
                    SHARE YOUR WIN&nbsp;
                    <FaShareAlt />
                  </GameButton>
                }
              />
            </div>

            {/* booster card */}
            <div className="booster-card mx-auto d-none d-md-block">
              <h3 className="summary-header">Next Steps</h3>
              <p className="summary-text">
                You have taken the first step, it is time to move closer to
                owning your home. Join the BALL community to explore quality
                properties that match your budget and lifestyle.
              </p>{' '}
            </div>
            <div
              className="d-flex flex-wrap justify-content-center gap-3 my-4"
              data-hide-on-capture
            >
              <GameButton className="gold">
                START YOUR BALL JOURNEY <FaRocket />
              </GameButton>

              <GameButton
                color="red"
                className="ms-3"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to reset your progress?'
                    )
                  ) {
                    // Clear localStorage/sessionStorage or any relevant state here
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/game'; // Redirect to home or starting page
                  }
                }}
                data-hide-on-capture
              >
                Restart Game <MdLoop />
              </GameButton>
            </div>
          </div>
        </section>
        {/* ---------- Confetti Animation ---------- */}
        {/* Confetti animation on load */}
        <Realistic autorun={{ speed: 0.3, duration: 9000 }} ref={confettiRef} />
      </section>
    </>
  );
}
