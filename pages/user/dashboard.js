import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { BgWave, ReferIcon } from 'components/utils/Icons';
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
import colorTokens from 'style-dictionary/build/color.tokens';
import classNames from 'classnames';

export const PegassusImage =
  'https://ballers-staging.s3.amazonaws.com/63da062af9ec130016200f41/7de33a00-ab6a-11ed-9d59-6fa02cafbd66.jpg';
export const BlissvilleImage =
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
      <WelcomeHero isIndex />
      {/* <ShowInfo offers={offers} /> */}
      <Overview />
      <Others />
    </BackendPage>
  );
};

export const WidgetBox = ({
  children,
  title,
  buttonName = 'View All',
  buttonLink,
  isStandAlone,
}) => (
  <div className={`col-sm-6 ${isStandAlone ? '' : 'mt-4'}`}>
    <div className="widget h-100 card widget-box">
      <div className="d-flex align-items-center justify-content-between">
        <h6 className="fw-bold mb-4">{title}</h6>
        {!isStandAlone && (
          <Button color="secondary-light" className="px-4 py-1 mb-4 text-sm">
            {buttonName}
          </Button>
        )}
      </div>
      {children}
    </div>
  </div>
);
// get first 2 letters of title
export const getInitials = (title) => {
  const words = title.split(' ');
  return words[0].charAt(0) + words[1].charAt(0);
};

// assign color (warning, success, primary, danger) based on first letter of title
export const getColor = (title) => {
  const firstLetter = title.charAt(0).toUpperCase();
  const warningLetters = ['A', 'F', 'K', 'P', 'U', 'Z'];
  const successLetters = ['B', 'G', 'L', 'Q', 'V'];
  const primaryLetters = ['C', 'H', 'M', 'R', 'W'];
  const dangerLetters = ['D', 'I', 'N', 'S', 'X'];
  // const secondaryLetters = ['E', 'J', 'O', 'T', 'Y'];

  if (warningLetters.includes(firstLetter)) {
    return 'warning';
  }
  if (successLetters.includes(firstLetter)) {
    return 'success';
  }
  if (primaryLetters.includes(firstLetter)) {
    return 'primary';
  }
  if (dangerLetters.includes(firstLetter)) {
    return 'danger';
  }
  return 'secondary';
};

export const StackBox = ({
  avatarColor = 'primary',
  src,
  title,
  date,
  price,
  status,
  statusName = 'Received',
}) => (
  <div className="widget-stack">
    <section className="d-flex justify-content-between">
      <div className="d-flex flex-row">
        {!src && (
          <div className={`avatar-rounded avatar-${getColor(title)}`}>
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
          <h4 className={`text-primary text-md fw-semibold my-0`}>{title}</h4>
          {date && <p className="text-sm text-primary mt-1 my-0">{date}</p>}
        </div>
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row">
          <div className="text-end">
            {price && (
              <p className="fw-bold text-end mb-0">
                <span className="fw-semibold">
                  <span className="text-md fw-bold">₦</span>
                  {price}
                </span>
              </p>
            )}
            <div className="text-sm status-badge">
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
                <div className="badge bg-primary rounded-pill">
                  {statusName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export const ServiceBox = ({ title, link, price, content }) => (
  <div className="widget-stack service-box">
    <section className="d-flex justify-content-between">
      <div className="d-flex flex-row">
        <div className="d-flex flex-column">
          <h4
            className={`text-secondary text-md fw-semibold my-0  widget-title`}
          >
            {title}
          </h4>
        </div>
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row">
          <div className="text-end">
            {price && (
              <p className="fw-semibold text-end my-0">
                <small className="text-muted fw-normal">From </small>
                <span className="text-md text-primary fw-bold">₦ {price}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
    <section>
      <p className="text-md mt-2 text-primary mb-0">{content}</p>

      <p className="mt-4">
        <Link href={link}>
          <a className="btn btn-primary-light btn-xs btn-wide">Learn More</a>
        </Link>
      </p>
    </section>
  </div>
);

export const WelcomeHero = ({
  title,
  subtitle,
  isIndex = false,
  isApproved = true,
}) => {
  const { userState } = React.useContext(UserContext);

  return (
    <section className="position-relative mt-n5">
      <div
        className={classNames('dashboard-hero mb-3', {
          'index-page': isIndex,
          'onboarding-user': !isApproved,
        })}
      >
        <SquareBubbles />
        <div className="px-4 py-6">
          <h2 className="text-white mt-4 mt-md-0">
            {title || `Hello, ${userState.firstName}`}{' '}
          </h2>
          <p className="lead">
            {subtitle ||
              `Welcome to BALL - your dream home is just a few clicks away.`}
          </p>
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

export const Overview = ({ type = 'user' }) => (
  <div className="container-fluid py-0 mt-n6">
    <ContributionGraph type={type} />
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
            status="1"
            statusName="Due: 5 days"
          />
        </WidgetBox>

        <WidgetBox title="Active Offers">
          <StackBox
            title="Blissville Uno"
            date="Due: 7 days"
            status="2"
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
        <WidgetBox title="Recent Transactions">
          <StackBox
            title="Pegassus Duplexes"
            date="Mar 10th, 2023"
            src={PegassusImage}
            price="150,000"
            status="3"
            statusName="Paystack"
          />
          <StackBox
            title="Pegassus Duplexes"
            date="Mar 10th, 2023"
            src={PegassusImage}
            price="150,000"
            status="3"
            statusName="Paystack"
          />
        </WidgetBox>
        <WidgetBox title="Recommended Services">
          <ServiceBox
            link="/services/title-validity"
            title="Title Validity"
            price="50,000"
            content="Title validity refers to the legal status of the ownership of a property. It is essential to ensure that the title of a property is valid and clear before buying or selling it."
          />
        </WidgetBox>
      </div>

      <ReferAndEarn />

      {/* <div className="row mt-5">
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
      </div> */}
    </div>
  </>
);

export const ReferAndEarn = () => (
  <InfoBox
    title="Refer a friend, and BALL together!"
    Icon={<ReferIcon />}
    linkHref="user/refer"
    linkText="Refer and Earn"
  >
    Invite your friends to join BALL and you can ball together! <br />
    <span className="d-none d-md-inline">
      Share the love and achieve your homeownership goals with BALL!
    </span>
  </InfoBox>
);

export const InfoBox = ({
  color = 'primary',
  title,
  children,
  Icon,
  linkHref,
  linkText,
}) => (
  <Card className="info-box widget card  d-block my-4 position-relative h-100">
    <section className={`widget-${color} p-3`}>
      <div className="card-body">
        <div className="row">
          <h4 className={`fw-bold text-${color}`}>{title}</h4>
          <div className="col-8">
            <p className="mt-3 mb-4 text-gray">{children}</p>
            <Link href={linkHref}>
              <a className={`btn btn-${color}`}>{linkText}</a>
            </Link>
          </div>
          <div className="col-3 col-sm-4 text-end widget-svg">{Icon}</div>
        </div>
      </div>
    </section>
  </Card>
);

export const DashboardTable = ({ children, title, className }) => {
  return (
    <div className={classNames('table-responsive card mb-5', className)}>
      <table className="table table-border table-striped">
        <thead>
          <tr>
            <th colSpan="6">
              <h5 className="my-3">{title}</h5>
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Dashboard;
