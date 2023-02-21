import React from 'react';
// import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import FacebookLogo from 'assets/img/icons/facebook.png';
import TwitterLogo from 'assets/img/icons/twitter.png';
import InstagramLogo from 'assets/img/icons/instagram.png';
import LinkedInLogo from 'assets/img/icons/linkedin.png';
import Map from 'components/common/Map';
import { OFFICE_LOCATION } from 'utils/constants';

const ContactUs = () => (
  <>
    <Header />
    <TitleSection
      name="Contact Us"
      content={
        <>
          Do you have questions about BALL or would you like to hear more about
          the platform? <br /> Then feel free to contact us by mail, phone or
          chat. We're usually pretty quick.
        </>
      }
    />
    <Content />
    <MapAndAddress />
    <CommunityGallery />
    <Footer />
  </>
);

const Content = () => (
  <section className="container-fluid bg-light-blue py-6">
    <div className="row">
      <div className="col-lg-6 col-12">
        <div className="col-10 contact-hello-form">
          <h4 className="contact-hello-heading">Send a message</h4>
          <form method="post" data-toggle="validator">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                className="form-control"
                id="contact-name"
                name="name"
                required
              />
              <small className="help-block with-errors text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input
                type="email"
                className="form-control"
                id="contact-email"
                name="email"
                required
              />
              <small className="help-block with-errors text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message *</label>
              <textarea
                className="form-control"
                id="contact-message"
                name="message"
                required
              />
              <small className="help-block with-errors text-danger" />
            </div>
            <button type="submit" className="btn btn-secondary">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <div className="row col-lg-6 col-12 contact-hello-info">
        <div className="col-lg-12 col-sm-6 col-12">
          <h4 className="header-secondary">SAY HELLO</h4>
          <h3>
            <a
              href="mailto:hello@ballers.ng"
              className="text-primary fw-normal"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@ballers.ng
            </a>
          </h3>
        </div>
        <div className="col-lg-12 col-sm-6 col-12">
          <h5 className="my-5">Follow us in our everyday lives</h5>
          <ul className="list-unstyled">
            <li className="d-none d-lg-block">
              <a className="text-link" href="/">
                Instagram
              </a>
            </li>
            <li className="d-none d-lg-block">
              <a className="text-link" href="/">
                Facebook
              </a>
            </li>
            <li className="d-none d-lg-block">
              <a className="text-link" href="/">
                Twitter
              </a>
            </li>
            <li className="d-none d-lg-block">
              <a className="text-link" href="/">
                LinkedIn
              </a>
            </li>

            <li className="d-block d-lg-none">
              <a href="/">
                <img
                  src={LinkedInLogo}
                  alt="linkedin"
                  className="footer-icon"
                />
              </a>{' '}
              &nbsp;
              <a href="/">
                <img
                  src={InstagramLogo}
                  alt="instagram"
                  className="footer-icon"
                />
              </a>{' '}
              &nbsp;
              <a href="/">
                <img
                  src={FacebookLogo}
                  alt="facebook"
                  className="footer-icon"
                />
              </a>{' '}
              &nbsp;
              <a href="/">
                <img src={TwitterLogo} alt="twitter" className="footer-icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const MapAndAddress = () => (
  <section className="container-fluid">
    <div className="row h-100 map-and-address">
      <div className="col-lg-6 col-12 my-auto text-end pe-5">
        <h4 className="header-secondary">COME OVER FOR COFFEE</h4>
        <h5 className="text-height-2">
          5th Floor, Ibukun House,
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
