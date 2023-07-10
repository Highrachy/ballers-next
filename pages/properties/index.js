import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { API_ENDPOINT } from 'utils/URL';
import { RecommendedPropertyLists } from 'components/common/PropertyCard';
import Axios from 'axios';

const PublicProperties = ({ result }) => {
  return (
    <>
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

export const PropertiesRowList = ({ result, title }) => {
  return result && result.length > 0 ? (
    <div className="container-fluid">
      {title && <h3 className="my-5">{title}</h3>}
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
