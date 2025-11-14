import React, { useEffect } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { API_ENDPOINT } from 'utils/URL';
import { RecommendedPropertyLists } from 'components/common/PropertyCard';
import Axios from 'axios';
import Button from '@/components/forms/Button';
import { useChatMessage } from '@/context/ChatContext';
import SeoHead from '@/components/utils/SeoHead';

const PublicProperties = ({ result }) => {
  const { setMessage } = useChatMessage();

  useEffect(() => {
    setMessage(
      'Hi! I am looking for the right property on BALL. Could you help me with more information on how to proceed?'
    );
  }, [setMessage]);

  // Use best available image for OG image
  const firstImage =
    result && result[0]?.mainImage
      ? result[0].mainImage
      : 'https://www.ballers.ng/img/pages/ball-refer.png';

  return (
    <>
      <SeoHead
        title="Properties for Sale in Lagos | Affordable Flexible Payment Homes | BALL"
        description="Explore verified properties for sale in Lagos with flexible payment plans. Find duplexes, terraces, apartments and premium homes in Ajah, Lekki, Sangotedo and more on BALL."
        canonical="https://ballers.ng/properties"
        ogImage={firstImage}
        keywords={[
          'properties for sale in lagos',
          'houses for sale in lekki',
          'ajah houses for sale',
          'terrace duplex lagos',
          '4 bedroom duplex in lagos',
          'homes with payment plan',
          'buy house in nigeria',
          'sangotedo houses for sale',
          'ball real estate',
        ]}
      />
      <Header />
      <TitleSection
        name="Our Properties"
        content="The only realistic burden free process of owning your ideal home."
      />
      <PropertiesRowList result={result} title="Available Properties" />
      <CommunityGallery />
      <Footer />
    </>
  );
};

export const PropertiesRowList = ({ result, title, viewAllLink }) => {
  return result && result.length > 0 ? (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h3 className="mt-7 mb-4 d-flex justify-content-between align-items-center">
            {title}
            {viewAllLink && (
              <Button href={viewAllLink} color="secondary-light" wide>
                View All
              </Button>
            )}
          </h3>
        </div>
      </div>
      <div className="row">
        <RecommendedPropertyLists
          propertyClassName="col-sm-6 col-lg-6 col-xl-4"
          properties={result}
          isPublic
        />
      </div>
    </div>
  ) : null;
};

export async function getStaticProps() {
  const propertiesRes = await Axios.get(API_ENDPOINT.getAllProperties());

  return {
    props: {
      ...propertiesRes.data,
    },
    revalidate: 10,
  };
}

export default PublicProperties;
