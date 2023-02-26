import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { ReferIcon } from 'components/utils/Icons';
import { RightArrowIcon, SearchIcon } from 'components/utils/Icons';
import SearchForProperty from 'components/common/SearchDashboardPropertyForm';
import ContributionGraph, {
  ContributionGraph2,
} from 'components/common/ContributionGraph';
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
import { PropertiesRowList } from '@/components/common/PropertiesRowList';
import SquareBubbles from '@/components/common/SquareBubbles';

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
      {/* <ShowInfo offers={offers} /> */}
      <Overview />
      <Others />
    </BackendPage>
  );
};

const Welcome = () => {
  const { userState } = React.useContext(UserContext);
  const WINDOW_SIZE = useWindowSize();
  const [showSearch, setShowSearch] = React.useState(
    WINDOW_SIZE.width > MOBILE_WIDTH
  );
  return (
    <section className="position-relative mt-n5">
      <div className="dashboard-hero mb-3">
        <SquareBubbles />
        <div className="px-5 py-6">
          <h2 className="text-white">Hello, {userState.firstName} </h2>
          <p className="lead">Welcome to BALL!</p>
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
        <Link href={`/user/offer/${_id}`} passHref>
          <a className="btn btn-success btn-sm float-end">View Offer Letter</a>
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
  <div className="container-fluid mt-n6">
    <ContributionGraph2 />
    {/* <div className="row row-eq-height">
      <div className="col-sm-8 mb-3">
        <ContributionGraph />
      </div>
      <div className="col-sm-4 mb-3">
        <ReferAndEarn />
      </div>
    </div> */}
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
    <Link href="/user/refer-and-earn">
      <a className="btn btn-sm btn-secondary">Refer and Earn</a>
    </Link>
  </section>
);

const Others = () => (
  <>
    <div className="container-fluid">
      <LinkHeader href="/user/portfolio" name="Overview" />
      <div className="row row-eq-height">
        <PortfolioCards isSinglePortfolio hideTitle hidePagination limit="2" />
      </div>
      <EnjoyYourBallingExperience />

      <LinkHeader href="/user/just-for-you" name="Just for you" />

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

const LinkHeader = ({ name, href }) => (
  <>
    <div className="link-header">
      <span>{name}</span>
      <Link href={href}>
        <a>
          View All &nbsp;
          <RightArrowIcon />
        </a>
      </Link>
    </div>
  </>
);

const EnjoyYourBallingExperience = () => (
  <Card className="card-container d-block text-center h-100">
    <h5 className="mt-5">Enjoying your balling experience?</h5>
    <div className="mb-5">Expand your portfolio today</div>

    <Link href="/user/just-for-you">
      <a className="btn btn-sm btn-secondary">Add a new property + </a>
    </Link>
  </Card>
);

export default Dashboard;
