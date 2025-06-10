import React from 'react';
import { Button } from 'react-bootstrap';
import BreakdownTable from './BreakdownTable';
import { displayValue } from './helpers';

const ResultRow = ({ label, value, highlight }) => (
  <div className={`result-row ${highlight ? 'highlight' : ''}`}>
    <div className="result-label">{label}</div>
    <div className="result-value">{value}</div>
  </div>
);

const PROPERTY_VALUE = 180000000;

const SummaryStep = ({
  allQuestions,
  answers,
  handleEdit,
  getAnswerValue,
  income,
  savingPlan,
  setMode,
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

      <h4 className="fw-bold mb-3 text-primary fade-in mt-6">
        Estimated Result
      </h4>

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

      <div className="mb-6"></div>

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
    </>
  );
};

export default SummaryStep;
