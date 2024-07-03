import React from 'react';
import BackendPage from '@/components/layout/BackendPage';
import {
  BadgesIcon,
  EnquiryIcon,
  OfferIcon,
  PortfolioIcon,
  PropertyIcon,
  ReferIcon,
  TransactionIcon,
  VasIcon,
  VisitationIcon,
} from '@/components/utils/Icons';
import Toast, { useToast } from '@/components/utils/Toast';
import {
  differenceInDays,
  getDate,
  getDateStatus,
  getShortDate,
  isPastDate,
} from 'utils/date-helpers';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from '@/hooks/useQuery';
import { ContentLoader } from '@/components/utils/LoadingItems';
import Humanize from 'humanize-plus';
import WidgetBox from '@/components/dashboard/WidgetBox';
import WelcomeHero from '@/components/common/WelcomeHero';
import StackBox from '@/components/dashboard/StackBox';
import Widget from '@/components/dashboard/Widget';
import { moneyFormatInNaira } from '@/utils/helpers';
import RecentOffersWidget from '@/components/dashboard/widgets/RecentOffersWidget';
import RemittanceWidget from '@/components/dashboard/widgets/RemittanceWidget';
import RecentTransactionsWidget from '@/components/dashboard/widgets/RecentTransactionsWidget';
import ServiceBox from '@/components/dashboard/ServiceBox';

const Dashboard = () => {
  const [toast] = useToast();

  const [dashboardQuery] = useGetQuery({
    axiosOptions: {},
    name: 'dashboard',
    endpoint: API_ENDPOINT.getDashboardInfo(),
    refresh: true,
  });

  const result = dashboardQuery?.data || {};

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero subtitle="Welcome to the Admnistrative Dashboard" />
      <AdminOverview result={result} />
      <PendingPropertiesAndOffers result={result} />
      <ReceivedPaymentsAndRemittance result={result} />
    </BackendPage>
  );
};

const AdminOverview = ({ result }) => {
  const { widgets } = result;

  const widgetLists = [
    {
      name: 'Properties',
      color: 'danger',
      Icon: <PropertyIcon />,
      value: widgets?.propertyCount || 0,
    },
    {
      name: 'Portfolios',
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
      name: 'Transactions',
      color: 'pink',
      Icon: <TransactionIcon />,
      value: widgets?.transactionCount || 0,
    },
    {
      name: 'Services',
      key: 'service',
      link: 'service',
      color: 'warning',
      Icon: <VasIcon />,
      value: widgets?.serviceCount || 0,
    },
    {
      name: 'Enquiries',
      color: 'pink',
      Icon: <EnquiryIcon />,
      value: widgets?.enquiryCount || 0,
    },
    {
      name: 'Scheduled Visits',
      color: 'primary',
      link: 'scheduled-visits',
      key: 'visitations',
      Icon: <VisitationIcon />,
      value: widgets?.visitationCount || 0,
    },
    {
      name: 'Badges',
      color: 'secondary',
      Icon: <BadgesIcon />,
      value: widgets?.badgeCount || 0,
    },
  ];

  return (
    <div className="container-fluid py-0 mt-n6">
      <div className="row g-4">
        {widgetLists.map((widget, index) => (
          <Widget
            key={index}
            {...widget}
            role="admin"
            className="col-6 col-md-6 col-lg-4 col-xl-3"
          />
        ))}
      </div>
    </div>
  );
};

const PendingPropertiesAndOffers = ({ result }) => {
  const { pendingProperties } = result;

  return (
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox
          title="Pending Properties"
          href={`/admin/properties`}
          data={pendingProperties}
        >
          {pendingProperties?.map((property, index) => {
            const vendorInfo = property?.vendorInfo;
            return (
              <StackBox
                key={index}
                src={property.mainImage}
                title={`${property.name} (${property.houseType})`}
                subtitle={vendorInfo?.vendor?.companyName}
                value={moneyFormatInNaira(property?.price)}
                {...getDateStatus(property?.createdAt)}
              />
            );
          })}
        </WidgetBox>
        <RecentOffersWidget result={result?.recentOffers} role="admin" />
      </div>
    </div>
  );
};

