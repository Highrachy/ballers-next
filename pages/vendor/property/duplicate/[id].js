import { useRouter } from 'next/router';
import React from 'react';
import SingleProperty from '@/components/shared/SingleProperty';
import { useGetQuery } from '@/hooks/useQuery';
import { API_ENDPOINT } from '@/utils/URL';
import { ContentLoader } from '@/components/utils/LoadingItems';
import { PropertyIcon } from '@/components/utils/Icons';
import { NewPropertyForm } from '../new';
import { useToast } from '@/components/utils/Toast';
import BackendPage from '@/components/layout/BackendPage';

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const DuplicateProperty = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;

  return (
    <BackendPage>
      <div className="container-fluid">
        <DuplicatePropertyForm id={id} />
      </div>
    </BackendPage>
  );
};

const DuplicatePropertyForm = ({ id }) => {
  const [toast, setToast] = useToast();
  const [propertyQuery, property] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneProperty(id),
    refresh: true,
  });

  return (
    <ContentLoader
      hasContent={!!property}
      Icon={<PropertyIcon />}
      query={propertyQuery}
      name={pageOptions.pageName}
      toast={toast}
    >
      <NewPropertyForm
        toast={toast}
        setToast={setToast}
        property={{ ...property, _id: null, name: '' }}
      />
    </ContentLoader>
  );
};

export default DuplicateProperty;
