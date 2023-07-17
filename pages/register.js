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

const Content = ({ redirectTo, sid, token }) => {
  const referralInfo = getReferralInfo();
  const [showUserForm, setShowUserForm] = React.useState(true);

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
                <h1>Create a free Vendor account</h1>
                <p className="lead">
                  Showcase your properties to multiple buyers
                </p>
              </>
            )}
          </div>
          <div className="col-lg-6 offset-lg-1">
            <div className="card p-5 my-6">
              <RegisterForm
                redirectTo={redirectTo}
                sid={sid}
                setShowUserForm={setShowUserForm}
                showUserForm={showUserForm}
                token={token}
              />
              <section className="auth__footer">
                <div className="register mt-6 text-center">
                  Registered?{' '}
                  <Link href="/login">
                    <a className="auth__link">Sign In</a>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
        <p />
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

const RegisterForm = ({ setShowUserForm, showUserForm }) => {
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
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Register
          </Button>

          <DisplayFormikState {...props} hide showAll />

          {showUserForm ? (
            <p className="pt-5 text-center">
              Have properties for sale? Register{' '}
              <span
                className="text-link text-secondary"
                onClick={() => setShowUserForm(false)}
              >
                as a Vendor
              </span>
            </p>
          ) : (
            <p className="pt-5 text-center">
              Want to become a Baller? Register{' '}
              <span
                className="text-link text-secondary"
                onClick={() => setShowUserForm(true)}
              >
                as a User
              </span>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};
export default Register;
