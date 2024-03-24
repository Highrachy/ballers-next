import React, { useEffect } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { useRouter } from 'next/router';
import contentProperty from '@/data/contentProperty';
import { PropertiesRowList } from './properties';
import {
  ApartmentIcon,
  ArrowLeftIcon,
  BuildingIcon,
  HouseIcon,
  MapPinIcon,
  PropertyIcon,
  SearchIcon,
} from '@/components/utils/Icons';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import { CloseCircle, TickCircle } from 'iconsax-react';
import Link from 'next/link';
import { moneyFormatInNaira, nearestMillion } from '@/utils/helpers';
import ReactRangeSlider from 'react-rangeslider';
import { recommendBallersPlan } from 'utils/search-result-helpers';
import Map from '@/components/common/Map';
import MyResponsiveLine, {
  generateLineChartData,
} from '@/components/common/Line';
import Button from '@/components/forms/Button';

const EligibilityResultPage = () => {
  const { query } = useRouter();
  const {
    location: area,
    houseType,
    initialPayment,
    monthlyPayment,
    budget,
  } = query;

  const [error, setError] = React.useState(false);

  useEffect(() => {
    // Check if any of the required parameters is missing
    if (!area || !houseType || !initialPayment) {
      setError(true); // Set error state to true if any parameter is missing
    } else {
      setError(false); // Reset error state if all parameters are present
    }
  }, [area, houseType, initialPayment, monthlyPayment, budget]);

  // Continue rendering the page if all required parameters are present
  const allData = contentProperty[area || 'lekki'];
  const propertyContent = allData?.houseType?.[houseType];
  const result = propertyContent
    ? {
        ...propertyContent,
        area,
        type: houseType,
        initialPayment,
        monthlyPayment: monthlyPayment || 0,
        budget: budget || 0,
        ...allData,
      }
    : null;

  return (
    <>
      <Header />
      <TitleSection
        name="Eligibility Result"
        content="You're one step closer to your dream home."
      />
      {result && !error ? (
        <EligibilityContainer result={result} />
      ) : (
        <NoSearchResultFound />
      )}
      <CommunityGallery />
      <Footer />
    </>
  );
};

const EligibilityContainer = ({ result }) => {
  return (
    <>
      <Section className="bg-white">
        <CheckEligibility result={result} />
      </Section>
      <Section className="search-result-section">
        <SearchResult result={result} />
      </Section>
      <Section className="bg-white">
        <EligibilityReport result={result} />
      </Section>
      <Section className="search-result-section">
        <AboutThisLocation result={result} />
        <PriceAnalysisAtLocation result={result} />
      </Section>
    </>
  );
};

const Section = ({ children, className }) => {
  return (
    <section className={`container-fluid ${className}`}>
      <div className="row">
        <div className="col-lg-10 mx-auto">{children}</div>
      </div>
    </section>
  );
};

const CheckEligibility = ({ result }) => {
  return (
    <div className="mt-6 mb-7 text-center">
      <BuildingIcon />
      <h3 className="mt-n2 text-xxl fw-semibold">Congratulations!</h3>
      <h4 className="mb-2 text-lg fw-semibold">
        You are eligible to own a{' '}
        <span className="text-secondary-800">{result.type}</span> in{' '}
        <span className="text-secondary-800">{result.area}</span>
      </h4>
      <p className="text-muted text-lg mb-2">
        with an initial payment of{' '}
        <span className="text-primary">
          {moneyFormatInNaira(result.initialPayment)}
        </span>{' '}
        and monthly payment of{' '}
        <span className="text-primary">
          {moneyFormatInNaira(result.monthlyPayment)}
        </span>{' '}
        <br />
      </p>
      {/* <h6 className="fw-normal text-soft mb-3">
        Budget is within{' '}
        <span className="text-primary">
          {moneyFormatInNaira(result.budget)}
        </span>
      </h6> */}

      <div className="my-4">
        <Button color="primary-light" wide className="me-3" href="/properties">
          Redefine Eligibility
        </Button>
        <Button color="secondary" wide href="/properties">
          View Result
        </Button>
      </div>

      <Realistic autorun={{ speed: 0.3, duration: 9_000 }} />
    </div>
  );
};

// const UserIsNotEligible = ({ result }) => {
//   return (
//     <div className="text-center">
//       <HouseIcon />
//       <h3 className="mt-4">Sorry!</h3>
//       <p>
//         You are not eligible for a {result.type} in {result.area} with an
//         initial payment of ₦{result.initialPayment} and monthly payment of ₦
//         {result.monthlyPayment}.
//       </p>
//     </div>
//   );
// };

