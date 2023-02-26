import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import { moneyFormatInNaira } from 'utils/helpers';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from 'hooks/useQuery';
import 'chart.js/auto';

import Humanize from 'humanize-plus';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HeartAdd, Buildings, StatusUp, UserAdd } from 'iconsax-react';
import Button from '../forms/Button';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const widgetLists = [
  {
    name: 'Porfolio',
    link: 'my-properties',
    key: 'assignedProperty',
    color: 'primary',
    Icon: <Buildings variant="Bulk" />,
  },
  {
    name: 'Active Services',
    color: 'secondary',
    Icon: <StatusUp variant="Bulk" />,
  },
  {
    name: 'Contribution Rewards',
    color: 'warning',
    Icon: <UserAdd variant="Bulk" />,
  },
  {
    name: 'Referral Rewards',
    color: 'danger',
    key: 'interests',
    Icon: <HeartAdd variant="Bulk" />,
  },
];

const WidgetList = () => {
  return (
    <div className="col-sm-6">
      <div className="row g-4">
        {widgetLists.map((widget, index) => (
          <Widget
            key={index}
            number={Math.floor(Math.random() * 200)}
            {...widget}
          />
        ))}
      </div>
    </div>
  );
};

export const Widget = ({
  name,
  color,
  link,
  Icon,
  number,
  className = 'col-6',
  role = 'user',
}) => {
  const url = `/app/${role}/${link || name}`;

  return (
    <section className={`widget ${className}`}>
      <Link href={url} passHref>
        <a className="text-reset">
          <div className="card position-relative">
            <div className="card-body">
              <h6 className="card-title mt-0" title="Number of Customers">
                {Humanize.capitalize(name)}
              </h6>
              <h2 className="text-muted mt-2 mb-3">{number || 0}</h2>
              <div className="mt-5"></div>
              <div className="float-end widget-icon">{Icon}</div>
            </div>{' '}
            {/* end card-body*/}
          </div>
        </a>
      </Link>
    </section>
  );
};

export const ContributionGraph2 = () => {
  const radialchartColors = [' #5156be', ' #34c38f'];
  const options = {
    chart: {
      height: 270,
      type: 'radialBar',
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -130,
        endAngle: 130,
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 10,
            fontSize: '18px',
            color: undefined,
            formatter: function (val) {
              return val + '%';
            },
          },
        },
      },
    },
    colors: [radialchartColors[0]],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: [radialchartColors[1]],
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [20, 60],
      },
    },
    stroke: {
      dashArray: 4,
    },
    legend: {
      show: false,
    },
    series: [80],
    labels: ['Series A'],
  };

  const series = [67];

  return (
    <div className="row">
      <WidgetList />
      <div className="widget col-sm-6">
        {/* card */}
        <div className="card h-100 position-relative">
          {/* card body */}
          <div className="card-body">
            <div className="d-flex flex-wrap align-items-center mb-4">
              <h6 className="card-title me-2">Invested Overview</h6>
              <div className="ms-auto">
                <Button
                  href="#"
                  className="px-5 py-2 btn-wide"
                  color="secondary"
                >
                  View
                </Button>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-12">
                <Chart
                  options={options}
                  series={series}
                  type="radialBar"
                  height={300}
                />
              </div>
              <div className="col-sm align-self-center">
                <div className="mt-4 mt-sm-0">
                  <p className="mb-1">Invested Amount</p>
                  <h4>$ 6134.39</h4>
                  <p className="text-muted mb-4">
                    {' '}
                    + 0.0012.23 ( 0.2 % ){' '}
                    <i
                      className="mdi mdi-arrow-up ms-1
                                              text-success"
                    />
                  </p>
                  {/* <div className="row g-0">
                    <div className="col-6">
                      <div>
                        <p
                          className="mb-2
                                                      text-muted
                                                      text-uppercase
                                                      font-size-11"
                        >
                          Income
                        </p>
                        <h5 className="fw-medium">$ 2632.46</h5>
                      </div>
                    </div>
                    <div className="col-6">
                      <div>
                        <p
                          className="mb-2
                                                      text-muted
                                                      text-uppercase
                                                      font-size-11"
                        >
                          Expenses
                        </p>
                        <h5 className="fw-medium">-$ 924.38</h5>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <a
                      href="#"
                      className="btn
                                              btn-primary btn-sm"
                    >
                      View more{' '}
                      <i
                        className="mdi
                                                  mdi-arrow-right ms-1"
                      />
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end col */}

      {/* end col */}
    </div>
  );
};

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
      <div className="row"></div>
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
                cutout: '75%',
                plugins: {
                  legend: { display: false },
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
