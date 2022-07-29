import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { AllTransactions } from '../shared/Transactions';
import { AllOfflinePayments } from '../shared/OfflinePayments';

const AdminTransactions = () => (
  <BackendPage>
    <AllOfflinePayments />
    <AllTransactions />
  </BackendPage>
);

export default AdminTransactions;
