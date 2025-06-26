import Header from '@/components/layout/Header';
import Image from 'next/image';
import GameButton from '../shared/GameButton';
import GameNavigation from '../shared/GameNavigation';
import { FaPlay } from 'react-icons/fa';

export default function InterludePage({
  heading = 'What That Says\nAbout You',
  bullets = [
    'One house? Nice flex. Two? Now you’re the boss.',
    "Your home is not the final stop – it's the starting point.",
  ],
  onContinue,
  onPrevious,
  badgeSrc = '/img/game/badge/interlude-badge.svg',
  currentStep = 1,
}) {
  return (
    <>
      <Header />

      <section className="interlude-wrap">
        {/* ────────── torn card (background-image) ────────── */}
        <article className="interlude-card">
          <h2
            className="text-white"
            dangerouslySetInnerHTML={{ __html: heading.replace('\n', '<br/>') }}
          />

          <div className="divider my-3">
            <span />
            <span className="diamond" />
            <span />
          </div>

          <ol className="bullet-list">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ol>

          <GameButton gold onClick={onContinue}>
            Next Stage <FaPlay />
          </GameButton>
        </article>

        {/* ─────────── illustration : curve + badge ────────── */}
        <div className="interlude-illus">
          <Image src={badgeSrc} alt="" width={150} height={150} priority />
        </div>
      </section>
      <div className="container mb-10 mt-n5">
        <GameNavigation
          className="interlude-nav"
          onNext={onContinue}
          onPrevious={onPrevious}
        />
      </div>
    </>
  );
}
