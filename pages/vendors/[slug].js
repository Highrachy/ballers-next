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
import { useRouter } from 'next/router';
import Sharer from '@/components/utils/Sharer';

const pageOptions = {
  key: 'user',
  pageName: 'User',
};

const VendorProfile = () => {
  const router = useRouter();
  const { asPath } = useRouter();
  const { slug } = router.query;
  const [toast, setToast] = useToast();
  const [userQuery, user] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, slug],
    setToast,
    endpoint: API_ENDPOINT.getVendor('blissville' || slug),
    refresh: true,
  });

  return (
    <>
      <Header />
      <Toast {...toast} showToastOnly />

      <section className="container-fluid">
        <div className="d-flex flex-row justify-content-end pe-5 pt-6 align-items-center">
          <div className="pe-3">Share Vendor:</div>
          <Sharer
            shareUrl={`${process.env.NEXT_PUBLIC_HOST}${asPath}`}
            content={'This property will be shared on social media networks'}
            contentBody={
              'This property will be shared on social media networks'
            }
          />
        </div>
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
                name="vendor logo"
                src={user.vendor.companyLogo}
                className="avatar-company"
              />
              <div className="certified-icon">
                <Tooltip text="Certified Vendor">
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
