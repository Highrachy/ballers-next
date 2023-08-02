import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Link from 'next/link';
import Toast, { useToast } from 'components/utils/Toast';
import { BgWave, PropertyIcon } from 'components/utils/Icons';
import PortfolioCards from 'components/common/PortfolioCards';
import { OffersRow, OffersRowList } from 'components/shared/Offers';
import { API_ENDPOINT } from 'utils/URL';
import { OfferIcon } from 'components/utils/Icons';
import PaginatedContent from 'components/common/PaginatedContent';
import { PropertiesRowList } from '@/components/common/PropertiesRowList';
import { Card } from 'react-bootstrap';
import colorTokens from 'style-dictionary/build/color.tokens';
import { Global, Home } from 'iconsax-react';
import { allServices } from 'pages/user/services';
import WelcomeHero from '@/components/common/WelcomeHero';
import { InfoBox } from '@/components/dashboard/InfoBox';
import ServiceBox from '@/components/dashboard/ServiceBox';
import { DashboardTable } from '@/components/dashboard/DashboardTable';

const Services = () => {
  const [toast, setToast] = useToast();
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title="Value Added Services"
        subtitle="Discover value-added services that enhance your real estate experience."
      />
      <Content setToast={setToast} />
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

// get last 3 services from allServices
const lastThreeServices = allServices.slice(-3);

const Content = ({ setToast }) => (
  <>
    <div className="container-fluid">
      <div className="row mt-5">
        <h4>Value Added Services</h4>

        {lastThreeServices.map(({ title, content, price }) => (
          <div className="col-sm-6 mt-4" key={title}>
            <div className="widget card widget-box p-0">
              <ServiceBox
                link="/services/title-validity"
                title={title}
                price={price}
                content={content}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

// const EnjoyingBallers = () => (
//   <section className="container-fluid">
//     <div className="card bg-primary dashboard mt-4 mb-3">
//       <div className="row py-4">
//         <div className="col-sm-8">
//           <h4>Enjoying your balling experience </h4>
//           <p className="lead">Expand your portfolio today</p>
//         </div>
//         <div className="col-sm-4">
//           <section className="property-btn">
//             <Link href="/user/just-for-you" className="btn btn-secondary">
//               + Add a New Property
//             </Link>
//           </section>
//         </div>
//       </div>
//     </div>
//   </section>
// );

export const TransactionHistory = ({ results, offset }) => {
  return (
    <DashboardTable title={`${results.length} Offer`}>
      {!results || results.length === 0 ? (
        <tr>
          <td colSpan="5">
            <div className="py-4 mt-2 text-md text-center text-gray-700">
              You have no offer letter
            </div>
          </td>
        </tr>
      ) : (
        results?.map((offer, index) => (
          <OffersRow key={index} number={offset + index + 1} {...offer} />
        ))
      )}
    </DashboardTable>
  );
};

export default Services;
