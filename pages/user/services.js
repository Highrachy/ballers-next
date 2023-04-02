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
import { DashboardTable, InfoBox, ServiceBox, WelcomeHero } from './dashboard';
import { Card } from 'react-bootstrap';
import colorTokens from 'style-dictionary/build/color.tokens';
import { Global, Home } from 'iconsax-react';

export const allServices = [
  {
    title: 'Survey plan investigation',
    content: `Before buying a property, it's important to investigate the survey plan to ensure the property is correctly documented and there are no boundary disputes.`,
    price: '50,000',
  },
  {
    title: 'Title validity checks',
    content: `Conducting title validity checks is crucial in ensuring that the property you are purchasing has a clear and marketable title, without any liens or encumbrances.`,
    price: '50,000',
  },
  {
    title: 'Mortgage prequalification',
    content: `Mortgage prequalification is a process of evaluating your financial status to determine how much you can afford to borrow for a property purchase. We will guide you here.`,
    price: '20,000',
  },
  {
    title: 'Property appraisal and valuation',
    content: `Property appraisal and valuation is the process of determining the fair market value of a property, which is essential for setting a competitive price for sale or purchase.`,
    price: '250,000',
  },
  {
    title: 'Structural integrity tests',
    content: `Conducting structural integrity tests help in assessing the structural soundness of the property, identifying potential defects or damages, and ensuring the safety of the occupants.`,
    price: '400,000',
  },
  {
    title: 'Power audits',
    content: `Power audits help in assessing the energy consumption patterns of a property and identifying ways to optimize energy efficiency, reduce costs, and minimize the environmental impact.`,
    price: '1,000,000',
  },
  {
    title: 'Expert advisory and consultancy',
    content: `Expert advisory and consultancy services offer professional advice and guidance on various aspects of real estate transactions, including legal, financial, and technical matters.`,
    price: '50,000',
  },
];
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

const Content = ({ setToast }) => (
  <>
    <div className="container-fluid">
      <div className="row mt-5">
        <h4>Value Added Services</h4>
        {allServices.map(({ title, content, price }) => (
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

const Offers = () => (
  <PaginatedContent
    endpoint={API_ENDPOINT.getAllOffers()}
    pageName="Offer"
    pluralPageName="Offers"
    DataComponent={TransactionHistory}
    PageIcon={<OfferIcon />}
    queryName="offer"
    hideTitle
  />
);

const EnjoyingBallers = () => (
  <InfoBox
    color="primary"
    title="Enjoying your balling experience"
    Icon={<Home variant="Bulk" />}
    linkHref={'user/refer'}
    linkText="Add a New Property"
  >
    With BALL, you can easily build a diverse portfolio of quality homes in
    well-planned communities that offer comfort and security. Start your journey
    towards financial freedom today and become a BALLer with multiple
    properties.
  </InfoBox>
);

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
