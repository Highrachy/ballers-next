import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import {
  BADGE_ACCESS_LEVEL,
  BASE_API_URL,
  DASHBOARD_PAGE,
  FAST_TRACK_VENDOR,
  FEATURE_FLAGS,
  STATUS,
  USER_TYPES,
} from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import {
  dataToOptions,
  getError,
  getFormattedAddress,
  statusIsSuccessful,
  valuesToOptions,
} from 'utils/helpers';
import { Card, Tabs, Tab } from 'react-bootstrap';
import { FastTrackVendorIcon, UserIcon } from 'components/utils/Icons';
import CardTableSection from 'components/common/CardTableSection';
import { ShowDirectorsTable } from '../vendor/setup/Signatories';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { commentSchema } from 'components/forms/schemas/vendorSchema';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import Textarea from 'components/forms/Textarea';
import { VENDOR_STEPS } from 'utils/constants';
import Image, { LocalImage, OnlineImage } from 'components/utils/Image';
import Modal from 'components/common/Modal';
import { SuccessIcon } from 'components/utils/Icons';
import BallersSpinner from 'components/utils/BallersSpinner';
import { QuestionMarkIcon } from 'components/utils/Icons';

import { getVerificationStatus } from '../vendor/setup/AccountSetup';
import Timeline from 'components/common/Timeline';
import { LogTimeline } from 'components/common/Timeline';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import {
  addFeatureFlagSchema,
  emailSchema,
  updateRemittanceSchema,
} from 'components/forms/schemas/userSchema';
import InputFormat from 'components/forms/InputFormat';
import { setQueryCache } from 'hooks/useQuery';
import Select from 'components/forms/Select';
import Link from 'next/link';
import BadgePlaceholderImage from 'assets/img/placeholder/property.png';
import { BadgesIcon } from 'components/utils/Icons';
import Input from 'components/forms/Input';
import WelcomeHero from '@/components/common/WelcomeHero';
import DataList, { DataItem } from '@/components/common/DataList';
import { FaTimes } from 'react-icons/fa';

const pageOptions = {
  key: 'user',
  pageName: 'User',
};

const SingleUser = ({ id }) => {
  const [toast, setToast] = useToast();
  const [userQuery, user, setUser] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneUser(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <WelcomeHero title={`Single User`} subtitle={`Manage User information`} />{' '}
      <div className="container-fluid">
        <ContentLoader
          hasContent={!!user}
          Icon={<UserIcon />}
          query={userQuery}
          name={pageOptions.pageName}
          toast={toast}
        >
          <UserInfoCard
            vendorId={id}
            user={user}
            setUser={setUser}
            toast={toast}
            setToast={setToast}
          />
        </ContentLoader>
      </div>
    </BackendPage>
  );
};

// add comment form should be in each tab
// Add upgrade and downgrade editor here

// change documents name from
// better colour alignment of remaining steps

