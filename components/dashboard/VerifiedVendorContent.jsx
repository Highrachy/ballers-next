import {
  HomeIcon,
  OfferIcon,
  PortfolioIcon,
  PropertyIcon,
  VasIcon,
} from '@/components/utils/Icons';
import { ContentLoader } from '../utils/LoadingItems';
import WidgetBox from './WidgetBox';
import StackBox from './StackBox';
import OverviewGraph from './OverviewGraph';
import Widget from './Widget';
import { useGetQuery } from '@/hooks/useQuery';
import { API_ENDPOINT } from '@/utils/URL';
import colorTokens from 'style-dictionary/build/color.tokens';
import {
  differenceInDays,
  getDate,
  getDateStatus,
  isPastDate,
} from '@/utils/date-helpers';
import Humanize from 'humanize-plus';
import { getUserName, moneyFormatInNaira } from '@/utils/helpers';
import { ACTIVE_OFFER_STATUS, FAST_TRACK_VENDOR } from '@/utils/constants';
import ServiceBox from './ServiceBox';
import RemittanceWidget from './widgets/RemittanceWidget';
import PendingPropertiesWidget from './widgets/PendingPropertiesWidget';
import PendingPropertyVideosWidget from './widgets/PendingPropertyVideosWidget';
import { UserContext } from '@/context/UserContext';
import React, { useContext, useState } from 'react';
// import ReactJoyride from 'react-joyride';

const VerifiedVendorContent = ({ toast }) => {
  const [dashboardQuery] = useGetQuery({
    axiosOptions: {},
    name: 'dashboard',
    endpoint: API_ENDPOINT.getDashboardInfo(),
    refresh: true,
  });

  const result = dashboardQuery?.data || {};

  const [steps] = React.useState([
    {
      target: '.overview-graph',
      content: 'This is your transaction overview',
    },
    {
      target: '.quick-access',
      content: 'This is your quick access cards to important functionalities',
    },
    {
      target: '.enquiries',
      content:
        'Your pending enquiries and upcoming visitations will be shown here',
    },
    {
      target: '.payments',
      content:
        'Your most recent payment and remittance details will be shown here',
    },
    {
      target: '.quick-look',
      content:
        'This contains a summary of your account information, services and badges earned',
    },
  ]);

  return (
    <>
      <ContentLoader
        hasContent={!!result}
        Icon={<HomeIcon />}
        query={dashboardQuery}
        name="Dashboard"
        toast={toast}
      >
        {/* <ReactJoyride run steps={steps} /> */}
        <Overview result={result} />
        <EnquiriesAndVisitations result={result} />
        <ReceivedPaymentsAndRemittance result={result} />
        <PendingPropertiesAndVideos result={result} />
        <OfferAndServices result={result} />
      </ContentLoader>
    </>
  );
};

