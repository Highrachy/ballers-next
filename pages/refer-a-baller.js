import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Image from 'next/image';
import Link from 'next/link';
import { FaGift, FaExclamationTriangle } from 'react-icons/fa';
import { FaGifts, FaShare, FaUserPlus } from 'react-icons/fa6';
import Button from '@/components/forms/Button';
import FAQsAccordion from '@/components/common/FAQsAccordion';
import FAQsContent from '@/data/faqs';

const ReferAndEarn = () => (
  <>
    <Header />
    <TitleSection
      name="Refer & Earn Big: BALLERS Only"
      content="Got a baller in your circle? Help them buy premium, get paid premium."
    />
    <HeroSection />
    <Steps />
    <PayoutProcess />
    <TheBALLPlatform />
    <FAQsSection />
    <CommunityGallery />
    <Footer />
  </>
);

const FAQsSection = () => {
  const FAQs = FAQsContent['referral'].faqs;
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

const HeroSection = () => {
  return (
    <section className="py-3 py-xl-7">
      <div className="container-fluid">
        <div className="row">
          <section className="col-xl-5 pt-0 pt-lg-4 text-center text-xl-start">
            <p className="text-uppercase  fw-bold mb-2 header-secondary">
              Turn Your Network into Income
            </p>
            <h1 className="display-3 fw-bold mb-3">
              Refer a BALLer from your circle and earn ₦1 million in cash &amp;
              gifts.
            </h1>

            <p className="h4 fw-light lh-normal my-4 pe-xl-8 px-md-6 px-lg-8 px-xl-0 text-primary">
              Have a baller in your circle? Help them own a quality home and get
              paid premium when they close. That&apos;s what we call a win-win.
            </p>
            <div className="mb-5">
              <Button href="/register">
                Create <span className="d-none d-sm-inline">a Free</span>{' '}
                Account
              </Button>
              <Button color="primary-light" className="mx-3" href="/login">
                Sign into your Account
              </Button>
            </div>
          </section>
          <section className="col-xl-7 text-center text-xl-start">
            <Image
              src="/img/pages/referral/refer-and-earn.svg"
              width="1475"
              height="1024"
              alt="phone"
            />
          </section>
        </div>
      </div>
    </section>
  );
};

export default ReferAndEarn;

/* ---------- 3-STEP  HOW-IT-WORKS  ---------- */
const Steps = () => (
  <section className="bg-light-blue py-6">
    <div className="text-center">
      <h6 className="header-secondary">HOW IT WORKS</h6>
      <h3>Referring a BALLer is as easy as 1, 2, 3</h3>
    </div>
    <div className="container">
      <div className="row text-center gy-4 py-6">
        <Step
          icon={<FaUserPlus size={48} className="text-primary" />}
          title="1. Sign up & Get Code"
          text="Create (or log into) your BALL account in seconds and grab your unique referral link."
        />
        <Step
          icon={<FaShare size={48} className="text-primary" />}
          title="2. Share with Buyers"
          text="Send your link to friends, family, colleagues—anyone ready to own a premium home."
        />
        <Step
          icon={<FaGifts size={48} className="text-primary" />}
          title="3. Earn When They Close"
          text="They choose & purchase their premium home, and you will up to ₦1 million in cash and gifts."
        />
      </div>
    </div>
  </section>
);

const Step = ({ icon, title, text }) => (
  <div className="col-md-4 ">
    <div className="card h-100 py-6 px-5">
      <div className="mb-3">{icon}</div>
      <h6 className="fw-bold">{title}</h6>
      <p className="mx-auto">{text}</p>
    </div>
  </div>
);

/* ---------- PAYOUT CARD  ---------- */
const PayoutProcess = () => (
  <section className="bg-light pt-8">
    <div className="container">
      <div className="row align-items-center gy-4">
        {/* bullet list */}
        <div className="col-md-7">
          <h3 className="fw-bold mb-3"> Payout Process</h3>
          <ul className="text-lg lh-2">
            <li>₦1,000,000+ cash for every Baller you refer</li>
            <li>Your reward is processed promptly</li>
            <li>You get paid, no stress, no delay</li>
          </ul>
          <p className="text-muted">
            Rewards are processed within 3 business days of confirmed buyer
            payment and verification. Payment is made via secure bank transfer
          </p>
        </div>
        {/* illustration */}
        <div className="col-md-5 text-center">
          <Image
            src="/img/pages/referral/payout.png"
            width="1024"
            height="1024"
            alt="phone"
          />
        </div>
      </div>
    </div>
  </section>
);

const TheBALLPlatform = () => (
  <section className="container-fluid py-6 py-lg-7 mt-n5">
    <div className="row">
      <div className="col-lg-4">
        <h6 className="header-secondary d-none d-lg-block">
          THE BALL PLATFORM
        </h6>
        <h2 className="mt-4 my-md-0">
          BALL is the smarter, faster way to Become a LandLord.
        </h2>
        <p className="lead text-primary mt-4 mb-5">
          BALL makes homeownership possible for everyday Nigerians with no
          stress or pressure. With flexible payment plans, trusted communities,
          and full support every step of the way, you can finally stop dreaming
          and start owning your dream home today.
        </p>

        <div className="text-center text-xl-start mb-5">
          <Button href="/register">
            Create <span className="d-none d-sm-inline">a Free</span> Account
          </Button>
          <Button color="primary-light" className="mx-3" href="/login">
            Sign into your Account
          </Button>
        </div>
      </div>
      <div className="col-lg-7 offset-lg-1">
        <Image
          src="/img/pages/ball-refer.png"
          width="1680"
          height="1000"
          alt="ball platform"
        />
      </div>
    </div>
  </section>
);
