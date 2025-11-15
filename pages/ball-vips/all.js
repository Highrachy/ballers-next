import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { CertifyIcon, MapPinIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import Toast, { useToast } from 'components/utils/Toast';
import { OnlineImage } from 'components/utils/Image';
import Link from 'next/link';
import TitleSection from '@/components/common/TitleSection';
import axios from 'axios';
import SeoHead from '@/components/utils/SeoHead';

const pageOptions = {
  key: 'user',
  pageName: 'User',
};

const VendorProfile = ({ result }) => {
  const [toast, setToast] = useToast();

  return (
    <>
      <SeoHead
        title="All BALL VIPs &mdash; Verified Real Estate Developers in Nigeria"
        description="Meet all BALL VIP developers and sellers. Explore trusted real estate vendors across Nigeria, verified to help you find and own your ideal home."
        canonical="https://www.ballers.ng/ball-vips/all"
      />
      <Header />
      <Toast {...toast} showToastOnly />
      <TitleSection
        name="All BALL VIPs"
        content="Connect with the best developers in the real estate space."
      />

      {/* Hidden SEO Content to Improve Page Depth */}
      <section className="visually-hidden">
        <h2>Verified Real Estate Developers and BALL VIP Partners</h2>

        <p>
          Explore all BALL VIP developers and certified property vendors across
          Nigeria. This page brings together a curated list of trusted real
          estate professionals who meet BALL’s highest standards for
          documentation integrity, transparency, project quality, and customer
          service. Every VIP partner featured here has undergone a thorough
          verification process to ensure buyers work only with reliable
          developers who deliver real value and support throughout the
          homeownership journey.
        </p>

        <p>
          The BALL VIP program highlights property companies operating in key
          markets such as Lekki, Ajah, Sangotedo, Ikoyi, Victoria Island,
          Ibeju-Lekki, Yaba, Ikeja, and Abuja. Whether you are searching for
          off-plan developments, ready-to-move-in homes, luxury residences,
          affordable starter homes or investment-friendly projects, BALL VIPs
          represent developers with a strong track record of delivering quality
          real estate solutions.
        </p>

        <p>
          Each VIP listing showcases the developer’s brand, office location,
          reputation, and property portfolio, helping buyers compare options and
          make informed decisions. Many of these partners offer flexible payment
          plans, verified land documentation, professional customer support and
          estate developments designed to meet different lifestyle and budget
          needs. With BALL, buyers avoid uncertainty and reduce the risks
          commonly associated with property purchases in Nigeria.
        </p>

        <p>
          This page is regularly updated as new developers join the BALL
          ecosystem. Newly verified partners, reputable builders, certified
          vendors and established development companies are added after
          completing BALL’s review and compliance checks. By browsing this list,
          buyers and investors gain direct access to some of the most trusted
          real estate vendors in the industry—making it easier to discover
          reliable properties, schedule inspections, start applications and move
          closer to homeownership with confidence.
        </p>

        <p>
          BALL is committed to raising the standard of real estate in Nigeria by
          promoting credible developers and offering a safe environment where
          home buyers can research, connect and make secure property decisions.
          This directory of BALL VIPs reflects our mission to simplify access to
          quality homes and empower Nigerians to own property without fear,
          confusion or misinformation.
        </p>
      </section>

      <VendorRowList results={result} />

      <Footer />
    </>
  );
};

const VendorRowList = ({ results, offset }) => {
  return (
    <div className="container-fluid mt-6">
      <div className="row">
        {results.map((user, index) => (
          <VendorComponent key={index} number={offset + index + 1} {...user} />
        ))}
      </div>
    </div>
  );
};

const VendorComponent = ({ number, ...user }) => {
  const address = user.vendor.companyAddress;
  return (
    <div className="col-md-6 col-lg-4 mb-4 vendor-container">
      <Link href={`/ball-vips/${user?.vendor?.slug}`}>
        <a className="card vendor-card">
          <div className="card-header bg-white">
            <OnlineImage
              name={user?.vendor?.companyName}
              src={user?.vendor?.companyLogo}
              width="200px"
            />
          </div>
          <div className="card-body px-4 py-3 bg-light">
            <h5 className="vendor-name fw-semibold text-single-line">
              {user?.vendor?.companyName}
              {user?.vendor?.certified && (
                <span className="text-secondary">
                  &nbsp;
                  <CertifyIcon />
                </span>
              )}
            </h5>
            <p className="text-muted text-md">
              <MapPinIcon /> {address?.city || 'Lekki'},{' '}
              {address?.state || 'Lagos'}
            </p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export async function getStaticProps() {
  const vendors = await axios.get(API_ENDPOINT.getAllVendors());

  return {
    props: {
      ...vendors?.data,
    },
    revalidate: 10,
  };
}

export default VendorProfile;
