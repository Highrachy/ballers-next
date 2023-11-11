import CreateOfferLetter from '@/components/pages/vendor/CreateOfferLetter';
import { useRouter } from 'next/router';
import React from 'react';

const CreateOfferLetterPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <CreateOfferLetter id={id} />;
};

export default CreateOfferLetterPage;