const UserInfoCard = ({ user, setUser, toast, setToast, vendorId }) => {
  const [loadingVerification, setLoadingVerification] = React.useState(false);
  const [badgeQuery] = useGetQuery({
    key: 'available-badge',
    name: 'available-badge',
    setToast,
    endpoint: API_ENDPOINT.getAllBadgesByRole(
      user?.role !== USER_TYPES.editor ? user.role || 1 : 1
    ),
    axiosOptions: {
      params: { assignedRole: `${BADGE_ACCESS_LEVEL.ALL}:${user?._id}` },
    },
  });

  const badges = badgeQuery?.data?.badges;
  const verifyVendor = () => {
    setLoadingVerification(true);
    setVerifyVendorModal(false);
    const payload = { vendorId };
    Axios.put(`${BASE_API_URL}/user/vendor/verify`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Vendor has been successfully verified`,
          });
          user.vendor.verified = true;
          setUser(user);
          setLoadingVerification(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoadingVerification(false);
      });
  };

  const certifyVendor = () => {
    setLoadingVerification(true);
    setVerifyVendorModal(false);
    const payload = { vendorId };
    Axios.put(`${BASE_API_URL}/user/vendor/certify`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Vendor has been successfully certified`,
          });
          user.vendor.verified = true;
          setUser(user);
          setLoadingVerification(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoadingVerification(false);
      });
  };

  const StepAction = ({ step }) => {
    const [hideForm, setHideForm] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [commentLoading, setCommentLoading] = React.useState(null);

    const approveVerificationStep = () => {
      setLoading(true);
      const payload = { vendorId, step };
      Axios.put(`${BASE_API_URL}/user/vendor/verify/step`, payload, {
        headers: { Authorization: getTokenFromStore() },
      })
        .then(function (response) {
          const { status } = response;
          if (statusIsSuccessful(status)) {
            setToast({
              type: 'success',
              message: `${VENDOR_STEPS[step]} has been successfully verified`,
            });
            user.vendor.verification[step].status = 'Verified';
            setUser(user);
            setLoading(false);
          }
        })
        .catch(function (error) {
          setToast({
            message: getError(error),
          });
          setLoading(false);
        });
    };

    const resolveSingleComment = ({ vendorId, step, commentId }) => {
      console.log('vendorId, step, commentId', vendorId, step, commentId);
      setCommentLoading(commentId);
      const payload = { vendorId, step, commentId };

      Axios.put(`${BASE_API_URL}/user/vendor/verify/comment/resolve`, payload, {
        headers: { Authorization: getTokenFromStore() },
      })
        .then(function (response) {
          const { status, data } = response;
          if (statusIsSuccessful(status)) {
            setToast({
              type: 'success',
              message: `${VENDOR_STEPS[step]} has been successfully resolved`,
            });
            setUser(data.vendor);
            setCommentLoading(null);
          }
        })
        .catch(function (error) {
          setToast({
            message: getError(error),
          });
          setCommentLoading(null);
        });
    };

    return (
      <Formik
        enableReinitialize={true}
        initialValues={setInitialValues(commentSchema)}
        onSubmit={({ comment }, actions) => {
          const payload = { vendorId, step, comment };
          Axios.put(`${BASE_API_URL}/user/vendor/verify/comment`, payload, {
            headers: { Authorization: getTokenFromStore() },
          })
            .then(function (response) {
              const { status, data } = response;
              if (statusIsSuccessful(status)) {
                setToast({
                  type: 'success',
                  message: `Your comment has been successfully added`,
                });
                setHideForm(true);
                setUser(data.vendor);
                actions.setSubmitting(false);
                actions.resetForm();
              }
            })
            .catch(function (error) {
              setToast({
                message: getError(error),
              });
              setHideForm(true);
              actions.setSubmitting(false);
            });
        }}
        validationSchema={createSchema(commentSchema)}
      >
        {({ isSubmitting, handleSubmit, ...props }) => {
          if (user.vendor?.verification[step]?.status === 'Verified') {
            return null;
          }
          return (
            <Form>
              <p className="mt-3 text-uppercase lead fw-bold">
                Status: {user.vendor?.verification[step]?.status}
              </p>

              {user.vendor?.verification[step]?.comments.length > 0 && (
                <section className="my-4">
                  <h6>Comments</h6>
                  {user.vendor?.verification[step].comments.map(
                    ({ comment, _id, status }, index) => (
                      <p key={index} className="speech-bubble">
                        {status === STATUS.Resolved ? (
                          <strike>{comment}</strike>
                        ) : (
                          <>{comment}</>
                        )}

                        <span
                          className="btn btn-sm text-primary resolve-comment-btn"
                          onClick={() =>
                            resolveSingleComment({
                              step,
                              commentId: _id,
                              vendorId: user._id,
                            })
                          }
                        >
                          {commentLoading && commentLoading === _id ? (
                            <>
                              <BallersSpinner small /> Loading
                            </>
                          ) : status === STATUS.Resolved ? (
                            <span className="text-success">
                              <SuccessIcon />
                            </span>
                          ) : (
                            <span className="text-danger">
                              <QuestionMarkIcon /> Mark As Resolved
                            </span>
                          )}
                        </span>
                      </p>
                    )
                  )}
                </section>
              )}
              {hideForm ? (
                <>
                  <Button
                    onClick={() => {
                      setHideForm(false);
                    }}
                    color="info"
                    className="btn-sm btn-wide"
                  >
                    Add Comment
                  </Button>
                  &nbsp; &nbsp; &nbsp;
                  <Button
                    color="secondary"
                    loading={loading}
                    onClick={approveVerificationStep}
                    className="btn-sm btn-wide"
                  >
                    Approve {VENDOR_STEPS[step]}
                  </Button>{' '}
                </>
              ) : (
                <>
                  <Textarea label="Comment" name="comment" />
                  <Button
                    color="info"
                    className="mt-3 btn-sm btn-info"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Add Comment
                  </Button>{' '}
                  &nbsp; &nbsp; &nbsp;
                  <button
                    onClick={() => {
                      setHideForm(true);
                    }}
                    className="mt-3 btn btn-sm btn-outline-dark"
                  >
                    Close Comment
                  </button>
                  <DisplayFormikState {...props} showAll />
                </>
              )}
            </Form>
          );
        }}
      </Formik>
    );
  };

  const VENDOR_STEPS_KEY = Object.keys(VENDOR_STEPS);
  const isVendor = user.role === USER_TYPES.vendor;

  const [showVerifyVendorModal, setVerifyVendorModal] = React.useState(false);

  const verificationState = {
    userInfo: getVerificationStatus(user, 0),
    bankDetails: getVerificationStatus(user, 1),
    directorInfo: getVerificationStatus(user, 2),
    documentUpload: getVerificationStatus(user, 3),
  };

  const isFastTrackUser =
    user.vendor?.fastTrack && user.vendor?.fastTrack === FAST_TRACK_VENDOR.AUTO;

  // to remove all
  // const verificationState = getVerificationState(user);

  const UserInformation = () => {
    const [loading, setLoading] = React.useState(false);
    const userRole = user?.role;

    const processRoleChange = () => {
      setLoading(true);
      const action = userRole === USER_TYPES.user ? 'upgrade' : 'downgrade';

      Axios.put(
        `${BASE_API_URL}/user/editor/${action}`,
        { userId: user._id },
        {
          headers: { Authorization: getTokenFromStore() },
        }
      )
        .then(function (response) {
          const { status, data } = response;
          if (status === 200) {
            setToast({
              message: data.message,
              type: 'success',
            });
            setUser(data.user);
            setQueryCache([pageOptions.key, user._id], {
              user: data.user,
            });
            setLoading(false);
          }
        })
        .catch(function (error) {
          setToast({
            message: getError(error),
          });
          setLoading(false);
        });
    };

    return (
      <>
        <CardTableSection
          name={
            <span className="title">
              User Information{' '}
              {isVendor && (
                <span
                  className={
                    isFastTrackUser
                      ? 'text-info'
                      : verificationState.userInfo.className
                  }
                >
                  {isFastTrackUser ? (
                    <FastTrackVendorIcon />
                  ) : (
                    verificationState.userInfo.icon
                  )}
                </span>
              )}
            </span>
          }
          className="border-0"
        >
          <tr>
            <td colSpan="5" className="text-center">
              <OnlineImage
                bordered
                circle
                alt={user.firstName}
                className={'img-fluid avatar--large'}
                src={user.profileImage}
                defaultImage={'/img/placeholder/user.jpg'}
                name={user.firstName}
              />
            </td>
          </tr>
          {isVendor ? (
            <>
              <tr>
                <td>
                  <strong>Company Logo</strong>
                </td>
                <td colSpan="4">
                  {user.vendor?.companyLogo && (
                    <OnlineImage
                      name={user.firstName}
                      className="img-fluid dashboard-top-nav__company-logo mb-3"
                      src={user.vendor.companyLogo}
                      title={user.firstName}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Company Name</strong>
                </td>
                <td colSpan="4">{user.vendor?.companyName}</td>
              </tr>
            </>
          ) : (
            <tr>
              <td>
                <strong>First Name</strong>
              </td>
              <td>{user.firstName}</td>
              <td>&nbsp;</td>
              <td>
                <strong>Last Name</strong>
              </td>
              <td>{user.lastName}</td>
            </tr>
          )}
          <tr>
            <td>
              <strong>Email</strong>
            </td>
            <td>{user.email}</td>
            <td></td>
            {isFastTrackUser ? (
              <>
                <td>
                  <strong>Password</strong>
                </td>
                <td>{`${user.email
                  .toLowerCase()
                  .substring(0, 4)
                  .toLowerCase()}@007#`}</td>
              </>
            ) : (
              <>
                <td>
                  <strong>Phone</strong>
                </td>
                <td>
                  {user.phone} <br /> {user.phone2}
                </td>
              </>
            )}
          </tr>

          {isVendor && (
            <tr>
              <td>
                <strong>Entity Type</strong>
              </td>
              <td>{user.vendor?.entity}</td>
              <td></td>
              <td>
                <strong>Redan Number</strong>
              </td>
              <td>{user.vendor?.redanNumber}</td>
            </tr>
          )}

          {isFastTrackUser ||
            (user.vendor?.fastTrack === FAST_TRACK_VENDOR.REQUIRE_INFO && (
              <>
                <tr>
                  <td>
                    <strong>Fast Track Status</strong>
                  </td>
                  <td colSpan="4">{user.vendor.fastTrack}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Hand Over Account</strong>
                  </td>
                  <td colSpan="4">
                    <TransferToVendorForm
                      user={user}
                      setUser={setUser}
                      setToast={setToast}
                    />
                  </td>
                </tr>
              </>
            ))}
          {!isFastTrackUser && (
            <>
              <tr>
                <td>
                  <strong>Address</strong>
                </td>
                <td colSpan="4">
                  {user.address && getFormattedAddress(user.address)}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Feature Flag</strong>
                </td>
                <td colSpan="4">
                  <ul className="list-group mt-3">
                    {user?.featureFlag?.map(({ name }, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center p-3"
                      >
                        <span>{name}</span>
                        <DeleteFeatureFlagModal
                          flagName={name}
                          user={user}
                          setUser={setUser}
                          setToast={setToast}
                        />
                      </li>
                    ))}
                  </ul>

                  <AddFeatureFlagForm
                    user={user}
                    setUser={setUser}
                    setToast={setToast}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Badges</strong>
                </td>
                <td colSpan="4">
                  {user?.badges?.length > 0 && (
                    <LoadCurrentUserBadges user={user} badges={user?.badges} />
                  )}

                  <AssignBadge
                    badges={badges}
                    user={user}
                    setToast={setToast}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Referral Bonus</strong>
                </td>
                <td colSpan="4">
                  <ReferralBonusForm
                    user={user}
                    setUser={setUser}
                    setToast={setToast}
                  />
                </td>
              </tr>

              {isVendor && (
                <tr>
                  <td>
                    <strong>Remittance</strong>
                  </td>
                  <td colSpan="4">
                    <RemittanceForm
                      user={user}
                      setUser={setUser}
                      setToast={setToast}
                    />
                  </td>
                </tr>
              )}

              {/* {(user.role === USER_TYPES.user ||
                user.role === USER_TYPES.editor) && (
                <tr>
                  <td colSpan="5">
                    <Button
                      color="none"
                      loading={loading}
                      className={
                        user.role === USER_TYPES.user
                          ? 'btn-secondary-light'
                          : 'btn-danger-light'
                      }
                      onClick={processRoleChange}
                    >
                      Change Role to{' '}
                      {user.role === USER_TYPES.user ? 'a User' : 'an Editor'}
                    </Button>
                  </td>
                </tr>
              )} */}

              {isVendor && (
                <tr>
                  <td colSpan="5">
                    <StepAction step={VENDOR_STEPS_KEY[0]} />
                  </td>
                </tr>
              )}
            </>
          )}
        </CardTableSection>
      </>
    );
  };
  const BankInformation = () => (
    <CardTableSection
      name={
        <span className="title">
          Bank Details{' '}
          <span className={verificationState.bankDetails.className}>
            {verificationState.bankDetails.icon}
          </span>
        </span>
      }
      className="border-0"
    >
      <tr>
        <td>
          <strong>Account Name</strong>
        </td>
        <td>{user.vendor?.bankInfo?.accountName}</td>
      </tr>
      <tr>
        <td>
          <strong>Bank Name</strong>
        </td>
        <td>{user.vendor?.bankInfo?.bankName}</td>
      </tr>
      <tr>
        <td>
          <strong>Account Number</strong>
        </td>
        <td>{user.vendor?.bankInfo?.accountNumber}</td>
      </tr>
      {user.vendor?.bankInfo?.bankName && (
        <tr>
          <td colSpan="5">
            <StepAction step={VENDOR_STEPS_KEY[1]} />
          </td>
        </tr>
      )}
    </CardTableSection>
  );

  const Directors = () => (
    <Card className="pt-5 my-5 border-0 card-container">
      <span className="title">
        Directors / Signatories{' '}
        <span className={verificationState.directorInfo.className}>
          {verificationState.directorInfo.icon}
        </span>
      </span>
      <ShowDirectorsTable
        directors={user.vendor?.directors}
        moveToNextStep={null}
      />

      {user.vendor?.directors[0] && <StepAction step={VENDOR_STEPS_KEY[2]} />}
    </Card>
  );

  const Certificates = () => (
    <CardTableSection
      name={
        <span className="title">
          Certificates{' '}
          <span className={verificationState.documentUpload.className}>
            {verificationState.documentUpload.icon}
          </span>
        </span>
      }
      className="pt-4 my-5 border-0"
    >
      <tr>
        <td>
          <strong>Identification</strong>
        </td>
        <td>
          <LocalImage
            src={user.vendor?.identification && user.vendor?.identification.url}
            name="identification"
            bordered
          />
          <br />
          <strong>
            {user.vendor?.identification && user.vendor?.identification.type}
          </strong>
        </td>
      </tr>
      <tr>
        <td>
          <strong>Tax Certificate</strong>
        </td>
        <td>
          <LocalImage name="tax" src={user.vendor?.taxCertificate} bordered />
        </td>
      </tr>
      {((user.vendor?.identification && user.vendor?.identification?.url) ||
        user.vendor?.taxCertificate) && (
        <tr>
          <td colSpan="5">
            <StepAction step={VENDOR_STEPS_KEY[3]} />
          </td>
        </tr>
      )}
    </CardTableSection>
  );

  const Logs = () => (
    <div className="card h-100 my-5 pt-5 border-0">
      <div className="card-container">
        <h5 className="title">Logs</h5>

        <Timeline>
          {user.vendor?.logs?.map((log, index) => (
            <LogTimeline log={log} key={index} />
          ))}
        </Timeline>
      </div>
    </div>
  );

  return (
    <Timeline>
      <Toast {...toast} showToastOnly />
      {/* <AlertToast message="Awaiting your Review" /> */}
      <Card className="card-container mb-5">
        {isVendor && !isFastTrackUser ? (
          <Tabs defaultActiveKey="0">
            <Tab
              eventKey="0"
              title={
                <>
                  User Information{' '}
                  <span className={verificationState.userInfo.className}>
                    {verificationState.userInfo.icon}
                  </span>
                </>
              }
            >
              <div className="card-tab-content pt-5">
                <UserInformation />
              </div>
            </Tab>
            <Tab
              eventKey="1"
              title={
                <>
                  Bank Details{' '}
                  <span className={verificationState.bankDetails.className}>
                    {verificationState.bankDetails.icon}
                  </span>
                </>
              }
            >
              <div className="card-tab-content py-5">
                <BankInformation />
              </div>
            </Tab>
            <Tab
              eventKey="2"
              title={
                <>
                  Directors / Signatories{' '}
                  <span className={verificationState.directorInfo.className}>
                    {verificationState.directorInfo.icon}
                  </span>
                </>
              }
            >
              <Directors />
            </Tab>
            <Tab
              eventKey="3"
              title={
                <>
                  Document Upload{' '}
                  <span className={verificationState.documentUpload.className}>
                    {verificationState.documentUpload.icon}
                  </span>
                </>
              }
            >
              <Certificates />
            </Tab>
            <Tab eventKey="4" title="Logs">
              <Logs />
            </Tab>
          </Tabs>
        ) : (
          <UserInformation />
        )}
      </Card>
      {/* add a status page here like the one in the userdashbard, something like user is currently onboarding */}
      {/* user has been verified, certified, not started onboarding, currently onboarding, needs review, has pending comment */}
      {/*
      Not Started = all completed steps is false,
      current Onboarding = At least 1 completed Step is true,
      Needs review = all completed step but not veriried
      Has Pending comment = has pending comment
       */}

      {/* <UserCard showEmail />
      <UserCard /> */}

      {isVendor && (
        <>
          {!user.vendor?.verified &&
            user.vendor?.verification?.companyInfo?.status === 'Verified' &&
            user.vendor?.verification?.bankDetails?.status === 'Verified' &&
            user.vendor?.verification?.directorInfo?.status === 'Verified' &&
            user.vendor?.verification?.documentUpload?.status ===
              'Verified' && (
              <Button
                loading={loadingVerification}
                onClick={() => setVerifyVendorModal(true)}
                className="btn btn-secondary"
              >
                Verify Vendor
              </Button>
            )}
          {user.vendor?.verified &&
            !user.vendor?.certified &&
            !user?.isDemoAccount && (
              <Button
                loading={loadingVerification}
                onClick={() => setVerifyVendorModal(true)}
                className="btn btn-secondary"
              >
                Certify Vendor
              </Button>
            )}
          {user?.isDemoAccount && (
            <>
              <Button
                color="danger"
                loading={loadingVerification}
                onClick={() => setVerifyVendorModal(true)}
                className="me-3"
              >
                Delete Demo Account
              </Button>
            </>
          )}

          {/*  Modals */}
          <Modal
            title="Verify Vendor"
            show={showVerifyVendorModal}
            onHide={() => setVerifyVendorModal(false)}
            showFooter={false}
          >
            <section className="row">
              <div className="col-md-12 my-3 text-center">
                <h5 className="my-2 confirmation-text">
                  Are you sure you want to{' '}
                  {user.vendor?.verified ? 'certify' : 'verify'} this vendor?
                </h5>
                <button
                  className="btn btn-secondary mb-5"
                  onClick={user.vendor?.verified ? certifyVendor : verifyVendor}
                >
                  {user.vendor?.verified ? 'Certify Vendor' : 'Verify Vendor'}
                </button>
              </div>
            </section>
          </Modal>
        </>
      )}
    </Timeline>
  );
};

const AddFeatureFlagForm = ({ setUser, setToast, user }) => {
  const [showAddFlagForm, setShowAddFlagForm] = React.useState(false);

  const availableFeatureFlags = FEATURE_FLAGS.reduce((acc, flag) => {
    const flagAssigned = user?.featureFlag?.some(
      (userFlag) => userFlag.name === flag
    );
    if (!flagAssigned) {
      acc.push(flag);
    }
    return acc;
  }, []);

  if (availableFeatureFlags.length === 0) {
    return null;
  }

  return (
    <Formik
      initialValues={setInitialValues(addFeatureFlagSchema)}
      validationSchema={createSchema(addFeatureFlagSchema)}
      onSubmit={({ name }, actions) => {
        const payload = {
          name,
          userId: user._id,
        };
        Axios.post(`${BASE_API_URL}/user/feature-flag/add`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: 'Feature flag added successfully',
              });
              setUser(data.user);
              setQueryCache([pageOptions.key, user._id], {
                user: data.user,
              });
            }
          })
          .catch(function (error) {
            setToast({
              type: 'error',
              message: getError(error) || 'Failed to add feature flag',
            });
          })
          .finally(() => {
            actions.setSubmitting(false);
            setShowAddFlagForm(false);
          });
      }}
    >
      {({ isSubmitting, handleSubmit, ...props }) => {
        return (
          <Form>
            <div className="row mt-3">
              <div className="col-md-6">
                <Select
                  name="name"
                  options={valuesToOptions(availableFeatureFlags)}
                  placeholder="Select Feature Flag"
                />
              </div>
              <div className="col-md-6">
                <Button
                  color="secondary-light"
                  onClick={() => setShowAddFlagForm(true)}
                  disabled={isSubmitting}
                >
                  Add Feature Flag
                </Button>
              </div>
            </div>

            <Modal
              title="Add Feature Flag"
              show={showAddFlagForm}
              onHide={() => setShowAddFlagForm(false)}
              showFooter={false}
            >
              <section>
                {/* Confirmation text */}
                <div className="text-center col-md-12 mt-5">
                  <h4>{props?.values?.name}</h4>
                  <p className="mt-2 mb-4 confirmation-text">
                    Are you sure you want to add this feature flag?
                  </p>
                </div>

                <div className="text-center col-md-12 mb-5">
                  <Button
                    color="secondary"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Yes, Add Feature Flag
                  </Button>
                </div>
              </section>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

const DeleteFeatureFlagModal = ({ flagName, user, setUser, setToast }) => {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [loadingFeatureFlag, setLoadingFeatureFlag] = React.useState(false);

  const handleDelete = async () => {
    setLoadingFeatureFlag(true);

    Axios.delete(`${BASE_API_URL}/user/feature-flag/delete`, {
      data: { name: flagName, userId: user?._id },
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status, data } = response;
        if (status === 200) {
          setToast({
            message: 'Feature flag deleted successfully',
            type: 'success',
          });
          setUser(data.user);
          setQueryCache([pageOptions.key, user._id], {
            user: data.user,
          });
          setLoadingFeatureFlag(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoadingFeatureFlag(false);
      });
  };

  return (
    <div>
      <span
        className="text-link text-muted text-danger"
        onClick={() => setShowConfirmModal(true)}
      >
        <FaTimes />
      </span>

      {/* Confirmation modal */}
      <Modal
        title="Delete Feature Flag"
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        showFooter={false}
      >
        <section>
          <h5 className="mb-4 confirmation-text">
            Are you sure you want to delete the <strong>{flagName}</strong> from
            this user?
          </h5>
          <div className="text-center col-md-12">
            <Button
              className="mt-4 btn-secondary"
              loading={loadingFeatureFlag}
              onClick={handleDelete}
            >
              Yes, Delete Feature Flag
            </Button>
          </div>
        </section>
      </Modal>
    </div>
  );
};

const TransferToVendorForm = ({ user, setUser, setToast }) => {
  const [showTransferForm, setShowTransferForm] = React.useState(false);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(emailSchema)}
      onSubmit={({ email }, actions) => {
        console.log('email');
        const payload = { email, vendorId: user._id };
        Axios.put(`${BASE_API_URL}/user/transfer-to-vendor`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `The email has been successfully updated`,
              });
              setUser(data.user);
              setQueryCache([pageOptions.key, user._id], {
                user: data.user,
              });
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(emailSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => {
        return (
          <Form>
            <div className="input-group">
              <Input type="email" placeholder="Email Address" name="email" />
              <div className="input-group-append">
                <Button
                  color="dark"
                  onClick={() => setShowTransferForm(true)}
                  disabled={props.values?.email?.toString() === null}
                >
                  Update
                </Button>
              </div>
            </div>

            <DisplayFormikState {...props} hide />

            <Modal
              title="Hand Over Account To Vendor"
              show={showTransferForm}
              onHide={() => setShowTransferForm(false)}
              showFooter={false}
            >
              <section>
                <h5 className="mb-4 confirmation-text">
                  Are you sure you want to hand over the{' '}
                  {user.vendor.companyName} account to{' '}
                  <strong>{props.values?.email}?</strong>
                </h5>
                <div className="text-center col-md-12">
                  <Button
                    className="mt-4 btn-secondary"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Yes, Hand Over Account
                  </Button>
                </div>
              </section>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

const RemittanceForm = ({ user, setUser, setToast }) => {
  const [showRemitModal, setShowRemitModal] = React.useState(false);
  const defaultPercentage = user?.vendor?.remittancePercentage || 5;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(updateRemittanceSchema, {
        percentage: defaultPercentage,
      })}
      onSubmit={({ percentage }, actions) => {
        const payload = { percentage, vendorId: user._id };
        Axios.put(`${BASE_API_URL}/user/remittance`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              console.log(`data`, data);
              setToast({
                type: 'success',
                message: `Remittance has been successfully updated`,
              });
              setUser(data.user);
              setQueryCache([pageOptions.key, user._id], {
                user: data.user,
              });
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(updateRemittanceSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => {
        return (
          <Form>
            <div className="input-group">
              <InputFormat
                formGroupClassName=""
                suffix="%"
                prefix=""
                name="percentage"
              />
              <div className="input-group-append">
                <Button
                  color="dark"
                  onClick={() => setShowRemitModal(true)}
                  disabled={
                    defaultPercentage?.toString() ===
                    props.values?.percentage?.toString()
                  }
                >
                  Update
                </Button>
              </div>
            </div>

            <DisplayFormikState {...props} hide />

            <Modal
              title="Remittance"
              show={showRemitModal}
              onHide={() => setShowRemitModal(false)}
              showFooter={false}
            >
              <section>
                <h5 className="mb-4 confirmation-text">
                  Are you sure you want to update this Remittance?
                </h5>
                <table className="table table-sm">
                  <thead>
                    <tr className="text-secondary">
                      <th>New Percentage</th>
                      <th>
                        <h5 className="text-secondary ms-n2">
                          {props.values.percentage}%
                        </h5>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Old Percentage</td>
                      <td>{defaultPercentage}%</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center col-md-12">
                  <Button
                    className="mt-4 btn-secondary"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Yes, Update Remittance
                  </Button>
                </div>
              </section>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

const ReferralBonusForm = ({ user, setUser, setToast }) => {
  const [showRemitModal, setShowRemitModal] = React.useState(false);
  const defaultPercentage = user?.additionalInfo?.referralPercentage || 1.5;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(updateRemittanceSchema, {
        percentage: defaultPercentage,
      })}
      onSubmit={({ percentage }, actions) => {
        const payload = { percentage, userId: user._id };
        Axios.put(`${BASE_API_URL}/user/referral-percentage`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Referral Percentage has been successfully updated`,
              });
              setUser(data.user);
              setQueryCache([pageOptions.key, user._id], {
                user: data.user,
              });
              actions.setSubmitting(false);
              actions.resetForm();
              setShowRemitModal(false);
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(updateRemittanceSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => {
        return (
          <Form>
            <div className="input-group">
              <InputFormat
                formGroupClassName=""
                suffix="%"
                prefix=""
                name="percentage"
              />
              <div className="input-group-append">
                <Button
                  color="dark"
                  onClick={() => setShowRemitModal(true)}
                  disabled={
                    defaultPercentage?.toString() ===
                    props.values?.percentage?.toString()
                  }
                >
                  Update
                </Button>
              </div>
            </div>

            <DisplayFormikState {...props} hide />

            <Modal
              title="Referral Bonus"
              show={showRemitModal}
              onHide={() => setShowRemitModal(false)}
              showFooter={false}
            >
              <section>
                <h5 className="mb-4 confirmation-text">
                  Are you sure you want to update this Referral Bonus?
                </h5>
                <table className="table table-sm">
                  <thead>
                    <tr className="text-secondary">
                      <th>New Percentage</th>
                      <th>
                        <h5 className="text-secondary ms-n2">
                          {props.values.percentage}%
                        </h5>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Old Percentage</td>
                      <td>{defaultPercentage}%</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center col-md-12">
                  <Button
                    className="mt-4 btn-secondary"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Yes, Update Referral Bonus
                  </Button>
                </div>
              </section>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

const AssignBadge = ({ user, setToast, badges }) => {
  const [showFlagModal, setShowFlagModal] = React.useState(false);

  return (
    <>
      <Button
        color="none"
        className="btn btn-sm btn-wide btn-outline-dark"
        onClick={() => setShowFlagModal(true)}
      >
        Assign Badge
      </Button>

      {/* Assign BAdge Modals */}
      <Modal
        title="Assign Badge"
        show={showFlagModal}
        onHide={() => setShowFlagModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="my-3 col-md-12">
            <Formik
              initialValues={setInitialValues({})}
              onSubmit={({ badge }, actions) => {
                const payload = {
                  userId: user._id,
                  badgeId: badge,
                };
                console.log(`payload`, payload);
                Axios.post(
                  `${BASE_API_URL}/assign-badge`,
                  { ...payload },
                  {
                    headers: { Authorization: getTokenFromStore() },
                  }
                )
                  .then(function (response) {
                    const { status } = response;
                    if (statusIsSuccessful(status)) {
                      setToast({
                        type: 'success',
                        message: `The badge has been successfully to user`,
                      });
                      actions.setSubmitting(false);
                      actions.resetForm();
                      setShowFlagModal(false);
                    }
                  })
                  .catch(function (error) {
                    setToast({
                      message: getError(error),
                    });
                    actions.setSubmitting(false);
                  });
              }}
              validationSchema={createSchema({})}
            >
              {({ isSubmitting, handleSubmit, ...props }) => (
                <Form>
                  <Select
                    label="Badge"
                    name="badge"
                    options={dataToOptions(badges, 'name')}
                  />
                  <Button
                    className="mt-4 btn-secondary"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Assign Badge
                  </Button>
                  <DisplayFormikState {...props} hide showAll />
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const LoadCurrentUserBadges = ({ badges }) => (
  <section className="py-4 row">
    {badges.map((badge, index) => (
      <SingleUserBadge key={index} {...badge} />
    ))}
  </section>
);

export const SingleUserBadge = ({ image, user, _id, name }) => {
  return (
    <div className="mb-4 text-center col-md-4 col-6">
      <div className="mb-2 icon-xl badge-gray">
        {image ? (
          <Link href={`/${DASHBOARD_PAGE[user?.role]}/badge/${_id}`}>
            <Image
              src={image}
              name={`badge ${_id}`}
              width="80"
              alt="badge"
              defaultImage={BadgePlaceholderImage}
            />
          </Link>
        ) : (
          <BadgesIcon />
        )}
      </div>
      <strong className="small">{name}</strong>
    </div>
  );
};

export default SingleUser;
