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
        title="BALL Properties for Sale in Nigeria with Payment Plans"
        description="Explore verified Lagos properties with flexible payment plans. Find terraces, duplexes & apartments in Lekki, Ajah, Sangotedo on BALL."
        canonical="https://www.ballers.ng/properties"
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

      <section style={{ display: 'none' }}>
        <h2>Properties for Sale in Lagos and Across Nigeria</h2>
        <p>
          BALL offers a curated list of verified properties including duplexes,
          terraces, apartments and premium residential units across Lagos and
          Nigeria. Each listing is vetted to ensure authenticity, transparent
          pricing and flexible payment options to support your homeownership
          journey.
        </p>

        <h3>What You Can Expect</h3>
        <ul>
          <li>Fully verified developers and BALL VIP partners</li>
          <li>Flexible payment plans for all property types</li>
          <li>Homes in Lekki, Ajah, Sangotedo, Abijo and more</li>
          <li>Detailed property information and high-quality images</li>
          <li>Access to expert support for buying decisions</li>
        </ul>

        <p>
          Whether you&apos;re purchasing your first home or upgrading, BALL
          provides trusted listings built for Nigerians seeking security,
          convenience and transparency when buying property.
        </p>
      </section>
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
