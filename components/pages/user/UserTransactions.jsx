import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import ContributionGraph from 'components/common/ContributionGraph';
import { AllTransactions } from '../shared/Transactions';

import { AllOfflinePayments } from '../shared/OfflinePayments';

const UserTransactions = () => (
  <BackendPage>
    <Overview />
    <AllOfflinePayments />
    <AllTransactions />
  </BackendPage>
);

const Overview = () => (
  <div className="container-fluid ">
    <ContributionGraph />
  </div>
);

export default UserTransactions;
