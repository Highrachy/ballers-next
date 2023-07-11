import { useRouter } from 'next/router';
import Home from 'pages';
import React from 'react';

const ReferralCode = () => {
  const router = useRouter();
  const { referralCode } = router.query;
  return <Home referralCode={referralCode} />;
};

export default ReferralCode;
