import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import Axios from 'axios';
import Input from 'components/forms/Input';
import { feedback } from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { loginSchema } from 'components/forms/schemas/userSchema';
import TitleSection, {
  EmptyTitleSection,
} from 'components/common/TitleSection';
import Toast, { useToast } from 'components/utils/Toast';
import { BASE_API_URL, DASHBOARD_PAGE } from 'utils/constants';
import {
  storeToken,
  storeUserRole,
  getUserFirstName,
  clearStorage,
} from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import store from 'store2';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';

const Login = () => {
  const { query } = useRouter();
  const { token, url } = query;

  return (
    <>
      <Header />
      <TitleSection name="Login Page" content="Log into your account" />
      <EmptyTitleSection>
        <Content token={token} redirectTo={url} />
      </EmptyTitleSection>
      <Footer />
    </>
  );
};

const Content = ({ redirectTo, token }) => {
  return (
    <section>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 auth__text">
            <h1>
              Welcome Back, <br />
              {getUserFirstName()}
            </h1>
            <p className="lead">
              Sign in to access your profile, rewards and contributions.
            </p>
          </div>
          <div className="offset-lg-2 col-lg-5">
            <div className="card p-5 my-6">
              <LoginForm redirectTo={redirectTo} token={token} />
              <section className="auth__footer">
                <div className="register mt-6 text-center">
                  Not Registered?{' '}
                  <Link href="/register">
                    <a className='className="auth__link"'> Create Account</a>
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
  token: PropTypes.string,
};

Content.defaultProps = {
  redirectTo: null,
  token: null,
};

const LoginForm = ({ redirectTo, token }) => {
  const router = useRouter();
  const [toast, setToast] = useToast();
  const { userState, loginUser } = React.useContext(UserContext);
  console.log('userState: ', userState);

  // CHECK TOKEN ACTIVATION
  React.useEffect(() => {
    token &&
      Axios.get(`${BASE_API_URL}/user/activate`, { params: { token } })
        .then(function (response) {
          const { status, data } = response;
          if (status === 200) {
            // clear storage
            store(false);
            setToast({
              type: 'success',
              message: data.message,
            });
          }
        })
        .catch(function (error) {
          setToast({
            message: 'Your account could not be activated. Please try again.',
          });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // CHECK IF USER HAS SIGNED IN
  React.useEffect(() => {
    if (userState && userState?.isLoggedIn) {
      const dashboardUrl = `/${DASHBOARD_PAGE[userState.role]}/dashboard`;
      router.push(dashboardUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={(values, actions) => {
        Axios.post(`${BASE_API_URL}/user/login`, values)
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              clearStorage();
              storeToken(data.user.token);
              storeUserRole(data.user.role);
              loginUser(data.user, data.user.token);
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(loginSchema)}
    >
      {({ isSubmitting, handleSubmit }) => {
        const submitFormWithEnterKey = (event) => {
          if (event.keyCode === 13) {
            handleSubmit();
          }
        };
        return (
          <Form>
            <Toast {...toast} />
            <Input
              label="Email"
              name="email"
              onKeyDown={(e) => submitFormWithEnterKey(e)}
              placeholder="Email Address"
              showFeedback={feedback.NONE}
              tabIndex={1}
            />
            <Input
              label="Password"
              labelClassName="d-block"
              labelLink={{
                to: '/forgot-password',
                text: 'Forgot Password',
              }}
              name="password"
              onKeyDown={(evt) => submitFormWithEnterKey(evt)}
              placeholder="Password"
              showFeedback={feedback.NONE}
              tabIndex={2}
              type="password"
            />
            <Button loading={isSubmitting} onClick={handleSubmit}>
              Sign in
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

LoginForm.propTypes = {
  redirectTo: PropTypes.string,
  token: PropTypes.string,
};

LoginForm.defaultProps = {
  redirectTo: null,
  token: null,
};

export default Login;
