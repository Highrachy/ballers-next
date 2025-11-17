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
  getTokenFromStore,
  getUserRoleFromStore,
} from 'utils/localStorage';
import { getDemoLoginLink, getError, statusIsSuccessful } from 'utils/helpers';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import GoogleLoginButton from '@/components/common/GoogleLoginButton';
import SeoHead from '@/components/utils/SeoHead';

const Login = () => {
  const { query } = useRouter();
  const { token, url } = query;

  return (
    <>
      <SeoHead
        title="Login | BALL - Access Your Account"
        description="Log into your BALL account to manage your profile, contributions and property plans. Secure sign in to access your dashboard and homeownership tools."
        canonical="https://www.ballers.ng/login"
        keywords={[
          'BALL login',
          'ballers sign in',
          'login to ballers',
          'ball dashboard login',
        ]}
      />

      <Header />
      <TitleSection name="Login Page" content="Log into your account" />
      <section className="visually-hidden">
        <p>
          Logging into your BALL account gives you secure access to your
          personal dashboard, saved properties, contributions, rewards, and
          homeownership progress. Your BALL profile is designed to help you
          manage every step of your real estate journey with ease. Whether you
          are exploring verified listings, reviewing payment plans, tracking
          contributions or connecting with trusted developers, your dashboard
          keeps everything organized in one place.
        </p>

        <p>
          When you sign in, you immediately unlock tools that help you make
          informed real estate decisions. You can view properties you previously
          saved, resume your applications, check eligibility for payment plans,
          and explore new opportunities available exclusively to BALL users. Our
          secure login process ensures that your information, preferences and
          personal data remain protected at all times.
        </p>

        <p>
          BALL also makes it easy for returning users to pick up exactly where
          they left off. Whether you logged out from your laptop, mobile phone
          or tablet, your account keeps everything synced so you can continue
          your homeownership journey without disruption. You can log in using
          your email and password, or choose to sign in quickly through Google
          for a seamless experience.
        </p>

        <p>
          For new users who have not created an account yet, BALL provides a
          fast, simple and free registration process. Creating an account
          unlocks access to verified developers, secure payment options, trusted
          listings and powerful financial tools that help Nigerians avoid scams
          and buy property with confidence. Your account also helps you track
          your progress and receive personalized recommendations based on your
          homeownership goals.
        </p>

        <p>
          If you ever experience issues logging in or accessing your BALL
          account, our system provides clear guidance for resetting your
          password or recovering access. We are committed to ensuring that every
          user enjoys a smooth, secure and supportive experience while using
          BALL to explore, plan and take real steps toward owning their ideal
          home.
        </p>
      </section>

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
            <h2 className="h1">
              Welcome Back, <br />
              {getUserFirstName()}
            </h2>
            <p className="lead">
              Sign in to access your profile, rewards and contributions.
            </p>
          </div>

          <div className="offset-lg-2 col-lg-5">
            <div className="card p-5 my-6">
              <LoginForm redirectTo={redirectTo} token={token} />
              <section className="auth__footer">
                <GoogleLoginButton />
                <div className="register mb-5 text-center">
                  Not registered?{' '}
                  <Link href="/create-a-new-ball-account">
                    <a className="auth__link">Create account</a>
                  </Link>
                </div>
                <div className="text-center">
                  <Button
                    color="secondary-light"
                    className="btn-wide"
                    href={getDemoLoginLink()}
                  >
                    Login to your demo account
                  </Button>
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

  const loginToken = getTokenFromStore();
  const userRole = getUserRoleFromStore();

  // CHECK TOKEN ACTIVATION
  React.useEffect(() => {
    if (!token) return;
    Axios.get(`${BASE_API_URL}/user/activate`, { params: { token } })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: data.message,
          });
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      })
      .catch(function () {
        setToast({
          message: 'Your account could not be activated. Please try again.',
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // CHECK IF USER HAS SIGNED IN
  React.useEffect(() => {
    if ((userState && userState?.isLoggedIn) || (loginToken && userRole)) {
      const dashboardUrl = `/${
        DASHBOARD_PAGE[userRole || userState?.role]
      }/dashboard`;
      router.push(dashboardUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState, loginToken]);

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
              placeholder="Email address"
              showFeedback={feedback.NONE}
              tabIndex={1}
            />
            <Input
              label="Password"
              labelClassName="d-block"
              labelLink={{
                to: '/forgot-password',
                text: 'Forgot password',
              }}
              name="password"
              onKeyDown={(evt) => submitFormWithEnterKey(evt)}
              placeholder="Password"
              showFeedback={feedback.NONE}
              tabIndex={2}
              type="password"
            />
            <Button wide loading={isSubmitting} onClick={handleSubmit}>
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
