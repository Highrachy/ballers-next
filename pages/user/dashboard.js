import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
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
import { PropertiesRowList } from '@/components/common/PropertiesRowList';
import SquareBubbles from '@/components/common/SquareBubbles';
import Button from '@/components/forms/Button';
import { OnlineImage } from '@/components/utils/Image';

import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';

const PegassusImage =
  'https://ballers-staging.s3.amazonaws.com/63da062af9ec130016200f41/7de33a00-ab6a-11ed-9d59-6fa02cafbd66.jpg';
const BlissvilleImage =
  'https://ballers-staging.s3.amazonaws.com/63d73318936e55001633c84c/95a141e0-a04e-11ed-86c2-f1037f8bce01.jpg';

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

const WidgetBox = ({ children, title, buttonName = 'View All' }) => (
  <div className="col-sm-6 mt-4">
    <div className="widget h-100 card widget-box">
      <div className="d-flex align-items-center justify-content-between">
        <h6 className="fw-bold mb-4">{title}</h6>
        <Button color="secondary-light" className="px-4 py-1 mb-4 text-sm">
          {buttonName}
        </Button>
      </div>
      {children}
    </div>
  </div>
);
// get first 2 letters of title
const getInitials = (title) => {
  const words = title.split(' ');
  return words[0].charAt(0) + words[1].charAt(0);
};

const StackBox = ({
  avatarColor = 'secondary',
  src,
  title,
  date,
  price,
  content,
  status,
  statusName = 'Received',
  hideTitle = false,
}) => (
  <div className="widget-stack">
    <section className="d-flex justify-content-between">
      <div className="d-flex flex-row">
        {!src && !hideTitle && (
          <div className={`avatar-rounded bg-${avatarColor}`}>
            {getInitials(title)}
          </div>
        )}
        {src && (
          <OnlineImage
            src={src}
            name={`property`}
            width="40"
            className="img-rounded"
            alt="property"
            defaultImage={PropertyPlaceholderImage}
          />
        )}
        <div className="d-flex flex-column">
          <h4
            className={`text-primary text-md fw-semibold mb-0 ${
              content ? 'widget-title' : ''
            }`}
          >
            {title}
          </h4>
          {date && <p className="text-sm text-primary mt-1 mb-0">{date}</p>}
        </div>
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row">
          <div className="text-end">
            {price && (
              <p className="fw-bold text-end mb-0">
                <span className="fw-semibold">
                  {content && (
                    <small className="text-muted fw-normal">From </small>
                  )}
                  <span className="text-md fw-bold">₦</span>
                  {price}
                </span>
              </p>
            )}
            <div className="text-xs status-badge">
              {status === '0' && (
                <div className="badge bg-danger rounded-pill">{statusName}</div>
              )}
              {status === '1' && (
                <div className="badge bg-success rounded-pill">
                  {statusName}
                </div>
              )}
              {status === '2' && (
                <div className="badge bg-secondary rounded-pill">
                  {statusName}
                </div>
              )}
              {status === '3' && (
                <div className="badge bg-dark rounded-pill">{statusName}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <p className="text-sm mt-2 text-primary mb-0">{content}</p>
    </section>
  </div>
);

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
  <div className="container-fluid py-0 mt-n6">
    <ContributionGraph />
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

const Others = () => (
  <>
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox title="Upcoming Payments">
          <StackBox
            title="Pegassus Duplexes"
            src={PegassusImage}
            date="Mar 10th, 2023"
            price="100,000"
            status="0"
            statusName="Overdue: 7 days"
          />
          <StackBox
            title="Blissville Uno"
            src={BlissvilleImage}
            date="Mar 10th, 2023"
            price="150,000"
            status="2"
            statusName="Due: 5 days"
          />
        </WidgetBox>

        <WidgetBox title="Active Offers">
          <StackBox
            title="Blissville Uno"
            date="Due: 7 days"
            status="0"
            statusName="Awaiting"
          />
          <StackBox
            title="Pegassus Duplexes"
            date="Mar 10th, 2023"
            status="1"
            statusName="Signed"
          />
        </WidgetBox>
      </div>
      <div className="row row-eq-height">
        <WidgetBox title="RecentTransactions">
          <StackBox
            title="Pegassus Duplexes"
            date="Mar 10th, 2023"
            src={PegassusImage}
            price="150,000"
            status="2"
            statusName="Paystack"
          />
          <StackBox
            title="Title Validity"
            date="Mar 10th, 2023"
            price="20,000"
            status="2"
            statusName="Bank Transfer"
          />
        </WidgetBox>
        <WidgetBox title="Recommended Services">
          <StackBox
            title="Title Validity"
            hideTitle
            price="50,000"
            content="This is the proof of ownership of the property and the right to sell, mortgage,..."
          />
          <StackBox
            title="Survey Plan Investigation"
            hideTitle
            price="20,000"
            content="This is a process of examining the official survey plan of a property to verify..."
          />
        </WidgetBox>
      </div>

      <EnjoyYourBallingExperience />

      <div className="row mt-5">
        <h4 className="mb-4">Recommended Properties</h4>
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
  <Card className="widget card d-block text-center py-5 my-4 h-100">
    <div className="icon-container">
      <ReferIcon width={48} height={48} />
    </div>
    <h5 className="mt-3">Enjoying your balling experience?</h5>
    <p className="mb-3">
      Refer your colleagues and friends to receive bonuses to grow your BALL net
      worth.
    </p>
    <Link href="/user/refer-and-earn">
      <a className="btn btn-secondary">Refer and Earn</a>
    </Link>
  </Card>
);

export default Dashboard;
