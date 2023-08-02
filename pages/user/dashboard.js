import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Link from 'next/link';
import {
  HomeIcon,
  OfferIcon,
  PortfolioIcon,
  ReferIcon,
  VasIcon,
} from 'components/utils/Icons';
import { OFFER_STATUS, USER_TYPES } from 'utils/constants';
import { UserContext } from 'context/UserContext';
import Toast, { useToast } from 'components/utils/Toast';
import { differenceInDays, getDate, isPastDate } from 'utils/date-helpers';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from '@/hooks/useQuery';
import { ContentLoader } from '@/components/utils/LoadingItems';
import Humanize from 'humanize-plus';
import { OverviewGraph } from '@/components/dashboard/OverviewGraph';
import { Widget } from '@/components/dashboard/Widget';
import Colors from 'style-dictionary/build/color.tokens.js';
import WidgetBox from '@/components/dashboard/WidgetBox';
import StackBox from '@/components/dashboard/StackBox';
import { moneyFormatInNaira } from '@/utils/helpers';
import WelcomeHero from '@/components/common/WelcomeHero';
import ServiceBox from '@/components/dashboard/ServiceBox';
import { ReferAndEarn } from '@/components/dashboard/ReferAndEarn';

export const PegassusImage =
  'https://ballers-staging.s3.amazonaws.com/63da062af9ec130016200f41/7de33a00-ab6a-11ed-9d59-6fa02cafbd66.jpg';
export const BlissvilleImage =
  'https://ballers-staging.s3.amazonaws.com/63d73318936e55001633c84c/95a141e0-a04e-11ed-86c2-f1037f8bce01.jpg';

const Dashboard = () => {
  const [toast, setToast] = useToast();

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
      <WelcomeHero isIndex />
      <ContentLoader
        hasContent={!!result}
        Icon={<HomeIcon />}
        query={dashboardQuery}
        name="Dashboard"
        toast={toast}
      >
        <Overview result={result} />
        <UpcomingPaymentsAndRecentOffers result={result} />
        <RecentTransactionsAndServices result={result} />
      </ContentLoader>
      <ReferAndEarn />
    </BackendPage>
  );
};

const UpcomingPaymentsAndRecentOffers = ({ result }) => {
  const { upcomingPayments, recentOffers } = result;
  console.log('upcomingPayments: ', upcomingPayments);

  return (
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox title="Upcoming Payments" href={`/user/portfolio`}>
          {upcomingPayments?.map((nextPayment, index) => {
            const property = nextPayment?.propertyInfo;
            const days = Math.abs(differenceInDays(nextPayment?.dueDate)) || 0;
            const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
            const isOverdueDate = isPastDate(nextPayment?.dueDate);

            return (
              <StackBox
                key={index}
                src={property.mainImage}
                title={property.name}
                subtitle={`Due on ${getDate(nextPayment?.dueDate)}`}
                value={moneyFormatInNaira(nextPayment?.expectedAmount)}
                statusColor={isOverdueDate ? 'danger' : 'success'}
                statusName={`${
                  isOverdueDate ? 'Overdue' : 'Due'
                }: ${daysInWords}`}
              />
            );
          })}
        </WidgetBox>
        <WidgetBox title="Recent Offers" href={`/user/portfolio`}>
          {recentOffers?.map((offer, index) => {
            const vendor = offer?.vendorInfo;
            const property = offer?.propertyInfo;
            const days = Math.abs(differenceInDays(offer?.expires)) || 0;
            const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
            const dueText = `${
              isPastDate(offer?.expires) ? 'Overdue in' : 'Due in'
            }: ${daysInWords}`;

            return (
              <StackBox
                key={index}
                title={property.name}
                subtitle={`By ${vendor.firstName}`}
                value={offer.status}
                statusColor={
                  offer.status === OFFER_STATUS.GENERATED
                    ? 'danger'
                    : 'secondary'
                }
                statusName={
                  offer.status === OFFER_STATUS.GENERATED
                    ? dueText
                    : offer.status
                }
              />
            );
          })}
        </WidgetBox>
      </div>
    </div>
  );
};

const RecentTransactionsAndServices = ({ result }) => {
  const { recentTransactions } = result;

  return (
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox title="Recent Payments" href={`/user/portfolio`}>
          {recentTransactions?.map((transaction, index) => {
            const property = transaction?.propertyInfo;

            return (
              <StackBox
                key={index}
                src={property.mainImage}
                title={property?.name}
                subtitle={`Paid on ${getDate(transaction?.paidOn)}`}
                value={moneyFormatInNaira(transaction.amount)}
                statusColor={
                  transaction.paymentSource === 'Paystack'
                    ? 'secondary'
                    : 'success'
                }
                statusName={transaction.paymentSource}
              />
            );
          })}
        </WidgetBox>
        <WidgetBox title="Recommended Services">
          <ServiceBox
            link="/services"
            title="Title Validity"
            price="50,000"
            content="Title validity refers to the legal status of the ownership of a property. It is essential to ensure that the title of a property is valid and clear before buying or selling it."
          />
        </WidgetBox>
      </div>
    </div>
  );
};

const Overview = ({ result }) => {
  const { payments, widgets } = result;
  const data = [
    {
      id: 'transactions',
      label: 'Trasanctions',
      value: payments?.totalAmountPaid || 0,
      color: Colors.secondary[500],
    },
    {
      id: 'rewards',
      label: 'Rewards',
      value: payments?.contributionReward + payments?.referralRewards || 0,
      color: Colors.success[500],
    },
    {
      id: 'pendingPayment',
      label: 'Pending Payment',
      value: payments?.totalPropertyPrice - payments?.totalAmountPaid || 0,
      color: Colors.danger[50],
    },
  ];

  const widgetLists = [
    {
      name: 'My Porfolio',
      link: 'portfolio',
      key: 'portfolios',
      color: 'secondary',
      Icon: <PortfolioIcon />,
      value: widgets?.portfolioCount || 0,
    },
    {
      name: 'All Offers',
      link: 'portfolio',
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
    {
      name: 'All Referrals',
      color: 'danger',
      key: 'interests',
      Icon: <ReferIcon />,
      value: widgets?.referralCount || 0,
    },
  ];

  return (
    <div className="container-fluid py-0 mt-n6">
      <div className="row">
        <section className="widget col-sm-6 mb-4 mb-md-0">
          <OverviewGraph data={data} />
        </section>
        <section className="widget col-sm-6 mb-4 mb-md-0">
          <div className="row g-4">
            {widgetLists.map((widget, index) => (
              <Widget key={index} {...widget} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
