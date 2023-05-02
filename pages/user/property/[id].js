import SingleUserProperty from '@/components/pages/user/SingleUserProperty';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleUserProperty id={id} />;
};

export default Single;
