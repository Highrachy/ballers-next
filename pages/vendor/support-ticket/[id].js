import SingleSupportTicket from '@/components/shared/SingleSupportTicket';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleSupportTicket id={id} />;
};

export default Single;
