import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import WidgetBox from '@/components/dashboard/WidgetBox';
import Link from 'next/link';
import {
  BankInfoIcon,
  CompanyInfoIcon,
  FileIcon,
  UserIcon,
} from '@/components/utils/Icons';
import { UserContext } from '@/context/UserContext';
import {
  getCompletedSteps,
  getVerificationState,
  getVerificationStatus,
} from '@/components/pages/vendor/setup/AccountSetup';
import Humanize from 'humanize-plus';
import { OFFER_STATUS, VISITATION_STATUS } from 'utils/constants';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { moneyFormat, moneyFormatInNaira } from '@/utils/helpers';
import { ContentLoader } from '@/components/utils/LoadingItems';
import { EnquiryIcon } from '@/components/utils/Icons';
import { VisitationIcon } from '@/components/utils/Icons';
import { getShortDate } from '@/utils/date-helpers';
import WelcomeHero from '@/components/common/WelcomeHero';
import { OverviewGraph } from '@/components/common/ContributionGraph';
import StackBox from '@/components/dashboard/StackBox';
import ServiceBox from '@/components/dashboard/ServiceBox';

const PegassusImage =
  'https://ballers-staging.s3.amazonaws.com/63da062af9ec130016200f41/7de33a00-ab6a-11ed-9d59-6fa02cafbd66.jpg';
const BlissvilleImage =
  'https://ballers-staging.s3.amazonaws.com/63d73318936e55001633c84c/95a141e0-a04e-11ed-86c2-f1037f8bce01.jpg';

const Dashboard = () => {
  const [toast, setToast] = useToast();
  const { userState } = React.useContext(UserContext);
  const isVerifiedVendor = !!userState?.vendor?.verified;

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        subtitle="Welcome to BALL - Maximize Your Property Sales with BALL"
        isIndex
        isApproved={isVerifiedVendor}
      />

      {isVerifiedVendor ? (
        <VerifiedVendorContent />
      ) : (
        <UnVerifiedVendorContent />
      )}
    </BackendPage>
  );
};

