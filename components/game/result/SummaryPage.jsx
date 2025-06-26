/******************************************************************
 * components/game/result/SummaryPage.jsx
 ******************************************************************/
import { useRef } from 'react';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import GameButton from '../shared/GameButton';
import {
  FaDownload,
  FaShareAlt,
  FaWhatsapp,
  FaTwitter,
  FaRocket,
} from 'react-icons/fa';
import BallersLogo from '@/components/utils/BallersLogo';

export default function SummaryPage() {
  /* ── constants ───────────────────────────────────────────── */
  const badgeURL = '/img/game/summary/1-trophy.png';
  const captureRef = useRef(null);

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

      <section className="question-container">
        <section className="question-page">
          {/* mini-toolbar (not captured) */}
          <div className="summary-toolbar" data-hide-on-capture>
            <button onClick={downloadBadge} aria-label="Download badge">
              <FaDownload />
            </button>
            <button onClick={shareWin} aria-label="Share on Twitter">
              <FaTwitter />
            </button>
            <button onClick={shareWin} aria-label="Share on WhatsApp">
              <FaWhatsapp />
            </button>
          </div>
          <div className="summary-page container text-center" ref={captureRef}>
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
              className="badge-img"
            />

            <h2 className="mt-3 fw-bold">You Did It! &nbsp;Welcome, Baller</h2>
            <div className="diamond-divider my-3" />

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
              <GameButton gold>START YOUR BALLER JOURNEY ✨</GameButton>
            </div>

            {/* booster card */}
            <div className="booster-card mx-auto" data-hide-on-capture>
              <h5>BOOST EARNINGS</h5>
              <p>
                Before we talk property keys, let’s grow your wallet. BALL can
                guide you with side hustles and savings strategies. Your baller
                journey starts here—get that bag first.
              </p>
              <GameButton color="green" data-hide-on-capture>
                BOOST EARNINGS <FaRocket />
              </GameButton>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
