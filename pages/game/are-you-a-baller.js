/******************************************************************
 * pages/game/Start.jsx
 ******************************************************************/
import React, { useState, useMemo, useEffect } from 'react';

import QuestionPage from '@/components/game/question/QuestionPage';
import InterludePage from '@/components/game/result/InterludePage';
import SummaryPage from '@/components/game/result/SummaryPage';

import useLocalStorageState from '@/hooks/useLocalStorageState';
import questionsData from '@/data/campaign/questions';
import { hasAnswer } from '@/components/game/shared/helper';

/* 1-based break pages */
const BREAK_STEPS = [];

export default function Start() {
  /* ───────────────────── state ───────────────────── */
  const [answers, setAnswers] = useLocalStorageState(
    'are-you-a-baller-answers',
    {}
  );
  const [step, setStep] = useState(0); // 0-based
  const [view, setView] = useState('question'); // question | interlude | summary

  /* ───────────── flat question list ──────────────── */
  const questions = useMemo(
    () =>
      questionsData.flatMap((sec) =>
        sec.questions.map((q) => ({ ...q, section: sec.section }))
      ),
    []
  );
  const total = questions.length;

  /* ───────────── helper lambdas ───────────────────── */
  const needsInterlude = (idx) => BREAK_STEPS.includes(idx + 1); // 0→1

  const firstIncomplete = () =>
    questions.findIndex((q) => !hasAnswer(q.id, answers));

  /* jump automatically on answers change ------------- */
  useEffect(() => {
    const idx = firstIncomplete();
    if (idx === -1) {
      setView('summary');
      return;
    } // everything answered
    setStep(idx);
    setView('question');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* save answer ------------------------------------- */
  const saveAnswer = (val) =>
    setAnswers((prev) => ({ ...prev, [questions[step].id]: val }));

  /* save custom answer ------------------------------------- */
  const saveCustom = (id, customVal) =>
    setAnswers((prev) => ({ ...prev, [`${id}_custom`]: customVal }));

  /* forward ----------------------------------------- */
  const goNext = () => {
    const next = step + 1;
    if (next >= total) {
      setView('summary');
      return;
    }

    if (needsInterlude(next)) {
      setStep(next);
      setView('interlude');
    } else {
      setStep(next);
    }
  };

  /* back -------------------------------------------- */
  const goBack = () => {
    /* coming FROM an interlude → show previous question */
    if (view === 'interlude') {
      if (step > 0) setStep((s) => s - 1);
      setView('question');
      return;
    }

    /* already at first question */
    if (step === 0) return;

    const prevIdx = step - 1;

    setStep(prevIdx);
    setView('question');
  };

  /* ───────────── view switch ─────────────────────── */
  if (view === 'interlude')
    return (
      <InterludePage
        heading={step + 1 === 4 ? 'Half-way there!' : 'Final stretch!'}
        onContinue={() => setView('question')}
        onPrevious={goBack}
      />
    );

  if (view === 'summary')
    return (
      <SummaryPage
        answers={answers}
        questions={questions}
        onRestart={() => {
          setAnswers({});
          setStep(0);
          setView('question');
        }}
      />
    );

  /* default: question */
  const current = questions[step];
  const selected = answers[current?.id];

  return (
    <QuestionPage
      currentStep={step}
      totalSteps={total}
      currentQuestion={current}
      selectedValue={selected}
      answers={answers}
      handleSelect={saveAnswer}
      handleNext={goNext}
      handleBack={goBack}
      handleCustom={saveCustom}
      isNextDisabled={!hasAnswer(current.id, answers)}
    />
  );
}
