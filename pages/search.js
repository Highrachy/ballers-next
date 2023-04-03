import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import SearchContentPropertyForm from 'components/common/SearchContentPropertyForm';
import classNames from 'classnames';
import Map from 'components/common/Map';
import Slider from 'react-rangeslider';
import { commaNumber, moneyFormatInNaira, nearestMillion } from 'utils/helpers';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import {
  QuestionMarkIcon,
  MapPinIcon,
  ArrowLeftIcon,
  InfoIcon,
  HouseIcon,
  CloseIcon,
  LocationIcon,
  ApartmentIcon,
  RangeLine,
} from 'components/utils/Icons';
import NumberFormat from 'react-number-format';
import { recommendBallersPlan } from 'utils/search-result-helpers';
import * as queryString from 'query-string';
import { Slide } from 'react-awesome-reveal';
import { useRouter } from 'next/router';
import contentProperty from '@/data/contentProperty';
import Link from 'next/link';

const Search = () => {
  const { query } = useRouter();
  const { area, houseType } = query;

  const defaultInputValue = { area, houseType };
  const allData = contentProperty[area || 'lekki'];
  const propertyContent = allData?.houseType?.[houseType];
  const result = propertyContent
    ? { ...propertyContent, area, type: houseType, ...allData }
    : null;

  return (
    <>
      <Header />
      <SearchForm defaultInputValue={defaultInputValue} />
      {result ? (
        <SearchResultContent result={result} />
      ) : (
        <NoSearchResultFound />
      )}
      <Footer />
    </>
  );
};

