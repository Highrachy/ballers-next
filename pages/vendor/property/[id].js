import { useRouter } from 'next/router';
import React from 'react';
import SingleProperty from '@/components/shared/SingleProperty';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleProperty id={id} />;
};

export default Single;
