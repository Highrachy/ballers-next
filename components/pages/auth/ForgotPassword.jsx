import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { Link } from '@reach/router';
import { Formik, Form } from 'formik';
import Axios from 'axios';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { forgotPasswordSchema } from 'components/forms/schemas/userSchema';

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
                <h5 className="header mb-5">Forgot Password</h5>
                <ForgotPasswordForm />
              </section>
              <section className="auth__footer">
                <div className="mt-6 text-center">
                  <Link className="auth__link" to="/login">
                    Back to Login Page
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
  // const [message, setMessage] = React.useState(null);
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      onSubmit={(values, actions) => {
        // post to api
        Axios.post('/api/v1/users/forgot-password', values)
          .then(function (response) {
            const { status } = response;
            if (status === 200) {
              // setMessage({
              //   type: 'warning',
              //   message: `A password reset link has been sent to your mail. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address.`,
              // });
              actions.resetForm();
            }
          })
          .catch(function (error) {
            // setMessage({
            //   message: error.response.data.message,
            // });
          });
        actions.setSubmitting(false);
      }}
      render={({ isSubmitting, handleSubmit }) => (
        <Form>
          {/* <AlertMessage {...message} /> */}
          <Input label="Email" name="email" placeholder="Email Address" />
          <Button loading={isSubmitting} onClick={handleSubmit}>
            Reset Password
          </Button>
        </Form>
      )}
      validationSchema={createSchema(forgotPasswordSchema)}
    />
  );
};

export default ForgotPassword;
