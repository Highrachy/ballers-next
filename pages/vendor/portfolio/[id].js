import { useRouter } from 'next/router';
import React from 'react';
import SinglePortfolio from '@/components/shared/SinglePortfolio';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SinglePortfolio id={id} />;
};

export default Single;
