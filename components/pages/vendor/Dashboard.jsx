import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { UserContext } from 'context/UserContext';
import { Link } from '@reach/router';
import {
  getCompletedSteps,
  getVerificationState,
} from 'components/pages/vendor/setup/AccountSetup';
import { CompanyInfoIcon } from 'components/utils/Icons';
import { BankInfoIcon } from 'components/utils/Icons';
import { FileIcon } from 'components/utils/Icons';
import { UserIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import { Loading } from 'components/utils/LoadingItems';
import { getVerificationStatus } from './setup/AccountSetup';
import { CertifyIcon } from 'components/utils/Icons';
import { VisitationIcon } from 'components/utils/Icons';
import { EnquiryIcon } from 'components/utils/Icons';
import { Alert } from 'react-bootstrap';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { OFFER_STATUS, VISITATION_STATUS } from 'utils/constants';
import DashboardCards from 'components/common/DashboardCards';
import { OfferIcon } from 'components/utils/Icons';

const Dashboard = () => (
  <BackendPage>
    <Welcome />
  </BackendPage>
);

const Welcome = () => {
  const { userState } = React.useContext(UserContext);

  if (!userState.firstName) {
    return <Loading Icon={<UserIcon />} text="Retrieving your Information" />;
  }

  return (
    <section className="container-fluid">
      <div className="card bg-primary dashboard mb-3">
        <div className="row">
          <div className="col-sm-12">
            <h4>
              Hello, {userState.vendor?.companyName || userState.firstName}{' '}
              {userState.vendor.certified && <CertifyIcon />}{' '}
            </h4>
            <p className="lead">Welcome to Ballers</p>
          </div>
        </div>
      </div>

      {userState.vendor?.verified ? (
        <VerifiedVendorContent />
      ) : (
        <UnVerifiedVendorContent />
      )}
    </section>
  );
};

const UnVerifiedVendorContent = () => {
  const { userState } = React.useContext(UserContext);
  const completedSteps = getCompletedSteps(userState);

  const noOfCompletedSteps = completedSteps.filter(Boolean).length;
  const currentProgress = noOfCompletedSteps * 25;

  const verificationState = getVerificationState(userState);

  return (
    <>
      <section>
        <div className="card card-bordered my-4">
          <div className="card-inner p-4">
            <div className="row">
              <div className="col-md-8">
                <h6>You need setup a verified Account to get started</h6>
                <p className="text-muted">
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
              <div className="col-md-4 text-right">
                <Link
                  to={`/vendor/setup/${verificationState.page}`}
                  className="btn btn-sm btn-wide btn-secondary mt-3"
                >
                  {noOfCompletedSteps > 0 ? 'Continue Setup' : 'Start Setup'}
                </Link>
              </div>
            </div>
          </div>
          <div className="card-progress-bar">
            <div
              className="pl-4 text-right text-smaller text-secondary px-2"
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
        >
          See your profile data and manage your Account to choose what is saved
          in our system.
        </VerificationCard>

        <VerificationCard
          icon={<BankInfoIcon />}
          title="Bank Information"
          index={1}
          key={1}
          status={getVerificationStatus(userState, 1)}
        >
          See your profile data and manage your Account to choose what is saved
          in our system.
        </VerificationCard>

        <VerificationCard
          icon={<UserIcon />}
          title="Signatories"
          index={2}
          key={2}
          status={getVerificationStatus(userState, 2)}
        >
          See your profile data and manage your Account to choose what is saved
          in our system.
        </VerificationCard>

        <VerificationCard
          icon={<FileIcon />}
          title="Certificates"
          status={getVerificationStatus(userState, 3)}
          index={3}
          key={3}
        >
          See your profile data and manage your Account to choose what is saved
          in our system.
        </VerificationCard>
      </div>
    </>
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

  return (
    <>
      {visitationsQuery.isLoading ||
      enquiriesQuery.isLoading ||
      offersQuery.isLoading ? (
        <Loading size="small" />
      ) : (
        <>
          {enquiriesQuery?.data?.result?.length > 0 && (
            <NoticeCard
              Icon={<EnquiryIcon />}
              link="/vendor/enquiries"
              name="Enquiries"
              type="secondary"
              message={`You have ${enquiriesQuery?.data?.result?.length} unresolved Enquiries`}
            />
          )}
          {visitationsQuery?.data?.result?.length > 0 && (
            <NoticeCard
              Icon={<VisitationIcon />}
              link="/vendor/scheduled-visits"
              name="Schedule Visitations"
              type="info"
              message={`You have ${visitationsQuery?.data?.result?.length} unresolved Scheduled Visitations`}
            />
          )}
          {offersQuery?.data?.result?.length > 0 && (
            <NoticeCard
              Icon={<OfferIcon />}
              link="/vendor/respond-to-offers"
              name="Offers"
              type="warning"
              message={`You have ${offersQuery?.data?.result?.length} unresolved Offers`}
            />
          )}
        </>
      )}
      <DashboardCards />
    </>
  );
};

const VerificationCard = ({ title, children, icon, index, status }) => (
  <Link to={`/vendor/setup/${index + 1}`} className="col-md-6 mb-4">
    <div className="card verification-card">
      <div className="verification-card__block">
        <div className="verification-card__img">{icon}</div>
        <div>
          <h5 className="verification-card__title">
            {title}{' '}
            <span className={`${status.className} verification__icon`}>
              {status.icon}
            </span>
          </h5>
          <p className="verification-card__text">{children}</p>
        </div>
      </div>
      <div className="verification-card__action">
        {status.icon} {status.status}
      </div>
    </div>
  </Link>
);

export const NoticeCard = ({ Icon, name, message, type, link }) => (
  <Link to={link}>
    <Alert key={name} variant={type} className="notice-card py-0">
      <div className="notice-card__text">
        <span className={`text-${type}`}>{Icon}</span>
        {message}
      </div>
    </Alert>
  </Link>
);
export default Dashboard;
