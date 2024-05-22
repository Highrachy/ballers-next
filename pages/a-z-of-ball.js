import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import BenefitsSection from 'components/common/BenefitsSection';
import Image from 'next/image';
import Link from 'next/link';

const AtoZ = () => (
  <>
    <Header />
    <TitleSection
      name="A-Z of BALL"
      content="In the world of BALL, great minds meet. BALLers are driven individuals who know their desires and relentlessly pursue the life they deserve. Being a BALLer means joining a community of exclusive homeowners, all striving for a secure future for themselves and their loved ones."
    />
    <BallExplained />
    <BallingIsEasy />
    <HowBallersWork />
    <BenefitsSection />
    <BallersCreed />
    <CommunityGallery />
    <Footer />
  </>
);

const BallExplained = () => (
  <div className="container-fluid mb-7">
    <section className="row mt-5">
      <div className="col-lg-5 col-12">
        <h2>What is BALL?</h2>
      </div>
      <div className="col-lg-7 col-12">
        <h6 className="header-secondary pt-0">BALL EXPLAINED</h6>
        <p className="lead text-primary pt-4 mb-4">
          BALL is a platform that enables her members to seamlessly own quality
          homes in well planned communities with a sustainable plan tailored to
          their current realities. We will guide you through the entire process
          which is customized specially for you.
        </p>
        <p className="lead text-primary">
          Balling is an experience, a choice for a quality lifestyle and a
          legacy from which generations to come will benefit.
        </p>
      </div>
    </section>
  </div>
);
const BallingIsEasy = () => (
  <section className="container-fluid bg-light-blue py-7">
    <h2 className="text-center mb-6 text-secondary">
      BALLing is as <br className="d-block d-sm-none" /> easy as ABC
    </h2>
    <div className="row row-eq-height justify-content-center">
      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <Image
          className="az-easy-abc-letter"
          src="/img/icons/a.png"
          alt="A"
          width="111"
          height="120"
        />
        <h5 className="py-3">
          Access the <br /> Pool of Properties
        </h5>
        <p className="text-primary">
          Explore a wide range of quality homes and find the perfect match for
          your needs.
        </p>
      </aside>
      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <Image
          className="az-easy-abc-letter"
          src="/img/icons/b.png"
          alt="B"
          width="111"
          height="120"
        />
        <h5 className="py-3">
          Begin Your <br /> Payment Plan
        </h5>
        <p className="text-primary">
          Start your personalized payment journey today, making your path to
          homeownership smooth and stress-free.
        </p>
      </aside>
      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <Image
          className="az-easy-abc-letter"
          src="/img/icons/c.png"
          alt="C"
          width="111"
          height="120"
        />
        <h5 className="py-3">
          Convert to home <br /> ownership
        </h5>
        <p className="text-primary">
          Secure your dream home, collect your keys, and officially become a
          homeowner.
        </p>
      </aside>
    </div>
  </section>
);

