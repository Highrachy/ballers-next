import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_MEDIA } from '@/utils/constants';

const Footer = () => (
  <footer className="footer bg-dark-blue m-0">
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 col-sm-12 footer-content bg-dark-blue">
          <div className="row m-0">
            <div className="col-lg-3 col-sm-6">
              <h5>Community</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/ball-vips">About BALL VIP</Link>
                </li>
                <li>
                  <Link href="/ball-vips/all">Meet our VIPs</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-sm-6">
              <h5>About Us</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/about-us">About BALL</Link>
                </li>
                <li>
                  <Link href="/about-us">Meet the Team</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-sm-6">
              <h5>Legal</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/terms-of-use">Terms of Use</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-sm-6">
              <h5 className="pb-2 pb-lg-0">Contact Us</h5>
              <ul className="list-inline">
                {Object.entries(SOCIAL_MEDIA).map(([media, url], index) => (
                  <li
                    className="list-inline-item me-2 social-media-links"
                    key={index}
                  >
                    <a href={url || '/'}>
                      <Image
                        width="32"
                        height="32"
                        src={`/img/icons/${media}.png`}
                        alt={media}
                      />
                    </a>{' '}
                  </li>
                ))}
                <li>&nbsp;</li>
                <li>
                  <Link
                    href="mailto:info@ballers.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    info@ballers.ng
                  </Link>
                </li>
                <li>
                  <Link href="tel:+2348028337440"> +2348028337440</Link>
                </li>
                <li>
                  <Link href="tel:+2348028388185"> +2348028388185</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
