import SingleOffer from '@/components/shared/SingleOffer';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleOffer id={id} />;
};

export default Single;
