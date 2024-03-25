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
import SharerModal from '@/components/utils/SharerModal';
import Button from '@/components/forms/Button';
import { RecommendedPropertyLists } from '@/components/common/PropertyCard';
import Modal from '@/components/common/Modal';

const pageOptions = {
  key: 'user',
  pageName: 'User',
};

const VendorProfile = ({ user }) => {
  const [toast, setToast] = useToast();
  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <TitleSection
        name={
          <>
            {user.vendor.companyName}
            <span className="icon-xl">
              &nbsp; <CertifyIcon />
            </span>
          </>
        }
        content={getFormattedAddress({
          ...user.vendor.companyAddress,
          hideCountry: true,
        })}
      />
      <Toast {...toast} showToastOnly />
      <section className="container-fluid py-6">
        {/* <div className="float-end">
          <SharerModal />
        </div> */}
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
              {user?.badges.map((badge, index) => (
                <SingleBadge key={index} {...badge} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <ContentHeader user={user} /> */}
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

const SingleBadge = ({ image, name }) => {
  const defaultBadge =
    'https://user-images.githubusercontent.com/26963369/255422209-359b5f2b-66c6-44f6-8224-c240dc43556c.svg';
  return (
    <div className="col-sm-6 col-md-4">
      <div className="my-6">
        <div className="text-center">
          <LocalImage
            name={'Test'}
            src={image || defaultBadge}
            alt="Property"
            className="img-fluid property-holder__img"
          />
          <h5 className="text-badge">{name}</h5>
        </div>
      </div>
    </div>
  );
};

const VendorInfo = ({ user }) => {
  const DEFAULT_IMAGE =
    'https://ballers-staging.s3.amazonaws.com/63d73318936e55001633c84c/db60b150-29e9-11ee-bc39-3d92b275c69b.jpg';
  const vendorImage = user.properties?.[0]?.mainImage || DEFAULT_IMAGE;
  return (
    <section className="container">
      <div className="row">
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
              `Welcome to ${user.vendor.companyName}, your trusted partner in real estate. With our years of experience and a dedicated team, we are committed to helping you find the perfect home. Our passion for real estate drives us to deliver exceptional service and tailor-made solutions to meet your unique needs. We're here to provide the best property for you to make your real estate dreams a reality.`}
          </p>

          <div className="mt-3">
            <GetInTouch />
            <SharerModal />
          </div>

          {/* <ProjectStats user={user} /> */}
        </div>
        <div className="col-md-6">
          <OnlineImage
            name="vendor logo"
            src={vendorImage}
            className="img-fluid rounded"
          />
        </div>
      </div>
    </section>
  );
};

export const GetInTouch = () => {
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  return (
    <>
      <Button
        color="secondary-light"
        onClick={() => setShowDetailsModal(true)}
        className="me-3"
      >
        {' '}
        Get in Touch
      </Button>

      <Modal
        title="Get in Touch"
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        showFooter={false}
      >
        <section className="px-2">
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
        </section>
      </Modal>
    </>
  );
};

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

const ProjectStats = ({ user }) => {
  return (
    <section className="container my-5">
      <div className="row">
        <SingleProjectStats
          title="Properties"
          number={user?.properties.length}
        />
        <SingleProjectStats title="Badges" number={user?.badges.length} />
      </div>
    </section>
  );
};

const SingleProjectStats = ({ title, number }) => (
  <div className="col-4">
    <div className="vendor-stats-value">{addZero(number)}</div>
    <h6 className="vendor-stats-title">{title}</h6>
  </div>
);
export default VendorProfile;

// add zero if number is less than 10
function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

export async function getStaticProps({ params }) {
  const slug = params['slug'];
  const response = await Axios.get(API_ENDPOINT.getVendor(slug));

  const user = response.data.user || {};

  return {
    props: {
      user,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const response = await Axios.get(API_ENDPOINT.getAllVendors());
  const vendors = response?.data?.result;
  return {
    paths: vendors.map(({ vendor }) => ({
      params: { slug: vendor.slug },
    })),
    fallback: true,
  };
}
