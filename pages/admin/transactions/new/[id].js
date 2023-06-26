import NewTransaction from '@/components/pages/admin/NewTransaction';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <NewTransaction offerId={id} />;
};

export default Single;
