// components/common/ExitIntentModal.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import Modal from '../common/Modal';

const ExitIntentModal = ({ show, onHide, property }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    try {
      setLoading(true);

      // TODO: Replace with API
      console.log('EMAIL:', email);

      setLoading(false);
      onHide();
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      showFooter={false}
      size="lg"
      className="exit-intent-modal p-0"
    >
      <div className="row g-0 exit-wrapper">
        {/* LEFT IMAGE */}
        <div className="col-md-6 d-none d-md-block exit-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              property?.mainImage ||
              '/img/exit-intent/exit-intent-placeholder.png'
            }
            alt="Property"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-6 exit-content">
          <button className="exit-close" onClick={onHide} />

          <p className="exit-tag">BECOME A BALLER</p>

          <h4 className="exit-title">Leaving already?</h4>

          <p className="exit-subtitle">
            {property?.name
              ? `Own ${property.name} sooner than you think.`
              : 'You could be closer to owning your home than you think.'}
          </p>

          {/* INPUT */}
          <input
            type="email"
            placeholder="Enter your email"
            className="exit-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* CTA */}
          <button
            className="exit-cta"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Become a Baller'}
          </button>

          {/* LINKS */}
          <p className="exit-alt-text">
            Not ready yet? Try one of these instead:
          </p>

          <div className="exit-links">
            <Link href="/game">Play the BALL game &rarr;</Link>
            <Link href="/request-property">Check your Eligibility &rarr;</Link>
            <Link href="/request-property">
              View all Available Properties &rarr;
            </Link>
          </div>

          {/* DISMISS */}
          <p className="exit-dismiss" onClick={onHide}>
            No thanks, I will just keep browsing.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ExitIntentModal;
