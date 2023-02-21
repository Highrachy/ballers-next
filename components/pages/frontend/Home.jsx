import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import { ReactComponent as PolkaDot } from 'assets/img/backgrounds/polka-dot.svg';
import HomeImage from 'assets/img/home.png';
import HomeTabImage from 'assets/img/home-tab.png';
import PhoneImage from 'assets/img/phone.png';
import Footer from 'components/layout/Footer';
import BenefitsSection from 'components/common/BenefitsSection';
import FAQsAccordion from 'components/common/FAQsAccordion';
import CommunityGallery from 'components/common/CommunityGallery';
import FAQsContent from 'content/faqs';
import SearchPropertyForm from 'components/common/SearchPropertyForm';
import { Flash, Slide } from 'react-awesome-reveal';
import useWindowSize from 'hooks/useWindowSize';
import { BASE_API_URL, MOBILE_WIDTH } from 'utils/constants';
import { Link } from '@reach/router';
import Modal from 'components/common/Modal';
import Axios from 'axios';
import { HouseIcon } from 'components/utils/Icons';
import { storeReferralInfo } from 'utils/localStorage';

const Home = ({ referralCode, inviteCode }) => {
  const [showReferralModal, setShowReferralModal] = React.useState(false);
  const [referral, setReferral] = React.useState(null);

  React.useEffect(() => {
    referralCode &&
      Axios.get(`${BASE_API_URL}/referral/ref/${referralCode}`)
        .then((response) => {
          const { status, data } = response;
          if (status === 200) {
            setReferral({ referrer: data.user });
            setShowReferralModal(true);
            storeReferralInfo({ referrer: { ...data.user, referralCode } });
          }
        })
        .catch((error) => {
          setReferral({});
        });
  }, [referralCode]);

  React.useEffect(() => {
    inviteCode &&
      Axios.get(`${BASE_API_URL}/referral/${inviteCode}`)
        .then((response) => {
          const { status, data } = response;
          if (status === 200) {
            setReferral(data.referral);
            setShowReferralModal(true);
            storeReferralInfo({ ...data.referral });
          }
        })
        .catch((error) => {
          setReferral({});
        });
  }, [inviteCode]);

  return (
    <>
      <Header />
      <HoldingSection />
      <AboutSection />
      <BenefitsSection />
      <HowItWorksSection />
      <FAQsSection />
      <CommunityGallery />
      <ReferralModal
        referral={referral}
        showReferralModal={showReferralModal}
        setShowReferralModal={setShowReferralModal}
      />

      <Footer />
    </>
  );
};

Home.propTypes = {
  referralCode: PropTypes.string,
  inviteCode: PropTypes.string,
};

Home.defaultProps = {
  referralCode: null,
  inviteCode: null,
};

const HoldingSection = () => (
  <section>
    <div className="row me-0 ms-0">
      <section className="col-md-6 ps-lg-6 home-hero-container">
        <div className="home-hero">
          <h1>
            Become <br className="d-none d-lg-block" /> a <span>LandLord</span>
          </h1>
          <p className="mt-4 text-primary">
            We make owning a home simpler and achievable.
          </p>
        </div>

        <section className="property-search__home">
          <SearchPropertyForm />
        </section>
        <div className="dotted-polka">
          <PolkaDot width="100" height="150" className="d-none d-lg-block" />
        </div>
        <p className="text-black mt-2 mb-6 d-none d-lg-block">
          The only realistic burden free process of owning your ideal home.
        </p>
      </section>
      <section className="col-md-6 home-bg  mb-n4"></section>
    </div>
  </section>
);

