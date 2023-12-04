import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Fade, Slide } from 'react-awesome-reveal';
import Header from '@/components/layout/Header';
import FAQsAccordion from '@/components/common/FAQsAccordion';
import FAQsContent from '@/data/faqs';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';
import axios from 'axios';
import { API_ENDPOINT } from '@/utils/URL';
import BenefitsSection from '@/components/common/BenefitsSection';
import Button from '@/components/forms/Button';
import { OnlineImage } from '@/components/utils/Image';
import { getDemoRegisterLink } from '@/utils/helpers';
import { TypewriterWrapper } from 'pages';

export default function Home({ result }) {
  return (
    <>
      <Header />
      <HoldingSection />
      <AboutSection />
      <BenefitsSection isVendor />
      <TheBALLPlatform />
      <VendorContainer results={result} />
      <FAQsSection />
      <CommunityGallery />
      <Footer />
    </>
  );
}

const HoldingSection = () => {
  return (
    <section className="vendor-hero">
      <div className="container-fluid">
        <div className="row">
          <section className="col-xl-6 pt-4">
            <div className="home-hero">
              <h2 className="pt-3 pt-md-5 pt-lg-0 text-center text-xl-start">
                Welcome to BALL: <br />
                Sell Smart,{' '}
                <span className="home-hero__text">
                  <TypewriterWrapper
                    texts={['Sell Faster', 'Endless Rewards', 'Achieve More']}
                    disableArrow
                  />
                </span>
              </h2>
            </div>
            <p className="lead mt-3 mb-4 pe-xl-8 px-md-6 px-lg-8 px-xl-0 text-primary text-center text-xl-start">
              Whether your goal is to sell more properties or increase your
              profits, BALL provides the solution to streamline your real estate
              journey.
            </p>
            <div className="text-center text-xl-start mb-5">
              <Button href="/register">
                Create <span className="d-none d-sm-inline">a Free</span>{' '}
                Account
              </Button>
              <Button
                color="primary-light"
                className="mx-3"
                href={getDemoRegisterLink()}
              >
                Try our Demo
              </Button>
            </div>
          </section>
          <section className="col-xl-6">
            <div className="home-hero-vendor-bg"></div>
          </section>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="container-fluid">
      <div className="row my-xl-7 my-5 mb-6">
        <div className="col-md-6 col-xl-7 col-12 text-center mb-n4">
          <h6 className="header-secondary d-xl-none d-block">
            ABOUT BALL FOR VENDORS
          </h6>
          <Slide triggerOnce direction="left">
            <Image
              src={`/img/pages/vendor-home.svg`}
              className="img-cover"
              alt="home"
              width="675 "
              height="446"
            />
          </Slide>
        </div>
        <div className="col-md-6 col-xl-5 ps-md-4 col-12 pb-md-5">
          <Fade triggerOnce cascade damping={0.2}>
            <h6 className="header-secondary d-none d-xl-block">
              ABOUT BALL FOR VENDORS
            </h6>
            <h3 className="mt-md-0 mt-5">
              The Game-Changing Platform{' '}
              <br className="d-none d-sm-block d-md-none d-lg-block" />
              for Real Estate Sales
            </h3>
            <p className="text-normal text-soft mt-3 mb-md-4 pe-0 pe-xl-6">
              BALL provides an easier, faster, and more efficient way to sell
              your property, redefining the real estate experience for everyone.
              We understand the unique challenges faced in the ever-evolving
              property market, and our platform is crafted to address these
              challenges head-on, offering a suite of innovative solutions
              tailored to elevate your business.
            </p>
            <Button wide href="/register" className="mt-3">
              Get started for Free
            </Button>
          </Fade>
        </div>
      </div>
    </section>
  );
};

const TheBALLPlatform = () => (
  <section className="container-fluid py-6 py-lg-7 mt-n5">
    <div className="row">
      <div className="col-lg-4">
        <Slide direction="left" triggerOnce>
          <h6 className="header-secondary d-none d-lg-block">
            THE BALL PLATFORM
          </h6>
          <h2 className="mt-4 my-md-0">
            Dive into the
            <br /> BALL Experience:
          </h2>
          <p className="lead text-primary mt-4 mb-5">
            Explore a demo to witness firsthand the power of BALL for your
            business. We&apos;re here to address any questions you may have.
            Unlock the potential of seamless property management today!
          </p>
          <Button
            color="secondary"
            wide
            className="mb-5"
            href={getDemoRegisterLink()}
          >
            Try our Demo
          </Button>
        </Slide>
      </div>
      <div className="col-lg-7 offset-lg-1">
        <Slide direction="right" triggerOnce>
          <Image
            src="/img/pages/ball-platform.png"
            width="769"
            height="575"
            alt="ball platform"
          />
        </Slide>
      </div>
    </div>
  </section>
);

const VendorContainer = ({ results }) => (
  <section className=" bg-gray-light">
    <div className="container-fluid py-6">
      <div className="row">
        <div className="col-sm-10 col-12 mx-auto">
          <div className="text-center">
            <h6 className="header-secondary d-block">MEET OUR VENDORS</h6>
            <h3 className="mb-5 px-3">
              Your Trusted Pathfinders in Real Estate
            </h3>
          </div>
          <div className="row g-3">
            {results.map((user, index) => (
              <VendorComponent key={index} number={index + 1} {...user} />
            ))}
          </div>

          <div className="text-center mt-5">
            <Button wide color="secondary-light" href="/vendors">
              View All Vendors
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const VendorComponent = ({ number, ...user }) => {
  return (
    <div className="col-md-3 col-6 vendor-container">
      <Link href={`/vendors/${user?.vendor?.slug}`}>
        <a className="card vendor-card">
          <OnlineImage
            name={user?.vendor?.companyName}
            src={user?.vendor?.companyLogo}
            width="150px"
          />
        </a>
      </Link>
    </div>
  );
};

const FAQsSection = () => {
  const FAQs = FAQsContent['vendor'].faqs;
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

export async function getStaticProps() {
  const vendors = await axios.get(API_ENDPOINT.getAllVendors());

  return {
    props: {
      result: vendors?.data?.result?.slice(0, 8) || [],
    },
    revalidate: 10,
  };
}
