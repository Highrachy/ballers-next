import React from 'react';
import HighrachyLogo from 'assets/img/logo/highrachy-logo.png';
import FacebookLogo from 'assets/img/icons/facebook.png';
import TwitterLogo from 'assets/img/icons/twitter.png';
import InstagramLogo from 'assets/img/icons/instagram.png';
import LinkedInLogo from 'assets/img/icons/linkedin.png';
import BallersLogo from 'assets/img/logo/ballers-logo.png';

const Footer = () => (
  <footer className="footer">
    <div className="row">
      <div className="col-lg-9 col-sm-12 footer-content bg-dark-blue pl-lg-6">
        <div className="row m-0">
          <div className="col-lg-3 col-sm-6">
            <h5>Community</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Search Properties</a>
              </li>
              <li>
                <a href="faq.php">FAQs</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-sm-6">
            <h5>About Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Our Story</a>
              </li>
              <li>
                <a href="/">Meet the Team</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-sm-6">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/terms-of-use">Terms of Use</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-sm-6">
            <h5 className="pb-2 pb-lg-0">Contact Us</h5>
            <ul className="list-unstyled">
              <li>
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
                  <img
                    src={TwitterLogo}
                    alt="twitter"
                    className="footer-icon"
                  />
                </a>
              </li>
              <li>&nbsp;</li>
              <li>
                <a
                  href="mailto:support@ballers.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  support@ballers.ng
                </a>
              </li>
              <li>
                <a href="tel:+2348076545543"> +2348076545543</a>
              </li>
              <li>
                <a href="tel:+2348094432231"> +2348094432231</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-sm-12 bg-light-blue footer-content pl-lg-5">
        <img
          src={BallersLogo}
          alt="ballers logo"
          className="ballers-logo-footer"
        />
        <p className="my-4 px-7 px-lg-0 pr-lg-6 footer-bottom-text">
          We make owning a home simpler and achievable.
        </p>
        <h5 className="highrachy-text">
          <span>An initiative of </span>
          <img
            src={HighrachyLogo}
            alt="highrachy logo"
            className="highrachy-logo-footer"
          />{' '}
        </h5>
      </div>
      {/* <div className="col-lg-12 col-sm-6 col-12 footer-normal-view">
        <span className="logo-div-text">An initiative of </span>
        <img
          src={HighrachyLogo}
          alt="highrachy logo"
          className="highrachy-logo-footer"
        />
      </div> */}
    </div>
  </footer>
);

export default Footer;
