import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import BenefitsSection from 'components/common/BenefitsSection';
import A from 'assets/img/icons/a.png';
import B from 'assets/img/icons/b.png';
import C from 'assets/img/icons/c.png';
import PreferenceImage from 'assets/img/preference.png';
import LocationHouse from 'assets/img/icons/location-house.png';
import HouseType from 'assets/img/icons/house-type.png';
import ConvertSubscription from 'assets/img/convert-subscription.png';
import StartContribution from 'assets/img/start-contribution.png';
import Subscription from 'assets/img/subscription.png';
import PaymentAmount from 'assets/img/icons/payment-amount.png';
import Interval from 'assets/img/icons/interval.png';
import Duration from 'assets/img/icons/duration.png';
import MoveIn from 'assets/img/move-in.png';
import SeeAvailable from 'assets/img/see-available.png';
import Monitor from 'assets/img/monitor.png';
import ViewMap from 'assets/img/view-map.png';
import Conversation from 'assets/img/conversation.png';
import QuotationMarkUp from 'assets/img/icons/quote-up.png';
import QuotationMarkDown from 'assets/img/icons/quote-down.png';
import Link from 'next/link';

const AtoZ = () => (
  <>
    <Header />
    <TitleSection
      name="A-Z of BALL"
      content="Great minds BALL. BALLers know what they want and they are motivated to go after the life that they desire and deserve. To BALL is to be a part of a community of exclusive homeowners who are reaching for the future and establishing security for themselves and their loved ones."
    />
    <BallExplained />
    <BallingIsEasy />
    <HowBallersWork />
    <BenefitsSection />
    <FullControl />
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
        <h6 className="text-green">BALL EXPLAINED</h6>
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
    <h2 className="text-center mb-6">
      BALLing is as <br className="d-block d-sm-none" /> easy as ABC
    </h2>
    <div className="row row-eq-height justify-content-center">
      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <img className="az-easy-abc-letter" src={A} alt="A" />
        <h5 className="pb-3">
          <span>Apply Now</span>
        </h5>
        <p className="text-primary">
          Click here to access and complete the BALLers applicant information
          form. Please ensure that you fill in accurate and clear information to
          help us effectively customise your BALLing experience.
        </p>
      </aside>
      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <img className="az-easy-abc-letter" src={B} alt="B" />
        <h5 className="pb-3">
          Begin periodic <br /> contribution
        </h5>
        <p className="text-primary">
          Cultivate the habit of making consistent contributions here to
          accelerate your BALL process and begin enjoying the lifelong benefits
          of a BALLer.
        </p>
      </aside>
      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <img className="az-easy-abc-letter" src={C} alt="C" />
        <h5 className="pb-3">
          Convert to home <br /> ownership
        </h5>
        <p className="text-primary">
          Get the home of your dreams using an array of financial products
          including single digit mortgages as low as 6%
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
    <h3 className="az-how-heading">APPLICATION</h3>
    <section className="mt-sm-5 py-4">
      <div className="row">
        <div className="az-how-step col-lg-5 col-sm-5 col-12">
          <img
            className="az-how-step-img"
            src={PreferenceImage}
            alt="Define preference"
          />
        </div>
        <div className="az-how-step-line col-lg-2 col-sm-2 col-12" />
        <div className="az-how-step col-lg-5 col-sm-5 col-12">
          <h5 className="az-how-step-title">Define your preference.</h5>
          <p className="az-how-step-text mt-3 pe-5">
            Bring your dreams to life, select from the options below to activate
            the process of customising your ideal home ownership process.{' '}
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
                  <img
                    className="az-how-step-icon"
                    src={LocationHouse}
                    alt="Preferred location"
                  />
                  <h6 className="az-how-step-title-2">
                    Select preferred <br /> location
                  </h6>
                  <p className="az-how-step-text-2">
                    Input your location of choice.
                  </p>
                </div>
                <div className="az-how-step az-tree__branch--right">
                  <img
                    className="az-how-step-icon"
                    src={HouseType}
                    alt="Property Type"
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
                <img
                  className="az-how-step-img"
                  src={Subscription}
                  alt="Subscription"
                />
              </div>
              <div className="col-md-2 d-none d-sm-block">
                <div className="text-center pt-5 my-5">
                  <span className="circle-dot"> </span>
                </div>
              </div>
              <div className="col-md-5 ms-lg-none ms-md-n4 mb-md-5 mb-lg-0">
                <h5 className="az-how-step-title pt-5 pt-sm-none pb-2">
                  Structure your subscription
                </h5>
                <p className="az-how-step-text pe-5">
                  One of the best things about BALLers is our goal to take out
                  the burden of heavy one-off payments to own a home. Select the
                  options below that are a best fit for your BALLing experience.
                </p>
              </div>
            </aside>
            <aside className="az-tree__branch az-tree__branch--half">
              <div className="az-tree__node">
                <div className="az-how-step az-tree__branch--left">
                  <img
                    className="az-how-step-icon"
                    src={PaymentAmount}
                    alt="Payment amount"
                  />
                  <h6 className="az-how-step-title-2">
                    Input amount available <br /> to begin with
                  </h6>
                </div>
                <div className="az-how-step az-tree__branch--center az-tree__branch--center-to-right-md">
                  <img
                    className="az-how-step-icon"
                    src={Interval}
                    alt="Interval"
                  />
                  <h6 className="az-how-step-title-2">
                    Select preferred <br />
                    periodic time interval
                  </h6>
                </div>
                {/* This section is repeated. This is shown for tablet and mobile */}
                <div className="az-how-step az-tree__branch--right d-md-none d-lg-block">
                  <img
                    className="az-how-step-icon"
                    src={Duration}
                    alt="Duration"
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
              <img className="az-how-step-icon" src={Duration} alt="Duration" />
              <h6 className="az-how-step-title-2">
                Calculate the total <br /> duration
              </h6>
            </div>
            <div className="clearfix" />
          </section>
        </div>
      </section>
      <div className="row mt-md-5 pt-md-5 mt-lg-0 pt-lg-0">
        <div className="col-sm-12 pt-md-3 pt-lg-0">
          <Link href="/register" className="btn btn-link">
            APPLY NOW
          </Link>
        </div>
      </div>
    </section>
    <h6 className=" text-secondary mt-5">STEP B</h6>
    <h3 className="az-how-heading">
      BEGIN PERIODIC <br /> CONTRIBUTION
    </h3>
    <div className="row">
      <div className="az-how-step col-md-5 col-sm-5 offset-sm-1 offset-md-0 offset-lg-1 col-lg-4 col-12">
        <img
          className="az-how-step-img smaller-md"
          src={StartContribution}
          alt="Start contribution"
        />
      </div>
      <div className="az-how-step-line col-sm-2 col-md-2 d-none d-sm-block">
        <div className="text-center pt-5 my-5">
          <span className="circle-dot"> </span>
        </div>
      </div>
      <div className="az-how-step col-md-5 col-sm-5 col-12 mt-md-n4 mt-lg-0">
        <h5 className="az-how-step-title">Start contributing</h5>
        <p className="az-how-step-text pe-5">
          We are excited! Now that you have the perfect plan with a clear figure
          and contribution times, begin your journey here by making your first
          investment.
        </p>
        <div className="col-sm-12 pt-md-3 text-start">
          <Link href="/register" className="btn btn-secondary ms-n3">
            APPLY NOW
          </Link>
        </div>
      </div>
    </div>
    <section className="az-section__spacing">
      <h6 className="text-secondary">STEP C</h6>
      <h3 className="az-how-heading">
        CONVERT TO <br /> HOME OWNERSHIP
      </h3>
      <div className="row">
        <div className="az-how-step col-md-5 col-sm-4 offset-md-0 offset-lg-1 col-lg-4 col-12">
          <img
            className="az-how-step-img smaller-md"
            src={ConvertSubscription}
            alt="Convert subscription"
          />
        </div>
        <div className="az-how-step-line col-lg-2 col-sm-2 col-12" />
        <div className="az-how-step col-lg-5 col-md-5 col-sm-5 col-12">
          <h5 className="az-how-step-title">Convert subscription</h5>
          <p className="az-how-step-text me-5">
            Once your contributions have reached the minimum required amount, we
            walk you through the process of converting to best-fit financial
            instruments from an array of products to acquire your desired
            property.
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
              <img className="az-how-step-img" src={MoveIn} alt="Move in" />
              <h5 className="az-how-step-title-3">Move into your new home</h5>
              <p className="az-how-step-text-2 col-md-6 offset-md-3">
                Congratulations! You did it. Now your future begins. Of course,
                you are welcome to go right back to the top and begin the
                process of buying your next property.
              </p>
              <div className="col-sm-12 pt-md-3">
                <Link href="/register" className="btn btn-secondary">
                  APPLY NOW
                </Link>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </section>
  </section>
);

