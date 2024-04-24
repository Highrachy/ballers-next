import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';

import Link from 'next/link';
import { Formik, Form } from 'formik';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { registerSchema } from 'components/forms/schemas/userSchema';
import CheckboxGroup from 'components/forms/CheckboxGroup';
import TitleSection, {
  EmptyTitleSection,
} from 'components/common/TitleSection';
import Toast, { useToast } from 'components/utils/Toast';
import { BASE_API_URL } from 'utils/constants';
import { getError } from 'utils/helpers';
import { getReferralInfo } from 'utils/localStorage';
import PhoneNumber from 'components/forms/PhoneNumber';
import { Tab, Tabs } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Register = () => (
  <>
    <Header />
    <TitleSection name="Registration Page" content="Create a new account" />
    <EmptyTitleSection>
      <Content />
    </EmptyTitleSection>
    <Footer />
  </>
);

export const Content = ({ currentUser = 'user', showVendorOnly = false }) => {
  const referralInfo = getReferralInfo();
  const [showUserForm, setShowUserForm] = React.useState(
    currentUser === 'user'
  );
  const [key, setKey] = React.useState(currentUser);
  const router = useRouter();

  const { tab } = router.query;

  React.useEffect(() => {
    setKey(tab);
  }, [tab]);

  return (
    <section>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 auth__text">
            {showUserForm ? (
              <>
                <h1>
                  {referralInfo ? (
                    <>
                      Hello
                      {referralInfo.firstName
                        ? ` ${referralInfo.firstName}`
                        : ''}
                      ,
                    </>
                  ) : (
                    <>
                      Create a <br /> free account
                    </>
                  )}
                </h1>
                <p className="lead">
                  {referralInfo ? (
                    <>
                      {referralInfo.referrer.firstName} has invited you to{' '}
                      <strong>become a Landlord</strong>
                    </>
                  ) : (
                    <>
                      Register to access your profile, rewards and
                      contributions.
                    </>
                  )}
                </p>
              </>
            ) : (
              <>
                <h1>Create a free BALL VIP account</h1>
                <p className="lead">
                  Showcase your properties to multiple buyers
                </p>
              </>
            )}
          </div>
          <div className="col-lg-6 offset-lg-1 mb-6">
            <Tabs
              id={`tab-register`}
              activeKey={key}
              onSelect={(k) => {
                setKey(k);
                setShowUserForm(!showUserForm);
              }}
            >
              {!showVendorOnly && (
                <Tab eventKey="user" title="Register as a User">
                  <RegisterForm showUserForm={true} />
                </Tab>
              )}
              <Tab eventKey="vendor" title="Register as a Seller">
                <RegisterForm showUserForm={false} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

Content.propTypes = {
  redirectTo: PropTypes.string,
  sid: PropTypes.string,
  token: PropTypes.string,
};

Content.defaultProps = {
  redirectTo: null,
  sid: null,
  token: null,
};

const RegisterForm = ({ showUserForm }) => {
  const agreementText = (
    <small className="ps-2">
      I agree to{' '}
      <a href="/terms-of-use" className="text-secondary" target="_blank">
        Ballers Terms of Use
      </a>{' '}
      and acknowledge the{' '}
      <a href="/privacy-policy" className="text-secondary" target="_blank">
        Privacy Policy
      </a>
      .
    </small>
  );

  const [toast, setToast] = useToast();

  const referrer = (getReferralInfo() && getReferralInfo().referrer) || null;
  const currentUser = showUserForm ? 'User' : 'Seller';

  return (
    <Formik
      initialValues={setInitialValues(registerSchema(showUserForm), {
        agreement: [],
      })}
      onSubmit={(values, actions) => {
        delete values.agreement;

        let payload;

        payload = referrer?.referralCode
          ? { ...values, referralCode: referrer.referralCode }
          : values;

        if (!showUserForm) {
          payload = {
            ...payload,
            firstName: payload.companyName,
            lastName: 'Company',
            vendor: { companyName: payload.companyName },
          };

          delete payload.companyName;
        }

        Axios.post(`${BASE_API_URL}/user/register`, payload)
          .then(function (response) {
            const { status } = response;
            if (status === 201) {
              setToast({
                type: 'success',
                message: `Your registration is successful. Kindly activate your account via the confirmation link sent to your inbox (${values.email}).`,
              });
              actions.resetForm();
            }
            actions.setSubmitting(false);
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(registerSchema(showUserForm))}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <h4 className="mt-4 mb-4 fw-semibold text-dark">
            {showUserForm ? 'Register as a User' : 'Become a BALL VIP'}
          </h4>
          <Toast {...toast} />
          {showUserForm ? (
            <div className="form-row">
              <Input
                formGroupClassName="col-md-6"
                isValidMessage="First Name looks good"
                label="First Name"
                name="firstName"
                placeholder="First Name"
              />
              <Input
                formGroupClassName="col-md-6"
                isValidMessage="Last Name looks good"
                label="Last Name"
                name="lastName"
                placeholder="Last Name"
              />
            </div>
          ) : (
            <Input
              isValidMessage="Company Name looks good"
              label="Company Name"
              name="companyName"
              placeholder="Company Name"
            />
          )}

          <div className="form-row">
            <Input
              formGroupClassName="col-md-6"
              isValidMessage="Email address seems valid"
              label={showUserForm ? 'Email' : 'Company Email'}
              name="email"
              placeholder="Email Address"
            />
            <PhoneNumber
              formGroupClassName="col-md-6"
              isValidMessage="Phone number looks good"
              label={showUserForm ? 'Phone' : 'Company Phone'}
              name="phone"
              placeholder="Phone"
            />
          </div>
          <div className="form-row">
            <Input
              formGroupClassName="col-md-6"
              isValidMessage="Password seems good"
              label="Password"
              name="password"
              placeholder="Password"
              type="password"
            />
            <Input
              formGroupClassName="col-md-6"
              isValidMessage="Awesome. Password matches"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
            />
          </div>
          <div className="form-row ms-0">
            <CheckboxGroup
              custom
              inline
              name="agreement"
              options={[{ label: agreementText, value: true }]}
            />
            <label className="form-check-label" htmlFor="agreement"></label>
          </div>
          {referrer?.referralCode && (
            <div className="text-primary mt-5 mb-3 text-small text-muted text-center">
              Referred By {referrer?.firstName} (Referral Code:{' '}
              {referrer?.referralCode})
            </div>
          )}
          <Button
            className="btn-secondary btn-wide mt-5"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Register as a {currentUser}
          </Button>

          <DisplayFormikState {...props} hide showAll />

          <section className="auth__footer">
            Already registered on BALL?{' '}
            <Link href="/login">
              <a className="auth__link">Sign In</a>
            </Link>
          </section>
        </Form>
      )}
    </Formik>
  );
};
export default Register;
