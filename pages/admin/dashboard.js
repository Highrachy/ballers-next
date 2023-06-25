import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { OfferIcon, TransactionIcon } from 'components/utils/Icons';
import { AdminWidgetList } from 'components/common/ContributionGraph';
import Toast, { useToast } from 'components/utils/Toast';
import {
  differenceInDays,
  getDate,
  getShortDate,
  isPastDate,
} from 'utils/date-helpers';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from '@/hooks/useQuery';
import { ContentLoader } from '@/components/utils/LoadingItems';
import Humanize from 'humanize-plus';
import {
  ServiceBox,
  StackBox,
  WelcomeHero,
  WidgetBox,
} from 'pages/user/dashboard';

export const PegassusImage =
  'https://ballers-staging.s3.amazonaws.com/63da062af9ec130016200f41/7de33a00-ab6a-11ed-9d59-6fa02cafbd66.jpg';
export const BlissvilleImage =
  'https://ballers-staging.s3.amazonaws.com/63d73318936e55001633c84c/95a141e0-a04e-11ed-86c2-f1037f8bce01.jpg';

const Dashboard = () => {
  const [toast, setToast] = useToast();

  const [offersQuery] = useGetQuery({
    axiosOptions: {},
    childrenKey: 'offer',
    key: 'pendingOffers',
    name: ['pendingOffers'],
    endpoint: API_ENDPOINT.getAllPortfolios(),
    refresh: true,
  });

  const [portfoliosQuery] = useGetQuery({
    axiosOptions: { limit: 0 },
    childrenKey: 'portfolio',
    key: 'portfolios',
    name: ['portfolios', { limit: 0 }],
    endpoint: API_ENDPOINT.getAllPortfolios(),
    refresh: true,
  });
  const [transactionsQuery] = useGetQuery({
    axiosOptions: { limit: 0 },
    childrenKey: 'transaction',
    key: 'transactions',
    name: ['transactions', { limit: 0 }],
    endpoint: API_ENDPOINT.getAllTransactions(),
    refresh: true,
  });

  const allPortfolios = portfoliosQuery?.data?.result;
  const allOffers = offersQuery?.data?.result;
  const allTransactions = transactionsQuery?.data?.result;

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero subtitle="Welcome to the Admnistrative Dashboard" />
      <AdminOverview
        result={{
          activeOffers: allOffers?.length,
          portfolios: allPortfolios?.length,
        }}
      />
      <Others
        allPortfolios={allPortfolios}
        allOffers={allOffers}
        allTransactions={allTransactions}
        portfoliosQuery={portfoliosQuery}
        offersQuery={offersQuery}
        transactionsQuery={transactionsQuery}
      />
    </BackendPage>
  );
};

const AdminOverview = ({ result }) => (
  <div className="container-fluid py-0 mt-n6">
    <AdminWidgetList result={result} />
  </div>
);

const Others = ({
  offersQuery,
  allOffers,
  allPortfolios,
  portfoliosQuery,
  allTransactions,
  transactionsQuery,
}) => (
  <>
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox title="Pending Property Approval">
          <StackBox
            title="Pegassus Duplexes"
            src={PegassusImage}
            date="Mar 10th, 2023"
            price="150,0000,000"
          />
          <StackBox
            title="Blissville Uno"
            src={BlissvilleImage}
            date="Apr 10th, 2023"
            price="60,000,000"
          />
        </WidgetBox>

        <WidgetBox title="Pending Offer Letter Approval">
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
      </div>
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
        <WidgetBox title="Upcoming Payments" href={`/user/portfolio`}>
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
              console.log('transaction.propertyInfo', transaction);
              const property = transaction?.propertyInfo;
              return (
                <StackBox
                  key={index}
                  title={property?.name || '3 Bedroom Property'}
                  src={property?.mainImage || PegassusImage}
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