const VerifiedVendorContent = () => {
  const axiosOptionForVisitations = {
    params: { limit: 0, status: VISITATION_STATUS.PENDING },
  };

  const axiosOptionForEnquiries = {
    params: { limit: 0, approved: false },
  };

  const axiosOptionForOffers = {
    params: { limit: 0, status: OFFER_STATUS.PENDING_VENDOR_REVIEW },
  };
  const [visitationsQuery] = useGetQuery({
    axiosOptions: axiosOptionForVisitations,
    key: 'scheduleVisits',
    name: ['scheduleVisits', axiosOptionForVisitations],
    endpoint: API_ENDPOINT.getAllVisitations(),
    refresh: true,
  });

  const [enquiriesQuery] = useGetQuery({
    axiosOptions: axiosOptionForEnquiries,
    key: 'enquiries',
    name: ['enquiries', axiosOptionForEnquiries],
    endpoint: API_ENDPOINT.getAllEnquiries(),
    refresh: true,
  });

  const [offersQuery] = useGetQuery({
    axiosOptions: axiosOptionForOffers,
    childrenKey: 'offer',
    key: 'pendingOffers',
    name: ['pendingOffers', axiosOptionForOffers],
    endpoint: API_ENDPOINT.getAllOffers(),
    refresh: true,
  });

  const [propertiesQuery] = useGetQuery({
    axiosOptions: { limit: 0 },
    childrenKey: 'property',
    key: 'properties',
    name: ['properties', { limit: 0 }],
    endpoint: API_ENDPOINT.getAllProperties(),
    refresh: true,
  });

  const allEnquiries = enquiriesQuery?.data?.result;
  const allVisitations = visitationsQuery?.data?.result;
  const allOffers = offersQuery?.data?.result;
  const allProperties = propertiesQuery?.data?.result;

  return (
    <>
      <OverviewGraph
        type="vendor"
        result={{
          enquiries: allEnquiries?.length,
          visitations: allVisitations?.length,
          offers: allOffers?.length,
          properties: allProperties?.length,
        }}
      />
      <div className="container-fluid py-0">
        <div className="row">
          <WidgetBox title="Enquiries" href={`/vendor/enquiries`}>
            <ContentLoader
              hasContent={allEnquiries?.length > 0}
              Icon={<EnquiryIcon />}
              query={enquiriesQuery}
              name={'Enquiry'}
              noContentText={`No Enquiries found`}
            >
              {allEnquiries?.map((enquiry, index) => (
                <StackBox
                  href={`/vendor/enquiries/${enquiry?._id}`}
                  key={`enquiry-${index}`}
                  title={enquiry?.propertyInfo.name}
                  src={enquiry?.propertyInfo.mainImage}
                  date={`${enquiry.title} ${enquiry?.firstName} ${enquiry.lastName}`}
                  price={moneyFormat(enquiry?.propertyInfo.price)}
                  status="0"
                  statusName="Pending"
                />
              ))}
            </ContentLoader>
          </WidgetBox>

          <WidgetBox
            title="Scheduled Visitation"
            href={`/vendor/scheduled-visits`}
          >
            <ContentLoader
              hasContent={allVisitations?.length > 0}
              Icon={<VisitationIcon />}
              query={visitationsQuery}
              name={'Scheduled Visitations'}
              noContentText={`No Scheduled Visitation found`}
            >
              {allVisitations?.map((visitation, index) => (
                <StackBox
                  href={`/vendor/scheduled-visits`}
                  key={`visitation-${index}`}
                  title={`${visitation?.visitorName}`}
                  topContent={getShortDate(visitation?.visitDate)}
                  subtitle={visitation?.propertyInfo?.[0]?.name}
                  status="2"
                  statusName={visitation?.status}
                />
              ))}
            </ContentLoader>

            {/* <StackBox
              title="Pegassus Duplexes"
              date="April 10th, 2023"
              status="1"
              statusName="Due: 12 days"
            /> */}
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
};

const UnVerifiedVendorContent = () => {
  const { userState } = React.useContext(UserContext);
  const completedSteps = getCompletedSteps(userState);

  const noOfCompletedSteps = completedSteps.filter(Boolean).length;
  const currentProgress = noOfCompletedSteps * 25;

  const verificationState = getVerificationState(userState);

  return (
    <section className="container-fluid">
      <section>
        <div className="card card-bordered my-4">
          <div className="card-inner p-4">
            <div className="row">
              <div className="col-md-8">
                <h5>Ready to sell your property? Verify your account now!</h5>
                <p className="text-dark">
                  <strong>Status: </strong>

                  {verificationState.noOfComments ? (
                    <>
                      {verificationState.noOfComments} Pending{' '}
                      {Humanize.pluralize(
                        verificationState.noOfComments,
                        'Comment'
                      )}
                    </>
                  ) : (
                    verificationState.status
                  )}
                </p>
              </div>
              <div className="col-md-4 text-end">
                <Link href={`/vendor/setup/${verificationState.page}`} passHref>
                  <a className="btn btn-sm btn-wide btn-secondary mt-3">
                    {noOfCompletedSteps > 0 ? 'Continue Setup' : 'Start Setup'}
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="card-progress-bar">
            <div
              className="ps-4 text-end text-smaller text-secondary px-2"
              style={{ width: `${currentProgress}%` }}
            >
              {noOfCompletedSteps > 0 && currentProgress !== 100 && (
                <>{currentProgress}% information has been submitted</>
              )}
            </div>
            <div
              className="progress-bar"
              data-progress={currentProgress}
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>
      </section>
      <div className="row">
        <VerificationCard
          icon={<CompanyInfoIcon />}
          title="Company Information"
          index={0}
          key={0}
          status={getVerificationStatus(userState, 0)}
        />

        <VerificationCard
          icon={<BankInfoIcon />}
          title="Bank Information"
          index={1}
          key={1}
          status={getVerificationStatus(userState, 1)}
        />

        <VerificationCard
          icon={<UserIcon />}
          title="Signatories"
          index={2}
          key={2}
          status={getVerificationStatus(userState, 2)}
        />

        <VerificationCard
          icon={<FileIcon />}
          title="Certificates"
          status={getVerificationStatus(userState, 3)}
          index={3}
          key={3}
        />
      </div>
    </section>
  );
};

const VerificationCard = ({ title, children, icon, index, status }) => (
  <Link href={`/vendor/setup/${index + 1}`} passHref>
    <a className="col-md-12 mb-4">
      <div className="card verification-card">
        <div className="d-flex items-center p-4">
          <div className={`bg-${status.className} verification-card__circle`}>
            {index + 1}
          </div>
          <div className="mb-0 ms-3">
            <h5 className={`text-${status.className} mb-0`}>{title}</h5>
            <div className={`text-${status.className} text-md`}>
              {status.status}
            </div>
          </div>
          <div
            className={`text-${status.className} icon-xl ms-auto verification-card__icon`}
          >
            {status.icon}
          </div>
        </div>
      </div>
    </a>
  </Link>
);

export default Dashboard;
