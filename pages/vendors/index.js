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
import { OnlineImage } from 'components/utils/Image';
import { CertifiedIcon } from 'components/utils/Icons';
import { PropertiesRowList } from 'pages/user/just-for-you';
import Link from 'next/link';
import UserCard from '@/components/common/UserCard';
import { Card } from 'react-bootstrap';
import { USER_TYPES } from '@/utils/constants';
import { getUserStatus } from '@/components/pages/admin/Users';
import Humanize from 'humanize-plus';
import Button from '@/components/forms/Button';
import TitleSection from '@/components/common/TitleSection';

const pageOptions = {
  key: 'user',
  pageName: 'User',
};

const VendorProfile = ({ slug = 'blissville' }) => {
  const [toast, setToast] = useToast();
  const [userQuery, user] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, slug],
    setToast,
    endpoint: API_ENDPOINT.getAllVendors(),
    refresh: true,
  });

  return (
    <>
      <Header />
      <Toast {...toast} showToastOnly />
      <TitleSection
        name="All Vendors"
        content="Connect with the best developers in the real estate space."
      />

      <section className="container-fluid">
        <PaginatedContent
          endpoint={API_ENDPOINT.getAllVendors()}
          initialFilter={{
            sortBy: 'createdAt',
            sortDirection: 'desc',
          }}
          limit="20"
          pageName="Vendor"
          DataComponent={UsersRowList}
          PageIcon={<UserIcon />}
          queryName="vendor"
        />
      </section>

      <Footer />
    </>
  );
};

const UsersRowList = ({ results, offset }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {results.map((user, index) => (
          <VendorComponent
            key={index}
            number={offset + index + 1}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

const UsersRow = ({ number, ...user }) => {
  const status = getUserStatus(user);
  // if (!user.vendor.companyLogo) return null;

  return (
    <div className="col-md-4 col-lg-3 mb-5">
      <div className="card">
        <div
          style={{
            height: '100px',
            textAlign: 'center',
            margin: '1rem',
            paddingTop: '1rem',
          }}
        >
          <OnlineImage src={user?.vendor?.companyLogo} width="200px" />
        </div>
        <div className="card-body bg-light">
          <h5 className="card-title">{user.vendor.companyName}</h5>
          <Button
            className="btn-sm px-3 mt-3"
            color="secondary"
            href={`/vendors/${user?.vendor?.slug}`}
          >
            View Vendor
          </Button>
        </div>
      </div>
    </div>
  );
};

const VendorComponent = ({ user }) => {
  return (
    <div className="vendor vendor-grid-item vendor-grid-item col-md-4 col-lg-3 mb-5">
      <div className="vendor-inner">
        <div className="vendor-image">
          <Link href={`/vendors/${user?.vendor?.slug}`}>
            <a>
              <div className="vendor-logo">
                <OnlineImage src={user?.vendor?.companyLogo} width="200px" />
              </div>
              <div className="vendor-hover-logo">
                <OnlineImage src={user?.vendor?.companyLogo} width="200px" />
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
