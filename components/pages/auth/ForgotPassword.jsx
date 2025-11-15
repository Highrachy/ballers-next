import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import Axios from 'axios';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { forgotPasswordSchema } from 'components/forms/schemas/userSchema';
import { BASE_API_URL } from '@/utils/constants';
import Toast, { useToast } from 'components/utils/Toast';

const ForgotPassword = () => (
  <>
    <Header />
    <Content />
    <Footer />
  </>
);

const Content = () => {
  return (
    <section>
      <div className="container-fluid bg-light-blue">
        <div className="row">
          <div className="col-lg-5 mx-auto">
            <div className="card p-5 my-6">
              <section>
                <h2 className="header h5 mb-5">Forgot Password</h2>
                <ForgotPasswordForm />
              </section>
              <section className="auth__footer">
                <div className="mt-6 text-center">
                  <Link href="/login">
                    <a className="auth__link">Back to Login Page</a>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ForgotPasswordForm = () => {
  const [toast, setToast] = useToast();
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      onSubmit={(values, actions) => {
        setToast({
          type: 'warning',
          message: `A password reset link has been sent to your mail. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address.`,
        });
        Axios.post(`${BASE_API_URL}/user/reset-password`, values)
          .then(function (response) {
            const { status } = response;
            if (status === 200) {
              setToast({
                type: 'warning',
                message: `A password reset link has been sent to your mail. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address.`,
              });
              actions.resetForm();
            }
          })
          .catch(function (error) {
            setToast({
              message: error.response.data.message,
            });
          });
        actions.setSubmitting(false);
      }}
      validationSchema={createSchema(forgotPasswordSchema)}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form>
          <Toast {...toast} />
          <Input label="Email" name="email" placeholder="Email Address" />
          <Button loading={isSubmitting} onClick={handleSubmit}>
            Reset Password
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPassword;
