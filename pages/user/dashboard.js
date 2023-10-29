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
import Toast, { useToast } from 'components/utils/Toast';
import { getDate, getDateStatus } from 'utils/date-helpers';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from '@/hooks/useQuery';
import { ContentLoader } from '@/components/utils/LoadingItems';
import OverviewGraph from '@/components/dashboard/OverviewGraph';
import Widget from '@/components/dashboard/Widget';
import Colors from 'style-dictionary/build/color.tokens.js';
import WidgetBox from '@/components/dashboard/WidgetBox';
import StackBox from '@/components/dashboard/StackBox';
import { moneyFormatInNaira } from '@/utils/helpers';
import WelcomeHero from '@/components/common/WelcomeHero';
import ServiceBox from '@/components/dashboard/ServiceBox';
import ReferAndEarn from '@/components/dashboard/ReferAndEarn';
import RecentOffersWidget from '@/components/dashboard/widgets/RecentOffersWidget';
import RecentTransactionsWidget from '@/components/dashboard/widgets/RecentTransactionsWidget';
import MoreStories from '@/components/blog/MoreStories';
import { getAllCategories, getAllPostsForHome } from 'lib/api';
import { CategoriesComponent } from 'pages/blog';
import ReactJoyride, { STATUS } from 'react-joyride';
import colorTokens from 'style-dictionary/build/color.tokens.js';

const Dashboard = ({ allPosts: { edges }, allCategories }) => {
  const [toast, setToast] = useToast();
  const morePosts = edges.slice(0, 2);

  const [dashboardQuery] = useGetQuery({
    axiosOptions: {},
    name: 'dashboard',
    endpoint: API_ENDPOINT.getDashboardInfo(),
    refresh: true,
  });

  const result = dashboardQuery?.data || {};

  const [{ run, steps }, setState] = React.useState({
    run: true,
    steps: [
      {
        content: (
          <div className="tour__content">
            <h3 className="pb-3">Welcome to BALL!</h3>
            <p>
              Let&apos;s embark on a guided tour and explore our powerful
              features together.
            </p>
          </div>
        ),
        placement: 'center',
        target: 'body',
        disableBeacon: true,
      },
      {
        content: (
          <div className="tour__content">
            <h4>Transaction Overview</h4>
            <p>
              Delve into the details of your financial transactions with our
              overview graph.
            </p>
          </div>
        ),
        target: '.overview-graph',
        disableBeacon: true,
      },
      {
        content: (
          <div className="tour__content">
            <h4>Quick Access Cards</h4>
            <p>
              Easily confirm important figures using our accessible quick access
              cards.
            </p>
          </div>
        ),
        target: '.quick-access',
        disableBeacon: true,
      },
      {
        content: (
          <div className="tour__content">
            <h4>Your Properties</h4>
            <p>
              Keep track of the properties you&apos;ve added to the platform
              with this widget.
            </p>
          </div>
        ),
        target: '.properties-widget',
        disableBeacon: true,
      },
      {
        title: 'Final Step',
        content: (
          <div className="tour__content">
            <h3 className="pb-3">Congratulations!</h3>
            <p>You&apos;ve reached the end of the tour.</p>
          </div>
        ),
        placement: 'center',
        target: 'body',
        disableBeacon: true,
      },
    ],
  });

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      // Tour is finished or skipped, you can update state accordingly
      console.log('finished', type);
    }
    // Handle other events as needed
  };

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
        <ReactJoyride
          run={run}
          steps={steps}
          showProgress
          showSkipButton
          spotlightClicks={false}
          continuous
          callback={handleJoyrideCallback}
          styles={{
            buttonSkip: {
              color: colorTokens.danger[600],
            },
            buttonBack: {
              color: colorTokens.gray[600],
            },
            buttonNext: {
              background: colorTokens.secondary[400],
              padding: '1rem 1.5rem',
            },
            tooltipContainer: {
              padding: '1rem 2rem 0',
            },
          }}
        />
        <Overview result={result} />
        <UpcomingPaymentsAndRecentOffers result={result} />
        <RecentTransactionsAndServices result={result} />
      </ContentLoader>
      <ReferAndEarn />
      <div className="container-fluid py-0">
        <h3 className="mt-5 mb-4">From our Blog</h3>
        <CategoriesComponent categories={allCategories} />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </div>
    </BackendPage>
  );
};

const UpcomingPaymentsAndRecentOffers = ({ result }) => {
  const { upcomingPayments } = result;
  return (
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox
          title="Upcoming Payments"
          href={`/user/transactions`}
          data={upcomingPayments}
        >
          {upcomingPayments?.map((nextPayment, index) => {
            const property = nextPayment?.propertyInfo;

            return (
              <StackBox
                key={index}
                src={property.mainImage}
                title={property.name}
                subtitle={`Due on ${getDate(nextPayment?.dueDate)}`}
                value={moneyFormatInNaira(nextPayment?.expectedAmount)}
                {...getDateStatus(nextPayment?.dueDate)}
              />
            );
          })}
        </WidgetBox>
        <RecentOffersWidget result={result?.recentOffers} />
      </div>
    </div>
  );
};

const RecentTransactionsAndServices = ({ result }) => {
  return (
    <div className="container-fluid py-0">
      <div className="row">
        <RecentTransactionsWidget
          result={result?.recentTransactions}
          role="user"
        />
        <WidgetBox
          title="Recommended Services"
          href="/user/services"
          data={['service']}
        >
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
      value: payments?.pendingPayment || 0,
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
      link: 'services',
      color: 'warning',
      Icon: <VasIcon />,
      value: widgets?.serviceCount || 0,
    },
    {
      name: 'All Referrals',
      link: 'referrals',
      color: 'danger',
      key: 'interests',
      Icon: <ReferIcon />,
      value: widgets?.referralCount || 0,
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
              <Widget key={index} {...widget} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const getStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);
  const allCategories = await getAllCategories(preview);

  return {
    props: { allPosts, allCategories },
    revalidate: 10,
  };
};

export default Dashboard;
