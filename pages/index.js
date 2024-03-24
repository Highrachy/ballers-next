import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AttentionSeeker,
  Fade,
  JackInTheBox,
  Slide,
} from 'react-awesome-reveal';
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
import Typewriter from 'typewriter-effect';
import BenefitsSection from '@/components/common/BenefitsSection';
import ServiceBox from '@/components/dashboard/ServiceBox';
import SearchEligibilityForm from '@/components/common/SearchEligibilityForm';

export default function Home({
  properties,
  allServices,
  referralCode = null,
  inviteCode = null,
}) {
  console.log('allServices', allServices);

  return (
    <>
      <Header />
      <HoldingSection />
      <AboutSection />
      <PropertiesRowList
        result={properties?.slice(0, 3)}
        title="Available Properties"
      />
      <BenefitsSection />
      <HowItWorksSection />
      {/* <OurServices /> */}
      <FAQsSection />
      <CommunityGallery />
      <ReferralModal referralCode={referralCode} inviteCode={inviteCode} />
      <Footer />
    </>
  );
}

const HoldingSection = () => {
  const [showArrow, setShowArrow] = React.useState(false);

  return (
    <section>
      <div className="row me-0 ms-0">
        <section className="col-lg-6 ps-lg-6 pt-4 home-hero-container">
          <div className="home-hero">
            <h1 className="text-shadow-light pt-5 pt-lg-0 home-hero-title">
              Ready to own your <br />
              <span className="home-hero__text">
                <TypewriterWrapper
                  texts={['dream home', 'rental investment', 'income property']}
                />
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
        <section className="col-lg-6">
          <div className="home-hero-bg"></div>
        </section>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const WINDOW_SIZE = useWindowSize();
  const isDesktop = WINDOW_SIZE.width > MOBILE_WIDTH;
  return (
    <section className="container-fluid bg-light-blue mb-n4">
      <div className="row my-4">
        <div className="col-sm-6 col-12 text-center mb-n4">
          <h6 className="header-secondary d-lg-none d-block">ABOUT BALL</h6>
          <Slide triggerOnce direction="left">
            <Image
              src={`/img/pages/home.png`}
              className="img-cover"
              alt="home"
              width="808"
              height="939"
            />
          </Slide>
        </div>
        <div className="col-sm-6 col-12 pb-5">
          <Fade triggerOnce cascade damping={0.2}>
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
          </Fade>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => (
  <section className="container-fluid my-4" id="how-it-works">
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

const OurServices = () => (
  <section className="container-fluid my-4">
    <div className="row">
      <ServiceBox
        link="/services"
        title="Title Validity"
        price="50,000"
        content="Title validity refers to the legal status of the ownership of a property. It is essential to ensure that the title of a property is valid and clear before buying or selling it."
      />
      <ServiceBox
        link="/services"
        title="Title Validity"
        price="50,000"
        content="Title validity refers to the legal status of the ownership of a property. It is essential to ensure that the title of a property is valid and clear before buying or selling it."
      />
      <ServiceBox
        link="/services"
        title="Title Validity"
        price="50,000"
        content="Title validity refers to the legal status of the ownership of a property. It is essential to ensure that the title of a property is valid and clear before buying or selling it."
      />
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
  const servicesRes = await axios.get(API_ENDPOINT.getAllVas());
  const allProperties = propertiesRes.data?.result;
  const lastThreeProperties = allProperties.slice(-3);

  return {
    props: {
      properties: lastThreeProperties,
      allServices: servicesRes.data?.result,
    },
    revalidate: 10,
  };
}

const SearchTabComponent = () => {
  const allTabs = [
    {
      title: 'Check Eligibility',
      component: <SearchEligibilityForm />,
    },
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
    <Tabs defaultActiveKey={allTabs[0].title} id="transaction-tabs">
      {allTabs.map((tab, index) => (
        <Tab key={index} eventKey={tab.title} title={tab.title}>
          {tab.component}
        </Tab>
      ))}
    </Tabs>
  );
};

export const TypewriterWrapper = ({ texts, disableArrow }) => {
  const [showArrow, setShowArrow] = React.useState(false);
  const WINDOW_SIZE = useWindowSize();
  const isDesktop = WINDOW_SIZE.width > MOBILE_WIDTH;

  const typeTextWithArrow = (typewriter, text) => {
    typewriter
      .typeString(text)
      .callFunction(() => {
        setShowArrow(true);
      })
      .pauseFor(3000)
      .callFunction(() => {
        setShowArrow(false);
      })
      .deleteAll()
      .stop();
  };

  const initializeTypewriter = (typewriter) => {
    texts.forEach((text, index) => {
      typeTextWithArrow(typewriter, text);
      if (index < texts.length - 1) {
        typewriter.pauseFor(1000);
      }
    });
    typewriter.start();
  };

  return (
    <div>
      <Typewriter
        onInit={initializeTypewriter}
        options={{
          autoStart: true,
          loop: true,
        }}
      />

      {showArrow && !disableArrow && (
        <JackInTheBox duration={1500}>
          <HeroArrow />
        </JackInTheBox>
      )}
    </div>
  );
};
