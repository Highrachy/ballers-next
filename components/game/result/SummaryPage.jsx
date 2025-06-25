import Header from '@/components/layout/Header';
import Image from 'next/image';
import GameButton from '../shared/GameButton';

export default function SummaryPage({
  heading = 'Summary',
  bullets = [
    'Here are some insights based on your choices:',
    "Your home is not the final stop – it's the starting point.",
  ],
  badgeSrc = '/img/game/badge/interlude-badge.svg',
}) {
  /* ── Reset handler ───────────────────────────────────────────────── */
  const handleReset = () => {
    localStorage.removeItem('are-you-a-baller-answers');
    window.location.reload();
  };
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

          <GameButton color="red" onClick={handleReset}>
            Reset & Start Over
          </GameButton>
        </article>

        {/* ─────────── illustration : curve + badge ────────── */}
        <div className="interlude-illus">
          <Image src={badgeSrc} alt="" width={150} height={150} priority />
        </div>
      </section>
    </>
  );
}
