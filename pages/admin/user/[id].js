import SingleUser from '@/components/pages/admin/SingleUser';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleUser id={id} />;
};

export default Single;
