import React, { useEffect } from 'react';
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
import SearchEligibilityForm from '@/components/common/SearchEligibilityForm';
import { ServiceCard } from './services';
import Slider from 'react-slick';
import { sliderSettings } from '@/components/common/BenefitsSection';
import { shuffleArray } from '@/utils/helpers';
import { useChatMessage } from '@/context/ChatContext';

export default function Home({
  properties,
  allServices,
  referralCode = null,
  inviteCode = null,
}) {
  const { setMessage } = useChatMessage();

  useEffect(() => {
    setMessage(
      'Hello! I am interested in the BALL platform, I will like to...'
    );
  }, [setMessage]);

  return (
    <>
      <Header />
      <HoldingSection />
      <AboutSection />
      <PropertiesRowList
        result={properties?.slice(0, 3)}
        title="Available Properties"
        viewAllLink={'/properties'}
      />
      <BenefitsSection />
      <HowItWorksSection />
      <OurServices services={allServices} />
      <FAQsSection />
      <CommunityGallery />
      <ReferralModal referralCode={referralCode} inviteCode={inviteCode} />
      <Footer />
    </>
  );
}

const HoldingSection = () => {
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
    <section className="bg-light-blue mb-n4">
      <div className="container-fluid">
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
              <p className="my-md-5 my-3 pe-md-5 pe-lg-8 text-lg text-muted">
                We have revolutionized the journey to becoming a landlord by
                aligning your income flow with our flexible property payment
                plans. With BALL, turning your dream of owning a home into
                reality is simpler and more attainable than ever before!
              </p>

              <Link href="/register" passHref>
                <a className="btn btn-secondary">Register Now</a>
              </Link>
            </Fade>
          </div>
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
                pply Now
              </h5>
              <p className="pe-md-8 pe-4 pb-4">
                Explore our quality properties and fill out the inquiry form to
                start your home ownership journey.
              </p>
            </li>
            <li className="timeline__border">
              <h5 className="text-secondary fw-normal">
                <span className="fw-bold text-secondary h3">B</span>
                egin Your Payment Plan
              </h5>
              <p className="pe-md-8 pe-4 pb-4">
                Start your personalized payment plan, tailored to your chosen
                property with BALL. You can pay in full, spread payments over
                time or pay at key milestones.
              </p>
            </li>
            <li>
              <h5 className="text-secondary fw-normal">
                <span className="fw-bold text-secondary h3">C</span>
                onvert to Home Ownership
              </h5>
              <p className="pe-md-8 pe-4 pb-4">
                Complete your payments, collect your keys, and officially become
                a landlord with BALL.
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

const OurServices = ({ services }) => {
  if (!services) {
    return null;
  }
  return (
    <section id="our-services" className="bg-light-blue my-5 py-5 pb-7">
      <div className="text-center">
        <h6 className="header-secondary text-uppercase">Additional Services</h6>
        <h3>Enriching Your Investment</h3>
      </div>
      <div className="container-fluid carousel my-4">
        <Slider {...sliderSettings}>
          {services.map((service, index) => (
            <div key={index} className="me-3 h-100">
              <ServiceCard {...service} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

const FAQsSection = () => {
  const FAQs = Object.values(FAQsContent).reduce((result, { faqs }, index) => {
    const homeFAQs = faqs.filter(({ showOnHomePage }) => showOnHomePage);
    return [...result, ...homeFAQs];
  }, []);
  return (
    <section id="faqs" className="container-fluid">
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

  const randomThreeProperties = shuffleArray(allProperties).slice(0, 3);

  return {
    props: {
      properties: randomThreeProperties,
      allServices: servicesRes.data?.result,
    },
    revalidate: 10,
  };
}

const SearchTabComponent = () => {
  const allTabs = [
    {
      title: 'Search for Properties',
      component: (
        <AdvancedSearchPropertyForm helpText="Find Your Dream Home: Start your search with your preferences" />
      ),
    },
    {
      title: 'Check Your Eligibility',
      component: <SearchEligibilityForm />,
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
