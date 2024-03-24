import React, { useCallback, useEffect, useRef } from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import SearchContentPropertyForm from 'components/common/SearchContentPropertyForm';
import classNames from 'classnames';
import Map from 'components/common/Map';
import ReactRangeSlider from 'react-rangeslider';
import { moneyFormatInNaira } from 'utils/helpers';
import { ArrowLeftIcon, HouseIcon, SearchIcon } from 'components/utils/Icons';
import { recommendBallersPlan } from 'utils/search-result-helpers';
import { useRouter } from 'next/router';
import contentProperty from '@/data/contentProperty';
import Link from 'next/link';
import SquareBubbles from '@/components/common/SquareBubbles';
import { CloseCircle, TickCircle } from 'iconsax-react';
import { PropertiesRowList } from './properties';
import CommunityGallery from '@/components/common/CommunityGallery';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Button from '@/components/forms/Button';
import { Alert, Card } from 'react-bootstrap';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';

export const searchProperty = async (searchQuery) => {
  try {
    // use axios to fetch data from API
    const { data } = await axios.get(
      `${BASE_API_URL}/property/search?${searchQuery}`
    );
    return data;
    // return data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
};

const Search = () => {
  const { query } = useRouter();
  const {
    location: area,
    houseType,
    initialPayment,
    monthlyPayment,
    budget,
  } = query;
  const searchQuery = `all=${area} ${houseType}`;
  const [properties, setProperties] = React.useState(null);

  const allData = contentProperty[area || 'lekki'];
  const propertyContent = allData?.houseType?.[houseType];

  const result = propertyContent
    ? {
        ...propertyContent,
        area,
        type: houseType,
        initialPayment,
        monthlyPayment,
        budget,
        ...allData,
      }
    : null;

  const search = async (searchTerm) => {
    try {
      const data = await searchProperty(
        propertyContent?.minimumPrice
          ? `${searchTerm}&price=${propertyContent?.minimumPrice}:${propertyContent?.maximumPrice}`
          : searchTerm
      );
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

  return (
    <>
      <Header />
      <SearchForm />
      <SearchQueryDisplay />
      {result ? (
        <SearchResultContent properties={properties} result={result} />
      ) : (
        <NoSearchResultFound />
      )}
      <CommunityGallery />
      <Footer />
    </>
  );
};

const SearchForm = ({ defaultInputValue = {} }) => (
  <section className="container-fluid property-search-holder">
    <div className="row">
      <section className="property-search__page mx-auto pt-5 my-5">
        <SquareBubbles />
        <div className="col-12">
          <h2 className="pb-3 text-white text-center">Confirm Eligibility</h2>
        </div>
        <SearchContentPropertyForm
          defaultInputValue={defaultInputValue}
          customForm
        />
      </section>
    </div>
  </section>
);

const SearchQueryDisplay = () => {
  const router = useRouter();
  const { query } = router;

  const { location, houseType, initialPayment, monthlyPayment, budget } = query;

  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center">Selected Search Options</Card.Title>
        <ul className="list-unstyled d-flex justify-content-around">
          <li>
            <strong>Location:</strong> {location}
          </li>
          <li>
            <strong>House Type:</strong> {houseType}
          </li>
          <li>
            <strong>Initial Payment:</strong> {initialPayment}
          </li>
          <li>
            <strong>Monthly Payment:</strong> {monthlyPayment}
          </li>
          <li>
            <strong>Budget:</strong> {budget}
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
};

const EligibilityAlert = ({ message }) => (
  <div className="container-fluid search-result-section">
    <div className="row">
      <div className="col-lg-10 mx-auto">
        <h2 className="text-start mt-4 mt-md-6 mb-0 text-primary">
          {result.type}, {result.area} <br />
        </h2>

        {isEligible ? (
          <Alert variant="success">Congratulations! You are eligible.</Alert>
        ) : (
          <Alert variant="danger">Sorry, you are not eligible.</Alert>
        )}

        <div className="row">
          <h3>Eligible Properties on BALL</h3>
          <PropertiesRowList result={propertiesResult} />
        </div>
      </div>
    </div>
  </div>
);
const NoSearchResultFound = () => (
  <div className="container-fluid search-result-section text-center full-height">
    <div className="mt-6">
      <HouseIcon />
      <h3 className="mt-4">No Search Results Found</h3>
    </div>
  </div>
);

const SearchResultContent = ({ properties, result }) => {
  // const WINDOW_SIZE = useWindowSize();
  // const [showMap, setShowMap] = React.useState(true);
  // get first 2 arrays in properties.result
  const propertiesResult = properties?.slice(0, 2) || [];
  const { location, area, type, initialPayment, monthlyPayment, budget } =
    result;

  console.log('result', result);

  const fireworksContainerStyle = {
    width: '100%',
    height: '80%',
    position: 'absolute', // Change position to absolute
    top: 0, // Align to the top of the parent container
    left: 0, // Align to the left of the parent container
    zIndex: 1000, // Ensure it's above other content// Ensure it's above other content
  };

  return (
    <div className="container-fluid search-result-section">
      <div className="row">
        <h2 className="text-start mt-4 mt-md-6 mb-0 text-primary">
          {result.type}, {result.area} <br />
        </h2>

        {true ? (
          <>
            <Alert variant="success">
              Congratulations! You are eligible to own a {type} property in{' '}
              {area}. With an initial payment of {initialPayment}, a monthly
              payment of {monthlyPayment}, and a budget of {budget}, you are
              ready to begin your journey to homeownership.
            </Alert>
            <Realistic
              style={fireworksContainerStyle}
              autorun={{ speed: 0.3, duration: 10_000 }}
            />
          </>
        ) : (
          <Alert variant="danger">
            Sorry, you are not eligible to own a {type} property in {area} with
            the selected criteria. Please review your options and try again.
          </Alert>
        )}
        <div className={classNames('col-lg-10 mx-auto')}>
          <h2 className="text-start mt-4 mt-md-6 mb-0 text-primary">
            {result.type}, {result.area} <br />
          </h2>

          {/* Average Property Price */}
          {/* <section className="search-result__card text-center">
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
          </section> */}

          <div className="row">
            <h3>Eligible Properties on BALL</h3>
            <PropertiesRowList result={propertiesResult} />
          </div>

          <DefineYourEligibility result={result} />
          <PropertyInfo result={result} />
        </div>
        {/* {showMap && (
          <div className="col-lg-4 search-result-map">
            {result && (
              <>
                <button
                  className="btn btn-sm btn-light btn-close-map"
                  onClick={() => setShowMap(false)}
                >
                  X Close Map
                </button>
                <Map
                  coordinates={{
                    lng: result.longitude,
                    lat: result.latitude,
                  }}
                  zoom={16}
                  pinColor="red"
                />
                <button
                  className="btn btn-sm btn-light btn-close-map-mobile d-inline-block d-sm-none"
                  onClick={() => setShowMap(false)}
                >
                  <CloseIcon />
                </button>
              </>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

const PropertyInfo = ({ result }) => (
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

const DefineYourEligibility = ({ result }) => {
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
    comfortLevel <= 33 ? 'green' : comfortLevel <= 50 ? 'orange' : 'red';

  return (
    <section className="eligibility-section" ref={myRef}>
      <section>
        <h3 className="mb-4">Eligibility Result</h3>
        <div className="card p-5 mt-3">
          <h4 className="mb-4 pb-2 text-primary">
            {' '}
            {userIsEligible ? (
              <span>
                You can afford a home in {result.area}, {result.state}
              </span>
            ) : (
              <span>
                Not Eligilble <CloseCircle size="32" variant="Bulk" />
              </span>
            )}
          </h4>
          {/* <section>
              <h3 className="text-start text-price">
                {moneyFormatInNaira(output.monthlyPayment)}
              </h3>
              <p className="text-muted">
                Your approximate monthly contribution
              </p>
            </section> */}
          <div className="row">
            <div className="col-sm-6">
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
            </div>
            <div className="col-sm-6 text-primary">
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
          <section>
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
                  findEligibilityResult({
                    ...inputs,
                    comfortLevel: value,
                  });
                }}
              />
            </div>
          </section>
          <div className="bottom-range-border pt-5 mt-5"></div>
          <section className="mt-5">
            <h4>
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
                  />
                );
              })}

              <Button
                color="purple-light"
                className="mt-5 mb-5"
                href={`/properties/search?all=${result.type} ${result.area}, ${result.state}`}
              >
                <SearchIcon /> Search for related Properties on BALL
              </Button>
            </div>
          </section>
        </div>

        <div className="button-container mt-5 mb-3">
          <button
            className="btn btn-light"
            onClick={() => cancelEligibilityStatus(false)}
          >
            <ArrowLeftIcon /> Redefine your Eligibility status
          </button>

          <Link href="/register" passHref>
            <a className="btn btn-secondary float-end">Create a free account</a>
          </Link>
        </div>
      </section>
    </section>
  );
};

const RecommendationCard = ({ result, cancelEligibilityStatus }) => {
  return (
    <section>
      <div className="recommendation__card mb-5 py-5">
        <p>You can afford a home of up to: </p>
        <h2 className="mb-3 text-secondary-dark">
          {moneyFormatInNaira(result?.propertyCost)}
        </h2>
        <div>
          with an initial investment of{' '}
          <strong className="text-lg">
            {' '}
            {moneyFormatInNaira(result.initial)}
          </strong>{' '}
          <br />
          and a monthly payment of{' '}
          <strong className="text-lg">
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

const SingleRecommendationCard = ({ title, advice }) => {
  return (
    <section className="col-sm-6">
      <div className="recommendation-box">
        <section className="d-flex justify-content-between">
          <div className="d-flex flex-row">
            <div className="d-flex flex-column">
              <h4 className={`text-secondary fw-bold`}>{title}</h4>
            </div>
          </div>
        </section>
        <section>
          <p className="text-md mt-2 text-primary mb-0">{advice}</p>

          <p className="mt-4">
            <Link href={'/register'}>
              <a className="btn btn-secondary btn-xs btn-wide">Get Started</a>
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
};

export default Search;
