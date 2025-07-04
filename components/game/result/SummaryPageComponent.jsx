import { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import GameButton from '../shared/GameButton';
import { FaShareAlt, FaRocket, FaKickstarter } from 'react-icons/fa';
import BallersLogo from '@/components/utils/BallersLogo';
import GameShare from '../shared/GameShare';
import { FaChartPie, FaRepeat } from 'react-icons/fa6';
import GameBadge from '../shared/GameBadge';
import GameConfetti from '../shared/GameConfetti';
import GameModal from '../shared/GameModal';
import GameInsightsModal from '../shared/GameInsightsModal';
import { useRouter } from 'next/router';
import { STORAGE } from '../shared/helper';
import Link from 'next/link';
import GameFooter from '../shared/GameFooter';

export default function SummaryPageComponent({
  contact,
  answers,
  bulletCache,
  isSharedView,
  userTier,
}) {
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const badgeURL = '/img/game/summary/';
  const captureRef = useRef(null);
  const name = contact?.name || '';

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || '';
  const shareUrl = `${baseUrl}/game/view-results?id=${contact?.id}`;

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
            <div className="summary-win mx-auto mt-5 mb-5" data-hide-on-capture>
              <h3 className="summary-header">Summary</h3>
              <p
                className="summary-text"
                dangerouslySetInnerHTML={{ __html: userTier?.summary }}
              />
              <GameButton
                className="mb-3"
                color="gold-light"
                onClick={() => setShowInsights(true)}
              >
                View Insights <FaChartPie />
              </GameButton>
              {showInsights && (
                <GameInsightsModal
                  isOpen={showInsights}
                  onClose={() => setShowInsights(false)}
                  answers={answers}
                  bulletCache={bulletCache}
                />
              )}
            </div>

            {/* CTA buttons (hidden in PNG) */}
            <div
              className="d-flex flex-wrap justify-content-center gap-3 mb-5"
              data-hide-on-capture
            >
              <GameBadge captureRef={captureRef} />
              {!isSharedView && (
                <GameShare
                  text={`🏆 I just became a Certified Baller on BALL!`}
                  title="Share your Badge"
                  trigger={
                    <GameButton color="purple-light" data-hide-on-capture>
                      SHARE YOUR WIN&nbsp;
                      <FaShareAlt />
                    </GameButton>
                  }
                  url={shareUrl}
                />
              )}
            </div>

            {/* Booster Card */}
            <div className="booster-card mx-auto" data-hide-on-capture>
              <h3 className="summary-header">Next Steps</h3>
              <p className="summary-text">
                Congratulations on taking your first step! Now, move even closer
                to owning your dream home. Join the BALL community to discover
                top-quality properties tailored to your budget and lifestyle.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              className="d-flex flex-wrap justify-content-center gap-3 my-4"
              data-hide-on-capture
            >
              <GameButton color="gold" onClick={() => router.push('/register')}>
                START YOUR BALL JOURNEY
              </GameButton>
              <GameButton
                color="red"
                className="ms-3"
                onClick={() => setShowResetModal(true)}
                data-hide-on-capture
              >
                {isSharedView ? (
                  <>Start a New Game {<FaKickstarter />}</>
                ) : (
                  <>Restart Game {<FaRepeat />}</>
                )}
              </GameButton>
            </div>

            <div className="text-muted mt-5">
              Generated on <Link href={shareUrl}>{shareUrl}</Link>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetModal && (
              <GameModal
                isOpen={showResetModal}
                title="Restart Game?"
                onClose={() => setShowResetModal(false)}
              >
                <div className="text-center">
                  <h4 className="lead text-white pt-5 my-4">
                    Are you sure you want to reset your progress? All of your
                    answers and achievements will be lost.
                  </h4>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <GameButton
                      color="navy"
                      onClick={() => setShowResetModal(false)}
                    >
                      No, Cancel
                    </GameButton>
                    <GameButton
                      color="red"
                      onClick={() => {
                        localStorage.removeItem(STORAGE.ANSWERS);
                        localStorage.removeItem(STORAGE.BULLET_CACHE);
                        // Regenerate contact id but keep name and email
                        const prevContact = JSON.parse(
                          localStorage.getItem(STORAGE.CONTACT) || '{}'
                        );
                        const { name, email } = prevContact;
                        const newContact = {
                          name,
                          email,
                          id: crypto.randomUUID(),
                        };
                        localStorage.setItem(
                          STORAGE.CONTACT,
                          JSON.stringify(newContact)
                        );
                        setShowResetModal(false);
                        window.location.href = '/game/are-you-a-baller';
                      }}
                    >
                      Yes, Restart
                    </GameButton>
                  </div>
                </div>
              </GameModal>
            )}
          </div>
        </section>
        {/* ---------- Confetti Animation ---------- */}
        <GameConfetti />
      </section>
    </>
  );
}
