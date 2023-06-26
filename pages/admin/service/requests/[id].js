import SingleVasRequest from 'components/pages/shared/SingleVasRequest';
import { useRouter } from 'next/router';
import React from 'react';

const Single = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <SingleVasRequest id={id} />;
};

export default Single;
