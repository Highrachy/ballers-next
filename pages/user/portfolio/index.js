import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { PropertyIcon } from 'components/utils/Icons';
import PortfolioCards from 'components/common/PortfolioCards';
import { OffersRow, OffersRowList } from 'components/shared/Offers';
import { API_ENDPOINT } from 'utils/URL';
import { OfferIcon } from 'components/utils/Icons';
import PaginatedContent from 'components/common/PaginatedContent';
import { PropertiesRowList } from '@/components/common/PropertiesRowList';
import { Home } from 'iconsax-react';
import WelcomeHero from '@/components/common/WelcomeHero';
import { InfoBox } from '@/components/dashboard/InfoBox';
import { DashboardTable } from '@/components/dashboard/DashboardTable';
import TabContent from '@/components/dashboard/TabContent';

const Portfolio = () => {
  const [toast, setToast] = useToast();
  const allTabs = [
    {
      title: 'Portfolios',
      component: (
        <div className="container-fluid">
          <div className="row mt-5">
            <PortfolioCards setToast={setToast} />

            <EnjoyingBallers />
          </div>
        </div>
      ),
    },
    {
      title: 'Offers',
      component: (
        <div className="container-fluid">
          <h3 className="mt-5 mb-4">All Offers</h3>
          <PaginatedContent
            endpoint={API_ENDPOINT.getAllOffers()}
            pageName="Offer"
            pluralPageName="Offers"
            DataComponent={OfferLetterList}
            PageIcon={<OfferIcon />}
            queryName="offer"
            hideTitle
          />
        </div>
      ),
    },
  ];
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title="My Portfolio"
        subtitle="Your Properties and Offers: A Record of Your BALL Journey"
      />
      <TabContent allTabs={allTabs} />
      <AdditionalContent setToast={setToast} />
    </BackendPage>
  );
};

const AdditionalContent = () => {
  return (
    <>
      {/* show this if portfolio is empty */}
      <div className="container-fluid">
        <h4 className="mt-5 ps-3">Just for you</h4>
        <PaginatedContent
          endpoint={API_ENDPOINT.searchProperties()}
          // initialFilter={filter}
          pageName="Property"
          pluralPageName="Properties"
          DataComponent={PropertiesRowList}
          PageIcon={<PropertyIcon />}
          queryName="property"
          limit={2}
          hidePagination
          hideTitle
        />
      </div>
    </>
  );
};

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

const EnjoyingBallers = () => (
  <div className="mt-n5">
    <InfoBox
      color="primary"
      title="Enjoying your balling experience"
      Icon={<Home variant="Bulk" />}
      linkHref={'user/refer'}
      linkText="Add a New Property"
    >
      {/* With BALL, you can easily build a diverse portfolio of quality homes in
      well-planned communities that offer comfort and security. */}
      Start your journey towards financial freedom today and become a BALLer
      with multiple properties.
    </InfoBox>
  </div>
);

export const OfferLetterList = ({ results, offset }) => {
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

export default Portfolio;
