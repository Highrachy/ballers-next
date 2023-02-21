import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Image from 'next/image';

const AboutUs = () => (
  <>
    <Header />
    <TitleSection
      name="About BALL"
      content="The only realistic burden free process of owning your ideal home."
    />
    <OurGoalAndPromise />
    <OurCoreValues />
    <OurTeam />
    <CommunityGallery />
    <Footer />
  </>
);

const OurGoalAndPromise = () => (
  <div className="container-fluid mb-7">
    <section className="row mt-5">
      <div className="col-lg-5 col-12">
        <h6 className="header-secondary">OUR GOAL</h6>
        <h2>
          Make owning a <br /> home easier.
        </h2>
      </div>
      <div className="col-lg-7 col-12">
        <p className="lead text-primary pt-5 mt-n3 mb-4">
          Our goal is to facilitate the emergence of a million new homeowners in
          less than a decade.
        </p>
        <p className="lead text-primary">
          We intend to achieve this by reducing the barriers to property
          investment and acquisition. Our team will guide your every step during
          this process to ensure your home ownership goals are achieved.
        </p>
      </div>
    </section>
    <section className="row mt-5">
      <div className="col-lg-5 col-12">
        <h6 className="header-secondary">OUR PROMISE TO YOU</h6>
        <h2>Beyond your expectations.</h2>
      </div>
      <div className="col-lg-7 col-12 mb-5">
        <p className="lead text-primary pt-5 mt-n3 mb-4">
          We know that you can achieve home ownership if you utilize the right
          route.
        </p>
        <p className="lead text-primary">
          If you will dare to Dream Big and take every step of this process with
          the required discipline, we promise to walk you through to your dream
          home.
        </p>
      </div>
    </section>
  </div>
);

const OurCoreValues = () => (
  <section className="bg-light-blue py-5">
    <div className="text-center">
      <h6 className="header-secondary">CORE VALUES</h6>
      <h2>What defines us.</h2>
      <p className="lead text-primary">
        We are a team of passionate and talented people
      </p>
    </div>

    <div className="container-fluid">
      <div className="row row-eq-height justify-content-center">
        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h3 className="text-secondary fw-bold mb-3"> Innovation</h3>
          <p className="text-primary">
            Our team is constantly working to push the boundaries of comfortable
            living with new concepts and thoughtful designs that bring the
            future of housing to you in the present.
          </p>
        </div>
        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h3 className="text-secondary fw-bold mb-3">Quality</h3>
          <p className="text-primary">
            A home is not complete until it offers you security and comfort. We
            offer you nothing but the best combination of designs, workmanship
            and construction materials to give you the quality lifestyle you
            deserve.
          </p>
        </div>
        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h4 className="text-secondary fw-bold mb-3">Accountability</h4>
          <p className="text-primary">
            Your contribution is not only secure but insured to ensure that your
            money is accounted for. <br />
            <br />
          </p>
        </div>
        <div className="col-lg-5 col-sm-5 col-12 core-values-card">
          <h4 className="text-secondary fw-bold mb-3">Solutions driven</h4>
          <p className="text-primary">
            Our constant target is to create and execute housing solutions that
            makes luxury and healthy living available to more hardworking
            individuals across Nigeria.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const OurTeam = () => (
  <section className="container-fluid">
    <h6 className="header-secondary">THE TEAM</h6>
    <h2>
      Meet our <br /> awesome team.
    </h2>
    <div className="row">
      <div className="col-lg-3 col-sm-6 col-12 mb-5">
        <Image
          src="/img/team/nnamdi.jpg"
          alt="Nnamdi Ijei"
          width="370"
          height="380"
        />
        <h5 className="mt-3 mb-0">Nnamdi Ijei</h5>
        <p className="text-green fw-bold">CEO</p>
      </div>
      <div className="col-lg-3 col-sm-6 col-12 mb-5">
        <Image
          src="/img/team/leonard.jpg"
          alt="Leonard Isiekwenagbu"
          width="370"
          height="380"
        />
        <h5 className="mt-3 mb-0">Leonard Isiekwenagbu</h5>
        <p className="text-green fw-bold">BUSINESS DEVELOPMENT</p>
      </div>
      <div className="col-lg-3 col-sm-6 col-12 mb-5">
        <Image
          src="/img/team/haruna.jpg"
          alt="Haruna Popoola"
          width="370"
          height="380"
        />
        <h5 className="mt-3 mb-0">Haruna Popoola</h5>
        <p className="text-green fw-bold">LEAD DEVELOPER</p>
      </div>
    </div>
  </section>
);
export default AboutUs;
