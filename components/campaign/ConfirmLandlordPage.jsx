import { useEffect, useMemo, useState } from 'react';
import questionsData from '@/data/campaign/questions';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import ResultPage from './ResultPage';
import QuestionStep from './QuestionStep';
import SummaryStep from './SummaryStep';
import BreakdownTable from './BreakdownTable';
import {
  extractHighestValue,
  parseSavingPercent,
  displayValue,
} from './helpers';
import Button from '../forms/Button';
import { Card } from 'react-bootstrap';

const PROPERTY_VALUE = 180000000; // ₦180M fixed

// const DEFAULT_PROPERTY_VALUE = {
//   homeownership_status: 'I live with family and friends',
//   homeownership_status_custom: '',
//   ideal_location: 'Lagos Island',
//   ideal_location_custom: '',
//   house_type: 'Flat',
//   house_type_custom: '',
//   number_of_bedrooms: '4 Bedroom',
//   number_of_bedrooms_custom: '',
//   home_buying_timeline: '1 - 2 years',
//   home_buying_timeline_custom: '',
//   home_paying_timeline: 'Not sure - need guidance',
//   home_paying_timeline_custom: '',
//   income_bracket: 'Other (enter exact amount)',
//   income_bracket_custom: '5,000,000',
//   saving_plan: 'Other (enter exact amount)',
//   saving_plan_custom: '40,000,000',
//   debt_profile: 'Other (enter exact amount)',
//   debt_profile_custom: '15,000,000',
//   saving_percent: 'Recommended (33%)',
//   saving_percent_custom: '',
//   financial_advisory: 'Occasionally for investment planning',
//   financial_advisory_custom: '',
//   retirement_planning: 'Yes (₦10,000,001 - ₦25,000,000)',
//   retirement_planning_custom: '',
// };

export default function ConfirmLandlordPage() {
  const [answers, setAnswers] = useLocalStorageState(
    'confirm_landlord_answers',
    {}
    // DEFAULT_PROPERTY_VALUE
  );

  const [mode, setMode] = useState('question');
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
    if (mode !== 'question') return;

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
    const debtProfile = 0;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const isNextDisabled =
    !selectedValue ||
    (selectedValue === 'Other (enter exact amount)' &&
      !answers[`${currentQuestion.id}_custom`]);

  return (
    <div className="confirm-landlord-page container py-5">
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
          mode={mode}
          currentSectionTitle={currentSectionTitle}
          isAnswered={isAnswered}
          handleEdit={handleEdit}
        />
      )}

      {/* Show result page when finished, with toggle for summary */}
      {mode === 'summary' && (
        <ResultWithSummaryToggle
          allQuestions={allQuestions}
          setMode={setMode}
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

// // --- ResultWithSummaryToggle component ---
// import { useState } from 'react';
// import SummaryStep from './SummaryStep';
// import ResultPage from './ResultPage';

function ResultWithSummaryToggle(props) {
  const [showSummary, setShowSummary] = useState(false);
  return (
    <div>
      <ResultPage
        answers={props.answers}
        yearsToBuy={props.yearsToBuy}
        availableFunds={props.availableFunds}
        totalNeeded={props.totalNeeded}
      />
      <hr />
      <div className="text-center my-4">
        <Button
          color="primary"
          className="mt-4"
          onClick={() => setShowSummary((s) => !s)}
        >
          {showSummary ? 'Hide' : 'Show'} All Breakdown
        </Button>
      </div>
      <section className="mb-4 p-6">
        {showSummary && (
          <SummaryStep
            allQuestions={props.allQuestions}
            setMode={props.setMode}
            answers={props.answers}
            handleEdit={props.handleEdit}
            getAnswerValue={props.getAnswerValue}
            income={props.income}
            savingPlan={props.savingPlan}
            debtProfile={props.debtProfile}
            retirementPlan={props.retirementPlan}
            savingPercentValue={props.savingPercentValue}
            yearsToBuy={props.yearsToBuy}
            availableFunds={props.availableFunds}
            totalNeeded={props.totalNeeded}
            monthlySaving={props.monthlySaving}
            monthsNeeded={props.monthsNeeded}
          />
        )}
      </section>
    </div>
  );
}
