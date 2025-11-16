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

const VendorProfile = ({ result }) => {
  const [toast, setToast] = useToast();

  return (
    <>
      <SeoHead
        title="BALL VIPs | Trusted Real Estate Developers in Nigeria"
        description="Meet BALL VIP developers and sellers. Find verified and trusted property vendors across Nigeria to help you buy your ideal home safely and confidently."
        canonical="https://www.ballers.ng/ball-vips/all"
        keywords={[
          'BALL VIP developers',
          'verified real estate Nigeria',
          'trusted property sellers',
          'Lagos developers',
          'Lekki real estate',
          'property investment Nigeria',
        ]}
      />
      <Header />
      <Toast {...toast} showToastOnly />
      <TitleSection
        name="All BALL VIPs"
        content="Connect with the best developers in the real estate space."
      />

      {/* Hidden SEO Section for readability and page depth */}
      <section className="visually-hidden">
        <h2>Verified Real Estate Developers and BALL VIP Partners</h2>

        <p>
          Explore all BALL VIP developers and certified property sellers in
          Nigeria. Every partner is checked for trust, proper documents, and
          quality. This makes property search safer and easier for buyers and
          investors.
        </p>

        <p>
          VIP developers operate in key areas like Lekki, Ajah, Sangotedo,
          Ikoyi, Victoria Island, Ibeju-Lekki, Yaba, Ikeja, and Abuja. They
          offer off-plan projects, ready homes, luxury houses, starter homes,
          and investment properties for different budgets.
        </p>

        <p>
          Each listing shows the company name, office address, reputation, and
          property portfolio. Many VIPs offer flexible payment plans, verified
          documents, dedicated support, and options to meet buyer needs.
        </p>

        <p>
          The list updates regularly as new developers and certified vendors
          join BALL. Buyers and investors can view contacts, schedule visits,
          submit applications, and make confident decisions.
        </p>

        <p>
          BALL promotes trusted developers and provides a safe platform for
          buyers. Explore BALL VIPs to find reliable vendors and own property
          without confusion or risk.
        </p>

        <p>
          Many VIP developers also provide extra services such as design advice,
          project updates, and after-sale support. This helps homebuyers at
          every step of buying a property.
        </p>

        <p>
          Buyers can filter properties by type, location, price, and features.
          Verified listings, clear pricing, and trustworthy vendor information
          help users make safe decisions quickly.
        </p>

        <p>
          The BALL VIP program features developers focused on quality, honesty,
          and customer satisfaction. Each partner is reviewed to ensure
          compliance with rules, construction standards, and good business
          practices.
        </p>

        <p>
          Choosing BALL VIP developers reduces risk. Buyers get verified
          properties, flexible payment options, and professional support. The
          platform connects buyers directly to developers for a smoother path to
          homeownership.
        </p>
      </section>

      <VendorRowList results={result} />

      <Footer />
    </>
  );
};

const VendorRowList = ({ results, offset = 0 }) => (
  <div className="container-fluid mt-6">
    <div className="row">
      {results.map((user, index) => (
        <VendorComponent key={index} number={offset + index + 1} {...user} />
      ))}
    </div>
  </div>
);

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
