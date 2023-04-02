import { useRouter } from 'next/router';
import React from 'react';
import SinglePortfolio from '@/components/shared/SinglePortfolio';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log('id', id);
  return <SinglePortfolio id={'63da0ab3f9ec130016200f5c'} />;
};

export default Single;
