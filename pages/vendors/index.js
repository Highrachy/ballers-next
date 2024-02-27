import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { CertifyIcon, MapPinIcon, PropertyIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import PaginatedContent from 'components/common/PaginatedContent';
import Toast, { useToast } from 'components/utils/Toast';
import { useGetQuery } from 'hooks/useQuery';
import { ContentLoader } from 'components/utils/LoadingItems';
import { UserIcon } from 'components/utils/Icons';
import { getFormattedAddress } from 'utils/helpers';
import Tooltip from 'components/common/Tooltip';
import { OnlineImage } from 'components/utils/Image';
import { CertifiedIcon } from 'components/utils/Icons';
import { PropertiesRowList } from 'pages/user/just-for-you';
import Link from 'next/link';
import TitleSection from '@/components/common/TitleSection';
import axios from 'axios';

const pageOptions = {
  key: 'user',
  pageName: 'User',
};

const VendorProfile = ({ result }) => {
  const [toast, setToast] = useToast();

  return (
    <>
      <Header />
      <Toast {...toast} showToastOnly />
      <TitleSection
        name="All BALL VIPs"
        content="Connect with the best developers in the real estate space."
      />

      <section className="container-fluid">
        <VendorRowList results={result} />
      </section>

      <Footer />
    </>
  );
};

const VendorRowList = ({ results, offset }) => {
  return (
    <div className="container-fluid">
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
      <Link href={`/vendors/${user?.vendor?.slug}`}>
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
