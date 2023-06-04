import { EmptyTitleSection } from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
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
import { resetPasswordSchema } from 'components/forms/schemas/userSchema';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { feedback } from 'components/forms/form-helper';
import { getError } from 'utils/helpers';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  if (!token) return null;
  return (
    <>
      <Header />
      <EmptyTitleSection>
        <Content token={token} />
      </EmptyTitleSection>
      <Footer />
    </>
  );
};

const Content = ({ token }) => {
  return (
    <section>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 auth__text">
            <h1>Change your password</h1>
            <p className="lead">Token: {token}</p>
          </div>
          <div className="offset-lg-2 col-lg-5">
            <div className="card p-5 my-6">
              <ResetPasswordForm token={token} />
              <section className="auth__footer">
                <div className="register mt-6 text-center">
                  Remember Password?{' '}
                  <Link href="/login">
                    <a className='className="auth__link"'> Login</a>
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

export default ResetPassword;

const ResetPasswordForm = ({ token }) => {
  const [toast, setToast] = useToast();
  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          initialValues={setInitialValues(resetPasswordSchema)}
          onSubmit={(values, actions) => {
            Axios.post(`${BASE_API_URL}/user/change-password/${token}`, values)
              .then(function (response) {
                const { status } = response;
                if (status === 200) {
                  setToast({
                    type: 'success',
                    message: `Your password has been successfully updated`,
                  });
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
          validationSchema={createSchema(resetPasswordSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <Toast {...toast} />
              <Input
                isValidMessage="Password seems good"
                label="New Password"
                name="password"
                placeholder="New Password"
                showFeedback={feedback.ERROR}
                type="password"
              />
              <Input
                isValidMessage="Password matches"
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm Password"
                showFeedback={feedback.ERROR}
                type="password"
              />
              <Button
                className="btn-danger btn-wide btn-transparent mt-3"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Reset Password
              </Button>
              <DisplayFormikState {...props} hide showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};
