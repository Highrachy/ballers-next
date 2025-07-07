import React from 'react';
import GameModal from './GameModal';
import { toTitleCase } from './helper';

export default function GameInsightsModal({
  isOpen,
  onClose,
  answers = {},
  bulletCache = {},
}) {
  return (
    <GameModal isOpen={isOpen} title="Your Insights" onClose={onClose}>
      <div className="text-start px-2 px-md-4 pb-3 text-white mb-5">
        {/* ---------- 1. OVERALL RESULT ---------- */}
        {bulletCache?.results && (
          <section className="text-center">
            <div className="result-image my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/img/game/summary/${bulletCache.results.emoji}`}
                alt="Certified Baller badge"
                width={150}
                className="img-fluid"
              />
            </div>

            <h3 className="mb-4 text-gold fw-bold">
              {bulletCache.results.label}
            </h3>

            <div className="diamond-divider navy my-4">
              <span />
              <span className="diamond" />
              <span />
            </div>
            <h4 className="mb-5 fw-normal h5 text-white">
              {bulletCache.results.summary}
            </h4>
          </section>
        )}
        <hr />
        {/* ---------- 2. INSIGHT BULLETS (except “results”) ---------- */}
        {Object.entries(bulletCache).filter(([k]) => k !== 'results').length >
          0 && (
          <section className="my-5">
            <h3 className="fw-bold text-white mb-3">Your Insights</h3>
            {Object.entries(bulletCache)
              .filter(([k]) => k !== 'results')
              .map(([key, value]) => {
                const [question, prettyLabel = key] = key.split('::');
                return (
                  <div key={key} className="mb-4">
                    <h6
                      className="fw-bold mb-2"
                      style={{ color: 'var(--gold)', wordBreak: 'break-word' }}
                    >
                      {toTitleCase(question)}: {toTitleCase(prettyLabel)}
                    </h6>
                    <div>
                      {value.replace(/<([^>]+)>/g, (_, k) => answers[k] ?? '')}
                    </div>
                  </div>
                );
              })}
          </section>
        )}
        <hr />
        {/* ---------- 3. USER ANSWERS ---------- */}
        {false && (
          <section>
            <h3 className="fw-bold mt-4" style={{ color: 'var(--gold)' }}>
              Your Answers
            </h3>
            {Object.keys(answers).length === 0 ? (
              <div className="text-muted">No answers available.</div>
            ) : (
              <ul className="ps-3">
                {Object.entries(answers).map(([key, value]) => (
                  <li key={key} className="mb-1">
                    <div className="fw-bold">{toTitleCase(key)}:&nbsp;</div>
                    <div className="mb-3">{value}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <button
          type="button"
          className="btn-game btn-game--red mt-4"
          onClick={onClose}
          style={{ float: 'right' }}
        >
          Close
        </button>
      </div>
    </GameModal>
  );
}
