import { useRouter } from 'next/router';
import React from 'react';
import SingleVasRequest from '@/components/shared/SingleVasRequest';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleVasRequest id={id} />;
};

export default Single;
