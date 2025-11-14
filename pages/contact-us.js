import React, { useEffect } from 'react';
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
import SeoHead from '@/components/utils/SeoHead';

const ContactUs = () => {
  const { setMessage, setIsVisible } = useChatMessage();

  useEffect(() => {
    setMessage('Hello! I have some questions about BALL...');
  }, [setMessage, setIsVisible]);

  return (
    <>
      <SeoHead
        title="Contact BALL | Reach Us for Support, Questions or Assistance"
        description="Get in touch with BALL for inquiries, support or assistance. Contact us via phone, WhatsApp, email or visit our Victoria Island office. We reply quickly and are ready to help."
        canonical="https://ballers.ng/contact-us"
        keywords={[
          'contact BALL',
          'ball customer support',
          'ball nigeria office',
          'ball victoria island',
          'homeownership questions nigeria',
          'ballers support',
          'contact ballers.ng',
        ]}
      />

      <Header />

      <TitleSection
        name="Contact Us"
        content={
          <>
            Do you have questions about BALL or would you like to hear more
            about the platform? <br /> Feel free to contact us by mail, phone or
            chat. We&apos;re usually pretty quick.
          </>
        }
      />

      {/* Low-content SEO helper */}
      <p className="visually-hidden">
        Contact BALL for questions about homeownership, property plans, support
        enquiries and platform assistance. Reach out by email, phone, WhatsApp
        or by visiting our Lagos office. Our team is always happy to guide you,
        explain how BALL works, help you understand payment plans, and provide
        support at any step of your homeownership journey. Whether you want to
        start your application, learn about available properties or get help
        using the platform, we are here to assist you.
      </p>

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
        {/* FORM SECTION */}
        <div className="col-lg-7 col-12">
          <div className="col-10 contact-hello-form">
            <h2 className="contact-hello-heading">Send a Message</h2>
            <SupportTicketForm buttonText="Send Message" page="Contact Us" />
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="row col-lg-5 col-12 contact-hello-info">
          <div className="col-lg-12 col-sm-6 col-12">
            <h2 className="header-secondary">Say Hello</h2>

            <h3>
              <Link href="mailto:info@ballers.ng">
                <a target="_blank" rel="noopener noreferrer nofollow">
                  info@ballers.ng
                </a>
              </Link>
            </h3>

            <h2 className="header-secondary">Call or WhatsApp</h2>

            <h4>
              <Link href="tel:+2349030200031">
                <a className="mb-2 d-block">+234 903 020 0031</a>
              </Link>
              <Link href="tel:+2348028337440">
                <a className="mb-2 d-block">+234 802 833 7440</a>
              </Link>
              <Link href="tel:+2348028388185">
                <a className="mb-3 d-block">+234 802 838 8185</a>
              </Link>
            </h4>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="col-lg-12 col-sm-6 col-12">
            <h2 className="header-secondary">Follow Us</h2>

            <ul className="list-unstyled">
              {/* Desktop list */}
              <li className="d-none d-lg-block mb-2">
                <Link
                  href="https://instagram.com/ballers.africa"
                  rel="noopener noreferrer nofollow"
                >
                  <a className="text-link">Instagram</a>
                </Link>
              </li>
              <li className="d-none d-lg-block mb-2">
                <Link
                  href="https://facebook.com/Ballerverse"
                  rel="noopener noreferrer nofollow"
                >
                  <a className="text-link">Facebook</a>
                </Link>
              </li>
              <li className="d-none d-lg-block mb-2">
                <Link
                  href="https://x.com/BALLers_ng"
                  rel="noopener noreferrer nofollow"
                >
                  <a className="text-link">Twitter</a>
                </Link>
              </li>
              <li className="d-none d-lg-block mb-2">
                <Link
                  href="https://linkedin.com/company/ballers.africa"
                  rel="noopener noreferrer nofollow"
                >
                  <a className="text-link">LinkedIn</a>
                </Link>
              </li>

              {/* Mobile icons */}
              <li className="d-block d-lg-none">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map(
                  (media) => (
                    <Link href="/" key={media}>
                      <a rel="noopener noreferrer nofollow">
                        <Image
                          width={32}
                          height={32}
                          src={`/img/icons/${media}.png`}
                          alt={`${media} icon`}
                          loading="lazy"
                        />
                      </a>
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
        <h2 className="header-secondary">Come Over for Coffee</h2>
        <h3 className="text-height-2">
          3rd Floor, Ibukun House,
          <br /> No.70 Adetokunbo Ademola Street,
          <br /> Victoria Island, Lagos.
        </h3>
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
