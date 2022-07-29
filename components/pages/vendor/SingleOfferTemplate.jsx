import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { useToast } from 'components/utils/Toast';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from 'hooks/useQuery';
import { ContentLoader } from 'components/utils/LoadingItems';
import { OfferIcon } from 'components/utils/Icons';
import { CreateOfferTemplateForm } from './CreateOfferTemplate';

const pageOptions = {
  key: 'offerTemplate',
  pageName: 'Offer Template',
};

const SingleOffer = ({ id }) => {
  const [toast, setToast] = useToast();
  const [offerTemplateQuery, offerTemplate] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneOfferTemplate(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!offerTemplate}
        Icon={<OfferIcon />}
        query={offerTemplateQuery}
        name={pageOptions.pageName}
        toast={toast}
        loadingText="Loading Offer Template"
      >
        <CreateOfferTemplateForm
          toast={toast}
          setToast={setToast}
          offer={offerTemplate}
          offerTemplateId={id}
        />
      </ContentLoader>
    </BackendPage>
  );
};

export default SingleOffer;
