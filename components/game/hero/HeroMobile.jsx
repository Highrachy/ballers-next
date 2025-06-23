// components/HeroMobile.js
import { FaPlay } from 'react-icons/fa';

export default function HeroMobile() {
  return (
    <section className="hero-mob">
      {/* navy torn card + content */}
      <div className="hero-mob__card">
        <h1 className="hero__title hero-mob__title">
          Welcome to the <span className="fw-bold">BALLERS</span>
          <br />
          real&nbsp;estate&nbsp;challenge
        </h1>

        <div className="hero__divider my-3">
          <span className="hero__divider-line" />
          <span className="hero__divider-diamond" />
          <span className="hero__divider-line" />
        </div>

        <p className="hero__copy mb-3">
          Welcome to the real-estate challenge that actually pays off. Let’s
          find out where you stand — and how to level up.
        </p>

        <div className="hero__meta fw-bold small d-flex align-items-center">
          <span className="text-uppercase">12&nbsp;Questions</span>
          <div className="hero__dots ms-2">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
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
        <button className="btn-game btn-game--gold ms-2">
          START CHALLENGE <FaPlay className="ms-2" size="0.9em" />
        </button>
      </div>
    </section>
  );
}