const FullControl = () => (
  <section className="az-control">
    <h2 className="az-control-heading">You have full control</h2>
    <div className="row">
      <div className="col-lg-1 col-12" />
      <div className="col-lg-5 col-sm-6 col-12">
        <img
          className="az-control-panel-img img-fluid"
          src={SeeAvailable}
          alt="Available Properties"
        />
        <h5 className="az-control-panel-heading">See available properties</h5>
        <p className="az-control-panel-text" />
      </div>
      <div className="col-lg-5 col-sm-6 col-12">
        <img
          className="az-control-panel-img img-fluid"
          src={Monitor}
          alt="Monitor your contribution"
        />
        <h5 className="az-control-panel-heading">Monitor your contribution</h5>
        <p className="az-control-panel-text" />
      </div>
      <div className="col-lg-1 col-12" />
      <div className="col-lg-1 col-12" />
      <div className="col-lg-5 col-sm-6 col-12">
        <img
          className="az-control-panel-img img-fluid"
          src={ViewMap}
          alt="View Map"
        />
        <h5 className="az-control-panel-heading">View map</h5>
        <p className="az-control-panel-text" />
      </div>
      <div className="col-lg-5 col-sm-6 col-12">
        <img
          className="az-control-panel-img img-fluid"
          src={Conversation}
          alt="Start a conversation"
        />
        <h5 className="az-control-panel-heading">Start a conversation</h5>
        <p className="az-control-panel-text" />
      </div>
      <div className="col-lg-1 col-12" />
    </div>
  </section>
);

const BallersCreed = () => (
  <section className="az-creed">
    <img className="az-creed-q-up" src={QuotationMarkUp} alt="quotation mark" />
    <h6 className="header-secondary pb-6">BALLERS CREED</h6>
    <h4 className="pb-5">
      As a BALLer, we share a duty to BALL <br /> and live a healthy lifestyle
      for it’s not <br /> just a home but also a lifestyle.
    </h4>
    <img
      className="az-creed-q-down"
      src={QuotationMarkDown}
      alt="quotation mark"
    />
    <img
      className="az-creed-q-up-mobile"
      src={QuotationMarkUp}
      alt="quotation mark"
    />
  </section>
);
export default AtoZ;
