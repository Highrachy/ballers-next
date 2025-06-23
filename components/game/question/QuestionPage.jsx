import Header from '@/components/layout/Header';
import { FaInfoCircle } from 'react-icons/fa';
import OptionCard from './OptionCard';
import QuestionPageNavigation from '../shared/Navigation';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function QuestionPage({
  currentStep,
  totalSteps,
  currentQuestion,
  selectedValue,
  answers,
  handleSelect,
  handleCustomInput,
  handleNext,
  handleBack,
  isNextDisabled,
  currentSectionTitle,
  isAnswered,
  handleEdit,
}) {
  return (
    <>
      <Header />
      <section className="question-container">
        <section className="question-page">
          <div className="question-content">
            <section className="question-main container">
              <div className="question-top">
                <div className="question-index small fw-bold text-uppercase">
                  Question{' '}
                  <span className="fw-bolder">
                    {currentStep + 1} of {totalSteps}
                  </span>{' '}
                </div>
                <h2 className="question-title mt-2">
                  {currentQuestion.prompt}{' '}
                  {currentQuestion.description && (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id={`tip-${currentQuestion.id}`}>
                          {currentQuestion.description}
                        </Tooltip>
                      }
                    >
                      <span className="text-muted cursor-pointer">
                        <FaInfoCircle />
                      </span>
                    </OverlayTrigger>
                  )}
                </h2>
                <p className="question-subtext">
                  {currentQuestion.description}
                </p>
              </div>

              <div className="option-grid my-5">
                {currentQuestion.options.map((opt) => (
                  <OptionCard
                    key={opt.label}
                    title={opt.label}
                    subtitle={opt.subtext}
                    selected={selectedValue === opt.label}
                    onClick={() => handleSelect(opt.label)}
                    emoji={opt.emoji} // optional
                  />
                ))}
              </div>

              <QuestionPageNavigation
                onPrevious={handleBack}
                onNext={handleNext}
                isFirst={currentStep === 0}
                isLast={currentStep === totalSteps - 1}
                isNextDisabled={isNextDisabled}
              />
            </section>
          </div>
        </section>
      </section>
    </>
  );
}
