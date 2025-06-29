/******************************************************************
 * components/game/shared/GameModal.jsx
 * ---------------------------------------------------------------
 * A single navy-blue modal that can render:
 *   • default “Other Amount” form  **OR**
 *   • any custom <children>
 ******************************************************************/
import { useState, useEffect } from 'react';
import Image from 'next/image';
import GameButton from '@/components/game/shared/GameButton';
import { CloseIcon } from '@/components/utils/Icons';

/* util:  1234567 → “₦ 1,234,567” (or blank) */
const format = (n) =>
  n
    ? `₦ ${Number(n).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
    : '';

export default function GameModal({
  /* —— shared —— */
  isOpen,
  title = 'MODAL',
  subtitle = 'Enter an amount',
  onClose = () => {},

  /* —— “amount” mode (legacy) —— */
  defaultValue = '',
  placeholder = 'Enter',
  onSave = () => {},

  /* —— anything else —— */
  children, // ⇠ if present → render as custom body
  primaryLabel = 'SAVE', // ⇠ label for bottom button (if we keep it)
  primaryAction, // ⇠ optional override handler
}) {
  /* -------- “amount” local state (only used when NO children) -------- */
  const [digits, setDigits] = useState(''); // raw numbers
  const [display, setDisplay] = useState(''); // formatted “₦ …”

  /* initialise once */
  useEffect(() => {
    const clean = defaultValue.replace(/[^0-9]/g, '');
    setDigits(clean);
    setDisplay(format(clean));
  }, [defaultValue]);

  /* SSR-safe early exit */
  if (!isOpen) return null;

  /* input change */
  const change = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setDigits(raw);
    setDisplay(format(raw));
  };

  /* default primary action (amount-save) */
  const save = () => {
    onSave(digits);
    onClose();
  };

  const action = primaryAction || save;

  /* ------------------------------------------------------------------ */
  return (
    <div className="gm__backdrop" onClick={onClose}>
      <article className="gm__wrap" onClick={(e) => e.stopPropagation()}>
        {/* — header ribbon — */}
        <header className="gm__head">
          <Image
            src="/img/game/modal/header.svg"
            alt=""
            width={500}
            height={125}
            priority
          />
          <h2 className="gm__title">{title}</h2>
        </header>

        {/* — navy torn body — */}
        <div className="gm__body">
          <button
            className="gm__close"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <CloseIcon width={24} height={24} />
          </button>
          {/* —— 1) custom children supplied —— */}
          <div className="gm__scroll">
            {children ? (
              children
            ) : (
              /* —— 2) legacy amount form —— */
              <section className="gm__form">
                <h4 className="text-white mb-4">{subtitle}</h4>

                <label className="gm-label mb-3" htmlFor="gm-input">
                  Enter an amount:
                </label>
                <input
                  id="gm-input"
                  className="gm-input"
                  type="text"
                  value={display}
                  onChange={change}
                  placeholder={placeholder}
                  inputMode="numeric"
                />

                <GameButton color="gold" className="w-100" onClick={action}>
                  {primaryLabel}
                </GameButton>
              </section>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
