import React, { useState, useMemo } from 'react';
import QuestionPage from '@/components/game/question/QuestionPage';
import InterludePage from '@/components/game/result/InterludePage';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import questionsData from '@/data/campaign/questions';

/** 1-based positions where an interlude should appear */
const BREAK_STEPS = [4, 7];

export default function Start() {
  /* ─────────────────────── State ─────────────────────── */
  const [answers, setAnswers] = useLocalStorageState(
    'confirm_landlord_answers',
    {}
  );
  const [step, setStep] = useState(0); // zero-based question index
  const [view, setView] = useState('question'); // 'question' | 'interlude'

  /* ─────────────────── Derived values ────────────────── */
  const questions = useMemo(
    () =>
      questionsData.flatMap((sec) =>
        sec.questions.map((q) => ({ ...q, section: sec.section }))
      ),
    []
  );

  const total = questions.length;
  const question = questions[step];
  const answer = answers[question?.id];

  /* ──────────────────── Helpers ──────────────────────── */
  const saveAnswer = (value) =>
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

  const goNext = () => {
    const next = step + 1;

    // show interlude if this was a break point
    if (BREAK_STEPS.includes(next + 1)) {
      setStep(next);
      setView('interlude');
    } else {
      setStep(next);
    }
  };

  const goBack = () => {
    if (view === 'interlude') setView('question');
    else if (step > 0) setStep((s) => s - 1);
  };

  /* ─────────────────── Render switch ─────────────────── */
  if (view === 'interlude') {
    return (
      <InterludePage
        heading={step + 1 === 4 ? 'Half-way there!' : 'Final stretch!'}
        onContinue={() => setView('question')}
      />
    );
  }

  return (
    <QuestionPage
      currentStep={step}
      totalSteps={total}
      currentQuestion={question}
      selectedValue={answer}
      answers={answers}
      handleSelect={saveAnswer}
      handleNext={goNext}
      handleBack={goBack}
      isNextDisabled={!answer}
    />
  );
}
