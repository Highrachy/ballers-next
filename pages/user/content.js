import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import ContentGraph from '@/components/common/ContentGraph';
import WelcomeHero from '@/components/common/WelcomeHero';

const Dashboard = () => {
  return (
    <BackendPage>
      <WelcomeHero
        title="Content Property"
        subtitle="Update Property for People's view"
      />
      <ContentGraph />
    </BackendPage>
  );
};

export default Dashboard;