const SearchForm = ({ defaultInputValue }) => (
  <section className="container-fluid property-search-holder">
    <div className="row">
      <section className="property-search__page mx-auto pt-5 my-3">
        <SearchContentPropertyForm defaultInputValue={defaultInputValue} />
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

const SearchResultContent = ({ result }) => {
  console.log('result', result);

  // const WINDOW_SIZE = useWindowSize();
  const [showMap, setShowMap] = React.useState(false);

  return (
    <div className="container-fluid search-result-section">
      <div className="row">
        <div
          className={classNames('col-lg-10', {
            'offset-lg-1': !showMap,
          })}
        >
          <h2 className="text-start mt-6 mb-0 text-primary">
            {result.type} <br />
          </h2>
          <h5 className="text-secondary py-0">
            {result.area}, {result.state}
          </h5>
          {/* {!showMap && (
            <button className="btn-view-map" onClick={() => setShowMap(true)}>
              <span>
                <MapPinIcon /> View Map
              </span>
            </button>
          )} */}

          <section className="search-result__card text-center">
            <h5 className="text-muted fw-normal">
              <InfoIcon /> Average property price
            </h5>
            <h2 className="h1 my-3 text-secondary-600">
              {nearestMillion(result.averagePrice)}
            </h2>
            <ul className="list-inline">
              <li className="list-inline-item px-2">
                <LocationIcon /> {result.area}
              </li>
              <li className="list-inline-item px-2">
                <ApartmentIcon /> {result.type}
              </li>
            </ul>
            <div className="search-result-price-range">
              <RangeLine />
              <div className="row">
                <div className="col-lg-3 text-start ps-4 fw-bold">
                  {nearestMillion(result.minimumPrice)}
                </div>
                <div className="col-lg-6 text-center text-secondary">
                  <InfoIcon /> Property price range of the selected location
                </div>
                <div className="col-lg-3 text-end fw-bold">
                  {nearestMillion(result.maximumPrice)}
                </div>
              </div>
            </div>
            <article className="mt-7 row text-start">
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
          </section>

          <DefineYourEligibility result={result} />
        </div>
        {showMap && (
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
        )}
      </div>
    </div>
  );
};

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
        <Slider
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

  console.log('output', output);

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
      <div className="text-center">
        <h3>Define your eligibility</h3>
        <p className="lead-header">
          Fill in the details below to define your eligibility to owning this
          property
        </p>
      </div>

      <div className="row text-start">
        <div className="col-sm-4">
          <div className="text-start eligibility-form mt-5">
            <section className="col-12 bg-orange">
              <RangeInput
                min={1_000_000}
                max={50_000_000}
                name="initial"
                title="Initial investment amount"
                info="The amount you will pay upfront for the property"
                step={1_000_000}
                placeholder="10,000,000"
                handleChange={handleChange}
                inputs={inputs}
              />
            </section>

            <section className="col-12 bg-green">
              <RangeInput
                min={100_000}
                max={result.averagePrice}
                name="monthly"
                title="Monthly Income"
                info="Your entire monthly income or salary + any extra income"
                step={100_000}
                placeholder="1,000,000"
                handleChange={handleChange}
                inputs={inputs}
              />
            </section>

            <section className="col-12 bg-blue">
              <strong>Package Type</strong>
              <p className="text-xs mt-1 mb-2">
                Select one of the options below
              </p>
              <div className="btn-group-toggle d-flex" data-toggle="buttons">
                <OptionButton name="Any" value={0} />
                <OptionButton name="Premium" value={1} />
              </div>
            </section>
          </div>
          <div className="row search-calculate">
            <div className="col-lg-4">
              <button
                className="btn btn-secondary"
                name="calculate-investment"
                disabled={!enableCalculateButton}
                onClick={handleEligibility}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>
        <div className="col-sm-8">
          <div className="card p-5 mt-5">
            <h3 className="text-start text-price">
              {moneyFormatInNaira(output.monthlyPayment)}
            </h3>
            <p>Your approximate monthly contribution</p>
            <div className="d-flex justify-content-between mt-4">
              <p>Location</p>
              <strong> Lekki, Lagos State</strong>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <p>House Type</p>
              <strong> Flat</strong>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <p>Average Property Price</p>
              <strong> {moneyFormatInNaira(result.averagePrice)}</strong>
            </div>

            {showResultCard ? (
              <>
                <strong className="mt-4 mb-2">Savings to Payment ratio</strong>
                <div>
                  <strong>{inputs.comfortLevel}% </strong>({comfortLevelText})
                </div>

                <section className={`mt-5 comfort-level ${comfortLevelColor}`}>
                  <Slider
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
                </section>

                <section className="d-flex justify-content-between mt-5">
                  <h6>
                    Recommended Plan
                    {output?.recommendations?.length > 2 && 's'}{' '}
                  </h6>
                  <div>
                    {output?.recommendations?.map((recommendation, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between mt-1"
                      >
                        <p>&nbsp;</p>
                        <p className="text-secondary">
                          <TitleInfo
                            {...recommendation}
                            content={recommendation?.advice}
                          />
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  {showResultCard && (
                    <RecommendationCard
                      result={output}
                      cancelEligibilityStatus={cancelEligibilityStatus}
                    />
                  )}
                </section>
              </>
            ) : (
              <div className="recommendation__card mb-5">
                <p className="text-muted">
                  Fill the Eligibility Form to enable us to suggest a home for
                  you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const RecommendationCard = ({ result, cancelEligibilityStatus }) => {
  return (
    <section>
      <div className="recommendation__card mb-5">
        <p>You can afford a home of up to: </p>
        <h3 className="text-price">
          {moneyFormatInNaira(result?.propertyCost)}
        </h3>
        <div>
          with an initial investment of{' '}
          <strong> {moneyFormatInNaira(result.initial)}</strong> <br />
          and a monthly payment of{' '}
          <strong>{moneyFormatInNaira(result.monthlyPayment)} </strong>{' '}
        </div>
      </div>
      <div className="button-container mt-5 mb-3">
        <button
          className="btn btn-link"
          onClick={() => cancelEligibilityStatus(false)}
        >
          <ArrowLeftIcon /> Redefine your Eligibility status
        </button>

        <Link href="/register" passHref>
          <a className="btn btn-success">Create a free account</a>
        </Link>
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
          <Popover.Title as="h6">{title}</Popover.Title>
          <Popover.Content>{content}</Popover.Content>
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

const GetSearch = () => {
  const { query } = useRouter();
  const { area, houseType } = query;
  return (
    <div>
      Search: {area} - {houseType}
    </div>
  );
};

export default Search;