const Overview = ({ result }) => {
  const { payments, widgets } = result;
  const data = [
    {
      id: 'transactions',
      label: 'Trasanctions',
      value: payments?.totalReceivedAmount || 0,
      color: colorTokens.secondary[500],
    },
    {
      id: 'pendingRemittance',
      label: 'Pending Remittance',
      value: payments?.pendingRemittanceAmount || 0,
      color: colorTokens.danger[50],
    },
  ];

  const widgetLists = [
    {
      name: 'Properties',
      color: 'danger',
      Icon: <PropertyIcon />,
      value: widgets?.propertyCount || 0,
    },
    {
      name: 'Portfolios',
      link: 'portfolios',
      key: 'portfolios',
      color: 'secondary',
      Icon: <PortfolioIcon />,
      value: widgets?.portfolioCount || 0,
    },
    {
      name: 'Offers',
      color: 'success',
      Icon: <OfferIcon />,
      value: widgets?.offerCount || 0,
    },
    {
      name: 'All Services',
      color: 'warning',
      Icon: <VasIcon />,
      value: widgets?.serviceCount || 0,
    },
  ];

  return (
    <div className="container-fluid py-0 mt-n6">
      <div className="row">
        <section className="widget col-sm-6 mb-4 mb-md-0 overview-graph">
          <OverviewGraph data={data} />
        </section>
        <section className="widget col-sm-6 mb-4 mb-md-0 quick-access">
          <div className="row g-4">
            {widgetLists.map((widget, index) => (
              <Widget key={index} {...widget} role="vendor" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const EnquiriesAndVisitations = ({ result }) => {
  const { recentEnquiries, recentVisitations } = result;

  if (recentEnquiries?.length === 0 && recentVisitations?.length === 0) {
    return null;
  }

  return (
    <div className="container-fluid py-0 enquiries">
      <div className="row">
        <WidgetBox
          title="Pending Enquiries"
          href={`/vendor/enquiries`}
          data={recentEnquiries}
        >
          {recentEnquiries?.map((enquiry, index) => {
            const property = enquiry?.propertyInfo;
            const fullName = `${enquiry?.title} ${enquiry?.firstName} ${enquiry?.lastName}`;

            return (
              <StackBox
                key={index}
                src={property.mainImage}
                title={fullName}
                subtitle={property.name}
                value={moneyFormatInNaira(enquiry?.initialInvestmentAmount)}
                {...getDateStatus(enquiry?.createdAt)}
              />
            );
          })}
        </WidgetBox>
        <WidgetBox
          title="Upcoming Visitations"
          href={`/vendor/scheduled-visits`}
          data={recentVisitations}
        >
          {recentVisitations?.map((visitation, index) => {
            const property = visitation?.propertyInfo;

            return (
              <StackBox
                key={index}
                title={visitation.visitorName}
                subtitle={property.name}
                value={getDate(visitation?.visitDate)}
                {...getDateStatus(visitation?.visitDate)}
              />
            );
          })}
        </WidgetBox>
      </div>
    </div>
  );
};

const ReceivedPaymentsAndRemittance = ({ result }) => {
  const { receivedRemittances, pendingRemittances } = result;

  if (receivedRemittances?.length === 0 && pendingRemittances?.length === 0) {
    return null;
  }
  return (
    <div className="container-fluid py-0 payments">
      <div className="row">
        <RemittanceWidget
          title="Received Payments"
          role="vendor"
          result={receivedRemittances}
          avatarColor="success"
        />
        <RemittanceWidget
          title="Pending Payments"
          role="vendor"
          result={pendingRemittances}
        />
      </div>
    </div>
  );
};

const OfferAndServices = ({ result }) => {
  const { badgesCount = 1 } = result;
  const { userState } = useContext(UserContext);
  const { vendor } = userState;

  const isAutoEnroll = vendor?.fastTrack === FAST_TRACK_VENDOR.AUTO;
  const isDemoAccount = userState?.isDemoAccount;

  return (
    <div className="container-fluid py-0 quick-look">
      <div className="row">
        <WidgetBox title="Quick Look" data={['info']}>
          {isAutoEnroll && (
            <StackBox
              avatarColor={'danger'}
              title={'Fast Tracked Account'}
              subtitle={'This account is automatically managed by BALL'}
            />
          )}
          {badgesCount > 0 && (
            <StackBox
              src="https://user-images.githubusercontent.com/26963369/255422209-359b5f2b-66c6-44f6-8224-c240dc43556c.svg"
              title={`You have earned ${badgesCount} Badge${
                badgesCount !== 1 ? 's' : ''
              }`}
              subtitle={`Your Collection of Achievements on BALL`}
              href="/vendor/badges"
            />
          )}
          {isDemoAccount > 0 && (
            <StackBox
              avatarColor={'danger'}
              title={'Demo Account'}
              subtitle={'This is a demo account'}
            />
          )}
        </WidgetBox>
        <WidgetBox
          title="Recommended Services"
          href="/vendor/services"
          data={['services']}
        >
          <ServiceBox
            link="/services/title-validity"
            title="Structural integrity tests"
            price="400,000"
            content="Conducting structural integrity tests help in assessing the structural soundness of the property, identifying potential defects or damages, and ensuring the safety of the occupants."
          />
        </WidgetBox>
      </div>
    </div>
  );
};

const PendingPropertiesAndVideos = ({ result }) => {
  const { pendingProperties, pendingPropertyVideos } = result;

  if (pendingProperties?.length === 0 && pendingPropertyVideos?.length === 0) {
    return null;
  }

  return (
    <div className="container-fluid py-0">
      <div className="row">
        <PendingPropertiesWidget
          result={result?.pendingProperties}
          role="vendor"
        />
        <PendingPropertyVideosWidget
          result={result?.pendingPropertyVideos}
          role="vendor"
        />
      </div>
    </div>
  );
};

export default VerifiedVendorContent;
