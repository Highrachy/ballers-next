import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { API_ENDPOINT } from 'utils/URL';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { OnlineImage } from '@/components/utils/Image';
import { moneyFormatInNaira } from '@/utils/helpers';
import { VAS_ROLE, VAS_ROLE_TYPE, VAS_TYPE } from '@/utils/constants';
import SeoHead from '@/components/utils/SeoHead';

const AllServices = ({ result }) => {
  const [filteredResult, setFilteredResult] = React.useState(result);
  const [activeFilter, setActiveFilter] = React.useState({});

  const handleFilter = (type, value) => {
    let filtered = result;
    setActiveFilter({ [type]: value });

    if (value === activeFilter?.[type]) {
      clearFilter();
      return;
    }

    if (type === 'price') {
      if (value === 'Free') {
        filtered = result.filter((service) => service.price === 0);
      } else if (value === 'Premium') {
        filtered = result.filter((service) => service.price > 0);
      }
    } else if (type === 'type') {
      filtered = result.filter((service) => service[type] === value);
    } else if (type === 'assignedRole') {
      filtered = result.filter(
        (service) =>
          service[type] === value || service[type] === VAS_ROLE_TYPE.ALL
      );
    }

    setFilteredResult(filtered);
  };

  const clearFilter = () => {
    setActiveFilter({});
    setFilteredResult(result);
  };

  return (
    <>
      <SeoHead
        title="BALL Services | Explore Our Property & Real Estate Solutions"
        description="Discover all services offered by BALL, including property management, VIP solutions, homebuyer support, and real estate tools. Find services tailored for you."
        canonical="https://www.ballers.ng/services"
        keywords={[
          'BALL services',
          'property management Nigeria',
          'homebuyer services',
          'VIP real estate tools',
          'property solutions Nigeria',
        ]}
      />

      <Header />
      <TitleSection
        name="Our Services"
        content="The only realistic burden free process of owning your ideal home."
      />

      {/* Hidden SEO section */}
      <section className="visually-hidden">
        <h2>Explore Services Offered by BALL</h2>
        <p>
          BALL provides a wide range of services for homebuyers, property
          owners, and VIP users across Lagos and Nigeria. From property
          management to exclusive VIP tools, our services are designed to
          simplify the journey to homeownership.
        </p>
        <p>
          Users can access property listing management, investment guidance, and
          analytics tools that help monitor engagement and sales. BALL services
          ensure maximum visibility and efficiency for both sellers and buyers.
        </p>
        <p>
          Our VIP solutions offer advanced features such as priority support,
          featured listings, and collaborative tools for teams and agencies.
          Homebuyers benefit from educational resources and personalized
          assistance.
        </p>
        <p>
          By leveraging BALL services, individuals and businesses can streamline
          property transactions, enhance investment potential, and make informed
          decisions in the real estate market.
        </p>
        <p>
          Start exploring our services today to manage properties, access tools
          for buying and selling, and join a community dedicated to successful
          homeownership and real estate investment in Nigeria.
        </p>
      </section>
      <h3 className="mt-7 mb-4 text-center">Available Services</h3>
      <FilterSection
        onFilter={handleFilter}
        activeFilter={activeFilter}
        onClearFilter={clearFilter}
      />
      <ServicesRowList result={filteredResult} />
      <CommunityGallery />
      <Footer />
    </>
  );
};

export const ServicesRowList = ({ result }) => {
  return result && result.length > 0 ? (
    <div className="container-fluid">
      <div className="row row-eq-height">
        {result.map((service, index) => (
          <div className="col-sm-6 col-lg-4 mb-5" key={index}>
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export const ServiceCard = ({
  name,
  image,
  slug,
  assignedRole,
  old_price,
  price,
  description,
}) => (
  <Card className="h-100 card-container property-card mb-2">
    <Link href={`/services/${slug}`}>
      <article>
        <div className="content-image">
          <OnlineImage
            name={name}
            src={`/img/services/${image}`}
            alt={`Service: ${name}`}
            className="img-fluid property-holder__img"
          />
        </div>
        <div className="property-item">
          <h5 className="property-name mb-2 text-secondary">{name}</h5>
          {/* Price */}
          {false && (
            <>
              <h5 className="property-name mb-2">{name}</h5>
              <h5 className="property-price mb-1 d-flex">
                <span>{moneyFormatInNaira(price)}</span>
                <span className="text-soft ms-2 text-price-strike">
                  {moneyFormatInNaira(old_price)}
                </span>
              </h5>
            </>
          )}

          <p className="text-primary text-md mt-2">
            Recommended for {VAS_ROLE[assignedRole]}
          </p>
          {/* Info with Icons */}
          <div className="property-holder__separator my-3"></div>
          <div className="text-muted property-spacing">{description}</div>

          {/* View Button */}
          <div className="mt-4">
            <button className="btn btn-sm btn-wide btn-secondary-light">
              View Details
            </button>
          </div>
        </div>
      </article>
    </Link>
  </Card>
);

const FilterSection = ({ onFilter, activeFilter, onClearFilter }) => {
  const handleFilter = (type, value) => {
    onFilter(type, value);
  };

  const handleClearFilters = () => {
    onClearFilter();
  };

  // Define an array of filter options
  const filterOptions = [
    { type: 'price', label: 'Free' },
    { type: 'price', label: 'Premium' },
    { type: 'assignedRole', label: 'Homebuyer', value: VAS_ROLE_TYPE.USER },
    { type: 'assignedRole', label: 'BALL VIPs', value: VAS_ROLE_TYPE.VENDOR },
  ];

  return (
    <div className="mb-4 text-center">
      <ul className="list-unstyled list-inline">
        <FilterBadge
          key="clear-filter"
          type="none"
          label="All"
          onClick={handleClearFilters}
          isActive={Object.keys(activeFilter).length === 0}
        />
        {/* Map over the filter options and render FilterBadge for each */}
        {filterOptions.map((option, index) => {
          const currentValue = option?.value || option.label;
          return (
            <FilterBadge
              key={index}
              type={option.type}
              label={option.label}
              value={currentValue}
              onClick={handleFilter}
              isActive={activeFilter?.[option.type] === currentValue}
            />
          );
        })}
      </ul>
    </div>
  );
};

const FilterBadge = ({ type, value, label, onClick, isActive }) => {
  const handleClick = () => {
    onClick(type, value);
  };

  return (
    <li className={`list-inline-item ${isActive ? 'active' : ''}`}>
      <button
        className={`btn btn-sm btn-wide ${
          isActive ? 'btn-secondary-light' : 'btn-none'
        }`}
        onClick={handleClick}
      >
        {label || value}
      </button>
    </li>
  );
};

export async function getStaticProps() {
  const servicesRes = await axios.get(API_ENDPOINT.getAllVas());

  return {
    props: {
      ...servicesRes.data,
    },
    revalidate: 10,
  };
}

export default AllServices;
