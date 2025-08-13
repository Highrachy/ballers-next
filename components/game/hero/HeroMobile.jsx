// components/HeroMobile.js
import { HeroCtaButton } from './HeroDesktop';

export default function HeroMobile() {
  return (
    <section className="hero-mob">
      {/* navy torn card + content */}
      <div className="hero-mob__card">
        <h1 className="hero__title text-center mt-2 hero-mob__title">
          ARE YOU A <span className="fw-bold">BALLER?</span>
        </h1>

        <div className="hero__divider my-3">
          <span className="hero__divider-line" />
          <span className="hero__divider-diamond" />
          <span className="hero__divider-line" />
        </div>

        <p className="hero__copy mb-3">
          Whether you&apos;re a first-time buyer or a real estate veteran. Know
          exactly <strong>When</strong>, <strong>Where</strong>, and{' '}
          <strong>How</strong> your next purchase goes down.
        </p>

        <p className="hero__copy">
          Let&apos;s tell you your BALLer status — ready to find out when
          you&apos;ll make your next big deal?
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/game/house-coins.png"
          alt="House Coins"
          className="hero-mob__coins"
          aria-hidden="true"
        />
      </div>

      {/* Start Challenge button */}
      <div className="hero-mob__btn-wrapper">
        {/* CTA */}
        <HeroCtaButton />
      </div>
    </section>
  );
}
