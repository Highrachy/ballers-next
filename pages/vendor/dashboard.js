import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Link from 'next/link';
import { ReferIcon } from 'components/utils/Icons';
import ContributionGraph from 'components/common/ContributionGraph';
import Toast, { useToast } from 'components/utils/Toast';
import { getShortDate } from 'utils/date-helpers';
import TimeAgo from 'react-timeago';
import { isPast } from 'date-fns';
import { FileIcon } from 'components/utils/Icons';
import {
  BlissvilleImage,
  InfoBox,
  Overview,
  PegassusImage,
  ReferAndEarn,
  ServiceBox,
  StackBox,
  WelcomeHero,
  WidgetBox,
} from 'pages/user/dashboard';

const Dashboard = () => {
  const [toast, setToast] = useToast();

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        subtitle="Welcome to BALL - Maximize Your Property Sales with BALL"
        isIndex
      />
      <Overview type="vendor" />
      <Others />
    </BackendPage>
  );
};

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

const Others = () => (
  <>
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox title="Enquiries">
          <StackBox
            title="Pegassus Duplexes"
            src={PegassusImage}
            date="Haruna Popoola"
            price="15,000,000"
            status="0"
            statusName="Pending"
          />
          <StackBox
            title="Blissville Uno"
            src={BlissvilleImage}
            date="Adeola Ogunlana"
            price="25,000,000"
            status="1"
            statusName="Created"
          />
        </WidgetBox>

        <WidgetBox title="Scheduled Visitation">
          <StackBox
            title="Blissville Uno"
            date="April 3th, 2023 (2:00PM)"
            status="2"
            statusName="Due: 2 days"
          />
          <StackBox
            title="Pegassus Duplexes"
            date="April 10th, 2023"
            status="1"
            statusName="Due: 12 days"
          />
        </WidgetBox>
      </div>
      <div className="row row-eq-height">
        <WidgetBox title="Upcoming Remittance">
          <StackBox
            title="Pegassus Duplexes"
            date="Mar 10th, 2023"
            src={PegassusImage}
            price="150,000"
            status="2"
            statusName="Pending"
          />
          <StackBox
            title="Pegassus Duplexes"
            date="Mar 10th, 2023"
            src={PegassusImage}
            price="150,000"
            status="2"
            statusName="Pending"
          />
        </WidgetBox>
        <WidgetBox title="Recommended Services">
          <ServiceBox
            link="/services/title-validity"
            title="Structural integrity tests"
            price="400,000"
            content="Conducting structural integrity tests help in assessing the structural soundness of the property, identifying potential defects or damages, and ensuring the safety of the occupants."
          />
        </WidgetBox>
      </div>

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

export default Dashboard;
