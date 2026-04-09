import React, { useState } from 'react';
import Link from 'next/link';
import Axios from 'axios';
import Modal from '../common/Modal';
import { BASE_API_URL } from '@/utils/constants';
import { getTokenFromStore } from '@/utils/localStorage';
import { getError, statusIsSuccessful } from '@/utils/helpers';
import { FaCheckCircle } from 'react-icons/fa';

const ExitIntentModal = ({
  show,
  onHide,
  property,
  exitReason = 'exit',
  setToast = () => {},
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ NEW

  const [touched, setTouched] = useState({
    email: false,
    name: false,
  });

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isEmailInvalid = touched.email && !isValidEmail(email);
  const isNameInvalid = touched.name && !name.trim();

  // ---------------------------
  // DYNAMIC CONTENT
  // ---------------------------
  const content =
    exitReason === 'inactivity'
      ? {
          title: 'Still there?',
          subtitle: "Let's help you get started in seconds.",
        }
      : {
          title: 'Leaving already?',
          subtitle: property?.name
            ? `Don't miss your chance to own ${property.name}.`
            : "You're closer to owning than you think.",
        };

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handleEmailContinue = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    if (!isValidEmail(email)) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    setTouched((prev) => ({ ...prev, name: true }));
    if (!name.trim()) return;

    try {
      setLoading(true);

      const payload = {
        anonymousUser: {
          email,
          fullName: name,
        },
        description: property?.name
          ? `User is interested in ${property.name} (Exit Intent)`
          : 'User showed interest via Exit Intent',
        subject: 'EXIT INTENT Form Submission',
        captchaToken: 'bypass-ball-captcha',
      };

      const response = await Axios({
        method: 'post',
        url: `${BASE_API_URL}/support`,
        data: { ...payload, page: window.location.href },
        headers: { Authorization: getTokenFromStore() },
      });

      if (statusIsSuccessful(response.status)) {
        setSuccess(true); // ✅ show success state
      }

      setLoading(false);
    } catch (error) {
      setToast({
        message: getError(error),
      });
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
        {/* IMAGE */}
        <div className="col-md-6 d-none d-md-block exit-image">
          <img
            src={
              property?.mainImage ||
              '/img/exit-intent/exit-intent-placeholder.jpg'
            }
            alt="Property"
          />
        </div>

        {/* CONTENT */}
        <div className="col-md-6 exit-content">
          <button className="exit-close" onClick={onHide} />

          <p className="exit-tag">BECOME A BALLER</p>

          {!success && (
            <>
              <h4 className="exit-title">{content.title}</h4>
              <p className="exit-subtitle">{content.subtitle}</p>
            </>
          )}

          {/* SUCCESS STATE */}
          {success ? (
            <div className="text-center d-flex flex-column justify-content-center align-items-center py-4 px-3 h-100">
              {/* ICON */}
              <FaCheckCircle size={48} className="text-success mb-3" />

              {/* TITLE */}
              <h5 className="fw-bold mb-3">
                You&apos;re on your way to becoming a Baller
              </h5>

              {/* MESSAGE */}
              <p className="text-muted small mb-3">
                We&apos;ve received your details. Let&apos;s take the next step
                and show you what you can afford.
              </p>

              {/* PRIMARY ACTION */}
              <Link href="/game">
                <a className="btn btn-secondary btn-wide mb-2">
                  Continue with BALL Game&rarr;
                </a>
              </Link>

              {/* OPTIONAL SECONDARY */}
              <Link href="/properties">
                <a className="text-muted small mt-3 mb-0">
                  Or explore properties at your own pace
                </a>
              </Link>
            </div>
          ) : (
            <>
              {/* STEP 1 - EMAIL */}
              {step === 1 && (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`exit-input ${isEmailInvalid ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, email: true }))
                    }
                  />

                  {isEmailInvalid && (
                    <p className="exit-error">
                      Please enter a valid email address
                    </p>
                  )}

                  <button
                    className="exit-cta"
                    onClick={handleEmailContinue}
                    disabled={!isValidEmail(email)}
                  >
                    Continue &rarr;
                  </button>
                </>
              )}

              {/* STEP 2 - NAME */}
              {step === 2 && (
                <>
                  <p className="text-muted small mb-0">
                    What should we call you?
                  </p>

                  <input
                    type="text"
                    placeholder="Your name"
                    className={`exit-input ${isNameInvalid ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, name: true }))
                    }
                  />

                  {isNameInvalid && (
                    <p className="exit-error">Please enter your name</p>
                  )}

                  <button
                    className="exit-cta"
                    onClick={handleSubmit}
                    disabled={loading || !name.trim()}
                  >
                    {loading ? 'Please wait...' : 'Become a Baller'}
                  </button>
                </>
              )}
            </>
          )}

          {/* ALTERNATIVES */}
          {!success && (
            <>
              <p className="exit-alt-text">Not ready yet? Try this instead:</p>

              <ul className="exit-links">
                <li>
                  <Link href="/game">Play the BALL game &rarr;</Link>
                </li>
                <li>
                  <Link href="/properties">
                    View available properties &rarr;
                  </Link>
                </li>
              </ul>
            </>
          )}

          {/* DISMISS */}
          {!success && (
            <p className="exit-dismiss" onClick={onHide}>
              No thanks, I&rsquo;ll keep browsing.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExitIntentModal;
