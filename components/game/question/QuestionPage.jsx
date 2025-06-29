/******************************************************************
 * QuestionPage.jsx
 ******************************************************************/
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { FaInfoCircle } from 'react-icons/fa';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import OptionCard from './OptionCard';
import GameNavigation from '../shared/GameNavigation';
import GameModal from '../shared/GameModal';
import { useChatMessage } from '@/context/ChatContext';

/* ---------- helpers ---------- */
const naira = (val) => {
  const num = Number(val.toString().replace(/[^0-9.]/g, ''));
  if (Number.isNaN(num) || !num) return val; // fallback
  return `₦ ${num.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
};

export default function QuestionPage({
  currentStep,
  totalSteps,
  currentQuestion, // may be undefined for a split-second
  selectedValue,
  answers,
  handleSelect,
  handleCustom, // (id, customValue)
  handleNext,
  handleBack,
  isNextDisabled,
}) {
  /* ───── local UI state ───── */
  const [mounted, setMounted] = useState(false); // avoid SSR clash
  const [modalId, setModalId] = useState(null); // null ⇒ closed
  const { setIsVisible } = useChatMessage();
  useEffect(() => {
    setMounted(true);
    setIsVisible(false); // hide chat message on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Scroll to top when currentStep changes (i.e., when Next/Back is clicked)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  if (!currentQuestion) return null; // safety guard

  /* custom amount (if any) */
  const customRaw = answers?.[`${currentQuestion.id}_custom`] || '';
  const customFmt = customRaw ? naira(customRaw) : '';

  /* click handler */
  const onCardSelect = (opt) => {
    handleSelect(opt.label);
    if (opt.label === 'Other') setModalId(currentQuestion.id);
  };

  return (
    <>
      <Header />

      <section className="question-container">
        <section className="question-page">
          <div className="question-content">
            <section className="question-main container pb-6">
              {/* ───── top meta ───── */}
              <div className="question-top">
                <div className="question-index small fw-bold text-uppercase">
                  Question&nbsp;
                  <span className="fw-bolder">
                    {currentStep + 1} of {totalSteps}
                  </span>
                </div>

                <h2 className="question-title mt-2">
                  {currentQuestion.prompt}&nbsp;
                  {currentQuestion.description && (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id={`tip-${currentQuestion.id}`}>
                          {currentQuestion.description}
                        </Tooltip>
                      }
                    >
                      <span className="text-muted cursor-pointer info-icon">
                        <FaInfoCircle />
                      </span>
                    </OverlayTrigger>
                  )}
                </h2>

                {currentQuestion.description && (
                  <p className="question-subtext">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              {/* ───── answer options ───── */}
              <div className="option-grid my-5">
                {currentQuestion.options.map((opt) => {
                  const isOther = opt.label === 'Other';
                  const subtitle =
                    isOther && customFmt ? customFmt : opt.subtext;

                  return (
                    <OptionCard
                      key={opt.label}
                      title={opt.label}
                      subtitle={subtitle}
                      selected={mounted && selectedValue === opt.label}
                      onClick={() => onCardSelect(opt)}
                      emoji={opt.emoji}
                    />
                  );
                })}
              </div>

              {/* ───── nav buttons ───── */}
              <GameNavigation
                onPrevious={handleBack}
                onNext={handleNext}
                isFirst={currentStep === 0}
                isLast={currentStep === totalSteps - 1}
                isNextDisabled={isNextDisabled}
              />
            </section>

            {/* debug json (optional) */}
            {/* <pre>{mounted && JSON.stringify(answers, null, 2)}</pre> */}
          </div>

          {/* ───── modal ───── */}
          <GameModal
            isOpen={Boolean(modalId)}
            defaultValue={customRaw}
            onSave={(val) => handleCustom(modalId, val)}
            onClose={() => setModalId(null)}
          />
        </section>
      </section>
    </>
  );
}
