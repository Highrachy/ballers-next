import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { CertifyIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import Toast, { useToast } from 'components/utils/Toast';
import { getFormattedAddress } from 'utils/helpers';
import { LocalImage, OnlineImage } from 'components/utils/Image';
import TitleSection from '@/components/common/TitleSection';
import Axios from 'axios';
import Button from '@/components/forms/Button';
import { RecommendedPropertyLists } from '@/components/common/PropertyCard';
import Modal from '@/components/common/Modal';
import ShareButton from '@/components/common/ShareButton';
import SeoHead from '@/components/utils/SeoHead';

const VendorProfile = ({ user }) => {
  const [toast, setToast] = useToast();

  // Fallback for fallback: true pages
  if (!user || !user.vendor) {
    return (
      <>
        <Header />
        <TitleSection name="Loading Vendor..." content="Please wait" />
        <Footer />
      </>
    );
  }

  const title = `${user.vendor.companyName} — BALL VIP Developer Profile`;
  const description =
    user.vendor.about ||
    `${user.vendor.companyName} is a trusted BALL VIP real estate partner offering verified properties, trusted development, and premium projects.`;
  const canonical = `https://www.ballers.ng/ball-vips/${user.vendor.slug}`;

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonical={canonical}
        ogImage={user.vendor.companyLogo}
      />

      {/* Hidden low-content SEO filler */}
      <section style={{ display: 'none' }}>
        <div className="h2">
          {user.vendor.companyName} Real Estate Developer Overview
        </div>
        <p>
          {user.vendor.companyName} is one of the premium BALL VIP real estate
          developers providing verified homes, quality construction, and
          transparent service delivery across multiple Nigerian markets. The
          organisation focuses on helping homebuyers navigate the property
          market confidently through verified listings, trusted documentation,
          and fully managed purchase support.
        </p>

        <p>
          As a certified BALL VIP partner, {user.vendor.companyName} has passed
          strict verification checks for identity, track record, delivery
          history, and development quality. Homebuyers engaging with this vendor
          enjoy a secure and transparent process backed by the BALL ecosystem.
        </p>

        <p>
          Their property listings typically include modern apartments, duplexes,
          terraces, luxury homes, off-plan projects, and residential estates.
          Buyers benefit from flexible payment plans, verified documentation,
          and after-purchase support. The vendor&apos;s focus areas include
          communities such as Lekki, Ajah, Sangotedo, Ibeju-Lekki, Victoria
          Island, and other premium locations depending on current inventory.
        </p>

        <h3>Services Offered</h3>
        <ul>
          <li>Verified off-plan and completed properties</li>
          <li>Flexible payment plans</li>
          <li>Document verification and due diligence</li>
          <li>Construction oversight and project transparency</li>
          <li>Dedicated customer support via the BALL platform</li>
        </ul>
      </section>

      <Header />
      <TitleSection
        name={
          <>
            {user.vendor.companyName}
            {user.vendor.certified && (
              <span className="icon-xl">
                &nbsp; <CertifyIcon />
              </span>
            )}
          </>
        }
        content={getFormattedAddress(
          { ...user.vendor.companyAddress, hideCountry: true },
          true
        )}
      />

      <Toast {...toast} showToastOnly />

      <section className="container-fluid py-6">
        <div className="row">
          <div className="col-md-8 col-10 mx-auto">
            <VendorInfo user={user} />
          </div>
        </div>
      </section>

      <div className="container-fluid bg-light">
        <div className="row">
          <div className="col-md-8 col-10 mx-auto">
            <div className="row">
              {user?.badges?.map((badge, index) => (
                <SingleBadge key={index} {...badge} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 col-10 mx-auto">
          <VendorPropertiesRowList
            result={user?.properties}
            title="All Properties"
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

/* ---------------- BADGES ---------------- */

const SingleBadge = ({ image, name }) => {
  const defaultBadge =
    'https://user-images.githubusercontent.com/26963369/255422209-359b5f2b-66c6-44f6-8224-c240dc43556c.svg';
  return (
    <div className="col-sm-6 col-md-4">
      <div className="my-6 text-center">
        <LocalImage
          name={name}
          src={image || defaultBadge}
          alt={name}
          className="img-fluid property-holder__img"
        />
        <h5 className="text-badge">{name}</h5>
      </div>
    </div>
  );
};

/* ---------------- VENDOR INFO ---------------- */

const VendorInfo = ({ user }) => {
  const DEFAULT_IMAGE =
    'https://ballers-staging.s3.amazonaws.com/63d73318936e55001633c84c/db60b150-29e9-11ee-bc39-3d92b275c69b.jpg';

  const vendorImage = user.properties?.[0]?.mainImage || DEFAULT_IMAGE;

  return (
    <section className="container">
      <div className="row mb-4">
        <div className="col-12">
          <OnlineImage
            name="BALL VIP logo"
            src={user.vendor.companyLogo}
            className="img-fluid"
            style={{ maxWidth: '250px' }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h3 className="vendor-company-tagline">
            {user.vendor?.tagline || 'Unlocking the Door to Your Dreams'}
          </h3>

          <p className="vendor-company-content">
            {user.vendor.about ||
              `Welcome to ${user.vendor.companyName}, your trusted partner in real estate. We are committed to helping you find the perfect home with expert service and verified listings.`}
          </p>

          <div className="mt-3">
            <GetInTouch />
            <ShareButton />
          </div>
        </div>

        <div className="col-md-6">
          <OnlineImage
            name="vendor property"
            src={vendorImage}
            className="img-fluid rounded"
          />
        </div>
      </div>
    </section>
  );
};

/* ---------------- CONTACT MODAL ---------------- */

export const GetInTouch = () => {
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);

  return (
    <>
      <Button
        color="secondary"
        onClick={() => setShowDetailsModal(true)}
        className="me-3 mt-3"
      >
        Get in Touch
      </Button>

      <Modal
        title="Get in Touch"
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        showFooter={false}
      >
        <section className="px-2">
          <form method="post">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input type="text" className="form-control" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input type="email" className="form-control" required />
            </div>

            <div className="form-group">
              <label>Your Message *</label>
              <textarea className="form-control" required />
            </div>

            <button type="submit" className="btn btn-secondary">
              Send Message
            </button>
          </form>
        </section>
      </Modal>
    </>
  );
};

/* ---------------- PROPERTIES ---------------- */

export const VendorPropertiesRowList = ({ result, title }) => {
  return result && result.length > 0 ? (
    <div className="container-fluid">
      {title && <h3 className="mt-7 mb-4">{title}</h3>}
      <div className="row">
        <RecommendedPropertyLists
          propertyClassName="col-sm-6 col-lg-6 col-xl-6"
          properties={result}
          isPublic
        />
      </div>
    </div>
  ) : null;
};

/* ---------------- NEXT.JS DATA ---------------- */

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const response = await Axios.get(API_ENDPOINT.getVendor(slug));
  const user = response.data.user || null;

  return {
    props: { user },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const response = await Axios.get(API_ENDPOINT.getAllVendors());
  const vendors = response?.data?.result || [];

  return {
    paths: vendors.map(({ vendor }) => ({
      params: { slug: vendor.slug },
    })),
    fallback: true,
  };
}

export default VendorProfile;
