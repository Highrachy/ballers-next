/******************************************************************
 * components/game/hero/ShareGameButton.jsx  – mixin-powered version
 ******************************************************************/
import React, { useState } from 'react';
import {
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaRegCopy,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6';
import { FaShareAlt } from 'react-icons/fa';

import GameModal from '@/components/game/shared/GameModal';
import GameButton from '@/components/game/shared/GameButton';

export default function GameShare({
  text = '🎯 Take the BALLERS real-estate challenge!',
  url = typeof window !== 'undefined' ? window.location.href : '',
  trigger = null,
  title = 'Challenge your friends!',
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* tiny helper */
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* palette-id ⇒ icon / label / handler */
  const items = [
    {
      col: 'twitter',
      icon: <FaXTwitter />,
      label: 'Share on X',
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`,
          '_blank'
        ),
    },
    {
      col: 'facebook',
      icon: <FaFacebookF />,
      label: 'Facebook',
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          '_blank'
        ),
    },
    {
      col: 'linkedin',
      icon: <FaLinkedinIn />,
      label: 'LinkedIn',
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          '_blank'
        ),
    },
    {
      col: 'whatsapp',
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
          '_blank'
        ),
    },
    {
      col: 'email',
      icon: <FaEnvelope />,
      label: 'E-mail',
      onClick: () =>
        (window.location.href = `mailto:?subject=${encodeURIComponent(
          'Check this out!'
        )}&body=${encodeURIComponent(text + '\n\n' + url)}`),
    },
    {
      col: 'copy',
      icon: <FaRegCopy />,
      label: copied ? 'Copied!' : 'Copy link',
      onClick: copy,
    },
  ];

  /* helper: render either default or custom opener */
  const opener = React.isValidElement(trigger) ? (
    <span
      /* wrapper adds modal logic but also preserves original click */
      onClick={(e) => {
        trigger.props?.onClick?.(e);
        setOpen(true);
      }}
      style={{ display: 'inline-flex' }} // keeps button layout intact
    >
      {trigger}
    </span>
  ) : (
    <button
      className="btn-game btn-game--light mt-4"
      onClick={() => setOpen(true)}
      aria-label="Share game with friends"
    >
      <FaShareAlt /> <span>Share with Friends</span>
    </button>
  );

  return (
    <>
      {/* trigger (custom or default) */}
      {opener}
      {/* modal */}
      <GameModal
        isOpen={open}
        title="Share with Friends"
        onClose={() => setOpen(false)}
      >
        <div className="my-4">
          <h5 className="text-white text-center">{title}</h5>
        </div>
        <div className="share-grid">
          {items.map(({ col, icon, label, onClick }) => (
            <GameButton key={col} color={col} onClick={onClick}>
              {icon}&nbsp; {label}
            </GameButton>
          ))}

          {/* secondary CTA */}
          <GameButton color="light" onClick={() => setOpen(false)}>
            No thanks
          </GameButton>
        </div>
      </GameModal>
    </>
  );
}