const HowBallersWork = () => (
  <section className="az-how">
    <h6 className="header-secondary">HOW IT WORKS</h6>
    <h4>In three easy steps</h4>

    <h6 className="mt-7 text-secondary">STEP A</h6>
    <h3 className="az-how-heading">
      ACCESS THE <br /> POOL OF PROPERTIES
    </h3>
    <section className="mt-sm-5 py-4">
      <div className="row">
        <div className="az-how-step col-lg-5 col-sm-5 col-12">
          <Image
            className="az-how-step-img"
            src="/img/pages/a-to-z/preference.png"
            alt="Search for properties"
            width="700"
            height="400"
          />
        </div>
        <div className="az-how-step-line col-lg-2 col-sm-2 col-12" />
        <div className="az-how-step col-lg-5 col-sm-5 col-12">
          <Link href="/properties/search" passHref>
            <h5 className="az-how-step-title">Search for properties</h5>
          </Link>
          <p className="az-how-step-text mt-3 pe-5">
            Explore the available options below to start the process of finding
            your ideal home. Choose from a wide variety of locations and
            property types to match your preferences and budget.{' '}
            <Link href="/properties/search" passHref>
              <a className="text-link">Click here to</a>
            </Link>{' '}
            browse our property listings and get started on your journey to home
            ownership.
          </p>
        </div>
      </div>
      <section className="row az-tree">
        <div className="col-sm-12">
          <div className="text-center">
            <span className="circle-dot" />
          </div>
          <section className="az-tree__middle-border">
            <aside className="az-tree__branch">
              <div className="az-tree__node">
                <div className="az-how-step az-tree__branch--left">
                  <Image
                    className="az-how-step-icon"
                    src="/img/icons/location-house.png"
                    alt="Preferred location"
                    width="150"
                    height="150"
                  />
                  <h6 className="az-how-step-title-2">
                    Select preferred <br /> location
                  </h6>
                  <p className="az-how-step-text-2">
                    Input your location of choice.
                  </p>
                </div>
                <div className="az-how-step az-tree__branch--right">
                  <Image
                    className="az-how-step-icon"
                    src="/img/icons/house-type.png"
                    alt="Property Type"
                    width="150"
                    height="150"
                  />
                  <h6 className="az-how-step-title-2">
                    Select preferred <br /> property type
                  </h6>
                  <p className="az-how-step-text-2">
                    Select property of interest.
                  </p>
                </div>
              </div>
              <div className="clearfix" />
            </aside>
            <aside className="row az-tree__node mt-sm-5 pt-5 pb-md-5 mb-md-5">
              <div className="col-md-5 col-lg-4 offset-md-0 offset-lg-1">
                <Image
                  className="az-how-step-img"
                  src="/img/pages/a-to-z/subscription.png"
                  alt="Confirm the Payment Plan"
                  width="700"
                  height="400"
                />
              </div>
              <div className="col-md-2 d-none d-sm-block">
                <div className="text-center pt-5 my-5">
                  <span className="circle-dot"> </span>
                </div>
              </div>
              <div className="col-md-5 ms-lg-none ms-md-n4 mb-md-5 mb-lg-0">
                <h5 className="az-how-step-title pt-5 pt-sm-none pb-2">
                  Confirm the Payment Plan
                </h5>
                <p className="az-how-step-text pe-5">
                  One of the best things about BALL is our goal to offer various
                  payment plans to own a home. Select the options that best fit
                  for your BALLing experience.
                </p>
              </div>
            </aside>
            <aside className="az-tree__branch az-tree__branch--half">
              <div className="az-tree__node">
                <div className="az-how-step az-tree__branch--left">
                  <Image
                    className="az-how-step-icon"
                    src="/img/icons/payment-amount.png"
                    alt="Payment amount"
                    width="150"
                    height="150"
                  />
                  <h6 className="az-how-step-title-2">
                    Input amount available <br /> to begin with
                  </h6>
                </div>
                <div className="az-how-step az-tree__branch--center az-tree__branch--center-to-right-md">
                  <Image
                    className="az-how-step-icon"
                    src="/img/icons/interval.png"
                    alt="Interval"
                    width="150"
                    height="150"
                  />
                  <h6 className="az-how-step-title-2">
                    Select preferred <br />
                    payment plan
                  </h6>
                </div>
                {/* This section is repeated. This is shown for tablet and mobile */}
                <div className="az-how-step az-tree__branch--right d-md-none d-lg-block">
                  <Image
                    className="az-how-step-icon"
                    src="/img/icons/duration.png"
                    alt="Duration"
                    width="150"
                    height="150"
                  />
                  <h6 className="az-how-step-title-2">
                    Calculate the total <br /> duration
                  </h6>
                </div>
                <div className="clearfix" />
              </div>
            </aside>
            {/* This section is repeated to be shown on tablet. */}
            <div className="az-how-step az-tree__branch--center az-tree__branch--right-to-center-md d-lg-none d-md-block d-none">
              <Image
                className="az-how-step-icon"
                src="/img/icons/duration.png"
                alt="Duration"
                width="150"
                height="150"
              />
              <h6 className="az-how-step-title-2">
                Calculate the total <br /> duration
              </h6>
            </div>
            <div className="clearfix" />
          </section>
        </div>
      </section>
    </section>

    <h6 className=" header-secondary mt-5">STEP B</h6>
    <h3 className="az-how-heading">BEGIN YOUR PAYMENT PLAN</h3>
    <div className="row">
      <div className="az-how-step col-md-5 col-sm-5 offset-sm-1 offset-md-0 offset-lg-1 col-lg-4 col-12">
        <Image
          className="az-how-step-img smaller-md"
          src="/img/pages/a-to-z/start-contribution.png"
          alt="Start contribution"
          width="700"
          height="400"
        />
      </div>
      <div className="az-how-step-line col-sm-2 col-md-2 d-none d-sm-block">
        <div className="text-center pt-5 my-5">
          <span className="circle-dot"> </span>
        </div>
      </div>
      <div className="az-how-step col-md-5 col-sm-5 col-12 mt-md-n4 mt-lg-0">
        <h5 className="az-how-step-title">Start Your Payment Plan</h5>
        <p className="az-how-step-text pe-5">
          We can&apos;t wait for you to get started! With your customized plan,
          clear figures, and convenient payment schedule, you&apos;re all set to
          embark on your exciting journey to homeownership. Dive in and make
          your first investment—your dream home is just a step away!
        </p>
      </div>
    </div>

    <section className="az-section__spacing">
      <h6 className="header-secondary">STEP C</h6>
      <h3 className="az-how-heading">CONVERT TO HOME OWNERSHIP</h3>
      <div className="row">
        <div className="az-how-step col-md-5 col-sm-4 offset-md-0 offset-lg-1 col-lg-4 col-12">
          <Image
            className="az-how-step-img smaller-md"
            src="/img/pages/a-to-z/convert-subscription.png"
            alt="Convert subscription"
            width="700"
            height="400"
          />
        </div>
        <div className="az-how-step-line col-lg-2 col-sm-2 col-12" />
        <div className="az-how-step col-lg-5 col-md-5 col-sm-5 col-12">
          <h5 className="az-how-step-title">
            Collect Your Keys and Convert Title
          </h5>
          <p className="az-how-step-text me-5">
            Once your payments have reached the minimum required amount, we
            guide you through the process of converting the title and officially
            becoming a homeowner. Collect your keys and step into your new home.
          </p>
        </div>
      </div>
      <aside className="row az-tree">
        <div className="col-sm-12">
          <div className="text-center">
            <span className="circle-dot" />
          </div>
          <section className="az-tree__middle-border">
            <div className="mt-n4 pt-5 pb-5 az-tree__content">
              <Image
                className="az-how-step-img"
                alt="Move in"
                src="/img/pages/a-to-z/move-in.png"
                width="972"
                height="553"
              />
              <h5 className="az-how-step-title-3">Move into your new home</h5>
              <p className="az-how-step-text-2 col-md-6 offset-md-3">
                Congratulations! You did it. Now your future begins. Of course,
                you are welcome to go right back to the top and begin the
                process of buying your next property.
              </p>
              <div className="col-sm-12 pt-md-3">
                <Link href="/register" passHref>
                  <a className="btn btn-secondary">APPLY NOW</a>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </section>
  </section>
);

const BallersCreed = () => (
  <section className="az-creed">
    <Image
      className="az-creed-q-up"
      src="/img/icons/quote-up.png"
      alt="quotation mark"
      width="100"
      height="100"
    />
    <h6 className="header-secondary pb-6">BALLERS CREED</h6>
    <h4 className="pb-5">
      As a BALLer, we share a duty to BALL <br /> and live a healthy lifestyle
      for it’s not <br /> just a home but also a lifestyle.
    </h4>
    <Image
      className="az-creed-q-down"
      src="/img/icons/quote-down.png"
      alt="quotation mark"
      width="100"
      height="100"
    />
  </section>
);
export default AtoZ;
