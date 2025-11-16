import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';
import React from 'react';
import axios from 'axios';
import { PropertiesRowList } from '.';
import AdvancedSearchPropertyForm from '@/components/common/AdvancedSearchPropertyForm';
import { FaBed, FaSwimmingPool } from 'react-icons/fa';
import NoContent from '@/components/utils/NoContent';
import { Loading } from '@/components/utils/LoadingItems';
import { BASE_API_URL } from '@/utils/constants';
import SeoHead from '@/components/utils/SeoHead';

export const searchProperty = async (searchQuery) => {
  try {
    // use axios to fetch data from API
    const { data } = await axios.get(
      `${BASE_API_URL}/property/search${convertToQueryString(searchQuery)}`
    );
    return data;
    // return data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
};

export default function Search() {
  const router = useRouter();
  const searchQuery = router.query;

  const [result, setResult] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const search = async (searchTerm) => {
    try {
      const data = await searchProperty(searchTerm);
      return data?.result;
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    }
  };

  React.useEffect(() => {
    if (searchQuery) {
      search(searchQuery).then((searchResults) => {
        setSearchTerm(convertToReadableFormat(searchQuery));
        setResult(searchResults);
      });
    }
  }, [searchQuery]);

  const title = `Search result for '${searchTerm}'`;

  return (
    <>
      <SeoHead
        title={`Property Search | BALL`}
        description={`Search verified properties in Lagos and across Nigeria with BALL. Filter by location, house type, price, and amenities to find your ideal home.`}
        canonical={`https://www.ballers.ng/properties/search`}
        keywords={[
          'property search Nigeria',
          'houses for sale Lagos',
          'duplexes for sale',
          'apartments for sale Lagos',
          'property listings Nigeria',
          'BALL real estate platform',
        ]}
      />
      <Header />
      <TitleSection
        name="Search Page"
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />

      {/* Expanded Hidden SEO Section */}
      <section className="visually-hidden">
        <h1>Search Properties in Lagos and Nigeria with BALL</h1>
        <p>
          BALL offers a comprehensive property search platform designed to help
          homebuyers, investors, and property enthusiasts find their ideal homes
          in Lagos and across Nigeria. Our search tool provides verified
          listings, detailed property information, and real-time updates,
          ensuring buyers can make informed decisions with confidence.
        </p>
        <p>
          Users can filter properties by location, house type, price range,
          number of rooms, and amenities such as swimming pools, gardens, and
          premium finishes. BALL’s platform displays terraces, duplexes,
          apartments, and luxury homes, allowing for comparison between
          different property types to suit your budget and preferences.
        </p>
        <p>
          Beyond property details, the search tool offers insights into payment
          plans, affordability, and agent contact information. Buyers can
          evaluate total costs, monthly installments, and investment potential,
          helping to plan for homeownership effectively.
        </p>
        <p>
          BALL also provides educational resources and community insights. By
          exploring our verified listings, users gain knowledge about trending
          locations, property values, and investment opportunities in areas like
          Lekki, Ajah, Sangotedo, and Victoria Island.
        </p>
        <p>
          Whether you are a first-time buyer, an experienced investor, or
          looking for premium properties, BALL’s property search platform
          ensures a seamless, transparent, and stress-free experience. Start
          your journey today, explore available properties, compare options, and
          take the first step towards securing your dream home.
        </p>
      </section>
      <section className="search-page-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <AdvancedSearchPropertyForm advanced term={searchQuery?.all} />
            </div>
          </div>
        </div>
      </section>
      <section className="container-fluid mt-3 mb-5">
        <div className="row">
          {!result ? (
            <div className="mt-6 mb-9">
              <Loading
                text="Searching properties..."
                className="text-gray h3"
              />
            </div>
          ) : (
            <>
              <h2 className="mt-5 mb-3">{title}</h2>

              {result.length === 0 ? (
                <NoContent text={`No result found for ${searchTerm}`} />
              ) : (
                <PropertiesRowList result={result} />
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

const filters = [
  { icon: <FaBed />, label: 'Rooms' },
  { icon: <FaSwimmingPool />, label: 'Amazing pools' },
];

const FilterList = () => (
  <div className="container mt-4">
    <div className="row">
      {filters.map((filter, index) => (
        <div key={index} className="col-6 col-md-3">
          <label className="btn btn-light d-flex flex-column align-items-center m-1 p-3">
            <input
              type="radio"
              name="categoryScroller"
              className="visually-hidden"
            />
            <div className="mb-2">{filter.icon}</div>
            <span>{filter.label}</span>
          </label>
        </div>
      ))}
    </div>
  </div>
);

function convertToQueryString(obj) {
  const queryParams = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      queryParams.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );
    }
  }

  return queryParams.length > 0 ? '?' + queryParams.join('&') : '';
}

function convertToReadableFormat(values) {
  const readableOptions = [];

  for (const key in values) {
    const value = values[key];
    if (key === 'all' && value !== '') {
      readableOptions.push(value);
    } else if (value && value !== '0') {
      readableOptions.push(`${key}: ${value}`);
    }
  }

  return readableOptions.join(', ');
}
