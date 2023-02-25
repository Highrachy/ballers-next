import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import { moneyFormatInNaira } from 'utils/helpers';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from 'hooks/useQuery';
import 'chart.js/auto';

const PROPERTY_COLOR = '#2dca73';
const CONTRIBUTION_REWARD_COLOR = '#161d3f';
const REFERRAL_COLOR = '#F79B18';
const EMPTY_COLOR = '#c4c4c4';

const ContributionGraph = () => {
  const pageOptions = {
    key: 'accountOverview',
    pageName: 'Contribution Graph',
  };

  const [toast, setToast] = useToast();
  const initialOverview = {
    contributionReward: 0,
    totalAmountPaid: 0,
    referralRewards: 0,
  };
  const [accountOverviewQuery, accountOverview = initialOverview] = useGetQuery(
    {
      key: pageOptions.key,
      name: pageOptions.key,
      setToast,
      endpoint: API_ENDPOINT.getAccountOverview(),
      refresh: true,
    }
  );

  const contributionIsEmpty =
    accountOverview?.contributionReward === 0 &&
    accountOverview?.totalAmountPaid === 0 &&
    accountOverview?.referralRewards === 0;

  return (
    <Card className="card-container h-100">
      <Toast {...toast} showToastOnly />
      <div className="row">
        <div className="col-sm-4">
          <h6>Transactions</h6>
          <OverviewPrice
            title="Property"
            color="green"
            price={
              accountOverviewQuery.isLoading
                ? '-'
                : moneyFormatInNaira(accountOverview.totalAmountPaid)
            }
          />
        </div>
        <div className="col-sm-4">
          <div className="ms-n5 me-n5">
            <Doughnut
              data={{
                labels: ['Property', 'Contribution Rewards', 'Referral Bonus'],
                datasets: [
                  {
                    data: [
                      contributionIsEmpty ? 1 : accountOverview.totalAmountPaid,
                      accountOverview.contributionReward,
                      accountOverview.referralRewards,
                    ],
                    backgroundColor: [
                      contributionIsEmpty ? EMPTY_COLOR : PROPERTY_COLOR,
                      CONTRIBUTION_REWARD_COLOR,
                      REFERRAL_COLOR,
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                rotation: 1,
                maintainAspectRatio: true,
                cutoutPercentage: 75,
                legend: {
                  display: false,
                },
              }}
            />
          </div>
          <h5 className="text-center mt-3">
            {accountOverviewQuery.isLoading
              ? '-'
              : moneyFormatInNaira(
                  accountOverview.totalAmountPaid +
                    accountOverview.contributionReward +
                    accountOverview.referralRewards
                )}
          </h5>
          <p className="text-center  mb-0">
            My BALL <span className="text-orange">Net Worth</span>
          </p>
        </div>
        <div className="col-sm-4">
          <h6>Earnings</h6>
          <OverviewPrice
            title="Contribution Rewards"
            color="purple"
            price={
              accountOverviewQuery.isLoading
                ? '-'
                : moneyFormatInNaira(accountOverview.contributionReward)
            }
          />
          <OverviewPrice
            title="Referral Bonus"
            color="orange"
            price={
              accountOverviewQuery.isLoading
                ? '-'
                : moneyFormatInNaira(accountOverview.referralRewards)
            }
          />
        </div>
      </div>
    </Card>
  );
};

const OverviewPrice = ({ color, title, price }) => (
  <div className={`overview-price__circle overview-price__circle-${color}`}>
    <span className="overview-price__title">{title}</span>
    <strong className="overview-price__amount">{price}</strong>
  </div>
);

export default ContributionGraph;
