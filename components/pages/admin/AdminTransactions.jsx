import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { AllOfflinePayments } from '@/components/shared/OfflinePayments';
import { AllTransactions } from '@/components/shared/Transactions';
import { WelcomeHero } from 'pages/user/dashboard';

const AdminTransactions = () => (
  <BackendPage>
    <WelcomeHero
      title={`All Transactions`}
      subtitle={`Manage your transactionsx here`}
    />{' '}
    <AllOfflinePayments />
    <AllTransactions />
  </BackendPage>
);

export default AdminTransactions;
