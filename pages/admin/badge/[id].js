import SingleBadge from '@/components/pages/admin/SingleBadge';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleBadge id={id} />;
};

export default Single;