const SearchResult = ({ result }) => {
  const { area, type } = result;
  const [properties, setProperties] = React.useState(null);
  const searchQuery = `all=${area} ${type}`;

  const search = async (searchTerm) => {
    try {
      const searchQuery = result?.minimumPrice
        ? `${searchTerm}&price=${result?.minimumPrice}:${result?.maximumPrice}`
        : searchTerm;
      console.log('searchTerm', searchQuery);

      const { data } = await axios.get(
        `${BASE_API_URL}/property/search?${searchQuery}`
      );
      console.log('data', data);
      return data?.result;
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    }
  };

  React.useEffect(() => {
    if (searchQuery) {
      search(searchQuery).then((searchResults) => {
        setProperties(searchResults);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const propertiesResult = properties?.slice(0, 3) || [];

  return result ? (
    <section className="my-6">
      <h3 className="mb-4">Recommended for You</h3>
      <div className="row">
        <PropertiesRowList result={propertiesResult} />
      </div>
    </section>
  ) : (
    <></>
  );
};

const EligibilityReport = ({ result }) => {
  const initialValues = {
    initial: result?.initialPayment,
    monthly: result?.monthlyPayment,
    frequency: 30,
    comfortLevel: 30,
  };

  const [inputs, setInputs] = React.useState(initialValues);
  const [output, setOutput] = React.useState({});
  const userIsEligible = output?.recommendations?.[0]?.title !== 'Ineligible';

  const cancelEligibilityStatus = () => {
    setInputs(initialValues);
    setShowResultCard(false);
  };

  useEffect(() => {
    const findEligibilityResult = ({
      initial,
      frequency,
      monthly,
      comfortLevel,
    }) => {
      const recommendations = recommendBallersPlan({
        initial,
        frequency,
        monthly,
        comfortLevel,
        result,
      });
      setOutput(recommendations);
    };
    findEligibilityResult(inputs);
  }, [inputs, result]);

  const myRef = React.createRef();

  // 0 - 33 = comfortable
  // 34 - 50 = stretching
  // 51 - 100 = risky
  // get comformLevel from input.comfortLevel
  const comfortLevel = inputs.comfortLevel;
  const comfortLevelText =
    comfortLevel <= 33
      ? 'Comfortable'
      : comfortLevel <= 50
      ? 'Stretching'
      : 'Getting Risky';
  const comfortLevelColor =
    comfortLevel <= 33 ? 'success' : comfortLevel <= 50 ? 'warning' : 'danger';

  return (
    <section className="eligibility-section" ref={myRef}>
      <section>
        <div className="card p-7 mt-3 text-center">
          <h2 className="mb-4">Eligibility Result</h2>
          <h4 className="mb-4 pb-2 text-primary fw-semibold lead-header">
            {userIsEligible ? (
              <>
                You can afford a {result.type} in {result.area}, {result.state}{' '}
              </>
            ) : (
              <>
                Not Eligilble <CloseCircle size="32" variant="Bulk" />
              </>
            )}
          </h4>
          <section>
            {userIsEligible ? (
              <RecommendationCard
                result={output}
                cancelEligibilityStatus={cancelEligibilityStatus}
              />
            ) : (
              <InEligibleCard
                result={output}
                cancelEligibilityStatus={cancelEligibilityStatus}
              />
            )}
          </section>
          <section className="text-start">
            <strong className="mt-4 mb-2">Savings to Payment ratio</strong>
            <div>
              <strong>{inputs.comfortLevel}% </strong>({comfortLevelText})
            </div>

            <div className={`mt-3 comfort-level ${comfortLevelColor}`}>
              <ReactRangeSlider
                min={0}
                max={90}
                step={1}
                tooltip={false}
                value={inputs.comfortLevel}
                onChange={(value) => {
                  setInputs({
                    ...inputs,
                    comfortLevel: value,
                  });
                }}
              />
            </div>
          </section>
          <div className="pt-3 mt-5"></div>
          <div className="row">
            <div className="col-sm-12 text-primary">
              <ul className="list-dotted list-unstyled">
                <li>
                  <span className="list-dotted__label">Location </span>
                  <span className="list-dotted__value">
                    {result.area}, {result.state}
                  </span>
                </li>
                <li>
                  <span className="list-dotted__label">House Type </span>
                  <span className="list-dotted__value">{result.type}</span>
                </li>
                <li>
                  <span className="list-dotted__label">Average Price </span>
                  <span className="list-dotted__value">
                    {moneyFormatInNaira(result.averagePrice)}
                  </span>
                </li>
                <li>
                  <span className="list-dotted__label">Status</span>
                  <span className="list-dotted__value">
                    {userIsEligible ? (
                      <span className="text-secondary">
                        Eligible <TickCircle size="32" variant="Bulk" />
                      </span>
                    ) : (
                      <span className="text-danger">
                        Not Eligilble <CloseCircle size="32" variant="Bulk" />
                      </span>
                    )}
                  </span>
                </li>
              </ul>{' '}
            </div>
          </div>
          <section className="mt-5 text-start">
            <h4 className="text-secondary-800">
              Recommended Plan
              {output?.recommendations?.length > 2 && 's'}{' '}
            </h4>
            <div className="row">
              {output?.recommendations?.map(({ title, advice }, index) => {
                return (
                  <SingleRecommendationCard
                    title={title}
                    advice={advice}
                    key={index}
                    number={index + 1}
                  />
                );
              })}
            </div>
            <div className="bottom-range-border my-5"></div>
            <div className="button-container mt-3 mb-3">
              <h4 className="">Ready for the next step? </h4>
              <p className="lead">
                Create an account now to begin your journey towards
                homeownership. Our team is here to assist you every step of the
                way. Alternatively, you can redefine your eligibility to adjust
                your criteria and explore more options.
              </p>
              <Button
                color="light"
                className="mt-3 float-end"
                href="/contact-us"
                wide
              >
                <ArrowLeftIcon /> Redefine your Eligibility
              </Button>
              <Button
                wide
                color="secondary"
                className="mt-3"
                href="/contact-us"
              >
                Create a free account
              </Button>
            </div>
          </section>
        </div>
      </section>
    </section>
  );
};

const RecommendationCard = ({ result, cancelEligibilityStatus }) => {
  return (
    <section>
      <div className="recommendation__card secondary mb-5 py-5">
        <p>You can save up to: </p>
        <h2 className="mb-3 text-secondary-dark">
          {moneyFormatInNaira(result?.propertyCost)}
        </h2>
        <div>
          with an initial investment of{' '}
          <strong className="text-lg text-secondary-darker">
            {' '}
            {moneyFormatInNaira(result.initial)}
          </strong>{' '}
          <br />
          and a monthly payment of{' '}
          <strong className="text-lg text-secondary-darker">
            {moneyFormatInNaira(result.monthlyPayment)}{' '}
          </strong>{' '}
        </div>
      </div>
    </section>
  );
};

const InEligibleCard = ({ result }) => {
  return (
    <section>
      <div className="recommendation__card mb-5">
        <p>
          Sorry, based on your income, the properties in this location might be
          above your budget.{' '}
        </p>
        <h3 className="text-secondary-700">
          {moneyFormatInNaira(result?.propertyCost)}
        </h3>
        <div>
          with an initial investment of{' '}
          <strong> {moneyFormatInNaira(result.initial)}</strong> <br />
          and a monthly payment of{' '}
          <strong>{moneyFormatInNaira(result.monthlyPayment)} </strong>{' '}
        </div>
        <p className="">Let&apos;s explore other options within your budget.</p>
      </div>
      <small className="text-primary">
        Open a free account and own your dream home
      </small>
    </section>
  );
};

const SingleRecommendationCard = ({ title, advice, number }) => {
  return (
    <section className="col-sm-12">
      <div className="recommendation-box">
        <div className="d-flex flex-column">
          <h5 className={`text-primary fw-bold mb-1`}>
            {number}. {title}
          </h5>
          <p className="mt-2 text-primary-400 mb-0">{advice}</p>
        </div>
      </div>
    </section>
  );
};

const NoSearchResultFound = () => (
  <div className="container-fluid search-result-section text-center full-height">
    <div className="mt-6">
      <HouseIcon />
      <h3 className="mt-4">No Search Results Found</h3>
    </div>
  </div>
);

const AboutThisLocation = ({ result }) => (
  <article className="my-7 row text-start">
    <div className="col-sm-6">
      <h3>About {result.area}</h3>
      {result.content}
    </div>
    <div className="col-sm-6">
      <Map
        coordinates={{
          lng: result.longitude,
          lat: result.latitude,
        }}
        zoom={16}
        pinColor="red"
      />
    </div>
  </article>
);

const PriceAnalysisAtLocation = ({ result }) => (
  <section className="search-result__card text-center">
    <h5 className="text-muted fw-normal">Average property price</h5>
    <h2 className="h1 my-3 text-secondary-700">
      {nearestMillion(result.averagePrice)}
    </h2>
    <ul className="list-inline">
      <li className="list-inline-item text-dark">
        <PropertyIcon /> {result.type}
      </li>
      <li className="list-inline-item px-3 text-dark">|</li>
      <li className="list-inline-item text-dark">
        <MapPinIcon /> {result.area}
      </li>
    </ul>
    <div className="search-result-price-range mt-4">
      <div className="row">
        <div className="col-lg-3 col-6 order-0 order-lg-0 text-start fw-bold">
          {nearestMillion(result.minimumPrice)}
        </div>
        <div className="col-lg-6 col-12 order-2 order-lg-1 text-center text-sm text-muted">
          Property price range of the selected location
        </div>
        <div className="col-lg-3 col-6 order-1 order-lg-2 text-end fw-bold">
          {nearestMillion(result.maximumPrice)}
        </div>
      </div>
    </div>
    <div className="card h-100 position-relative">
      {/* card body */}
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-12" style={{ height: '500px' }}>
            <h2>Line Chart</h2>
            <MyResponsiveLine data={generateLineChartData('Lekki')} />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default EligibilityResultPage;
