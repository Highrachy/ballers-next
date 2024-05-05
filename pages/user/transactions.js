import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { AllOfflinePayments } from '@/components/shared/OfflinePayments';
import { AllTransactions } from '@/components/shared/Transactions';
import WelcomeHero from '@/components/common/WelcomeHero';
import TabContent from '@/components/dashboard/TabContent';

const UserTransactions = () => {
  const allTabs = [
    {
      title: 'Confirmed Transactions',
      component: <AllTransactions />,
    },
    {
      title: 'Pending Transactions',
      component: <AllOfflinePayments />,
    },

    {
      // TODO: Implement this
      title: 'Upcoming Payements',
      component: <AllOfflinePayments />,
    },
  ];
  return (
    <BackendPage>
      <WelcomeHero
        title="Transaction"
        subtitle="Secure and Seamless Transactions for Your Real Estate Needs"
      />

      <TabContent allTabs={allTabs} />
    </BackendPage>
  );
};

export default UserTransactions;
