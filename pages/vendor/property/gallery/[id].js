import { useRouter } from 'next/router';
import React from 'react';
import SingleProperty from '@/components/shared/SingleProperty';
import Gallery from '@/components/shared/Gallery';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <Gallery propertyId={id} />;
};

export default Single;
