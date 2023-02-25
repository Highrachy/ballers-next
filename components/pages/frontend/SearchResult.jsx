import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import SearchPropertyForm from 'components/common/SearchPropertyForm';
import classNames from 'classnames';
import Map from 'components/common/Map';
import { ReactComponent as ApartmentIcon } from 'assets/img/icons/house-gray.svg';
import { ReactComponent as LocationIcon } from 'assets/img/icons/location-gray.svg';
import { ReactComponent as RangeLine } from 'assets/img/dashed-line.svg';
import Slider from 'react-rangeslider';
import { commaNumber, nearestMillion } from 'utils/helpers';
import {
  Tabs,
  Tab,
  OverlayTrigger,
  Popover,
  Accordion,
  Card,
} from 'react-bootstrap';
import {
  QuestionMarkIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
  InfoIcon,
  HouseIcon,
  CloseIcon,
} from 'components/utils/Icons';
import NumberFormat from 'react-number-format';
import {
  recommendBallersPlan,
  FREQUENCY_IN_WORDS,
} from 'utils/search-result-helpers';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import Axios from 'axios';
import useWindowSize from 'hooks/useWindowSize';
import * as queryString from 'query-string';
import { Slide } from 'react-awesome-reveal';
import { BASE_API_URL, MOBILE_WIDTH } from 'utils/constants';
import Link from 'next/link';

