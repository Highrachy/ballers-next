import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { PropertyIcon } from 'components/utils/Icons';
import SearchDashboardPropertyForm from 'components/common/SearchDashboardPropertyForm';
import * as queryString from 'query-string';
import { UserContext } from 'context/UserContext';
import { RecommendedPropertyLists } from 'components/common/PropertyCard';
import { API_ENDPOINT } from 'utils/URL';
import PaginatedContent from 'components/common/PaginatedContent';
import Switch from 'components/forms/Switch';
import { Form, Formik } from 'formik';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import WelcomeHero from '@/components/common/WelcomeHero';

const JustForYou = ({ location }) => {
  const { userState } = React.useContext(UserContext);

  // From search query
  const queryParams = queryString.parse(location?.search);
  const { state, houseType } = queryParams;

  const searchFilter = { state, houseType };
  const userPreferences = {
    ...searchFilter,
    state: userState?.preferences?.location,
    houseType: userState?.preferences?.houseType,
  };

  // use my preference
  // Show Favorites

  return (
    <BackendPage>
      <WelcomeHero
        title="Just for You"
        subtitle="Find your dream property from a personalized selection just for you."
      />
      {/* <SearchForm defaultInputValue={{ state, houseType }} /> */}
      <Formik
        initialValues={setInitialValues({
          favorites: false,
          preferences: false,
        })}
      >
        {({ isSubmitting, handleSubmit, ...props }) => {
          return (
            <>
              <Form className="container-fluid py-r border-bottom mb-4">
                <div className="form-row">
                  <Switch
                    formGroupClassName="col-md-6"
                    label="Show my Favorites Properties"
                    name="favorites"
                    optional
                  />

                  <Switch
                    formGroupClassName="col-md-6"
                    label="Show Properties Based on my Preference"
                    name="preferences"
                    optional
                  />
                  <DisplayFormikState {...props} hide />
                </div>
              </Form>
              {props?.values?.favorites && (
                <section className="mt-5">
                  <PropertiesRowList
                    results={userState.favorites}
                    title="Favorite Properties"
                  />
                  <div className="my-5 border-bottom"></div>
                </section>
              )}
              <div className="mt-5">
                <PaginatedContent
                  endpoint={API_ENDPOINT.searchProperties()}
                  initialFilter={
                    props?.values?.preferences ? userPreferences : searchFilter
                  }
                  pageName="Property"
                  pluralPageName="Properties"
                  DataComponent={PropertiesRowList}
                  FilterComponent={SearchForm}
                  PageIcon={<PropertyIcon />}
                  queryName="property"
                  showFetching
                />
              </div>
            </>
          );
        }}
      </Formik>
    </BackendPage>
  );
};

const SearchForm = ({ defaultInputValue }) => (
  <div className="text-center py-4 mb-3 border-bottom">
    <h4>Search for your preferred Property</h4>
    <div className="row">
      <div className="col-sm-8 mx-auto">
        <div className="property-search__dashboard just-for-you__search">
          <SearchDashboardPropertyForm
            defaultInputValue={defaultInputValue}
            useDashboardStyles={false}
          />
        </div>
      </div>
    </div>
  </div>
);

export const PropertiesRowList = ({ results, title }) => {
  return results && results.length > 0 ? (
    <div className="container-fluid">
      {title && <h4 className="mb-5">{title}</h4>}
      <div className="row">
        <RecommendedPropertyLists
          propertyClassName="col-sm-6"
          properties={results}
        />
      </div>
    </div>
  ) : null;
};

export default JustForYou;
