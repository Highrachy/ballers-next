import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import ContributionGraph from 'components/common/ContributionGraph';
import { AllOfflinePayments } from '@/components/shared/OfflinePayments';
import { AllTransactions } from '@/components/shared/Transactions';
import {
  BlissvilleImage,
  PegassusImage,
  StackBox,
  WelcomeHero,
  WidgetBox,
} from './dashboard';
import MyResponsivePie from '@/components/common/PieChart';
import { moneyFormatInNaira } from 'utils/helpers';
import Colors from 'style-dictionary/build/color.tokens.js';
import NoContent from '@/components/utils/NoContent';
import { TransactionIcon } from '@/components/utils/Icons';

const UserTransactions = () => (
  <BackendPage>
    <WelcomeHero
      title="Transaction"
      subtitle="Secure and Seamless Transactions for Your Real Estate Needs"
    />
    <Overview />
    <AllOfflinePayments />
    <AllTransactions />
  </BackendPage>
);

const data = [
  {
    id: 'Online Payments',
    label: 'Online Payments',
    value: 0,
  },
  {
    id: 'Offline Payments',
    label: 'Offline Payments',
    value: 0,
  },
  {
    id: 'Pending Payments',
    label: 'Pending Payments',
    value: 0,
  },
];

const ChartColors = [
  Colors.success[500],
  Colors.success[700],
  Colors.danger[50],
];

const Overview = () => {
  const emptyData = [
    {
      id: 'noTransactions',
      label: 'No Trasanctions Yet',
      value: 1000,
    },
  ];
  const isAllZero = data.every((item) => item.value === 0);
  const graphData = isAllZero ? emptyData : data;
  return (
    <section className="container-fluid">
      <div className="row">
        <div className="widget col-sm-6">
          {/* card */}
          <div className="card h-100 position-relative">
            {/* card body */}
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center mb-4">
                <h6 className="card-title me-2">Overview</h6>
              </div>
              <div className="row align-items-center">
                <div className="col-12" style={{ height: '250px' }}>
                  <MyResponsivePie
                    data={graphData}
                    colors={ChartColors}
                    isAllZero={isAllZero}
                  />
                </div>
              </div>

              <div className="row justify-content-between g-0">
                <div className="col-12">
                  {/* <h6 className="text-md">Analysis</h6> */}
                  <div className="text-sm mt-3">
                    <div className="d-flex flex-between-center mb-1">
                      <div className="d-flex align-items-center">
                        <span
                          className="dot"
                          style={{ backgroundColor: ChartColors[0] }}
                        />
                        <span className="fw-semi-bold">Online Payments</span>
                      </div>

                      <span>{moneyFormatInNaira(data[0].value)}</span>
                    </div>
                    <div className="d-flex flex-between-center mb-1">
                      <div className="d-flex align-items-center">
                        <span
                          className="dot"
                          style={{ backgroundColor: ChartColors[1] }}
                        />
                        <span className="fw-semi-bold">Offline Payments</span>
                      </div>
                      <span>{moneyFormatInNaira(data[1].value)}</span>
                    </div>
                    <div className="d-flex flex-between-center mb-1">
                      <div className="d-flex align-items-center">
                        <span
                          className="dot"
                          style={{ backgroundColor: ChartColors[2] }}
                        />
                        <span className="fw-semi-bold">Pending Payments</span>
                      </div>
                      <span>{moneyFormatInNaira(data[2].value)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WidgetBox title="Pending Payments" isStandAlone>
          <NoContent text="No Pending Payments" Icon={<TransactionIcon />} />
          {/* <StackBox
            title="Pegassus Duplexes"
            src={PegassusImage}
            date="Mar 10th, 2023"
            price="100,000"
            status="3"
            statusName="Bank Draft"
          />
          <StackBox
            title="Blissville Uno"
            src={BlissvilleImage}
            date="Mar 10th, 2023"
            price="150,000"
            status="2"
            statusName="Bank Transfer"
          /> */}
        </WidgetBox>
      </div>
    </section>
  );
};

export default UserTransactions;
