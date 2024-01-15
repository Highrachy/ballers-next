import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { PropertyIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import PaginatedContent from 'components/common/PaginatedContent';
import { PropertiesRowList } from '../user/JustForYou';
import Toast, { useToast } from 'components/utils/Toast';
import { useGetQuery } from 'hooks/useQuery';
import { ContentLoader } from 'components/utils/LoadingItems';
import { UserIcon } from 'components/utils/Icons';
import { getFormattedAddress } from 'utils/helpers';
import Tooltip from 'components/common/Tooltip';
import Image, { OnlineImage } from 'components/utils/Image';
import { CertifiedIcon } from 'components/utils/Icons';

const pageOptions = {
  key: 'user',
  pageName: 'User',
};

const VendorProfile = ({ slug }) => {
  const [toast, setToast] = useToast();
  const [userQuery, user] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, slug],
    setToast,
    endpoint: API_ENDPOINT.getVendor(slug),
    refresh: true,
  });

  return (
    <>
      <Header />
      <Toast {...toast} showToastOnly />

      <section className="container-fluid">
        <ContentLoader
          hasContent={!!user}
          Icon={<UserIcon />}
          loadingText="Loading Vendor Information"
          query={userQuery}
          name={pageOptions.pageName}
          toast={toast}
        >
          <ContentHeader user={user} />
          <div className="row">
            {user?._id && (
              <PaginatedContent
                endpoint={API_ENDPOINT.searchProperties()}
                initialFilter={{ addedBy: user?._id }}
                pageName="Property"
                pluralPageName="Properties"
                DataComponent={PropertiesRowList}
                PageIcon={<PropertyIcon />}
                queryName="property"
                hideTitle
              />
            )}
          </div>
        </ContentLoader>
      </section>

      <Footer />
    </>
  );
};

const ContentHeader = ({ user }) => {
  return (
    <>
      <div className="row mt-5">
        <div className="col-sm-9">
          <div className="d-flex">
            <div className="company-avatar-container">
              <OnlineImage
                name="BALL VIP logo"
                src={user.vendor.companyLogo}
                className="avatar-company"
              />
              <div className="certified-icon">
                <Tooltip text="Certified BALL VIP">
                  <CertifiedIcon />
                </Tooltip>
              </div>
            </div>

            <div>
              <h5 className="mb-0 mt-3">{user.vendor.companyName}</h5>
              <p className="text-secondary text-small mt-2">View Badges</p>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <h6 className="mb-2 text-secondary">Office Address</h6>
          <p className="text-gray">
            {getFormattedAddress({
              ...user.vendor.companyAddress,
              hideCountry: true,
            })}
          </p>
        </div>
      </div>
    </>
  );
};

export default VendorProfile;
