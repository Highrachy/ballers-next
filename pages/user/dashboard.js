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
import { WalletInfoBox } from '@/components/dashboard/WalletInfoBox';
import { UserContext } from '@/context/UserContext';
import { FEATURE_FLAG_LIST, isFeatureFlagEnabled } from '@/utils/constants';

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
  const { userState } = React.useContext(UserContext);

  const [{ run, steps }, setState] = React.useState({
    run: false,
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

  const walletIsEnabled = isFeatureFlagEnabled(
    userState?.featureFlag || [],
    FEATURE_FLAG_LIST['wallet']
  );

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

        {walletIsEnabled ? (
          <>
            <WalletInfoBox setToast={setToast} result={result} />
            <Overview result={result} setToast={setToast} isNormal />
          </>
        ) : (
          <>
            <div className="mt-n6">
              <Overview result={result} setToast={setToast} />
            </div>
          </>
        )}

        <UpcomingPaymentsAndRecentOffers result={result} />
        <RecentTransactionsAndServices result={result} />
      </ContentLoader>
      <ReferAndEarn />
      {/* <VisitationCard /> */}
      <div className="container-fluid py-0">
        <h3 className="mt-5 mb-4">From our Blog</h3>
        <CategoriesComponent categories={allCategories} />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </div>
    </BackendPage>
  );
};

const UpcomingPaymentsAndRecentOffers = ({ result }) => {
  const { upcomingPayments, recentOffers } = result;

  if (upcomingPayments?.length === 0 && recentOffers?.length === 0) {
    return null;
  }

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
                href="/user/transactions"
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

const Overview = ({ result, isNormal = false }) => {
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
    <div className={`container-fluid py-0 ${isNormal ? '' : 'mt-n6'}`}>
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

// https://prium.github.io/falcon/v3.14.0/dashboard/project-management.html - visitation, milestoen statistic
// https://themesbrand.com/minia/layouts/pages-timeline.html - milestone
// https://dashlite.net/demo1/kyc-details-regular.html - enquiry
// https://angular.spruko.com/slica/preview/advancedui/accordion - accordion
// https://themesbrand.com/minia/layouts/index.html - beautiful pie graph
// https://preview.themeforest.net/item/laste-real-estate-property-elementor-template-kit/full_screen_preview/46573623?_ga=2.33620961.1985453818.1691213507-1657852806.1688910022  - milestone

// const VisitationCard = () => (
//   <div className="col-md-6">
//     <div className="card h-100">
//       <div className="card-header bg-white pb-0">
//         <div className="row px-3">
//           <div className="col">
//             <p className="mb-1 fs--2 text-500">Upcoming schedule</p>
//             <h5 className="text-primary fs-0">Falcon discussion</h5>
//           </div>
//           <div className="col-auto">
//             <div
//               className="bg-secondary-light px-3 py-3 rounded-circle text-center"
//               style={{ width: '60px', height: '60px' }}
//             >
//               <h5 className="text-primary mb-0 d-flex flex-column mt-n1">
//                 <span>09</span>
//                 <small className="text-primary fs--2 lh-1">MAR</small>
//               </h5>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="card-body d-flex align-items-end">
//         <div className="row g-3 justify-content-between">
//           <div className="col-10 mt-0">
//             <p className="mb-0">
//               The very first general meeting for planning Falcon’s design and
//               development roadmap
//             </p>
//           </div>
//           <div className="col-auto ps-0">
//             <div className="avatar-group avatar-group-dense">
//               <div className="avatar avatar-xl border border-3 border-light rounded-circle">
//                 <img
//                   className="rounded-circle"
//                   src="../assets/img/team/1-thumb.png"
//                   alt=""
//                 />
//               </div>
//               <div className="avatar avatar-xl border border-3 border-light rounded-circle">
//                 <img
//                   className="rounded-circle"
//                   src="../assets/img/team/2-thumb.png"
//                   alt=""
//                 />
//               </div>
//               <div className="avatar avatar-xl border border-3 border-light rounded-circle">
//                 <img
//                   className="rounded-circle"
//                   src="../assets/img/team/3-thumb.png"
//                   alt=""
//                 />
//               </div>
//               <div className="avatar avatar-xl border border-3 border-light rounded-circle">
//                 <div className="avatar-name rounded-circle ">
//                   <span>+50</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

export const getStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);
  const allCategories = await getAllCategories(preview);

  return {
    props: { allPosts, allCategories },
    revalidate: 10,
  };
};

export default Dashboard;
