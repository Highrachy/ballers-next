import React from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import Button from '../forms/Button';
import TopBar from './TopBar';

const QuestionStep = ({
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
  mode,
  currentSectionTitle,
  isAnswered,
  handleEdit,
}) => (
  <>
    <section className="card-content mt-5">
      <TopBar
        currentStep={mode === 'summary' ? totalSteps : currentStep}
        totalSteps={totalSteps}
        title={mode === 'summary' ? 'Summary' : currentSectionTitle}
        isAnswered={isAnswered}
        onDotClick={handleEdit}
        handleBack={handleBack}
      />
      {/* ── Label + Tooltip ───────────────────────────────────────────── */}
      <div className="d-flex align-items-center mb-2">
        <h4 className="fw-semibold mb-0 me-2">{currentQuestion.label}</h4>

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
      </div>

      {/* optional prompt */}
      {currentQuestion.prompt && (
        <p className="mb-4">{currentQuestion.prompt}</p>
      )}

      {/* ── Option list ──────────────────────────────────────────────── */}
      <div className="option-list mb-4">
        {currentQuestion.type === 'options' &&
          currentQuestion.options.map((option) => (
            <div
              key={option.label}
              className={`option-card ${
                selectedValue === option.label ? 'selected' : ''
              }`}
              onClick={() => handleSelect(option.label)}
            >
              <div>
                <div className="option-title">{option.label}</div>
                {option.subtext && (
                  <div className="option-subtext">{option.subtext}</div>
                )}
              </div>
              <div className="option-arrow">
                {selectedValue === option.label && <FaArrowRight />}
              </div>
            </div>
          ))}

        {/* free-text “Other” */}
        {currentQuestion.type === 'options' &&
          selectedValue === 'Other (enter exact amount)' && (
            <Form.Control
              type="text"
              className="mt-3 animated-input"
              placeholder="Enter exact value"
              value={answers[`${currentQuestion.id}_custom`] || ''}
              onChange={(e) => handleCustomInput(e.target.value)}
            />
          )}
      </div>

      {/* ── Navigation buttons ───────────────────────────────────────── */}
      <div className="d-flex justify-content-between">
        {
          <Button
            color="link"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="d-flex align-items-center p-0"
          >
            <FaArrowLeft className="me-2" />
            Back
          </Button>
        }

        <Button
          color="secondary"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="d-flex align-items-center"
        >
          {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
          <FaArrowRight className="ms-2" />
        </Button>
      </div>
    </section>
  </>
);

export default QuestionStep;
