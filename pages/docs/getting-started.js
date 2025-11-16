import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Link from 'next/link';
import SeoHead from '@/components/utils/SeoHead';

const GettingStarted = () => (
  <>
    <SeoHead
      title="Getting Started with BALL | Your Homeownership Journey"
      description="Learn how to start your journey to homeownership with BALL. Explore our platform, create an account, and understand features that help you become a property owner in Nigeria."
      canonical="https://www.ballers.ng/docs/getting-started"
      keywords={[
        'BALL getting started',
        'homeownership Nigeria',
        'BALL documentation',
        'property guide Nigeria',
        'how to use BALL',
      ]}
    />

    <Header />
    <TitleSection
      name="Getting Started"
      content="The only realistic burden free process of owning your ideal home."
    />
    {/* Hidden SEO section */}
    <section className="visually-hidden">
      <h2>Getting Started with BALL</h2>
      <p>
        BALL helps Nigerians achieve homeownership with a seamless, burden-free
        process. Learn how to navigate the platform, create your account, and
        understand available property options in Lagos and across Nigeria.
      </p>
      <p>
        This guide provides step-by-step instructions for new users, including
        how to set up an account, explore the platform features, and access
        resources that simplify property investment.
      </p>
      <p>
        Users can also learn about BALL Teams, VIP benefits, and property
        management tools to collaborate effectively and maximize their real
        estate opportunities.
      </p>
      <p>
        Explore popular topics such as creating your BALL account, beginning
        your property journey, understanding payment plans, and leveraging
        platform features to make informed homeownership decisions.
      </p>
      <p>
        By following this Getting Started guide, you gain insights and practical
        steps to begin your journey towards owning property in Nigeria
        confidently and efficiently.
      </p>
    </section>
    <OurGoalAndPromise />
    <CommunityGallery />
    <Footer />
  </>
);

const OurGoalAndPromise = () => (
  <section className="row mt-5">
    <div className="container my-md-5 my-3 py-5 px-8 terms-of-use">
      <h3>Get started with BALL Documentation</h3>
      <p className="mt-3 lead">
        Learn how to start your journey towards homeownership and real estate
        success with BALL. Explore our platform, create an account, and connect
        with a community dedicated to achieving their home ownership goals.
      </p>

      <div className="row mt-5">
        <div className="col-sm-6">
          <h6>Start here</h6>

          <ul className="list-unstyled">
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  Introduction to BALL Platform
                </Link>
                <p className="text-md text-gray">
                  Discover how BALL and real estate can help you achieve your
                  dream of owning a home.
                </p>
              </div>
            </li>
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  Understanding BALL&apos;s Offerings
                </Link>
                <p className="text-md text-gray">
                  Learn about the various features and benefits of BALL&apos;s
                  membership plans, tailored for you.
                </p>
              </div>
            </li>
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  Becoming a BALLER
                </Link>
                <p className="text-md text-gray">
                  Explore the collaborative potential of BALL Teams, where
                  groups of individuals can seamlessly collaborate across
                  multiple projects within a vibrant community.
                </p>
              </div>
            </li>
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  Creating Your BALL Account:
                </Link>
                <p className="text-md text-gray">
                  Discover how BALL and real estate can help you achieve your
                  dream of owning a home.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-sm-6">
          <h6>Popular Topics</h6>

          <ul className="list-unstyled">
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  Creating your BALL Account
                </Link>
                <p className="text-md text-gray">
                  Start your BALL journey by creating your personal account on
                  our platform.
                </p>
              </div>
            </li>
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  The BALL journey
                </Link>
                <p className="text-md text-gray">
                  Follow our step-by-step guide to begin your property journey
                  with BALL&apos;s user-friendly interface.
                </p>
              </div>
            </li>
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  Becoming a Landlord with Ease
                </Link>
                <p className="text-md text-gray">
                  Discover how BALL and real estate can help you achieve your
                  dream of owning a home. Discover how BALL and real estate can
                  help you achieve your dream of owning a home.
                </p>
              </div>
            </li>
            <li className="my-2">
              <hr />
              <div className="py-3">
                <Link
                  className="text-lg text-primary"
                  href="/docs/getting-started"
                >
                  Understanding BALL Offerings
                </Link>
                <p className="text-md text-gray">
                  Discover how BALL and real estate can help you achieve your
                  dream of owning a home.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default GettingStarted;
