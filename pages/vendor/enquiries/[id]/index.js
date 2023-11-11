import SingleEnquiry from '@/components/shared/SingleEnquiry';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleEnquiry id={id} />;
};

export default Single;
