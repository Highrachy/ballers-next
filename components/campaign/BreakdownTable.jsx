import React from 'react';

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

export default BreakdownTable;
