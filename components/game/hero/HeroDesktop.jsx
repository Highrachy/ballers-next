import Header from '@/components/layout/Header';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';
import GameModal from '../shared/GameModal';
import { useState } from 'react';
import GameDisclaimer from '../shared/GameDisclaimer';
import GameShare from '../shared/GameShare';

export default function HeroDesktop() {
  return (
    <>
      <Header />

      {/* ─────────────  HERO  ───────────── */}
      <section className="hero d-flex align-items-center justify-content-center">
        <div className="hero__content d-flex flex-column align-items-start">
          {/* ── Wrapper is relative ── */}
          <div className="hero__card-wrap position-relative">
            {/* torn card */}
            <div className="hero__card">
              <h1 className="hero__title">
                Welcome to the <span className="fw-bold">BALLERS</span>
                <br />
                real&nbsp;estate&nbsp;challenge
              </h1>

              <div className="hero__divider my-4">
                <span className="hero__divider-line" />
                <span className="hero__divider-diamond" />
                <span className="hero__divider-line" />
              </div>

              <p className="hero__copy mb-4">
                Welcome to the real estate challenge that actually pays off.
                Let&apos;s find out where you stand and how to level up.
              </p>

              <div className="hero__meta fw-bold small d-flex align-items-center">
                <span className="text-uppercase">11&nbsp;Questions</span>
                <div className="hero__dots ms-2">
                  <span className="dot active" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/game/house-coins.png"
              alt="House sitting on stacks of coins"
              className="hero__illus"
            />
          </div>

          {/* CTA */}
          <HeroCtaButton />
        </div>
      </section>
    </>
  );
}

export const HeroCtaButton = () => (
  <>
    <div className="hero__btn-wrapper">
      <Link href="/game/are-you-a-baller" passHref>
        <button className="btn-game btn-game--gold">
          START CHALLENGE <FaPlay className="ms-2" size="0.9em" />
        </button>
      </Link>
    </div>
    <GameDisclaimer />

    <div className="text-center mt-4">
      <GameShare />
    </div>
  </>
);
