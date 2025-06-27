/******************************************************************
 * components/game/result/SummaryPage.jsx
 ******************************************************************/
import { useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import GameButton from '../shared/GameButton';
import {
  FaDownload,
  FaShareAlt,
  FaWhatsapp,
  FaTwitter,
  FaRocket,
  FaMoneyBillWave,
} from 'react-icons/fa';
import BallersLogo from '@/components/utils/BallersLogo';
import { MdLoop } from 'react-icons/md';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';

export default function SummaryPage({ contact }) {
  // confetti
  const confettiRef = useRef(null);

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current();
    }
  }, []);

  /* ── constants ───────────────────────────────────────────── */
  const badgeURL = '/img/game/summary/1-trophy.png';
  const captureRef = useRef(null);
  const name = contact?.name || 'Baller'; // fallback name

  /* ── little helper to hide elements for the snapshot ─────── */
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badgeURL}
              alt="Certified Baller badge"
              width={312}
              height={206}
              priority
              className="img-fluid"
            />

            <h2 className="mt-3 fw-bold">
              {' '}
              You did it,&nbsp;
              <span className="baller-name">{name.split(' ')[0]}</span>! <br />
              &nbsp;You are a Baller
            </h2>
            <div className="diamond-divider my-3">
              <span />
              <span className="diamond" />
              <span />
            </div>

            <p className="lead mb-4">
              You’ve got the mindset, the options, and the roadmap.
              <br />
              Now it’s time to move from dreaming&nbsp;to&nbsp;owning.
            </p>

            {/* CTA buttons (hidden in PNG) */}
            <div
              className="d-flex flex-wrap justify-content-center gap-3 mb-5"
              data-hide-on-capture
            >
              <GameButton
                color="light"
                onClick={downloadBadge}
                data-hide-on-capture
              >
                DOWNLOAD BADGE&nbsp;
                <FaDownload />
              </GameButton>
              <GameButton color="light" onClick={shareWin} data-hide-on-capture>
                SHARE YOUR WIN&nbsp;
                <FaShareAlt />
              </GameButton>
            </div>

            {/* summary card */}
            <div className="summary-win mx-auto mb-5">
              <h5>SUMMARY WIN</h5>
              <p>
                You rent your home, but you’ve got what it takes to own.
                A&nbsp;3-bedroom terrace in Lekki, VI, or Ajah is within reach
                sooner than you think. With the right plan, your keys could be
                less than three&nbsp;years away.
              </p>
              <GameButton gold>
                START YOUR BALLER JOURNEY <FaRocket />
              </GameButton>
            </div>

            {/* booster card */}
            <div className="booster-card mx-auto d-none d-md-block">
              <h5>Next Steps</h5>
              <p>
                Before we talk property keys, let’s grow your wallet. BALL can
                guide you with side hustles and savings strategies. Your baller
                journey starts here—get that bag first.
              </p>{' '}
            </div>
            <div
              className="d-flex flex-wrap justify-content-center gap-3 mt-4"
              data-hide-on-capture
            >
              <GameButton
                color="red"
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
