import { useRouter } from 'next/router';
import React from 'react';
import SingleVas from '@/components/shared/SingleVas';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleVas id={id} />;
};

export default Single;
