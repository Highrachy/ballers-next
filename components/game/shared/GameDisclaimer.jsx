/******************************************************************
 * components/game/hero/DisclaimerButton.jsx
 ******************************************************************/
import { useState } from 'react';
import GameModal from '@/components/game/shared/GameModal';
import GameButton from '@/components/game/shared/GameButton';

const DISCLAIMER = (
  <>
    <ul className="disc-list mb-4">
      <li>
        <strong>Quick&nbsp;Heads-Up!</strong>&nbsp;Your answers help us find
        your dream home faster. This isn’t a loan application – just a friendly
        chat to get started!
      </li>
      <li>
        <strong>Let’s&nbsp;Talk&nbsp;Timelines!</strong>&nbsp;Your plans guide
        us. This info doesn’t guarantee a purchase – always consult a financial
        pro for final decisions!
      </li>
      <li>
        <strong>Just&nbsp;So&nbsp;You&nbsp;Know…</strong>&nbsp;We’re real-estate
        pros, not financial advisors. Always seek certified advice tailored to
        you.
      </li>
    </ul>

    <div className="text-end">
      <GameButton
        color="gold"
        className="btn-game"
        onClick={() => setOpen(false)}
      >
        CLOSE
      </GameButton>
    </div>
  </>
);

/* — tiny helper so we can close from inside — */
let setOpen = () => {};

export default function GameDisclaimer() {
  const [open, _setOpen] = useState(false);
  setOpen = _setOpen;

  return (
    <>
      {/* tiny clause */}
      <p className="hero__disclaimer mt-3">
        By continuing you agree to our{' '}
        <button
          type="button"
          className="hero__disclaimer-link"
          onClick={() => setOpen(true)}
        >
          terms&nbsp;&amp;&nbsp;conditions
        </button>
        .
      </p>

      {/* reuse the generic GameModal */}
      <GameModal
        isOpen={open}
        title="DISCLAIMER"
        onClose={() => _setOpen(false)}
      >
        {DISCLAIMER}
      </GameModal>
    </>
  );
}
