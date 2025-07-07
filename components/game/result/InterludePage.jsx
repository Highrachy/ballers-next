/******************************************************************
 * components/game/result/Interlude.jsx
 ******************************************************************/
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import GameButton from '../shared/GameButton';
import GameNavigation from '../shared/GameNavigation';
import { FaPlay } from 'react-icons/fa';
import { isEmail } from '@/components/game/shared/helper'; // tiny regex helper

export default function Interlude({
  /* —— shared —— */
  heading = 'What That Says\nAbout You',
  badgeSrc = '/img/game/badge/interlude-badge.svg',

  /* —— “content” interlude (default) —— */
  bullets = [],
  onContinue = () => {},
  onPrevious = () => {},

  /* —— contact-capture interlude —— */
  collectContact = false, //   ⇢ when true we show the form
  onSaveContact = () => {}, //   ⇢ receives { name, email }
  currentStep = 1, // cosmetic 1-based step number
}) {
  /* local state only used when collectContact === true */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

    // run AFTER the next paint tick → guarantees DOM is ready
    const id = setTimeout(() => {
      window.scrollTo(0, 0); // most browsers
      document.documentElement.scrollTop = 0; // Safari / legacy
    }, 0);

    return () => clearTimeout(id); // clean-up
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) return setErr('Please enter your name');
    if (!isEmail(email.trim())) return setErr('Enter a valid e-mail address');
    onSaveContact({ name: name.trim(), email: email.trim() });
  };

  /* choose the main button label / handler */
  const mainLabel = collectContact ? 'See My Result' : 'Next Stage';
  const mainAction = collectContact ? handleSubmit : onContinue;

  return (
    <>
      <Header />

      <section className={`interlude-wrap${collectContact ? ' single' : ''}`}>
        {/* ────────── torn paper card ────────── */}
        <article className="interlude-card">
          <div className="interlude-card__scroll">
            <h2
              className="text-white text-center"
              dangerouslySetInnerHTML={{
                __html: heading.replace('\n', '<br/>'),
              }}
            />
            <div className="divider my-3">
              <span />
              <span className="diamond" />
              <span />
            </div>

            {/* ——— contact-form OR bullet-list ——— */}
            {collectContact ? (
              <>
                <p className="mb-3">
                  Enter your details to unlock your results and earn BALL
                  rewards.
                </p>

                <label forName="name" className="mb-2 fw-bold gm-label">
                  Name
                </label>
                <input
                  id="name"
                  className="gm-input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label forName="email" className="my=2 fw-bold gm-label">
                  E-mail
                </label>
                <input
                  id="email"
                  className="gm-input"
                  placeholder="you@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {err && <p className="text-danger-light mb-3">{err}</p>}
              </>
            ) : (
              <>
                <ol className="bullet-list">
                  {bullets.map((b) => (
                    <>
                      <li key={b}>{b}</li>
                    </>
                  ))}
                </ol>
              </>
            )}

            {/* ——— primary CTA ——— */}
            {collectContact && (
              <GameButton color="gold" onClick={mainAction}>
                {mainLabel} {!collectContact && <FaPlay />}
              </GameButton>
            )}
          </div>
        </article>

        {/* ────────── curve + badge illus ────────── */}
        <div className="interlude-illus">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={badgeSrc} alt="illustration" className="img-fluid" />
        </div>
      </section>

      {/* bottom navigation only for the regular “content” interludes */}
      {!collectContact && (
        <div className="container mb-10 mt-n5">
          <GameNavigation
            className="interlude-nav"
            onNext={onContinue}
            onPrevious={onPrevious}
          />
        </div>
      )}
    </>
  );
}
