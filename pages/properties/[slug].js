import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { ContentLoader } from 'components/utils/LoadingItems';
import { useGetQuery } from 'hooks/useQuery';
import { useToast } from 'components/utils/Toast';
import { API_ENDPOINT } from 'utils/URL';
import { PortfolioIcon } from 'components/utils/Icons';
import { useRouter } from 'next/router';
import { OwnedPropertyCard } from '@/components/shared/SingleProperty';
import { Actionbar } from '@/components/pages/user/SingleUserProperty';

const PublicPropertySingle = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <>
      <Header />
      <TitleSection
        name="Single Property"
        content="The only realistic burden free process of owning your ideal home."
      />
      <section className="row justify-content-center">
        <div className="col-md-10 col-lg-9">
          <LoadProperty slug={slug} />
        </div>
      </section>

      <CommunityGallery />
      <Footer />
    </>
  );
};

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const LoadProperty = ({ slug }) => {
  const [toast, setToast] = useToast();
  const [propertyQuery, property, setProperty] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, slug],
    setToast,
    endpoint: API_ENDPOINT.getPropertyBySlug(slug),
    refresh: true,
  });
  const loadedProperty = propertyQuery?.data?.result[0];
  return (
    <ContentLoader
      hasContent={!!loadedProperty}
      Icon={<PortfolioIcon />}
      query={propertyQuery}
      name={pageOptions.pageName}
      toast={toast}
    >
      <OwnedPropertyCard
        property={loadedProperty}
        setToast={setToast}
        setProperty={setProperty}
        enquiryInfo={loadedProperty?.enquiryInfo}
        vendorInfo={loadedProperty?.vendorInfo}
        Actionbar={
          <Actionbar
            property={loadedProperty}
            visitationInfo={loadedProperty?.visitationInfo}
            setToast={setToast}
            vasQuery={{}}
          />
        }
      />
    </ContentLoader>
  );
};
export default PublicPropertySingle;