const AboutSection = () => {
  const WINDOW_SIZE = useWindowSize();
  return (
    <section className="container-fluid bg-light-blue mb-n4">
      <div className="row my-4">
        <div className="col-sm-6 col-12 text-center mb-n4">
          <h6 className="header-secondary d-lg-none d-block">ABOUT BALL</h6>
          <img
            src={WINDOW_SIZE.width > MOBILE_WIDTH ? HomeImage : HomeTabImage}
            className="img-fluid home-image"
            alt="home"
          />
        </div>
        <div className="col-sm-6 col-12 pb-5">
          <h6 className="header-secondary d-none d-lg-block">ABOUT BALL</h6>
          <h2>
            Game-changing service <br /> that makes owning <br /> your home
            easier
          </h2>
          <p className="my-5 text-normal">
            We make owning a home simpler and achievable. <br /> With BALL
            unique saving plan tailored to you and your <br /> financial
            position,owning a home has never been easier.
          </p>
          <button className="btn btn-secondary">LEARN MORE</button>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => (
  <section className="container-fluid my-4">
    <div className="row">
      <div className="col-lg-4 mt-6">
        <Slide direction="left">
          <img src={PhoneImage} alt="phone" className="img-fluid" />
        </Slide>
      </div>
      <div className="col-lg-6 offset-lg-2">
        <Slide direction="right">
          <h6 className="header-secondary">HOW IT WORKS</h6>
          <h3>BALLing is as easy as ABC</h3>
        </Slide>

        <ul className="timeline mt-5">
          <Flash cascade damping={1} delay={3000}>
            <li className="timeline__border">
              <h5 className="text-secondary fw-normal">
                <span className="fw-bold text-secondary h3">A</span>
                pply now
              </h5>
              <p className="pe-8 pb-4">
                Take control of your destiny and create a worthy legacy by
                filling our short registration form.
              </p>
            </li>
            <li className="timeline__border">
              <h5 className="text-secondary fw-normal">
                <span className="fw-bold text-secondary h3">B</span>
                egin periodic contribution
              </h5>
              <p className="pe-8 pb-4">
                Cultivate the habit of contribution today and reap the rewards
                forever with BALLers.
              </p>
            </li>
            <li>
              <h5 className="text-secondary fw-normal">
                <span className="fw-bold text-secondary h3">C</span>
                onvert to home ownership
              </h5>
              <p className="pe-8 pb-4">
                Convert structure to extended mortgage plan at affordable rates
                from 6% per annum.
              </p>
            </li>
            <li className="timeline-no-border">
              <Link to="/register" className="btn btn-secondary">
                SIGN UP NOW
              </Link>
            </li>
          </Flash>
        </ul>
      </div>
    </div>
  </section>
);

const FAQsSection = () => {
  const FAQs = Object.values(FAQsContent).reduce((result, { faqs }, index) => {
    const homeFAQs = faqs.filter(({ showOnHomePage }) => showOnHomePage);
    return [...result, ...homeFAQs];
  }, []);
  return (
    <section className="container-fluid">
      <h6 className="header-secondary">FAQs</h6>
      <h2>
        Your questions <br /> Answered
      </h2>
      <div className="row">
        <div className="col-lg-9 col-sm-10 col-12 offset-lg-3 offset-sm-2 mt-5 faqs-section">
          <FAQsAccordion faqs={FAQs} />
        </div>
      </div>
    </section>
  );
};

const ReferralModal = ({
  referral,
  showReferralModal,
  setShowReferralModal,
}) => {
  return referral ? (
    <Modal
      title="Welcome to Ball"
      show={showReferralModal}
      onHide={() => setShowReferralModal(false)}
      showFooter={false}
    >
      <section className="row">
        <div className="col-md-12 my-3 text-center">
          <HouseIcon />
          <h3 className="my-4">
            Hello{referral.firstName ? ` ${referral.firstName}` : ''},
          </h3>
          <p className="lead">
            {referral.referrer.firstName} has invited you to{' '}
            <strong>become a Landlord.</strong>
          </p>

          <Link to="/register" className="btn btn-secondary my-4">
            Register for Free
          </Link>
        </div>
      </section>
    </Modal>
  ) : null;
};

export default Home;
