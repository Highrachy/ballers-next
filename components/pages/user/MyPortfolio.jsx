import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Link } from '@reach/router';
import Toast, { useToast } from 'components/utils/Toast';
import { PropertyIcon } from 'components/utils/Icons';
import PortfolioCards from 'components/common/PortfolioCards';
import { OffersRowList } from '../shared/Offers';
import { API_ENDPOINT } from 'utils/URL';
import { OfferIcon } from 'components/utils/Icons';
import PaginatedContent from 'components/common/PaginatedContent';
import { PropertiesRowList } from './JustForYou';

const Portfolio = () => {
  const [toast, setToast] = useToast();
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <Content setToast={setToast} />
    </BackendPage>
  );
};

const Content = ({ setToast, recommendedProperties }) => (
  <>
    <div className="container-fluid">
      <div className="row">
        <PortfolioCards setToast={setToast} />
      </div>
    </div>

    <Offers />
    <EnjoyingBallers />

    {/* show this if portfolio is empty */}
    <div className="container-fluid">
      <h5 className="mt-4">Just for you</h5>
      <div className="row">
        <PaginatedContent
          endpoint={API_ENDPOINT.searchProperties()}
          // initialFilter={filter}
          pageName="Property"
          pluralPageName="Properties"
          DataComponent={PropertiesRowList}
          PageIcon={<PropertyIcon />}
          queryName="property"
          limit={2}
          hidePagination
          hideTitle
        />
      </div>
    </div>
  </>
);

const EnjoyingBallers = () => (
  <section className="container-fluid">
    <div className="card bg-primary dashboard mt-4 mb-3">
      <div className="row py-4">
        <div className="col-sm-8">
          <h4>Enjoying your balling experience </h4>
          <p className="lead">Expand your portfolio today</p>
        </div>
        <div className="col-sm-4">
          <section className="property-btn">
            <Link to="/user/just-for-you" className="btn btn-secondary">
              + Add a New Property
            </Link>
          </section>
        </div>
      </div>
    </div>
  </section>
);

const Offers = () => (
  <PaginatedContent
    endpoint={API_ENDPOINT.getAllOffers()}
    pageName="Offer"
    pluralPageName="Offers"
    DataComponent={OffersRowList}
    PageIcon={<OfferIcon />}
    queryName="offer"
  />
);

export default Portfolio;
