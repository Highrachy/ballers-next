import React from 'react';
// import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Map from 'components/common/Map';
import { OFFICE_LOCATION } from 'utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import { SupportTicketForm } from '@/components/shared/SupportTicket';
import { useChatMessage } from '@/context/ChatContext';
import { useEffect } from 'react';

const ContactUs = () => {
  const { setMessage, setIsVisible } = useChatMessage();

  useEffect(() => {
    setMessage('Hello! I have some questions about BALL...');
  }, [setMessage, setIsVisible]);

  return (
    <>
      <Header />
      <TitleSection
        name="Contact Us"
        content={
          <>
            Do you have questions about BALL or would you like to hear more
            about the platform? <br /> Then feel free to contact us by mail,
            phone or chat. We&apos;re usually pretty quick.
          </>
        }
      />
      <Content />
      <MapAndAddress />
      <CommunityGallery />
      <Footer />
    </>
  );
};

const Content = () => {
  return (
    <section className="container-fluid bg-light-blue py-6">
      <div className="row">
        <div className="col-lg-7 col-12">
          <div className="col-10 contact-hello-form">
            <h4 className="contact-hello-heading">Send a message</h4>
            <SupportTicketForm buttonText="Send Message" page="Contact Us" />
          </div>
        </div>
        <div className="row col-lg-5 col-12 contact-hello-info">
          <div className="col-lg-12 col-sm-6 col-12">
            <h4 className="header-secondary">SAY HELLO</h4>
            <h3>
              <Link href="mailto:info@ballers.ng">
                <a target="_blank" rel="noopener noreferrer">
                  info@ballers.ng
                </a>
              </Link>
            </h3>
            <h4 className="header-secondary">CALL / WHATSAPP</h4>
            <h4>
              <Link href="tel:+2349030200031">
                <a className="mb-2 d-block">+234 903 020 0031</a>
              </Link>
              <Link href="tel:+2348028337440">
                <a className="mb-2 d-block">+234 802 833 7440</a>
              </Link>
              <Link href="tel:+2348028388185">
                <a className="mb-3">+234 802 838 8185</a>
              </Link>
            </h4>
          </div>
          <div className="col-lg-12 col-sm-6 col-12">
            <h4 className="header-secondary">FOLLOW US</h4>
            <ul className="list-unstyled">
              <li className="d-none d-lg-block">
                <Link className="text-link" href="/">
                  Instagram
                </Link>
              </li>
              <li className="d-none d-lg-block">
                <Link className="text-link" href="/">
                  Facebook
                </Link>
              </li>
              <li className="d-none d-lg-block">
                <Link className="text-link" href="/">
                  Twitter
                </Link>
              </li>
              <li className="d-none d-lg-block">
                <Link className="text-link" href="/">
                  LinkedIn
                </Link>
              </li>

              <li className="d-block d-lg-none">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map(
                  (media) => (
                    <Link href="/" key={media}>
                      <Image
                        width="32"
                        height="32"
                        src={`/img/icons/${media}.png`}
                        alt={media}
                      />
                    </Link>
                  )
                )}
                &nbsp;
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapAndAddress = () => (
  <section className="container-fluid">
    <div className="row h-100 map-and-address">
      <div className="col-lg-6 col-12 my-auto text-right pr-5">
        <h4 className="header-secondary">COME OVER FOR COFFEE</h4>
        <h5 className="text-height-2">
          3rd Floor, Ibukun House,
          <br /> No.70 Adetokunbo Ademola Street, <br />
          Victoria Island, Lagos.
        </h5>
      </div>
      <div className="col-lg-6 position-relative">
        <div style={{ height: '33rem', width: '100%' }}>
          <Map coordinates={OFFICE_LOCATION} />
        </div>
      </div>
    </div>
  </section>
);

export default ContactUs;
