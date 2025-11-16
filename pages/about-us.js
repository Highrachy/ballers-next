import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import SeoHead from '@/components/utils/SeoHead';

const AboutUs = () => (
  <>
    <SeoHead
      title="About BALL | Our Goal, Promise and Core Values"
      description="Learn about BALL, our mission to help Nigerians become homeowners, and the core values that guide our team and the homeownership journey."
      canonical="https://www.ballers.ng/about-us"
      keywords={[
        'about BALL',
        'ball real estate',
        'homeownership mission nigeria',
        'ball core values',
        'become a BALLer',
        'property investment nigeria',
      ]}
    />

    <Header />

    <TitleSection
      name="About BALL"
      content="The only realistic and burden free process of owning your ideal home."
    />

    {/* Low-content SEO helper text */}
    <p className="visually-hidden">
      Learn about BALL, our goal to simplify home ownership, our promise to
      guide you through the entire journey, and the core values that define our
      team.
    </p>

    <OurGoalAndPromise />
    <OurCoreValues />
    <CommunityGallery />
    <Footer />
  </>
);

const OurGoalAndPromise = () => (
  <div className="container-fluid mb-7">
    {/* GOAL */}
    <section className="row mt-5">
      <div className="col-lg-5 col-12">
        <div className="header-secondary h6">Our Goal</div>
        <h2>
          Make owning a <br /> home easier.
        </h2>
      </div>

      <div className="col-lg-7 col-12">
        <p className="lead text-primary pt-5 mt-n3 mb-4">
          Our goal is to facilitate the emergence of one million new homeowners
          in less than a decade.
        </p>
        <p className="lead text-primary">
          We intend to achieve this by reducing the barriers to property
          investment and acquisition. Our team will guide you at every step to
          ensure your homeownership goals are successfully achieved.
        </p>
      </div>
    </section>

    {/* PROMISE */}
    <section className="row mt-5">
      <div className="col-lg-5 col-12">
        <div className="header-secondary h6">Our Promise to You</div>
        <h3>Beyond your expectations.</h3>
      </div>

      <div className="col-lg-7 col-12 mb-5">
        <p className="lead text-primary pt-5 mt-n3 mb-4">
          We know that you can achieve homeownership if you choose the right
          route.
        </p>
        <p className="lead text-primary">
          If you dare to dream big and take each step of this journey with
          discipline, we promise to walk with you until you arrive at your dream
          home.
        </p>
      </div>
    </section>
  </div>
);

const OurCoreValues = () => (
  <section className="bg-light-blue py-5">
    <div className="text-center">
      <div className="header-secondary h6">Core Values</div>
      <h3>What defines us.</h3>
      <p className="lead text-primary">
        We are a team of passionate and talented people.
      </p>
    </div>

    <div className="container-fluid">
      <div className="row row-eq-height justify-content-center">
        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h4 className="text-secondary fw-bold mb-3">Innovation</h4>
          <p className="text-primary">
            Our team constantly pushes the boundaries of comfortable living with
            new ideas and thoughtful designs that bring the future of housing
            into the present.
          </p>
        </div>

        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h4 className="text-secondary fw-bold mb-3">Quality</h4>
          <p className="text-primary">
            A home is complete only when it offers you security and comfort. We
            offer nothing but the best in design, workmanship and construction
            materials to ensure the lifestyle you deserve.
          </p>
        </div>

        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h4 className="text-secondary fw-bold mb-3">Accountability</h4>
          <p className="text-primary">
            Your contribution is secure and insured to ensure that every amount
            is fully accounted for.
          </p>
        </div>

        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h4 className="text-secondary fw-bold mb-3">Solutions driven</h4>
          <p className="text-primary">
            Our focus is delivering housing solutions that make quality living
            accessible to more hardworking individuals across Nigeria.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs;
