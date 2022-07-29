import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import { Link } from '@reach/router';
import { ReferIcon } from 'components/utils/Icons';
import { RightArrowIcon, SearchIcon } from 'components/utils/Icons';
import SearchForProperty from 'components/common/SearchDashboardPropertyForm';
import ContributionGraph from 'components/common/ContributionGraph';
import useWindowSize from 'hooks/useWindowSize';
import { MOBILE_WIDTH, BASE_API_URL } from 'utils/constants';
import { UserContext } from 'context/UserContext';
import { PropertyIcon } from 'components/utils/Icons';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError } from 'utils/helpers';
import Toast, { useToast } from 'components/utils/Toast';
import { getShortDate } from 'utils/date-helpers';
import TimeAgo from 'react-timeago';
import { isPast } from 'date-fns';
import PortfolioCards from 'components/common/PortfolioCards';
import { FileIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import PaginatedContent from 'components/common/PaginatedContent';
import { PropertiesRowList } from './JustForYou';

const Dashboard = () => {
  const [toast, setToast] = useToast();
  const [offers, setOffers] = React.useState(null);

  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/offer/active`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        if (status === 200) {
          setOffers(data.offers);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [setToast]);

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <Welcome />
      <ShowInfo offers={offers} />
      <Overview />
      <Others />
    </BackendPage>
  );
};

const Welcome = () => {
  const { userState /* userDispatch */ } = React.useContext(UserContext);
  const WINDOW_SIZE = useWindowSize();
  const [showSearch, setShowSearch] = React.useState(
    WINDOW_SIZE.width > MOBILE_WIDTH
  );
  return (
    <section className="container-fluid">
      <div className="card bg-primary dashboard mb-3">
        <div className="row">
          <div className="col-sm-5">
            <h4>Hello, {userState.firstName} </h4>
            <p className="lead">Welcome to BALL!</p>
          </div>
          <div className="col-sm-7">
            <section className="property-search__dashboard">
              {showSearch ? (
                <SearchForProperty />
              ) : (
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => setShowSearch(true)}
                >
                  <SearchIcon /> Search Property
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

const ShowInfo = ({ offers }) =>
  offers ? (
    <div className="container-fluid">
      {offers.map((offer, index) => (
        <OffersRow key={index} number={index + 1} {...offer} />
      ))}
    </div>
  ) : null;

const OffersRow = ({ _id, expires, status, propertyInfo, vendorInfo }) => {
  if (isPast(expires) || status !== 'Generated') {
    return null;
  }
  return (
    <div className="card d-flex flex-row toast-alert info">
      <div className="span toast-icon-holder icon-xl">
        <FileIcon />
      </div>
      <div className="w-100 font-weight-normal">
        <Link
          className="btn btn-success btn-sm float-right"
          to={`/user/offer/${_id}`}
        >
          View Offer Letter
        </Link>
        {vendorInfo?.vendor?.companyName} has sent you an offer letter for{' '}
        <strong>{propertyInfo.name}</strong>
        <br />
        <small className="text-muted">
          Expires on {getShortDate(expires)} (<TimeAgo date={expires} />)
        </small>
      </div>
    </div>
  );
};

const Overview = () => (
  <div className="container-fluid ">
    <div className="row row-eq-height">
      <div className="col-sm-8 mb-3">
        <ContributionGraph />
      </div>
      <div className="col-sm-4 mb-3">
        <ReferAndEarn />
      </div>
    </div>
  </div>
);

const ReferAndEarn = () => (
  <section className="card d-block card-container h-100 text-center">
    <div className="icon-container">
      <ReferIcon width={48} height={48} />
    </div>
    <h5 className="mt-3">Refer and Earn</h5>
    <p className="">
      Refer your colleagues and friends to receive bonuses to grow your BALL net
      worth.
    </p>
    <Link to="/user/refer-and-earn" className="btn btn-sm btn-secondary">
      Refer and Earn
    </Link>
  </section>
);

const Others = () => (
  <>
    <div className="container-fluid">
      <LinkHeader to="/user/portfolio" name="Overview" />
      <div className="row row-eq-height">
        <PortfolioCards isSinglePortfolio hideTitle hidePagination limit="2" />
      </div>
      <EnjoyYourBallingExperience />

      <LinkHeader to="/user/just-for-you" name="Just for you" />

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

const LinkHeader = ({ name, to }) => (
  <>
    <div className="link-header">
      <span>{name}</span>
      <Link to={to}>
        View All &nbsp;
        <RightArrowIcon />
      </Link>
    </div>
  </>
);

const EnjoyYourBallingExperience = () => (
  <Card className="card-container d-block text-center h-100">
    <h5 className="mt-5">Enjoying your balling experience?</h5>
    <div className="mb-5">Expand your portfolio today</div>

    <Link to="/user/just-for-you" className="btn btn-sm btn-secondary">
      Add a new property +{' '}
    </Link>
  </Card>
);

export default Dashboard;
