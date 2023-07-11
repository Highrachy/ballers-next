import { useRouter } from 'next/router';
import Home from 'pages';
import React from 'react';

const InviteCode = () => {
  const router = useRouter();
  const { inviteCode } = router.query;
  return <Home inviteCode={inviteCode} />;
};

export default InviteCode;
