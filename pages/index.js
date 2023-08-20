import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AttentionSeeker, Slide } from 'react-awesome-reveal';
import Header from '@/components/layout/Header';
import { HeroArrow, PolkaDot } from '@/components/utils/Icons';
import useWindowSize from '@/hooks/useWindowSize';
import { MOBILE_WIDTH } from '@/utils/constants';
import FAQsAccordion from '@/components/common/FAQsAccordion';
import FAQsContent from '@/data/faqs';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';
import SearchContentPropertyForm from '@/components/common/SearchContentPropertyForm';
import axios from 'axios';
import { PropertiesRowList } from './properties';
import { API_ENDPOINT } from '@/utils/URL';
import ReferralModal from '@/components/common/ReferralModal';
import { Tab, Tabs } from 'react-bootstrap';
import AdvancedSearchPropertyForm from '@/components/common/AdvancedSearchPropertyForm';

export default function Home({
  properties,
  referralCode = null,
  inviteCode = null,
}) {
  return (
    <>
      <Header />
      <HoldingSection />
      <AboutSection />
      <PropertiesRowList result={properties} title="Available Properties" />
      <HowItWorksSection />
      <FAQsSection />
      <CommunityGallery />
      <ReferralModal referralCode={referralCode} inviteCode={inviteCode} />
      <Footer />
    </>
  );
}

const HoldingSection = () => (
  <section>
    <div className="row me-0 ms-0">
      <section className="col-lg-6 ps-lg-6 pt-4 home-hero-container">
        <div className="home-hero">
          <h1 className="text-shadow-light pt-5 pt-lg-0 home-hero-title">
            Ready to own your{' '}
            <span>
              dream home <HeroArrow />
            </span>
          </h1>
        </div>

        <section className="position-relative">
          <SearchTabComponent />
          <div className="dotted-polka">
            <PolkaDot />
          </div>
        </section>
      </section>
      <section className="col-lg-6 home-bg  mb-n4"></section>
    </div>
  </section>
);

const AboutSection = () => {
  const WINDOW_SIZE = useWindowSize();
  const isDesktop = WINDOW_SIZE.width > MOBILE_WIDTH;
  return (
    <section className="container-fluid bg-light-blue mb-n4">
      <div className="row my-4">
        <div className="col-sm-6 col-12 text-center mb-n4">
          <h6 className="header-secondary d-lg-none d-block">ABOUT BALL</h6>
          <Image
            src={`/img/pages/${isDesktop ? 'home.png' : 'home-tab.png'}`}
            className="img-cover"
            alt="home"
            width={isDesktop ? '808' : '363'}
            height={isDesktop ? '939' : '367'}
          />
        </div>
        <div className="col-sm-6 col-12 pb-5">
          <h6 className="header-secondary d-none d-lg-block">ABOUT BALL</h6>
          <h2 className="my-4 my-md-0">
            Game-changing service <br /> that makes owning <br /> your home
            easier
          </h2>
          <p className="my-md-5 my-3 text-normal">
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
        <Slide direction="left" triggerOnce>
          <Image
            src="/img/pages/phone.png"
            width="644"
            height="847"
            alt="phone"
          />
        </Slide>
      </div>
      <div className="col-lg-6 offset-lg-2">
        <Slide direction="right" triggerOnce>
          <h6 className="header-secondary">HOW IT WORKS</h6>
          <h3>BALLing is as easy as ABC</h3>
        </Slide>

        <ul className="timeline mt-5">
          <AttentionSeeker cascade damping={1} delay={3000}>
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
              <Link href="/register" passHref>
                <a className="btn btn-secondary">SIGN UP NOW</a>
              </Link>
            </li>
          </AttentionSeeker>
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

export async function getStaticProps() {
  const propertiesRes = await axios.get(API_ENDPOINT.getAllProperties());
  return {
    props: {
      properties: propertiesRes.data?.result,
    },
    revalidate: 10,
  };
}

const SearchTabComponent = () => {
  const allTabs = [
    {
      title: 'Confirm Eligibility',
      component: <SearchContentPropertyForm />,
    },
    {
      title: 'Search Property',
      component: <AdvancedSearchPropertyForm />,
    },
  ];

  return (
    <Tabs defaultActiveKey={allTabs[0].title} id="tranasction-tabs">
      {allTabs.map((tab, index) => (
        <Tab key={index} eventKey={tab.title} title={tab.title}>
          {tab.component}
        </Tab>
      ))}
    </Tabs>
  );
};

// <div>
//   <ul className="nav nav-tabs">
//     <li className="nav-item">
//       <a className="nav-link active" data-bs-toggle="tab" href="#desc">
//         Buy
//       </a>
//     </li>
//     <li className="nav-item">
//       <a className="nav-link" data-bs-toggle="tab" href="#addi__info">
//         Sale
//       </a>
//     </li>
//     <li className="nav-item">
//       <a className="nav-link" data-bs-toggle="tab" href="#review">
//         Rent
//       </a>
//     </li>
//   </ul>
//   <div className="tab-content">
//     <div className="tab-pane active" id="desc">
//       <form action="/listing-1.html">
//         <div className="input-group">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search for city, property, agent and more..."
//           />
//           <button type="submit" className="btn btn-primary">
//             Search Property
//           </button>
//           <div className="input-group-append">
//             <a href="#">
//               <span className="input-group-text icon-magnifying-glass"></span>
//             </a>
//           </div>
//         </div>
//       </form>
//     </div>

//     <div className="tab-pane" id="addi__info">
{
  /* <form action="/listing-1.html">
  <div className="input-group">
    <input
      type="text"
      className="form-control"
      placeholder="Search for city, property, agent and more..."
    />
    <button type="submit" className="btn btn-primary">
      Search Property
    </button>
    <div className="input-group-append">
      <a href="#">
        <span className="input-group-text icon-magnifying-glass"></span>
      </a>
    </div>
  </div>
</form>; */
}
//     </div>

//     <div className="tab-pane" id="review">
//       <form action="/listing-1.html">
//         <div className="input-group">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search for city, property, agent and more..."
//           />
//           <button type="submit" className="btn btn-primary">
//             Search Property
//           </button>
//           <div className="input-group-append">
//             <a href="#">
//               <span className="input-group-text icon-magnifying-glass"></span>
//             </a>
//           </div>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>
