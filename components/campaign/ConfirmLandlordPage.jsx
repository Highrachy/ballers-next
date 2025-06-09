import { useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import questionsData from '@/data/campaign/questions';
import useLocalStorageState from '@/hooks/useLocalStorageState';

const PROPERTY_VALUE = 180000000; // ₦180M fixed

const DEFAULT_PROPERTY_VALUE = {
  homeownership_status: 'I live with family and friends',
  homeownership_status_custom: '',
  ideal_location: 'Lagos Island',
  ideal_location_custom: '',
  house_type: 'Flat',
  house_type_custom: '',
  number_of_bedrooms: '4 Bedroom',
  number_of_bedrooms_custom: '',
  home_buying_timeline: '1 - 2 years',
  home_buying_timeline_custom: '',
  home_paying_timeline: 'Not sure - need guidance',
  home_paying_timeline_custom: '',
  income_bracket: 'Other (enter exact amount)',
  income_bracket_custom: '5,000,000',
  saving_plan: 'Other (enter exact amount)',
  saving_plan_custom: '40,000,000',
  debt_profile: 'Other (enter exact amount)',
  debt_profile_custom: '15,000,000',
  saving_percent: 'Recommended (33%)',
  saving_percent_custom: '',
  financial_advisory: 'Occasionally for investment planning',
  financial_advisory_custom: '',
  retirement_planning: 'Yes (₦10,000,001 - ₦25,000,000)',
  retirement_planning_custom: '',
};

// === TopBar component ===
const TopBar = ({ currentStep, totalSteps, title, isAnswered, onDotClick }) => {
  const dots = Array.from({ length: totalSteps });

  return (
    <div className="top-bar">
      <div className="top-bar-title">{title}</div>
      <div className="progress-line">
        {dots.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index <= currentStep ? 'active' : ''} ${
              isAnswered(index) ? 'clickable' : ''
            }`}
            style={{
              left: `${(index / (totalSteps - 1)) * 100}%`,
            }}
            onClick={() => isAnswered(index) && onDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

// === ConfirmLandlordPage component ===
export default function ConfirmLandlordPage() {
  const [answers, setAnswers] = useLocalStorageState(
    'confirm_landlord_answers',
    DEFAULT_PROPERTY_VALUE
  );

  const [mode, setMode] = useState(
    Object.keys(DEFAULT_PROPERTY_VALUE).length ? 'summary' : 'question'
  );
  const [currentStep, setCurrentStep] = useState(null);

  const allQuestions = useMemo(() => {
    return questionsData.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        sectionTitle: section.section,
      }))
    );
  }, []);

  const isAnswered = (idx) => {
    const q = allQuestions[idx];
    if (!q) return false;

    const value = answers[q.id];
    if (!value) return false;
    if (value === 'Other (enter exact amount)' && !answers[`${q.id}_custom`]) {
      return false;
    }
    return true;
  };

  const totalSteps = allQuestions.length;
  const currentQuestion = allQuestions[currentStep];
  const currentSectionTitle = currentQuestion?.sectionTitle || '';

  const selectedValue = answers[currentQuestion?.id];

  useEffect(() => {
    if (mode === 'summary') return; // Skip validation when in summary mode

    const firstIncompleteIndex = allQuestions.findIndex(
      (q) =>
        !answers[q.id] ||
        (answers[q.id] === 'Other (enter exact amount)' &&
          !answers[`${q.id}_custom`])
    );

    // 1️⃣ nothing is missing → either stay where we are, or go to summary
    if (firstIncompleteIndex === -1) {
      if (currentStep === null) setMode('summary');
      return; // **do not touch currentStep**
    }

    // 2️⃣ at least one question is missing
    if (currentStep === null) {
      setCurrentStep(firstIncompleteIndex); // first screen-load
    } else if (currentStep > firstIncompleteIndex) {
      setCurrentStep(firstIncompleteIndex); // prevent skipping ahead
    }
  }, [answers, allQuestions, currentStep, mode]);

  // Handlers
  const handleSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
      [`${currentQuestion.id}_custom`]: '',
    }));
  };

  const handleCustomInput = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: 'Other (enter exact amount)',
      [`${currentQuestion.id}_custom`]: value,
    }));
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;

    // If nextStep is beyond totalSteps, or all questions are answered, go to summary
    const firstIncompleteIndex = allQuestions.findIndex(
      (q) =>
        !answers[q.id] ||
        (answers[q.id] === 'Other (enter exact amount)' &&
          !answers[`${q.id}_custom`])
    );
    if (nextStep >= totalSteps || firstIncompleteIndex === -1) {
      // ✅ All steps done → go to summary
      setMode('summary');
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleEdit = (index) => {
    if (index !== -1) {
      setMode('question');
      setCurrentStep(index);
    }
  };

  const getAnswerValue = (id) => {
    return answers[id] === 'Other (enter exact amount)'
      ? answers[`${id}_custom`] || ''
      : answers[id] || '';
  };

  // Calculations
  const {
    income,
    savingPlan,
    debtProfile,
    retirementPlan,
    savingPercentValue,
    yearsToBuy,
    availableFunds,
    totalNeeded,
    monthlySaving,
    monthsNeeded,
  } = useMemo(() => {
    const income = extractHighestValue(getAnswerValue('income_bracket'));
    const savingPlan = extractHighestValue(getAnswerValue('saving_plan'));
    const debtProfile = extractHighestValue(getAnswerValue('debt_profile'));
    const retirementPlan = extractHighestValue(
      getAnswerValue('retirement_planning')
    );
    const savingPercentValue = parseSavingPercent(
      getAnswerValue('saving_percent')
    );

    const availableFunds = savingPlan + 0.25 * retirementPlan;
    const totalNeeded = Math.max(
      PROPERTY_VALUE + debtProfile - availableFunds,
      0
    );

    const monthlySaving = Math.max(0, savingPercentValue * income);
    const monthsNeeded = totalNeeded / monthlySaving;

    const yearsToBuy =
      monthlySaving > 0 && totalNeeded > 0
        ? Math.ceil(monthsNeeded / 12)
        : totalNeeded <= 0
        ? 0
        : 'N/A';

    return {
      income,
      savingPlan,
      debtProfile,
      retirementPlan,
      savingPercentValue,
      yearsToBuy,
      availableFunds,
      totalNeeded,
      monthlySaving,
      monthsNeeded,
    };
  }, [answers]);

  const isNextDisabled =
    !selectedValue ||
    (selectedValue === 'Other (enter exact amount)' &&
      !answers[`${currentQuestion.id}_custom`]);

  return (
    <div className="confirm-landlord-page container py-5">
      <TopBar
        currentStep={mode === 'summary' ? totalSteps : currentStep}
        totalSteps={totalSteps}
        title={mode === 'summary' ? 'Summary' : currentSectionTitle}
        isAnswered={isAnswered}
        onDotClick={handleEdit}
      />

      {mode === 'question' && currentQuestion && (
        <QuestionStep
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentQuestion={currentQuestion}
          selectedValue={selectedValue}
          answers={answers}
          handleSelect={handleSelect}
          handleCustomInput={handleCustomInput}
          handleNext={handleNext}
          handleBack={handleBack}
          isNextDisabled={isNextDisabled}
        />
      )}

      {mode === 'summary' && (
        <SummaryStep
          allQuestions={allQuestions}
          answers={answers}
          handleEdit={handleEdit}
          getAnswerValue={getAnswerValue}
          income={income}
          savingPlan={savingPlan}
          debtProfile={debtProfile}
          retirementPlan={retirementPlan}
          savingPercentValue={savingPercentValue}
          yearsToBuy={yearsToBuy}
          availableFunds={availableFunds}
          totalNeeded={totalNeeded}
          monthlySaving={monthlySaving}
          monthsNeeded={monthsNeeded}
        />
      )}
    </div>
  );
}

const ResultRow = ({ label, value, highlight }) => (
  <div className={`result-row ${highlight ? 'highlight' : ''}`}>
    <div className="result-label">{label}</div>
    <div className="result-value">{value}</div>
  </div>
);

const SummaryStep = ({
  allQuestions,
  answers,
  handleEdit,
  getAnswerValue,
  income,
  savingPlan,
  debtProfile,
  retirementPlan,
  savingPercentValue,
  yearsToBuy,
  availableFunds,
  totalNeeded,
  monthlySaving,
  monthsNeeded,
}) => {
  return (
    <>
      <h3 className="fw-bold mb-3 text-primary fade-in">
        Summary of Your Answers
      </h3>

      <div className="summary-list mb-4 fade-in">
        {allQuestions.map((q, index) => {
          const value = getAnswerValue(q.id);
          return (
            <div
              key={q.id}
              className="summary-item"
              onClick={() => handleEdit(index)}
            >
              <div className="summary-left">
                <span className="summary-number">{index + 1}.</span>
                <span className="summary-question">{q.label}</span>
              </div>
              <div className="summary-answer text-secondary">
                {value || 'No answer'}
              </div>
            </div>
          );
        })}
      </div>

      <h4 className="fw-bold mb-3 text-primary fade-in">Estimated Result</h4>

      <div className="result-table fade-in mb-4">
        <ResultRow
          label="Income Bracket"
          value={displayValue(getAnswerValue('income_bracket'), income)}
        />
        <ResultRow
          label="Saving Plan"
          value={displayValue(getAnswerValue('saving_plan'), savingPlan)}
        />
        <ResultRow
          label="Debt Profile"
          value={displayValue(getAnswerValue('debt_profile'), debtProfile)}
        />
        <ResultRow
          label="Property Value"
          value={`₦${PROPERTY_VALUE.toLocaleString()}`}
        />
        <ResultRow
          label="Retirement Planning"
          value={displayValue(
            getAnswerValue('retirement_planning'),
            retirementPlan
          )}
        />
        <ResultRow
          label="Saving % of Income"
          value={`${Math.round(savingPercentValue * 100)}%`}
        />
        <ResultRow
          label="Estimated Years to Buy a Home"
          value={`${yearsToBuy} years`}
          highlight
        />
      </div>

      {/* Breakdown Table */}
      <BreakdownTable
        savingPlan={savingPlan}
        retirementPlan={retirementPlan}
        propertyValue={PROPERTY_VALUE}
        availableFunds={availableFunds}
        totalNeeded={totalNeeded}
        income={income}
        debtProfile={debtProfile}
        savingPercentValue={savingPercentValue}
        monthlySaving={monthlySaving}
        monthsNeeded={monthsNeeded}
        yearsToBuy={yearsToBuy}
      />

      <Button
        variant="primary"
        className="w-100 py-2 fade-in"
        onClick={() => alert('Submitting answers...')}
      >
        Confirm & Submit
      </Button>
    </>
  );
};

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
}) => (
  <>
    <Button
      variant="link"
      onClick={handleBack}
      className="mb-3 p-0 d-flex align-items-center"
    >
      <FaArrowLeft className="me-2" /> Back
    </Button>

    <div className="text-muted mb-2 small">
      Step {currentStep + 1} of {totalSteps}
    </div>

    <h4 className="fw-bold mb-2 fade-in">{currentQuestion.label}</h4>
    <p className="text-muted mb-2 fade-in">{currentQuestion.prompt}</p>

    {currentQuestion.description && (
      <p className="question-description text-secondary mb-4 fade-in">
        {currentQuestion.description}
      </p>
    )}

    <div className="option-list mb-4 fade-in">
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

    <Button
      variant="danger"
      className="w-100 py-2 fade-in"
      onClick={handleNext}
      disabled={isNextDisabled}
    >
      {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
    </Button>
  </>
);

const BreakdownTable = ({
  propertyValue,
  savingPlan,
  retirementPlan,
  availableFunds,
  debtProfile,
  totalNeeded,
  income,
  savingPercentValue,
  monthlySaving,
  monthsNeeded,
  yearsToBuy,
}) => {
  const pct = (n) => `${Math.round(n * 100)}%`;
  const N = (n) => `₦${n.toLocaleString()}`;

  return (
    <>
      <h4 className="fw-bold mb-3 text-primary fade-in">
        Calculation Breakdown
      </h4>

      <table className="table table-bordered breakdown-table fade-in mb-4">
        <thead>
          <tr>
            <th>Item</th>
            <th className="text-end">Value</th>
            <th>Formula&nbsp;/&nbsp;Origin</th>
          </tr>
        </thead>
        <tbody>
          {/* ---------- Raw inputs ---------- */}
          <tr>
            <td>Property Price</td>
            <td className="text-end">{N(propertyValue)}</td>
            <td>Fixed benchmark for Lagos home</td>
          </tr>
          <tr>
            <td>Savings Already Set Aside</td>
            <td className="text-end">{N(savingPlan)}</td>
            <td>User answer “Saving Plan”</td>
          </tr>
          <tr>
            <td>Retirement Savings (25 % usable)</td>
            <td className="text-end">{N(retirementPlan)}</td>
            <td>User answer “Retirement Planning”</td>
          </tr>
          <tr>
            <td>Current Debt</td>
            <td className="text-end">{N(debtProfile)}</td>
            <td>User answer “Debt Profile”</td>
          </tr>
          <tr>
            <td>Monthly Income</td>
            <td className="text-end">{N(income)}</td>
            <td>User answer “Income Bracket”</td>
          </tr>

          {/* ---------- Derived numbers ---------- */}
          <tr>
            <td>Available Funds</td>
            <td className="text-end">{N(availableFunds)}</td>
            <td>
              <code>Savings&nbsp;+&nbsp;25% × Retirement</code>
              <br />= {N(savingPlan)} + 25 % × {N(retirementPlan)}
            </td>
          </tr>
          <tr>
            <td>Total Cash Needed</td>
            <td className="text-end">{N(totalNeeded)}</td>
            <td>
              <code>Property&nbsp;+&nbsp;Debt&nbsp;–&nbsp;Available Funds</code>
              <br />= {N(propertyValue)} + {N(debtProfile)} –{' '}
              {N(availableFunds)}
            </td>
          </tr>
          <tr>
            <td>Saving Rate</td>
            <td className="text-end">{pct(savingPercentValue)}</td>
            <td>User answer “Saving&nbsp;% of Income”</td>
          </tr>
          <tr>
            <td>Monthly Saving</td>
            <td className="text-end">{N(monthlySaving)}</td>
            <td>
              <code>Income&nbsp;×&nbsp;Saving Rate</code>
              <br />= {N(income)} × {pct(savingPercentValue)}
            </td>
          </tr>
          <tr>
            <td>Months Required</td>
            <td className="text-end">{Math.ceil(monthsNeeded)}</td>
            <td>
              <code>Total Needed&nbsp;/&nbsp;Monthly Saving</code>
              <br />= {N(totalNeeded)} ÷ {N(monthlySaving)}
            </td>
          </tr>
          <tr className="highlight">
            <td>Years to Buy Home</td>
            <td className="text-end">{yearsToBuy}</td>
            <td>
              <code>ceil( Months&nbsp;/&nbsp;12 )</code>
              <br />= ceil({Math.ceil(monthsNeeded)} ÷ 12)
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

const extractHighestValue = (value) => {
  if (!value) return 0;
  if (typeof value === 'string') {
    const match = value.match(/₦([\d,]+)/g);
    if (match && match.length > 0) {
      const nums = match.map((val) => parseInt(val.replace(/[₦,]/g, '')));
      return Math.max(...nums);
    }
  }
  return parseInt(value.replace(/[₦,]/g, '')) || 0;
};

const parseSavingPercent = (value) => {
  if (!value) return 0.33; // default 33%
  if (value.includes('75%')) return 0.75;
  if (value.includes('50%')) return 0.5;
  if (value.includes('33%')) return 0.33;
  if (value.includes('25%')) return 0.25;
  if (value.includes('20%')) return 0.2;
  return 0.33; // fallback
};

const displayValue = (rawValue, extractedNumber) => {
  if (!rawValue) return 'N/A';
  if (rawValue.includes('₦') && rawValue.includes('-')) {
    // Range → show "~ ₦number"
    return `~ ₦${extractedNumber.toLocaleString()}`;
  } else if (rawValue === 'Other (enter exact amount)') {
    return `₦${extractedNumber.toLocaleString()}`;
  } else {
    return `₦${extractedNumber.toLocaleString()}`;
  }
};
