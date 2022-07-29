import React from 'react';
import { Router } from '@reach/router';
import Home from 'components/pages/frontend/Home';
import AboutUs from 'components/pages/frontend/AboutUs';
import AtoZ from 'components/pages/frontend/AtoZ';
import FAQs from 'components/pages/frontend/FAQs';
import ContactUs from 'components/pages/frontend/ContactUs';
import TermsOfUse from 'components/pages/frontend/TermsOfUse';
import PrivacyPolicy from 'components/pages/frontend/PrivacyPolicy';
import Articles from 'components/pages/frontend/Articles';
import Login from 'components/pages/auth/Login';
import Logout from 'components/pages/auth/Logout';
import Register from 'components/pages/auth/Register';
import ForgotPassword from 'components/pages/auth/ForgotPassword';
import ResetPassword from 'components/pages/auth/ResetPassword';
import SearchResult from 'components/pages/frontend/SearchResult';
import FormComponents from 'components/forms/FormComponents';
import Invoice from 'components/pages/frontend/Invoice';
import ReactQuery from 'components/pages/playground/ReactQuery';
import { isDevEnvironment } from 'utils/helpers';
import ImagesComponent from 'components/pages/playground/ImagesComponent';
import VendorProfile from 'components/pages/shared/VendorProfile';
import PublicSingleOffer from 'components/pages/frontend/PublicSingleOffer';

const FrontPageRouter = () => (
  <Router>
    <Home path="/" />
    <Home path="/ref/:referralCode" />
    <Home path="/invite/:inviteCode" />
    <AboutUs path="/about-us" />
    <AtoZ path="/a-z-of-ball" />
    <FAQs path="/faqs" />
    <ContactUs path="contact-us" />
    <TermsOfUse path="terms-of-use" />
    <PrivacyPolicy path="privacy-policy" />
    <Login path="login" />
    <Login path="login/:sid" />
    <Login path="activate" />
    <Logout path="logout" />
    <ForgotPassword path="forgot-password" />
    <ResetPassword path="reset-password/:token" />
    <Register path="register" />
    <SearchResult path="search" />
    <Articles path="articles" />
    <Invoice path="payment" />
    <PublicSingleOffer path="offer/:id" />
    <VendorProfile path="vendors/:slug" />
    {isDevEnvironment() && (
      <>
        <FormComponents path="forms" />
        <ReactQuery path="react-query" />
        <ImagesComponent path="images" />
      </>
    )}
  </Router>
);

export default FrontPageRouter;
