/******************************************************************
 * GameModal.jsx  –  easier to read, live ₦-formatting
 ******************************************************************/
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import GameButton from '../shared/GameButton';
import { CloseIcon } from '@/components/utils/Icons';

/* format 1234567  ➜  "₦ 1,234,567"  (empty string ⇒ "") */
const fmt = (numStr) =>
  numStr
    ? `₦ ${Number(numStr).toLocaleString('en-NG', {
        maximumFractionDigits: 0,
      })}`
    : '';

export default function GameModal({
  isOpen,
  title = 'AMOUNT',
  subtitle = 'Other amount',
  placeholder = 'Enter',
  defaultValue = '',
  onSave = () => {},
  onClose = () => {},
}) {
  /* --------- local state --------- */
  const [digits, setDigits] = useState(''); // raw numbers only
  const [display, setDisplay] = useState(''); // formatted with ₦

  /* initialise with defaultValue (runs once) */
  useEffect(() => {
    const clean = defaultValue.replace(/[^0-9]/g, '');
    setDigits(clean);
    setDisplay(fmt(clean));
  }, [defaultValue]);

  /* --------- handlers --------- */
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, ''); // keep digits
    setDigits(raw);
    setDisplay(fmt(raw));
  };

  const save = () => {
    onSave(digits); // parent persists raw digits
    onClose();
  };

  /* --------- early exit (SSR friendly) --------- */
  if (!isOpen) return null;

  /* --------- render --------- */
  return (
    <div className="gm__backdrop" onClick={onClose}>
      <article className="gm__wrap" onClick={(e) => e.stopPropagation()}>
        {/* header ribbon */}
        <header className="gm__head">
          <Image
            src="/img/game/modal/header.svg"
            alt=""
            width={500}
            height={125}
            priority
          />
          <h2>{title}</h2>
          <button
            className="gm__close"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <CloseIcon width={24} height={24} />
          </button>
        </header>

        {/* torn navy body */}
        <div className="gm__body">
          <h3>{subtitle}</h3>

          <label htmlFor="gm-input">Amount</label>
          <input
            id="gm-input"
            type="text"
            value={display}
            onChange={handleChange}
            placeholder={placeholder}
            inputMode="numeric"
          />

          <GameButton gold onClick={save}>
            SAVE
          </GameButton>
        </div>
      </article>
    </div>
  );
}
