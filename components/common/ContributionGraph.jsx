import React from 'react';
import { moneyFormatInNaira } from 'utils/helpers';
import Humanize from 'humanize-plus';
import Colors from 'style-dictionary/build/color.tokens.js';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  BgWave,
  PortfolioIcon,
  OfferIcon,
  VasIcon,
  ReferIcon,
  PropertyIcon,
  BadgesIcon,
  EnquiryIcon,
  VisitationIcon,
} from '../utils/Icons';

const userData = [
  {
    id: 'transactions',
    label: 'Trasanctions',
    value: 0,
  },
  {
    id: 'rewards',
    label: 'Rewards',
    value: 0,
  },
  {
    id: 'pending Payment',
    label: 'Pending Payment',
    value: 0,
  },
];

const vendorData = [
  {
    id: 'transactions',
    label: 'Trasanctions',
    value: 0,
  },
  {
    id: 'pending Payment',
    label: 'Pending Payment',
    value: 0,
  },
];

const ChartColors = [
  Colors.secondary[500],
  Colors.success[500],
  Colors.danger[50],
];

const MyResponsivePie = dynamic(() => import('./PieChart'), {
  ssr: false,
});

const userWidgetLists = [
  {
    name: 'My Porfolio',
    link: 'portfolio',
    key: 'portfolios',
    color: 'secondary',
    Icon: <PortfolioIcon />,
  },
  {
    name: 'Active Offers',
    link: 'portfolio',
    key: 'activeOffers',
    color: 'success',
    Icon: <OfferIcon />,
  },
  {
    name: 'Services',
    color: 'warning',
    Icon: <VasIcon />,
  },
  {
    name: 'Referrals',
    color: 'danger',
    key: 'interests',
    Icon: <ReferIcon />,
  },
];

const vendorWidgetLists = [
  {
    name: 'Properties',
    color: 'secondary',
    Icon: <PropertyIcon />,
  },
  {
    name: 'Offers',
    color: 'success',
    Icon: <OfferIcon />,
  },
  {
    name: 'Enquiries',
    color: 'warning',
    Icon: <VasIcon />,
  },
  {
    name: 'Scheduled Visits',
    color: 'danger',
    link: 'scheduled-visits',
    key: 'visitations',
    Icon: <ReferIcon />,
  },
];

const adminWidgetLists = [
  {
    name: 'Properties',
    color: 'secondary',
    Icon: <PropertyIcon />,
  },
  {
    name: 'Offers',
    color: 'success',
    Icon: <OfferIcon />,
  },
  {
    name: 'Portfolios',
    color: 'warning',
    Icon: <VasIcon />,
  },
  {
    name: 'Transactions',
    color: 'danger',
    link: 'scheduled-visits',
    key: 'visitations',
    Icon: <ReferIcon />,
  },
  {
    name: 'Services',
    key: 'service',
    color: 'danger',
    Icon: <VasIcon />,
  },
  {
    name: 'Badges',
    color: 'purple',
    Icon: <BadgesIcon />,
  },
  {
    name: 'Enquiries',
    color: 'primary',
    Icon: <EnquiryIcon />,
  },
  {
    name: 'Scheduled Visits',
    color: 'secondary',
    link: 'scheduled-visits',
    key: 'visitations',
    Icon: <VisitationIcon />,
  },
];

const WidgetList = ({ type, result = {} }) => {
  const widgetLists = type === 'user' ? userWidgetLists : vendorWidgetLists;
  return (
    <div className="col-sm-6">
      <div className="row g-4">
        {widgetLists.map((widget, index) => (
          <Widget
            key={index}
            number={result?.[widget?.key || widget?.name?.toLowerCase()] || 0}
            role={type}
            {...widget}
          />
        ))}
      </div>
    </div>
  );
};

export const AdminWidgetList = ({ result = {} }) => {
  const widgetLists = adminWidgetLists;
  return (
    <div className="col-sm-12">
      <div className="row g-4">
        {widgetLists.map((widget, index) => (
          <Widget
            key={index}
            number={result?.[widget?.key || widget?.name?.toLowerCase()] || 0}
            role="admin"
            className="col-3"
            {...widget}
          />
        ))}
      </div>
    </div>
  );
};

export const Widget = ({
  name,
  color,
  link,
  Icon,
  number,
  className = 'col-6',
  role = 'user',
}) => {
  const url = `/${role}/${(link || name).toLowerCase()}`;

  return (
    <section className={`widget ${className}`}>
      <Link href={url} passHref>
        <a className="text-reset">
          <div className={`card position-relative`}>
            <section className={`widget-${color}`}>
              <div className="bg-holder">
                <BgWave color={Colors[color][500]} />
              </div>
              <div className="card-body">
                <span className="widget-icon">{Icon}</span>

                <h3 className="mt-3 pt-3 mb-1 fw-semibold">{number || 0}</h3>
                <h6 className="card-title mt-0" title="Number of Customers">
                  {Humanize.capitalize(name)}
                </h6>
              </div>
            </section>
          </div>
        </a>
      </Link>
    </section>
  );
};

