import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import SearchContentPropertyForm from 'components/common/SearchContentPropertyForm';
import classNames from 'classnames';
import Map from 'components/common/Map';
import ReactRangeSlider from 'react-rangeslider';
import { commaNumber, moneyFormatInNaira, nearestMillion } from 'utils/helpers';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import {
  QuestionMarkIcon,
  MapPinIcon,
  ArrowLeftIcon,
  HouseIcon,
  CloseIcon,
  PropertyIcon,
  SearchIcon,
} from 'components/utils/Icons';
import NumberFormat from 'react-number-format';
import { recommendBallersPlan } from 'utils/search-result-helpers';
import { useRouter } from 'next/router';
import contentProperty from '@/data/contentProperty';
import Link from 'next/link';
import SquareBubbles from '@/components/common/SquareBubbles';
import { CloseCircle, TickCircle } from 'iconsax-react';
import Axios from 'axios';
import { API_ENDPOINT } from 'utils/URL';
import { PropertiesRowList } from './properties';
import CommunityGallery from '@/components/common/CommunityGallery';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Button from '@/components/forms/Button';
import SeoHead from '@/components/utils/SeoHead';

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
  const { area, houseType } = query;
  const searchQuery = `all=${area} ${houseType}`;
  const [properties, setProperties] = React.useState(null);

  const defaultInputValue = { area, houseType };
  const allData = contentProperty[area || 'lekki'];
  const propertyContent = allData?.houseType?.[houseType];

  const result = propertyContent
    ? { ...propertyContent, area, type: houseType, ...allData }
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
      <SeoHead
        title="Confirm Eligibility | Property Affordability & Homeownership Check"
        description="Check your eligibility to own a property based on your income, initial investment, location and preferred house type. Get instant affordability insights on BALL."
        canonical={`https://www.ballers.ng/confirm-eligibility?area=${area}&houseType=${houseType}`}
        keywords={[
          'property eligibility checker',
          'home affordability nigeria',
          'can I buy a house',
          'ball eligibility',
          'lagos home affordability',
          'property price nigeria',
        ]}
      />
      <Header />
      <SearchForm defaultInputValue={defaultInputValue} />
      <section style={{ display: 'none' }}>
        <h1>Confirm Your Property Eligibility</h1>
        <p>
          Use the BALL eligibility checker to estimate how much home you can
          afford based on your income, monthly budget, upfront investment and
          preferred property location in Nigeria. This tool helps buyers
          understand price ranges, payment plans and real estate expectations
          before making a commitment.
        </p>
        <p>
          BALL provides transparent market data, including minimum and maximum
          price ranges for popular locations across Lagos and Abuja. You can
          compare house types such as terraces, duplexes, detached homes and
          apartments to make a smarter buying decision.
        </p>
      </section>
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

