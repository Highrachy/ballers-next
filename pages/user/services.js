import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Link from 'next/link';
import Toast, { useToast } from 'components/utils/Toast';
import { BgWave, PropertyIcon, VasIcon } from 'components/utils/Icons';
import PortfolioCards from 'components/common/PortfolioCards';
import { OffersRow, OffersRowList } from 'components/shared/Offers';
import { API_ENDPOINT } from 'utils/URL';
import { OfferIcon } from 'components/utils/Icons';
import PaginatedContent from 'components/common/PaginatedContent';
import { PropertiesRowList } from '@/components/common/PropertiesRowList';
import { Card } from 'react-bootstrap';
import colorTokens from 'style-dictionary/build/color.tokens';
import { Global, Home } from 'iconsax-react';
import { InfoBox } from '@/components/dashboard/InfoBox';
import WelcomeHero from '@/components/common/WelcomeHero';
import ServiceBox from '@/components/dashboard/ServiceBox';
import { DashboardTable } from '@/components/dashboard/DashboardTable';
import { moneyFormatInNaira } from '@/utils/helpers';
import { USER_TYPES } from '@/utils/constants';
import { VasRequestsList } from '@/components/shared/VasRequests';
import { UserContext } from 'context/UserContext';

const Services = () => {
  const [toast, setToast] = useToast();
  const { userState } = React.useContext(UserContext);
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title="Services"
        subtitle="Discover value-added services that enhance your real estate experience."
      />

      <VasRequestsList />
      <PaginatedContent
        endpoint={API_ENDPOINT.getAllVas()}
        initialFilter={{ assignedRole: userState?.role || USER_TYPES?.user }}
        pageName="Service"
        DataComponent={ServiceRowList}
        PageIcon={<VasIcon />}
        queryName="vas"
        hideTitle
      />
      <div className="container-fluid">
        <InfoBox
          color="primary"
          title="Need more information?"
          Icon={<Global variant="Bulk" />}
          linkHref={'user/refer'}
          linkText="Contact Us"
        >
          Looking for more information or have questions about our services?
          Don&apos;t hesitate to contact us! Our team is always here to help and
          provide the support you need.
        </InfoBox>
      </div>
    </BackendPage>
  );
};

const ServiceRowList = ({ results, setToast }) => (
  <>
    <div className="container-fluid">
      <div className="row mt-5">
        <h4>All Services</h4>
        {results.map(({ _id, name, description, price }) => (
          <div className="col-sm-6 mt-4" key={name}>
            <div className="widget card widget-box p-0">
              <ServiceBox
                link={`/user/service/${_id}`}
                title={name}
                price={moneyFormatInNaira(price)}
                content={description}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);
export default Services;
