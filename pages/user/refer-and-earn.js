import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { referralInviteSchema } from 'components/forms/schemas/userSchema';
import { BASE_API_URL } from 'utils/constants';
import { CopyToClipBoardIcon } from 'components/utils/Icons';
import { UserContext } from 'context/UserContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Sharer from 'components/utils/Sharer';
import { CheckIcon } from 'components/utils/Icons';
import { getError, getReferralStatus, moneyFormatInNaira } from 'utils/helpers';
import { getTokenFromStore } from 'utils/localStorage';
import NoContent from 'components/utils/NoContent';
import LoadItems from 'components/utils/LoadingItems';
import { ReferIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import PaginatedContent from 'components/common/PaginatedContent';
import { API_ENDPOINT } from 'utils/URL';
import { refreshQuery } from 'hooks/useQuery';
import UserCard from 'components/common/UserCard';
import { WelcomeHero } from './dashboard';
import { LocalImage } from '@/components/utils/Image';

const ReferAndEarn = () => {
  const { userState } = React.useContext(UserContext);

  const id = userState._id;

  return (
    <BackendPage>
      <WelcomeHero
        title="Refer and Earn"
        subtitle="Get rewarded for sharing the love of real estate"
      />
      <div className="col-sm-12 mx-auto">
        <EmailReferral />
        <InviteFriendByEmailCard />
        <PaginatedContent
          endpoint={API_ENDPOINT.getAllReferrals()}
          initialFilter={{ referrerId: id }}
          pageName="Referral"
          DataComponent={InviteFriendsTable}
          PageIcon={<ReferIcon />}
          queryName="referral"
          hideTitle
        />
      </div>
    </BackendPage>
  );
};

const EmailReferral = () => {
  const { userState } = React.useContext(UserContext);
  const referralCode = `${
    process.env.REACT_APP_HOST || 'https://ballers.ng'
  }/ref/${userState.referralCode}`;

  return (
    <div className="container-fluid">
      <h4 className="my-4">Refer your friends and BALL together</h4>
      <Card className="mt-4 widget card-container">
        <section className="row py-4">
          <div className="col-sm-5 my-5">
            <LocalImage
              src="/img/pages/a-to-z/refer-n-earn.png"
              alt="Referral"
              className="img-fluid"
            />
          </div>
          <div className="col-sm-7">
            <p className="text-primary mb-4">
              Refer your friends and earn. We will also give your friends
              rewards because we value your friendship.
            </p>

            <ReferralCodeClipBoard referralCode={referralCode} />

            <Sharer shareUrl={referralCode} />
          </div>
        </section>
      </Card>
    </div>
  );
};

const InviteFriendByEmailForm = () => {
  const [toast, setToast] = useToast();
  return (
    <Formik
      initialValues={setInitialValues(referralInviteSchema)}
      onSubmit={(values, actions) => {
        if (!values.firstName) delete values.firstName;

        Axios.post(`${BASE_API_URL}/referral/invite`, values, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status } = response;
            if (status === 200) {
              setToast({
                type: 'success',
                message: `Invite sent to ${
                  values?.firstName || values?.email
                }.`,
              });
              refreshQuery('referral', true);
              actions.setSubmitting(false);
              actions.resetForm();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(referralInviteSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} />
          <h5 className="mb-4">Invite Your Friends</h5>
          <div className="form-row">
            <Input
              formGroupClassName="col-md-4"
              isValidMessage="Email address seems valid"
              name="email"
              placeholder="Email Address"
            />
            <Input
              formGroupClassName="col-md-4"
              name="firstName"
              optional
              placeholder="Name (Optional)"
            />
            <div className="col-md-4">
              <Button
                color="secondary"
                className="btn-sm btn-wide ms-md-2"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Invite Friend
              </Button>
            </div>
          </div>
          <DisplayFormikState {...props} hide showAll />
        </Form>
      )}
    </Formik>
  );
};

const InviteFriendByEmailCard = ({ addNewReferral }) => (
  <div className="container-fluid">
    <Card className="mt-4 widget card-container">
      <section className="row p-4">
        <InviteFriendByEmailForm addNewReferral={addNewReferral} />
      </section>
    </Card>
  </div>
);

const ReferralCodeClipBoard = ({ referralCode }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <label htmlFor="referralLink">Share Your Referral Link</label>
      <div className="input-group">
        <input
          type="text"
          name="referralLink"
          className="form-control"
          aria-label="referral code"
          value={referralCode}
          readOnly
        />
        <div className="input-group-append">
          <CopyToClipboard text={referralCode} onCopy={() => setCopied(true)}>
            {copied ? (
              <span className="input-group-text btn-success text-white disabled">
                <CheckIcon />
              </span>
            ) : (
              <span className="input-group-text btn btn-primary-light btn-light">
                <CopyToClipBoardIcon />
              </span>
            )}
          </CopyToClipboard>
        </div>
      </div>
      <div className="mt-2">
        {copied && (
          <div className="small text-success text-center">
            Your referral link has been successfully copied!
          </div>
        )}
      </div>
    </>
  );
};

const InviteFriendsTable = ({ results, offset }) => {
  const referrals = results;
  return (
    <div className="container-fluid mt-5">
      <h6>
        {referrals !== null
          ? `You have ${referrals.length} invited ${Humanize.pluralize(
              referrals.length,
              'friend'
            )} `
          : 'Invited friends'}
      </h6>

      <LoadItems
        Icon={<ReferIcon />}
        items={referrals}
        loadingText="Loading your Referrals"
        noContent={<NoContent isButton text="No Referrals found" />}
      >
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Referred User</th>
                <th>Status</th>
                <th>Available Reward</th>
                <th>Total Reward</th>
              </tr>
            </thead>
            <tbody>
              {referrals &&
                referrals.map((referral, index) => {
                  const referralStatus = getReferralStatus(
                    referral.status,
                    referral?.reward?.status
                  );
                  return (
                    <tr key={referral.email}>
                      <td>{index + 1 + offset}</td>
                      <td>
                        <strong>
                          <UserCard
                            user={
                              {
                                email: referral.email,
                                firstName: referral?.firstName,
                                ...referral?.referee,
                              } || {}
                            }
                            hideImage
                            nameOnly
                          />
                        </strong>
                      </td>
                      <td className={`${referralStatus.className}`}>
                        {referralStatus.text}
                      </td>
                      <td>
                        {referral?.accumulatedReward?.total ? (
                          <h5 className="text-dark">
                            {moneyFormatInNaira(
                              referral?.accumulatedReward?.total
                            )}
                          </h5>
                        ) : (
                          'None Yet'
                        )}
                      </td>
                      <td>
                        {referral?.reward?.amount ? (
                          <h5 className="text-dark">
                            {moneyFormatInNaira(referral?.reward?.amount)}
                          </h5>
                        ) : (
                          'None Yet'
                        )}
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </LoadItems>
    </div>
  );
};

export default ReferAndEarn;