const SearchForm = ({ defaultInputValue }) => (
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

  return (
    <div className="container-fluid search-result-section">
      <div className="row">
        <div className={classNames('col-lg-10 mx-auto')}>
          <h2 className="text-start mt-4 mt-md-6 mb-0 text-primary">
            {result.type}, {result.area} <br />
          </h2>

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
          </section>

          <div className="row">
            <PropertiesRowList
              result={propertiesResult}
              title="Available Properties"
            />
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

const RangeInput = ({
  name,
  min,
  max,
  step,
  title,
  info,
  handleChange,
  placeholder,
  inputs,
}) => (
  <>
    <div className="search-result-range">
      <p className="fw-bold mb-0">{title}</p>
      <div className="text-xs mt-1 mb-3 text-muted">{info}</div>
      <div className="input-group mb-3 col-12">
        <div className="input-group-prepend">
          <span className="input-group-text">NGN</span>
        </div>
        <NumberFormat
          type="text"
          className="form-control investment-value-input initial-investment-input"
          name={name}
          value={!!inputs[name] && `NGN ${commaNumber(inputs[name])}`}
          onValueChange={({ value }) => handleChange(name, value)}
          placeholder={placeholder}
          thousandSeparator={true}
          prefix=""
        />
      </div>
      <div className="w-100 search-result-range-label">
        <ReactRangeSlider
          min={parseInt(min, 10)}
          max={parseInt(max, 10)}
          step={step}
          tooltip={false}
          value={inputs[name] || max / 2}
          onChange={(value) => handleChange(name, value)}
        />
      </div>
    </div>
  </>
);

const DefineYourEligibility = ({ result }) => {
  const initialValues = {
    initial: 0,
    monthly: 0,
    frequency: 0,
    comfortLevel: 30,
  };
  const [inputs, setInputs] = React.useState(initialValues);
  const [output, setOutput] = React.useState({});
  const [showResultCard, setShowResultCard] = React.useState(false);
  const userIsEligible = output?.recommendations?.[0]?.title !== 'Ineligible';

  const cancelEligibilityStatus = () => {
    setInputs(initialValues);
    setShowResultCard(false);
  };

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

  const handleChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: parseInt(value, 10),
    });
  };

  const OptionButton = ({ name, value }) => (
    <button
      className={classNames('btn btn-sm option-btn text-xs', {
        active: value === inputs.frequency,
      })}
      onClick={() =>
        setInputs({
          ...inputs,
          frequency: value,
        })
      }
    >
      {name}
    </button>
  );

  const enableCalculateButton = !!inputs['initial'] && !!inputs['monthly'];

  const myRef = React.createRef();
  const handleEligibility = () => {
    findEligibilityResult(inputs);
    setShowResultCard(true);
  };

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
      {!showResultCard ? (
        <section className="card p-5 mt-n6">
          <div className="text-center">
            <h3>Define your eligibility</h3>
            <p className="lead-header">
              Fill in the details below to define your eligibility to owning
              this property
            </p>
          </div>
          <div className="container-fluid">
            <section className="row eligibility-form mt-5">
              <div className="col-md-4 mb-3">
                <section className="bg-orange">
                  <RangeInput
                    min={1_000_000}
                    max={50_000_000}
                    name="initial"
                    title="Initial investment amount"
                    info="The amount you will pay upfront for the property"
                    step={1_000_000}
                    placeholder="E.g 10,000,000"
                    handleChange={handleChange}
                    inputs={inputs}
                  />
                </section>
              </div>
              <div className="col-md-4 mb-3">
                <section className="bg-green">
                  <RangeInput
                    min={100_000}
                    max={result.averagePrice}
                    name="monthly"
                    title="Monthly Income"
                    info="Your entire monthly income or salary + any extra income"
                    step={100_000}
                    placeholder="E.g 1,000,000"
                    handleChange={handleChange}
                    inputs={inputs}
                  />
                </section>
              </div>
              <div className="col-md-4 mb-3">
                <section className="bg-blue h-100">
                  <strong>Package Type</strong>
                  <p className="text-xs mt-1 mb-2">
                    Select one of the options below
                  </p>
                  <div
                    className="btn-group-toggle d-flex"
                    data-toggle="buttons"
                  >
                    <OptionButton name="Any" value={0} />
                    <OptionButton name="Premium" value={1} />
                  </div>
                </section>
              </div>
            </section>
            <div className="row mt-5 search-calculate">
              <div className="col-lg-4">
                <button
                  className="btn btn-secondary"
                  name="calculate-investment"
                  disabled={!enableCalculateButton}
                  onClick={handleEligibility}
                >
                  Confirm Eligibility
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
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
              <a className="btn btn-secondary float-end">
                Create a free account
              </a>
            </Link>
          </div>
        </section>
      )}
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
// const ResultCard = ({ result, setShowResultCard }) => {
//   const WINDOW_SIZE = useWindowSize();
//   return (
//     <div className="search-result__card result-card mb-5">
//       <h3>Awesome!</h3>
//       <section className="text-center awesome-text mb-5">
//         With an initial investment off{' '}
//         <span>NGN {commaNumber(result.initial)}</span>
//         <br />
//         and a <span>{FREQUENCY_IN_WORDS[result.frequency]}</span> contribution
//         of <span>NGN {commaNumber(result.monthlyPayment)}</span>
//         <br />
//         You’re a plan away from owning your home.
//       </section>

//       <div className="row">
//         <div className="offset-lg-1 col-lg-10">
//           {WINDOW_SIZE.width <= MOBILE_WIDTH ? (
//             <Accordion
//               className="search-result-tab-accordion"
//               defaultActiveKey={0}
//             >
//               {result?.recommendations?.map(({ title, advice }, index) => (
//                 <Card key={index}>
//                   <Accordion.Toggle
//                     as={Card.Header}
//                     variant="link"
//                     eventKey={index}
//                   >
//                     <ContextAwareToggle
//                       iconOpen={<ArrowDownIcon />}
//                       iconClose={<ArrowDownIcon />}
//                       eventKey={index}
//                     >
//                       <TabTitle title={title} content={advice} />
//                     </ContextAwareToggle>
//                   </Accordion.Toggle>
//                   <Accordion.Collapse eventKey={index}>
//                     <Card.Body>{advice}</Card.Body>
//                   </Accordion.Collapse>
//                 </Card>
//               ))}
//             </Accordion>
//           ) : (
//             <Tabs defaultActiveKey={0}>
//               {result?.recommendations?.map(({ title, advice }, index) => (
//                 <Tab
//                   key={index}
//                   eventKey={index}
//                   title={<TabTitle title={title} content={advice} />}
//                 >
//                   <div className="search-result-tab-content">{advice}</div>
//                 </Tab>
//               ))}
//             </Tabs>
//           )}
//         </div>
//       </div>
//   );
// };

const TitleInfo = ({ title, content }) => (
  <>
    {title}
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="top"
      overlay={
        <Popover>
          <Popover.Header as="h6">{title}</Popover.Header>
          <Popover.Body>{content}</Popover.Body>
        </Popover>
      }
    >
      <span>
        &nbsp;
        <QuestionMarkIcon />
      </span>
    </OverlayTrigger>
  </>
);

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
