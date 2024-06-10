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
import { WalletInfoBox } from '@/components/dashboard/WalletInfoBox';
import { UserContext } from '@/context/UserContext';
import { FEATURE_FLAG_LIST, isFeatureFlagEnabled } from '@/utils/constants';
import CompleteYourProfile from '@/components/dashboard/CompleteYourProfile';
import { userSteps } from '@/data/tourSteps';
import TourGuide from '@/components/common/TourGuide';

const Dashboard = () => {
  const [toast, setToast] = useToast();

  const [dashboardQuery] = useGetQuery({
    axiosOptions: {},
    name: 'dashboard',
    endpoint: API_ENDPOINT.getDashboardInfo(),
    refresh: true,
  });

  const result = dashboardQuery?.data || {};
  const { userState } = React.useContext(UserContext);

  const walletIsEnabled = isFeatureFlagEnabled(
    userState?.featureFlag || [],
    FEATURE_FLAG_LIST['wallet']
  );

  const stackboxes = getNextSteps(userState, result);
  const showOtherWidgets = stackboxes.length <= 3;

  if (userState?.needToCompleteProfile) {
    return <CompleteYourProfile />;
  }

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero isIndex />

      <TourGuide steps={userSteps} />
      <ContentLoader
        hasContent={!!result}
        Icon={<HomeIcon />}
        query={dashboardQuery}
        name="Dashboard"
        toast={toast}
      >
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

        <NextSteps stackboxes={stackboxes} />

        <UpcomingPaymentsAndRecentOffers result={result} />
        {showOtherWidgets && <RecentTransactionsAndServices result={result} />}
      </ContentLoader>
      {showOtherWidgets && <ReferAndEarn />}
      {/* <VisitationCard /> */}
      {/* <div className="container-fluid py-0">
        <h3 className="mt-5 mb-4">From our Blog</h3>
        <CategoriesComponent categories={allCategories} />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </div> */}
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

const NextSteps = ({ stackboxes }) => {
  if (stackboxes.length === 0) {
    return null;
  }

  const TOTAL_STACKBOXES = 4;

  return (
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox
          textEnd={`${
            TOTAL_STACKBOXES - stackboxes.length
          }/${TOTAL_STACKBOXES} completed`}
          title="Next Steps"
          className="col-12 mt-4"
          data={['preferences']}
        >
          {stackboxes.map((stackbox, index) => (
            <StackBox
              key={index}
              avatarInitials={`${index + 1}`}
              avatarCircle
              avatarColor="purple"
              title={stackbox.title}
              subtitle={stackbox.subtitle}
              value={stackbox.value}
              href={stackbox.href}
              isButton
            />
          ))}
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

const getNextSteps = (userState, result) => {
  if (result?.widgets === undefined) {
    return [];
  }
  const allStackBoxes = [
    {
      title: 'Customize Your Preferences',
      subtitle:
        'Personalize your preferences to receive properties tailored Just For You',
      value: 'Customize Preferences',
      href: '/user/settings?tab=preferences',
    },
    {
      title: 'Request a Service',
      subtitle:
        'Need a service? Simply request it on BALL for a seamless experience.',
      value: 'View Services',
      href: '/user/services',
    },
    {
      title: 'Buy your First Property',
      subtitle:
        'Ready to Become a LandLord? Explore and purchase your first property on BALL',
      value: 'View Properties',
      href: '/user/just-for-you',
    },
    {
      title: 'Refer a Friend',
      subtitle: 'Invite friends to BALL and Become A Landlord together',
      value: 'Refer and Earn',
      href: '/user/referrals',
    },
  ];

  const stackboxes = [];

  if (!userState?.preferences?.location) {
    stackboxes.push(allStackBoxes[0]);
  }

  // if (
  //   result.payments.totalAmountInWallet === 0 ||
  //   result.payments.totalAmountPaid === 0
  // ) {
  //   stackboxes.push(allStackBoxes[2]);
  // }

  if (result.widgets.serviceCount === 0) {
    stackboxes.push(allStackBoxes[1]);
  }

  if (result.widgets.offerCount === 0) {
    stackboxes.push(allStackBoxes[2]);
  }

  if (result.widgets.referralCount === 0) {
    stackboxes.push(allStackBoxes[3]);
  }

  return stackboxes;
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

// export const getStaticProps = async ({ preview = false }) => {
//   const allPosts = await getAllPostsForHome(preview);
//   const allCategories = await getAllCategories(preview);
//   return {
//     props: { allPosts, allCategories },
//     revalidate: 10,
//   };
// };

export default Dashboard;

// calendar visitation
// christmas
