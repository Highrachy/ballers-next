import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { PropertyIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import PaginatedContent from 'components/common/PaginatedContent';
import Toast, { useToast } from 'components/utils/Toast';
import { useGetQuery } from 'hooks/useQuery';
import { ContentLoader } from 'components/utils/LoadingItems';
import { UserIcon } from 'components/utils/Icons';
import { getFormattedAddress } from 'utils/helpers';
import Tooltip from 'components/common/Tooltip';
import { LocalImage, OnlineImage } from 'components/utils/Image';
import { CertifiedIcon } from 'components/utils/Icons';
import { useRouter } from 'next/router';
import Sharer from '@/components/utils/Sharer';
import TitleSection from '@/components/common/TitleSection';
import { PropertiesRowList } from 'pages/properties';
import Axios from 'axios';
import SharerModal from '@/components/utils/SharerModal';
import Button from '@/components/forms/Button';

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
        name={user.vendor.companyName}
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
          <PropertiesRowList result={user?.properties} title="All Properties" />
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
  const vendorImage = user.properties?.[0]?.mainImage;
  return (
    <section className="container">
      <div className="row">
        <div className="col-md-6">
          <OnlineImage
            name="vendor logo"
            src={user.vendor.companyLogo}
            className="img-fluid"
          />

          <h3 className="vendor-company-tagline">
            {user.vendor?.tagline || 'Unlocking the Door to Your Dreams'}
          </h3>
          <p className="vendor-company-content">
            {user.vendor.about ||
              `Welcome to ${user.vendor.companyName}, your trusted partner in real estate. With our years of experience and a dedicated team, we are committed to helping you find the perfect home. Our passion for real estate drives us to deliver exceptional service and tailor-made solutions to meet your unique needs. We're here to provide the best property for you to make your real estate dreams a reality.`}
          </p>
          <Button color="secondary-light" className="mt-3">
            Get in Touch
          </Button>
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

// const ProjectStats = () => {
//   return (
//     <section className="container my-5">
//       <div className="row">
//         <SingleProjectStats title="Properties" number="10" />
//         <SingleProjectStats title="Badges" number="10" />
//         <SingleProjectStats title="Projects" number="10" />
//       </div>
//     </section>
//   );
// };

const SingleProjectStats = ({ title, number }) => (
  <div className="col-md-4">
    <h6 className="vendor-stats-title">{title}</h6>
    <div className="vendor-stats-value">{number}</div>
  </div>
);
export default VendorProfile;

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
