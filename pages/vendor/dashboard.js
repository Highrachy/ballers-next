import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { UserContext } from '@/context/UserContext';
import WelcomeHero from '@/components/common/WelcomeHero';
import VerifiedVendorContent from '@/components/dashboard/VerifiedVendorContent';
import UnVerifiedVendorContent from '@/components/dashboard/UnVerifiedVendorContent';

const Dashboard = () => {
  const [toast, setToast] = useToast();
  const { userState } = React.useContext(UserContext);
  const isVerifiedVendor = !!userState?.vendor?.verified;

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        subtitle="Welcome to BALL - Maximize Your Property Sales with BALL"
        isIndex
        isApproved={isVerifiedVendor}
      />

      {isVerifiedVendor ? (
        <VerifiedVendorContent toast={toast} />
      ) : (
        <UnVerifiedVendorContent />
      )}
    </BackendPage>
  );
};

export default Dashboard;
