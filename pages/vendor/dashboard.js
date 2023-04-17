import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import {
  BlissvilleImage,
  Overview,
  PegassusImage,
  ServiceBox,
  StackBox,
  WelcomeHero,
  WidgetBox,
} from 'pages/user/dashboard';
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

const Dashboard = () => {
  const [toast, setToast] = useToast();
  const { userState } = React.useContext(UserContext);
  const isVerifiedVendor = userState.vendor?.verified;

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

const VerifiedVendorContent = () => (
  <>
    <Overview type="vendor" />
    <div className="container-fluid py-0">
      <div className="row">
        <WidgetBox title="Enquiries">
          <StackBox
            title="Pegassus Duplexes"
            src={PegassusImage}
            date="Haruna Popoola"
            price="15,000,000"
            status="0"
            statusName="Pending"
          />
          <StackBox
            title="Blissville Uno"
            src={BlissvilleImage}
            date="Adeola Ogunlana"
            price="25,000,000"
            status="1"
            statusName="Created"
          />
        </WidgetBox>

        <WidgetBox title="Scheduled Visitation">
          <StackBox
            title="Blissville Uno"
            date="April 3th, 2023 (2:00PM)"
            status="2"
            statusName="Due: 2 days"
          />
          <StackBox
            title="Pegassus Duplexes"
            date="April 10th, 2023"
            status="1"
            statusName="Due: 12 days"
          />
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
    </section>
  );
};

const VerificationCard2 = ({ title, children, icon, index, status }) => (
  <Link href={`/vendor/setup/${index + 1}`} passHref>
    <a className="col-md-6 mb-4">
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
    </a>
  </Link>
);

const VerificationCard = ({ title, children, icon, index, status }) => (
  <Link href={`/vendor/setup/${index + 1}`} passHref>
    <a className="col-md-12 mb-4">
      <div className="card verification-card">
        <div className="d-flex items-center p-4">
          <button className="w-10 h-10 rounded-circle btn btn-primary p-0">
            {index + 1}
          </button>
          <div className="mb-0 ms-3">
            <h5>{title}</h5>
            <div className="text-sm">{status.status}</div>
          </div>
          <div className={`${status.className} icon-xl ms-auto`}>
            {status.icon}
          </div>
        </div>
      </div>
    </a>
  </Link>
);

export default Dashboard;
