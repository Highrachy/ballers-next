import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import PaginatedContent from 'components/common/PaginatedContent';
import { API_ENDPOINT } from 'utils/URL';
import { PropertyIcon } from 'components/utils/Icons';
import { RecommendedPropertyLists } from 'components/common/PropertyCard';

const PublicProperties = () => (
  <>
    <Header />
    <TitleSection
      name="Our Properties"
      content="The only realistic burden free process of owning your ideal home."
    />
    <PaginatedContent
      endpoint={API_ENDPOINT.getAllProperties()}
      // initialFilter={
      //   props?.values?.preferences ? userPreferences : searchFilter
      // }
      pageName="Property"
      pluralPageName="Properties"
      DataComponent={PropertiesRowList}
      // FilterComponent={SearchForm}
      PageIcon={<PropertyIcon />}
      queryName="property"
      showFetching
      noAuthentication
    />
    <CommunityGallery />
    <Footer />
  </>
);

export const PropertiesRowList = ({ results, title }) => {
  return results && results.length > 0 ? (
    <div className="container-fluid">
      {title && <h4 className="mb-5">{title}</h4>}
      <div className="row">
        <RecommendedPropertyLists
          propertyClassName="col-sm-4 col-lg-3"
          properties={results}
          isPublic
        />
      </div>
    </div>
  ) : null;
};

export default PublicProperties;
