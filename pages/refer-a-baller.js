import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Image from 'next/image';
import Link from 'next/link';
import { FaGifts, FaShare, FaUserPlus } from 'react-icons/fa6';
import Button from '@/components/forms/Button';
import FAQsAccordion from '@/components/common/FAQsAccordion';
import FAQsContent from '@/data/faqs';
import BallerTerm from '@/components/common/BallerTerm';
import SeoHead from '@/components/utils/SeoHead';

const ReferAndEarn = () => (
  <>
    <SeoHead
      title="Refer a BALLer | Earn Over ₦1 Million in Cash and Gifts"
      description="Refer a buyer to BALL and earn over ₦1 million in cash and gifts. Share your referral link, help them own a home and get rewarded when they close."
      canonical="https://ballers.ng/refer-a-baller"
      ogImage="https://www.ballers.ng/img/pages/referral/refer-and-earn.svg"
      keywords={[
        'refer and earn nigeria',
        'ball referral program',
        'earn money referring buyers',
        'real estate referral nigeria',
        'become a baller',
      ]}
    />

    {/* SEO helper text */}
    <p className="visually-hidden">
      Refer buyers to BALL and earn rewards when they purchase a home through
      the platform. Get paid in cash and gifts for successful referrals.
    </p>

    <Header />

    <TitleSection
      name="Refer a BALLer & Earn Big"
      content="Help someone in your circle buy a quality home and get rewarded when they close."
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

export default ReferAndEarn;

/* ---------- FAQs SECTION ---------- */
const FAQsSection = () => {
  const FAQs = FAQsContent['referral'].faqs;

  return (
    <section className="container-fluid">
      <h6 className="header-secondary">FAQs</h6>
      <h2>Your Questions Answered</h2>
      <div className="row">
        <div className="col-lg-9 col-sm-10 col-12 offset-lg-3 offset-sm-2 mt-5 faqs-section">
          <FAQsAccordion faqs={FAQs} />
        </div>
      </div>
    </section>
  );
};

/* ---------- HERO SECTION ---------- */
const HeroSection = () => {
  return (
    <section className="py-3 py-xl-7">
      <div className="container-fluid">
        <div className="row">
          <section className="col-xl-5 pt-0 pt-lg-4 text-center text-xl-start">
            <p className="text-uppercase fw-bold mb-2 header-secondary">
              Turn Your Network into Income
            </p>

            <h2 className="display-5 fw-bold mb-3">
              Refer a <BallerTerm /> and become a{' '}
              <span className="text-secondary">Millionaire</span> in cash and
              gifts.
            </h2>

            <p className="h4 fw-light lh-normal my-4 pe-xl-8 px-md-6 px-lg-8 px-xl-0 text-primary">
              Have a <BallerTerm /> in your circle? Help them own a premium home
              and earn over ₦1 million in cash and gifts when they close.
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
              width={1475}
              height={1024}
              alt="Referral program illustration"
              loading="lazy"
            />
          </section>
        </div>
      </div>
    </section>
  );
};

/* ---------- HOW IT WORKS ---------- */
const Steps = () => (
  <section className="bg-light-blue py-6">
    <div className="text-center">
      <h6 className="header-secondary">How It Works</h6>
      <h3>
        Referring a <BallerTerm /> is Easy
      </h3>
    </div>

    <div className="container">
      <div className="row text-center gy-4 py-6">
        <Step
          icon={<FaUserPlus size={48} className="text-primary" />}
          title="1. Sign Up and Get Your Code"
          text="Create or log into your BALL account and get your unique referral link."
        />
        <Step
          icon={<FaShare size={48} className="text-primary" />}
          title="2. Share with Interested Buyers"
          text="Send your link to friends, family or colleagues who want to own a quality home."
        />
        <Step
          icon={<FaGifts size={48} className="text-primary" />}
          title="3. Earn Big When They Close"
          text="They purchase their premium home, and you will earn up to ₦1 million in cash and gifts."
        />
      </div>
    </div>
  </section>
);

const Step = ({ icon, title, text }) => (
  <div className="col-md-4">
    <div className="card h-100 py-6 px-5">
      <div className="mb-3">{icon}</div>
      <h6 className="fw-bold">{title}</h6>
      <p className="mx-auto">{text}</p>
    </div>
  </div>
);

/* ---------- PAYOUT PROCESS ---------- */
const PayoutProcess = () => (
  <section className="bg-light pt-8">
    <div className="container">
      <div className="row align-items-center gy-4">
        <div className="col-md-7">
          <h3 className="fw-bold mb-3">Payout Process</h3>
          <ul className="text-lg lh-2">
            <li>Earn over ₦1,000,000 for every buyer you refer</li>
            <li>Your reward is processed quickly</li>
            <li>Secure bank transfer with no delay</li>
          </ul>
          <p className="text-muted">
            Rewards are processed within three business days once the
            buyer&#39;s payment is confirmed and verified.
          </p>
        </div>

        <div className="col-md-5 text-center">
          <Image
            src="/img/pages/referral/payout.png"
            width={1024}
            height={1024}
            alt="Payout illustration"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

/* ---------- THE BALL PLATFORM ---------- */
const TheBALLPlatform = () => (
  <section className="container-fluid py-6 py-lg-7 mt-n5">
    <div className="row">
      <div className="col-lg-4">
        <h6 className="header-secondary d-none d-lg-block">
          The BALL Platform
        </h6>
        <h3 className="mt-4 my-md-0">
          BALL is the Smarter, Faster Way to Become a Landlord
        </h3>

        <p className="lead text-primary mt-4 mb-5">
          BALL makes homeownership possible with flexible payment plans, trusted
          communities and full support. Start owning your dream home without
          stress.
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
          width={1680}
          height={1000}
          alt="BALL platform preview"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);
