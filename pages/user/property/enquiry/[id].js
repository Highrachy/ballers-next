import { useRouter } from 'next/router';
import React from 'react';
import PropertyEnquiry from '@/components/pages/user/PropertyEnquiry';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <PropertyEnquiry id={id} />;
};

export default Single;
