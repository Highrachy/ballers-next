import React from 'react';
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

export default UnVerifiedVendorContent;