const SearchResult = ({ location }) => {
  const queryParams = queryString.parse(location.search);
  const { state, area, houseType } = queryParams;
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [defaultInputValue, setDefaultInputValue] = React.useState({
    state: 'Loading...',
    area: 'Loading...',
    houseType: 'Loading...',
  });

  React.useEffect(() => {
    const emptyFormValue = {
      state: 'Select State...',
      area: 'Select Area...',
      houseType: 'House Type...',
    };

    Axios.get(
      `${BASE_API_URL}/content-property/search/?state=${state}&area=${area}&houseType=${houseType}`
    ).then(function (response) {
      const { status, data } = response;
      if (status === 200) {
        setLoading(false);
        setResult(data.evaluation);
        setDefaultInputValue({
          state: data.evaluation.stateName,
          area: data.evaluation.areaName,
          houseType: data.evaluation.type,
        });
      } else {
        setLoading(false);
        setResult(null);
        setDefaultInputValue(emptyFormValue);
      }
    });
  }, [area, houseType, state]);
  return (
    <>
      <Header />
      <SearchForm defaultInputValue={defaultInputValue} />
      {loading ? (
        <LoadingSearchResult />
      ) : result ? (
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
      <section className="property-search__page  offset-lg-2 col-lg-8 my-3">
        <SearchPropertyForm defaultInputValue={defaultInputValue} />
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

const LoadingSearchResult = () => (
  <div className="container-fluid search-result-section text-center full-height">
    <div className="mt-6">
      <HouseIcon />
      <h3 className="mt-4">Loading Search Results</h3>
      <div className="dot-flashing"></div>
    </div>
  </div>
);

const SearchResultContent = ({ result }) => {
  const [showResultCard, setShowResultCard] = React.useState(false);
  const [output, setOutput] = React.useState({});

  const findEligibilityResult = ({ initial, frequency, periodic }) => {
    const averagePropertyCost = 20000000;
    const recommendations = recommendBallersPlan({
      initial,
      frequency,
      periodic,
      averagePropertyCost,
    });
    setOutput(recommendations);
    setShowResultCard(true);
  };

  const WINDOW_SIZE = useWindowSize();
  const [showMap, setShowMap] = React.useState(
    WINDOW_SIZE.width > MOBILE_WIDTH
  );

  return (
    <div className="container-fluid search-result-section">
      <div className="row">
        <div
          className={classNames('col-lg-8 text-center', {
            'offset-lg-2': !showMap,
          })}
        >
          {!showMap && (
            <button className="btn-view-map" onClick={() => setShowMap(true)}>
              <span>
                <MapPinIcon /> View Map
              </span>
            </button>
          )}

          <Slide triggerOnce>
            <section className="search-result__card">
              <h6 className="fw-normal search-result-average-price">
                <InfoIcon /> Average property price
              </h6>
              <h2>{nearestMillion(result.averagePrice)}</h2>
              <ul className="list-inline">
                <li className="list-inline-item px-2">
                  <LocationIcon /> {result.areaName}, {result.stateName}
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
            </section>
          </Slide>
          {showResultCard ? (
            <ResultCard result={output} setShowResultCard={setShowResultCard} />
          ) : (
            <DefineYourEligibility
              findEligibilityResult={findEligibilityResult}
              result={result}
            />
          )}
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

const RangeInput = ({ name, min, max, step, title, handleChange, inputs }) => (
  <>
    <h5>{title}</h5>
    <p>Use the scroll bar or type in the desired amount</p>
    <div className="row search-result-range">
      <div className="col-sm-6 col-12 search-result-range-label">
        <label htmlFor="initial-investment">
          NGN {!!inputs[name] && commaNumber(inputs[name])}
        </label>
        <Slider
          min={parseInt(min, 10)}
          max={parseInt(max, 10)}
          step={step}
          tooltip={false}
          value={inputs[name] || max / 2}
          onChange={(value) => handleChange(name, value)}
        />
      </div>
      <div className="input-group col-sm-6 col-12 ">
        <div className="input-group-prepend">
          <span className="input-group-text">NGN</span>
        </div>
        <NumberFormat
          type="text"
          className="form-control investment-value-input initial-investment-input"
          name={name}
          value={!!inputs[name] && `NGN ${commaNumber(inputs[name])}`}
          onValueChange={({ value }) => handleChange(name, value)}
          placeholder="500,000"
          thousandSeparator={true}
          prefix=""
        />
      </div>
    </div>
  </>
);

const DefineYourEligibility = ({ findEligibilityResult, result }) => {
  const [inputs, setInputs] = React.useState({
    initial: 0,
    periodic: 0,
    frequency: 1,
  });

  const handleChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: parseInt(value, 10),
    });
  };

  const OptionButton = ({ name, value }) => (
    <button
      className={classNames('col-sm-3 btn btn-sm option-btn', {
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

  const enableCalculateButton = !!inputs['initial'] && !!inputs['periodic'];

  const myRef = React.createRef();
  const handleEligibility = () => {
    findEligibilityResult(inputs);
    window.scrollTo({ behavior: 'smooth', top: myRef.current.offsetTop - 200 });
  };

  return (
    <section className="eligibility-section search-result__card" ref={myRef}>
      <div className="text-center">
        <h3>Define your eligibility</h3>
        <p className="lead-header">
          Fill in the details below to define your eligibility to owning this
          property
        </p>
      </div>

      <div className="row text-start eligibility-form mt-5">
        <section className="col-12 bg-orange">
          <RangeInput
            min={10000}
            max={result.averagePrice}
            name="initial"
            title="Initial investment amount"
            step={100000}
            handleChange={handleChange}
            inputs={inputs}
          />
        </section>

        <section className="col-12 bg-blue">
          <h5>Investment Frequency</h5>
          <p>Select one of the options below</p>
          <div className="btn-group-toggle row" data-toggle="buttons">
            <OptionButton name="Bi-Weekly" value={0.5} />
            <OptionButton name="Monthly" value={1} />
            <OptionButton name="Quarterly" value={4} />
          </div>
        </section>

        <section className="col-12 bg-green">
          <RangeInput
            min={10000}
            max={result.averagePrice}
            name="periodic"
            title="Periodic investment amount"
            step={10000}
            handleChange={handleChange}
            inputs={inputs}
          />
        </section>
      </div>
      <div className="row search-calculate">
        <div className="col-lg-4 mx-auto">
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
    </section>
  );
};

const ResultCard = ({ result, setShowResultCard }) => {
  const WINDOW_SIZE = useWindowSize();
  return (
    <div className="search-result__card result-card mb-5">
      <h3>Awesome!</h3>
      <section className="text-center awesome-text mb-5">
        With an initial investment off{' '}
        <span>NGN {commaNumber(result.initial)}</span>
        <br />
        and a <span>{FREQUENCY_IN_WORDS[result.frequency]}</span> contribution
        of <span>NGN {commaNumber(result.periodic)}</span>
        <br />
        You’re a plan away from owning your home.
      </section>

      <div className="row">
        <div className="offset-lg-1 col-lg-10">
          {WINDOW_SIZE.width <= MOBILE_WIDTH ? (
            <Accordion
              className="search-result-tab-accordion"
              defaultActiveKey={0}
            >
              {result.output.map(({ title, advice }, index) => (
                <Card key={index}>
                  <Accordion.Toggle
                    as={Card.Header}
                    variant="link"
                    eventKey={index}
                  >
                    <ContextAwareToggle
                      iconOpen={<ArrowDownIcon />}
                      iconClose={<ArrowDownIcon />}
                      eventKey={index}
                    >
                      <TabTitle title={title} content={advice} />
                    </ContextAwareToggle>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index}>
                    <Card.Body>{advice}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))}
            </Accordion>
          ) : (
            <Tabs defaultActiveKey={0}>
              {result.output.map(({ title, advice }, index) => (
                <Tab
                  key={index}
                  eventKey={index}
                  title={<TabTitle title={title} content={advice} />}
                >
                  <div className="search-result-tab-content">{advice}</div>
                </Tab>
              ))}
            </Tabs>
          )}
        </div>
      </div>

      <div className="button-container mt-5 mb-3">
        <button
          className="btn btn-link"
          onClick={() => setShowResultCard(false)}
        >
          <ArrowLeftIcon /> Redefine your Eligibility status
        </button>

        <Link href="/register" className="btn btn-success">
          Create a free account
        </Link>
      </div>
      <small className="text-primary">
        Open a free account and own your dream home
      </small>
    </div>
  );
};

const TabTitle = ({ title, content }) => (
  <>
    {title}
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="right"
      overlay={
        <Popover>
          <Popover.Title as="h6">{title} Package</Popover.Title>
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

export default SearchResult;