const ReceivedPaymentsAndRemittance = ({ result }) => {
  return (
    <div className="container-fluid py-0">
      <div className="row">
        <RecentTransactionsWidget
          result={result?.recentTransactions}
          role="admin"
        />
        <RemittanceWidget
          title="Pending Remittance"
          role="admin"
          result={result?.pendingRemittances}
        />
      </div>
    </div>
  );
};

const Others = ({
  allPortfolios,
  portfoliosQuery,
  allTransactions,
  transactionsQuery,
}) => (
  <>
    <div className="container-fluid py-0">
      <div className="row row-eq-height">
        <WidgetBox title="Pending Video Approval" href={`/user/portfolio`}>
          <StackBox
            title="Blissville Uno"
            date="Submitted: 7 days"
            status="0"
            statusName="Awaiting"
          />
          <StackBox
            title="Pegassus Duplexes"
            date="Submitted: 8 days"
            status="0"
            statusName="Awaiting"
          />
        </WidgetBox>

        <WidgetBox title="Requested Services" href={`/user/transactions`}>
          <StackBox
            title="Survey Inspection"
            date="Submitted: 7 days"
            status="0"
            statusName="Awaiting"
          />
          <StackBox
            title="Title Verification"
            date="Submitted: 2 days"
            status="0"
            statusName="Awaiting"
          />
        </WidgetBox>
      </div>
      <div className="row row-eq-height">
        <WidgetBox title="Upcoming Payments" href={`/user/transactions`}>
          <ContentLoader
            hasContent={allPortfolios?.length > 0}
            Icon={<TransactionIcon />}
            query={portfoliosQuery}
            name={'Active Offer'}
            noContentText={`You have no upcoming payments`}
          >
            {allPortfolios?.map((portfolio, index) => {
              const nextPayment = portfolio?.nextPaymentInfo?.[0];
              const property = portfolio?.propertyInfo;
              const days =
                Math.abs(differenceInDays(nextPayment?.expiresOn)) || 0;
              const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
              const isOverdueDate = isPastDate(nextPayment?.expiresOn);

              return (
                <StackBox
                  key={index}
                  title={property.name}
                  src={property.mainImage}
                  date={getDate(nextPayment?.expiresOn)}
                  price={nextPayment?.expectedAmount}
                  status={isOverdueDate ? '0' : '1'}
                  statusName={`${
                    isOverdueDate ? 'Overdue' : 'Due'
                  }: ${daysInWords}`}
                  href="/user/transactions"
                />
              );
            })}
          </ContentLoader>
        </WidgetBox>
        <WidgetBox title="Recent Transactions" href={`/user/transactions`}>
          <ContentLoader
            hasContent={allTransactions?.length > 0}
            Icon={<TransactionIcon />}
            query={transactionsQuery}
            name={'Recent Transactions'}
            noContentText={`You have no recent transactions`}
          >
            {allTransactions?.map((transaction, index) => {
              const property = transaction?.propertyInfo;
              return (
                <StackBox
                  key={index}
                  title={property?.name || '3 Bedroom Property'}
                  src={property?.mainImage}
                  date={getShortDate(transaction?.paidOn)}
                  price={transaction.amount}
                  status={transaction.paymentSource === 'Paystack' ? '1' : '2'}
                  statusName={transaction.paymentSource}
                />
              );
            })}
          </ContentLoader>
        </WidgetBox>
      </div>
      <div className="row row-eq-height">
        <WidgetBox title="Reported Properties" href={`/user/transactions`}>
          <StackBox
            title="Blissville Uno"
            date="Reported: 7 days"
            status="0"
            statusName="Awaiting"
          />
          <StackBox
            title="Pegassus Duplexes"
            date="Reported: 8 days"
            status="0"
            statusName="Awaiting"
          />
        </WidgetBox>
        <WidgetBox title="Quick Look">
          <ServiceBox
            link="/services"
            title="SMS"
            price="50,000"
            content="Hosted on AWS"
          />
        </WidgetBox>
      </div>
    </div>
  </>
);

export default Dashboard;