export const OverviewGraph = ({ type }) => {
  const isUser = type === 'user';
  const emptyData = [
    {
      id: 'noTransactions',
      label: 'No Trasanctions Yet',
      value: 1000,
    },
  ];
  const data = isUser ? userData : vendorData;
  const isAllZero = data.every((item) => item.value === 0);

  const graphData = isAllZero ? emptyData : data;

  const chartColors = isUser ? ChartColors : [ChartColors[0], ChartColors[2]];

  return (
    <div className="widget col-sm-6 mb-4 mb-md-0">
      {/* card */}
      <div className="card h-100 position-relative">
        {/* card body */}
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center mb-4">
            <h6 className="card-title me-2">Overview</h6>
          </div>
          <div className="row align-items-center">
            <div className="col-12" style={{ height: '250px' }}>
              <MyResponsivePie
                data={graphData}
                colors={chartColors}
                isAllZero={isAllZero}
              />
            </div>
          </div>

          <div className="row justify-content-between g-0">
            <div className="col-12">
              <div className="text-sm mt-3">
                <div className="d-flex flex-between-center mb-1">
                  <div className="d-flex align-items-center">
                    <span
                      className="dot"
                      style={{ backgroundColor: ChartColors[0] }}
                    />
                    <span className="fw-semi-bold">Transactions</span>
                  </div>

                  <span>{moneyFormatInNaira(data[0].value)}</span>
                </div>
                {isUser && (
                  <div className="d-flex flex-between-center mb-1">
                    <div className="d-flex align-items-center">
                      <span
                        className="dot"
                        style={{ backgroundColor: ChartColors[1] }}
                      />
                      <span className="fw-semi-bold">Rewards</span>
                    </div>
                    <span>{moneyFormatInNaira(data[1].value)}</span>
                  </div>
                )}
                <div className="d-flex flex-between-center mb-1">
                  <div className="d-flex align-items-center">
                    <span
                      className="dot"
                      style={{ backgroundColor: ChartColors[2] }}
                    />
                    <span className="fw-semi-bold">Pending Payments</span>
                  </div>
                  <span>
                    {moneyFormatInNaira(data[2]?.value || data[1]?.value)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContributionGraph = ({ type = 'user', result }) => (
  <div className="row">
    <OverviewGraph type={type} result={result} />
    <WidgetList type={type} result={result} />
  </div>
);

// TODO: Refactor this
// const PROPERTY_COLOR = '#2dca73';
// const CONTRIBUTION_REWARD_COLOR = '#161d3f';
// const REFERRAL_COLOR = '#F79B18';
// const EMPTY_COLOR = '#c4c4c4';

// const ContributionGraph = () => {
//   const pageOptions = {
//     key: 'accountOverview',
//     pageName: 'Contribution Graph',
//   };

//   const [toast, setToast] = useToast();
//   const initialOverview = {
//     contributionReward: 0,
//     totalAmountPaid: 0,
//     referralRewards: 0,
//   };
//   const [accountOverviewQuery, accountOverview = initialOverview] = useGetQuery(
//     {
//       key: pageOptions.key,
//       name: pageOptions.key,
//       setToast,
//       endpoint: API_ENDPOINT.getAccountOverview(),
//       refresh: true,
//     }
//   );

//   const contributionIsEmpty =
//     accountOverview?.contributionReward === 0 &&
//     accountOverview?.totalAmountPaid === 0 &&
//     accountOverview?.referralRewards === 0;

//   return (
//     <Card className="card-container h-100">
//       <Toast {...toast} showToastOnly />
//       <div className="row"></div>
//       <div className="row">
//         <div className="col-sm-4">
//           <h6>Transactions</h6>
//           <OverviewPrice
//             title="Property"
//             color="green"
//             price={
//               accountOverviewQuery.isLoading
//                 ? '-'
//                 : moneyFormatInNaira(accountOverview.totalAmountPaid)
//             }
//           />
//         </div>
//         <div className="col-sm-4">
//           <div className="ms-n5 me-n5">
//             <Doughnut
//               data={{
//                 labels: ['Property', 'Contribution Rewards', 'Referral Bonus'],
//                 datasets: [
//                   {
//                     data: [
//                       contributionIsEmpty ? 1 : accountOverview.totalAmountPaid,
//                       accountOverview.contributionReward,
//                       accountOverview.referralRewards,
//                     ],
//                     backgroundColor: [
//                       contributionIsEmpty ? EMPTY_COLOR : PROPERTY_COLOR,
//                       CONTRIBUTION_REWARD_COLOR,
//                       REFERRAL_COLOR,
//                     ],
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 rotation: 1,
//                 maintainAspectRatio: true,
//                 cutout: '75%',
//                 plugins: {
//                   legend: { display: false },
//                 },
//               }}
//             />
//           </div>
//           <h5 className="text-center mt-3">
//             {accountOverviewQuery.isLoading
//               ? '-'
//               : moneyFormatInNaira(
//                   accountOverview.totalAmountPaid +
//                     accountOverview.contributionReward +
//                     accountOverview.referralRewards
//                 )}
//           </h5>
//           <p className="text-center  mb-0">
//             My BALL <span className="text-orange">Net Worth</span>
//           </p>
//         </div>
//         <div className="col-sm-4">
//           <h6>Earnings</h6>
// <OverviewPrice
//   title="Contribution Rewards"
//   color="purple"
//   price={
//     accountOverviewQuery.isLoading
//       ? '-'
//       : moneyFormatInNaira(accountOverview.contributionReward)
//   }
// />
//           <OverviewPrice
//             title="Referral Bonus"
//             color="orange"
//             price={
//               accountOverviewQuery.isLoading
//                 ? '-'
//                 : moneyFormatInNaira(accountOverview.referralRewards)
//             }
//           />
//         </div>
//       </div>
//     </Card>
//   );
// };

// const OverviewPrice = ({ color, title, price }) => (
//   <div
//     className={`overview-price__circle overview-price__circle-${color} mb-3`}
//   >
//     <h6 className="overview-price__title">{title}</h6>
//     <strong className="overview-price__amount">{price}</strong>
//   </div>
// );

export default ContributionGraph;
