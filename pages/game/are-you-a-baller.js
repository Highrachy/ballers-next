/******************************************************************
 * pages/game/Start.jsx
 ******************************************************************/
import React, { useState, useMemo, useEffect } from 'react';

import QuestionPage from '@/components/game/question/QuestionPage';
import InterludePage from '@/components/game/result/InterludePage';
import SummaryPage from '@/components/game/result/SummaryPage';

import useLocalStorageState from '@/hooks/useLocalStorageState';
import questionsData from '@/data/game/questions';
import { hasAnswer, STORAGE } from '@/components/game/shared/helper';
import {
  INTERLUDES, // [{step, heading, badge, ids, collectContact}]
  BREAK_STEPS, // Set of the .step values above
  buildInterludeBullets,
} from '@/components/game/shared/interludeConfig';
import { gameEntrySync } from '@/components/game/shared/gameSync';

/* ─────────────────────────────────────────────────────────────── */

export default function Start() {
  /* ─── persistent state (local-storage hooks) ─── */
  const [answers, setAnswers] = useLocalStorageState(STORAGE.ANSWERS, {});
  const [bulletCache, setBulletCache] = useLocalStorageState(
    STORAGE.BULLET_CACHE,
    {}
  );

  const [contact, setContact] = useLocalStorageState(STORAGE.CONTACT, {});

  /* ─── navigation state ─── */
  const [step, setStep] = useState(0); // zero-based question index
  const [view, setView] = useState('question'); // question | interlude | summary

  /* ─── flat list of questions ─── */
  const questions = useMemo(
    () =>
      questionsData.flatMap((sec) =>
        sec.questions.map((q) => ({ ...q, section: sec.section }))
      ),
    []
  );
  const total = questions.length;

  /* ─── handy helpers ─── */
  const needsInterlude = (idx) => BREAK_STEPS.has(idx + 1); // idx is 0-based
  const firstIncomplete = () =>
    questions.findIndex((q) => !hasAnswer(q.id, answers));

  /* ────────────────────── FIRST-LOAD routing ─────────────────── */
  useEffect(() => {
    const idx = firstIncomplete();

    /* ① still have unanswered questions → jump to that question */
    if (idx !== -1) {
      setStep(idx);
      setView('question');
      return;
    }

    /* ② all answered but NO contact yet → show contact interlude */
    if (!contact.name || !contact.email) {
      setStep(total); // pseudo step 12 (contact screen)
      setView('interlude'); // cfg.collectContact === true
      return;
    }

    /* ③ everything done → summary */
    setView('summary');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); /* run only once on mount */

  useEffect(() => {
    if (view !== 'summary') {
      gameEntrySync.sync(answers, bulletCache, contact);
    }
  }, [answers, bulletCache, contact, step, view]);

  /* ────────────────────── answer handlers ───────────────────── */
  const saveAnswer = (val) =>
    setAnswers((prev) => ({ ...prev, [questions[step].id]: val }));

  const saveCustom = (id, val) =>
    setAnswers((prev) => ({ ...prev, [`${id}_custom`]: val }));

  /* ────────────────────── navigation ────────────────────────── */
  const goNext = () => {
    const next = step + 1;

    /* A. content interludes (steps 3, 7, 10) */
    if (needsInterlude(next)) {
      setStep(next);
      setView('interlude');
      return;
    }

    /* B. after last real question (index 11) */
    if (next >= total) {
      if (contact.name && contact.email) setView('summary');
      else {
        // show contact capture
        setStep(next); // pseudo step 12
        setView('interlude');
      }
      return;
    }

    /* C. normal advance */
    setStep(next);
  };

  const goBack = () => {
    if (view === 'interlude') {
      setView('question');
      if (step > 0) setStep((s) => s - 1);
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  };

  /* ────────────────────── RENDER SWITCH ─────────────────────── */
  if (view === 'interlude') {
    const cfg = INTERLUDES.find((i) => i.step === step + 1) ?? {
      heading: '',
      badge: '',
      ids: [],
    };

    /* last interlude: collect contact */
    if (cfg.collectContact) {
      if (contact?.email && contact?.name) {
        // already have contact info, skip to summary
        setView('summary');
        return null; // no need to render anything
      }
      return (
        <InterludePage
          collectContact // ⇠ show the form
          heading="One last thing…"
          badgeSrc={cfg.badge}
          onSaveContact={(obj) => {
            setContact((prev) => ({ ...prev, ...obj }));
            setView('summary');
          }}
          currentStep={step + 1}
        />
      );
    }

    /* normal interlude */
    const bullets = buildInterludeBullets(
      cfg,
      answers,
      bulletCache,
      setBulletCache
    );

    return (
      <InterludePage
        heading={cfg.heading}
        badgeSrc={cfg.badge}
        bullets={bullets}
        currentStep={step + 1} /* cosmetic 1-based */
        onContinue={() => setView('question')}
        onPrevious={goBack}
      />
    );
  }

  if (view === 'summary') {
    return (
      <SummaryPage
        answers={answers}
        contact={contact}
        questions={questions}
        onRestart={() => {
          setAnswers({});
          setContact({});
          setStep(0);
          setView('question');
        }}
      />
    );
  }

  /* default: QUESTION screen */
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
      handleCustom={saveCustom}
      handleNext={goNext}
      handleBack={goBack}
      isNextDisabled={!hasAnswer(current.id, answers)}
    />
  );
}
