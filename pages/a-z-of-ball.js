import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import BenefitsSection from 'components/common/BenefitsSection';
import Image from 'next/image';
import Link from 'next/link';
import SeoHead from '@/components/utils/SeoHead';

const AtoZ = () => (
  <>
    <SeoHead
      title="A-Z of BALL | How BALL Works & How to Become a BALLer"
      description="Discover the A-Z of BALL — how to apply, start a flexible payment plan, and become a BALLer with verified homeownership support."
      canonical="https://www.ballers.ng/a-z-of-ball"
      keywords={[
        'A-Z of BALL',
        'how BALL works',
        'become a BALLer',
        'homeownership nigeria',
        'property payment plan nigeria',
        'ball real estate',
        'flexible payment homes lagos',
      ]}
    />

    <Header />

    {/* Title section */}
    <TitleSection
      name="A-Z of BALL"
      content="Experience the essence of being a BALLer — a community where aspirations meet achievement. Join us to own quality homes and embark on a journey towards a brighter future."
    />

    {/* Extra SEO text for low-content fix */}
    <p className="visually-hidden">
      Learn the complete A-Z process of owning a home with BALL including how to
      apply, begin your payment plan, convert to ownership, and become a BALLer.
    </p>

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
        <h3 className="header-secondary pt-0">BALL Explained</h3>
        <p className="lead text-primary pt-4 mb-4">
          BALL is a platform that enables her members to seamlessly own quality
          homes in well-planned communities with a sustainable plan tailored to
          their current realities. We guide you through the entire process,
          customized specially for you.
        </p>
        <p className="lead text-primary">
          Balling is an experience — a choice for a quality lifestyle and a
          legacy that benefits generations to come.
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
          width={111}
          height={120}
          loading="lazy"
        />
        <h4 className="py-4">Apply Now</h4>
        <p className="text-primary">
          Explore our quality properties and fill out the application form to
          start your homeownership journey.
        </p>
      </aside>

      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <Image
          className="az-easy-abc-letter"
          src="/img/icons/b.png"
          alt="B"
          width={111}
          height={120}
          loading="lazy"
        />
        <h4 className="py-4">
          Begin Your <br /> Payment Plan
        </h4>
        <p className="text-primary">
          Start your personalized payment plan tailored to your chosen property
          with BALL.
        </p>
      </aside>

      <aside className="az-easy-abc col-lg-3 col-sm-5 col-11">
        <Image
          className="az-easy-abc-letter"
          src="/img/icons/c.png"
          alt="C"
          width={111}
          height={120}
          loading="lazy"
        />
        <h4 className="py-3">
          Convert to Home <br /> Ownership
        </h4>
        <p className="text-primary">
          Complete your payments, collect your keys, and officially become a
          landlord with BALL.
        </p>
      </aside>
    </div>
  </section>
);

const HowBallersWork = () => (
  <section className="az-how">
    <h2 className="header-secondary">How It Works</h2>
    <h3>In Three Easy Steps</h3>

    {/* STEP A */}
    <h4 className="mt-7 header-secondary">Step A</h4>
    <h4 className="az-how-heading">Apply Now</h4>

    <section className="mt-sm-5 py-4">
      <div className="row">
        <div className="az-how-step col-md-5 col-sm-5 offset-sm-1 offset-md-0 offset-lg-1 col-lg-4 col-12">
          <Image
            className="az-how-step-img"
            src="/img/pages/a-to-z/preference.png"
            alt="Search for properties"
            width={700}
            height={400}
            loading="lazy"
          />
        </div>

        <div className="az-how-step-line col-sm-2 col-md-2 d-none d-sm-block">
          <div className="text-center pt-5 my-5">
            <span className="circle-dot" />
          </div>
        </div>

        <div className="az-how-step col-md-5 col-sm-5 col-12 mt-md-n4 mt-lg-0">
          <Link href="/properties/search" passHref>
            <h5 className="az-how-step-title">
              Identify Your Preferred Property
            </h5>
          </Link>
          <p className="az-how-step-text mt-3 pe-5">
            Explore our diverse range of properties to find the one that fits
            your vision of home. Choose from various locations, designs, and
            features that suit your lifestyle and budget.{' '}
            <Link href="/properties/search" passHref>
              <a className="text-secondary">Browse our property listings</a>
            </Link>{' '}
            today and take the first step toward becoming a homeowner.
          </p>
        </div>
      </div>
    </section>

    {/* STEP B */}
    <h4 className="header-secondary mt-5">Step B</h4>
    <h4 className="az-how-heading">Begin Your Payment Plan</h4>

    <div className="row">
      <div className="az-how-step col-md-5 col-sm-5 offset-sm-1 offset-md-0 offset-lg-1 col-lg-4 col-12">
        <Image
          className="az-how-step-img smaller-md"
          src="/img/pages/a-to-z/start-contribution.png"
          alt="Start contribution"
          width={700}
          height={400}
          loading="lazy"
        />
      </div>

      <div className="az-how-step-line col-sm-2 col-md-2 d-none d-sm-block">
        <div className="text-center pt-5 my-5">
          <span className="circle-dot" />
        </div>
      </div>

      <div className="az-how-step col-md-5 col-sm-5 col-12 mt-md-n4 mt-lg-0">
        <h5 className="az-how-step-title">Start Your Payment Plan</h5>
        <p className="az-how-step-text pe-5">
          Select a payment plan that works for you. Whether you prefer to pay in
          installments, at key milestones, or in full, we offer flexible options
          tailored to your needs.
        </p>
      </div>
    </div>

    {/* STEP C */}
    <section className="az-section__spacing">
      <h4 className="header-secondary">Step C</h4>
      <h4 className="az-how-heading">Convert to Home Ownership</h4>

      <div className="row">
        <div className="az-how-step col-md-5 col-sm-4 offset-md-0 offset-lg-1 col-lg-4 col-12">
          <Image
            className="az-how-step-img smaller-md"
            src="/img/pages/a-to-z/convert-subscription.png"
            alt="Convert subscription"
            width={700}
            height={400}
            loading="lazy"
          />
        </div>

        <div className="az-how-step-line col-lg-2 col-sm-2 col-12" />

        <div className="az-how-step col-lg-5 col-md-5 col-sm-5 col-12">
          <h5 className="az-how-step-title">
            Collect Your Keys & Process Your Title
          </h5>
          <p className="az-how-step-text me-5">
            Once your payments reach the minimum required amount, collect your
            keys and move into your new home while we assist in processing your
            property title.
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
                width={972}
                height={553}
                loading="lazy"
              />

              <h5 className="az-how-step-title-3">Move into Your New Home</h5>

              <p className="az-how-step-text-2 col-md-6 offset-md-3">
                Congratulations! You’ve achieved your dream of homeownership.
                Continue building your legacy—with more opportunities to secure
                properties for yourself or your loved ones.
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
      width={100}
      height={100}
      loading="lazy"
    />

    <h2 className="header-secondary pb-6">BALLers Creed</h2>

    <h4 className="pb-5">
      As a BALLer, we share a duty to BALL and live a healthy lifestyle — for
      it&apos;s not just a home but a lifestyle.
    </h4>

    <Image
      className="az-creed-q-down"
      src="/img/icons/quote-down.png"
      alt="quotation mark"
      width={100}
      height={100}
      loading="lazy"
    />
  </section>
);

export default AtoZ;
