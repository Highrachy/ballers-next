import React, { useState, useMemo } from 'react';
import QuestionPage from '@/components/game/question/QuestionPage';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import questionsData from '@/data/campaign/questions';

const Start = () => {
  const [answers, setAnswers] = useLocalStorageState(
    'confirm_landlord_answers',
    {}
  );
  const [currentStep, setCurrentStep] = useState(0); // initialize to first step

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

  const isNextDisabled =
    !selectedValue ||
    (selectedValue === 'Other (enter exact amount)' &&
      !answers[`${currentQuestion.id}_custom`]);
  return (
    <QuestionPage
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
      currentSectionTitle={currentSectionTitle}
      isAnswered={isAnswered}
      handleEdit={handleEdit}
    />
  );
};

export default Start;
