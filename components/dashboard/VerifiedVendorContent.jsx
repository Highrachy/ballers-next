import {
  EnquiryIcon,
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
  getShortDate,
  isPastDate,
} from '@/utils/date-helpers';
import Humanize from 'humanize-plus';
import { moneyFormatInNaira } from '@/utils/helpers';
import { ACTIVE_OFFER_STATUS } from '@/utils/constants';
import ServiceBox from './ServiceBox';

const VerifiedVendorContent = ({ toast }) => {
  const [dashboardQuery] = useGetQuery({
    axiosOptions: {},
    name: 'dashboard',
    endpoint: API_ENDPOINT.getDashboardInfo(),
    refresh: true,
  });

  const result = dashboardQuery?.data || {};

  return (
    <>
      <ContentLoader
        hasContent={!!result}
        Icon={<HomeIcon />}
        query={dashboardQuery}
        name="Dashboard"
        toast={toast}
      >
        <Overview result={result} />
        <EnquiriesAndVisitations result={result} />
        <ReceivedPaymentsAndRemittance result={result} />
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
      color: colorTokens.success[500],
    },
    {
      id: 'pendingPayment',
      label: 'Pending Payment',
      value:
        payments?.totalPropertyPrice -
          (payments?.totalReceivedAmount + payments?.pendingRemittance) || 0,
      color: colorTokens.danger[50],
    },
  ];
  console.log('data first', data);

  const widgetLists = [
    {
      name: 'Properties',
      color: 'danger',
      Icon: <PropertyIcon />,
      value: widgets?.propertyCount || 0,
    },
    {
      name: 'Portfolios',
      link: 'portfolio',
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

const EnquiriesAndVisitations = ({ result }) => {
  const { recentEnquiries, recentVisitations } = result;

  return (
    <div className="container-fluid py-0">
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
          href={`/user/portfolio`}
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

  return (
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox
          title="Received Payments"
          href={`/vendor/transactions`}
          data={receivedRemittances}
        >
          {receivedRemittances?.map((transaction, index) => {
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
        <WidgetBox
          title="Pending Remittance"
          href={`/vendor/transactions`}
          data={pendingRemittances}
        >
          {pendingRemittances?.map((transaction, index) => {
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
      </div>
    </div>
  );
};

const OfferAndServices = ({ result }) => {
  const { recentOffers } = result;

  return (
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox
          title="Recent Offers"
          href={`/user/portfolio`}
          data={recentOffers}
        >
          {recentOffers?.map((offer, index) => {
            const user = offer?.userInfo;
            const property = offer?.propertyInfo;
            const days = Math.abs(differenceInDays(offer?.expires)) || 0;
            const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
            const offerHasExpired = isPastDate(offer?.expires);
            const dueText = `${
              offerHasExpired ? 'Expired in' : 'Due in'
            }: ${daysInWords}`;
            const activeOffer = ACTIVE_OFFER_STATUS.includes(offer.status);
            const offerColor = activeOffer
              ? 'success'
              : offerHasExpired
              ? 'danger'
              : 'secondary';
            const userFullName = `${user?.title || ''} ${user?.firstName} ${
              user?.lastName
            }`;

            return (
              <StackBox
                avatarColor={offerColor}
                key={index}
                title={property.name}
                subtitle={`For ${userFullName}`}
                statusColor={offerColor}
                statusName={activeOffer ? 'Active' : dueText}
              />
            );
          })}
        </WidgetBox>
        <WidgetBox title="Recommended Services" data={['services']}>
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

export default VerifiedVendorContent;
