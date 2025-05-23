import React, { useEffect } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { useRouter } from 'next/router';
import contentProperty from '@/data/contentProperty';
import { PropertiesRowList } from './properties';
import {
  ArrowLeftIcon,
  BuildingIcon,
  HouseIcon,
  HouseNotAvailable,
} from '@/components/utils/Icons';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import { InfoCircle, TickCircle } from 'iconsax-react';
import { moneyFormatInNaira, nearestMillion } from '@/utils/helpers';
import ReactRangeSlider from 'react-rangeslider';
import { recommendBallersPlan } from 'utils/search-result-helpers';
import Map from '@/components/common/Map';
import MyResponsiveLine, {
  generateLineChartData,
} from '@/components/common/Line';
import Button from '@/components/forms/Button';
import Modal from '@/components/common/Modal';
import SearchEligibilityForm from '@/components/common/SearchEligibilityForm';
import { MdClose } from 'react-icons/md';

const EligibilityResultPage = () => {
  const { query } = useRouter();
  const { location: area, houseType, initialPayment, monthlyPayment } = query;

  const [error, setError] = React.useState(false);
  const [currentValues, setCurrentValues] = React.useState({
    area,
    houseType,
    initialPayment,
    monthlyPayment,
  });

  useEffect(() => {
    setCurrentValues({
      area,
      houseType,
      initialPayment,
      monthlyPayment,
    });
    // Check if any of the required parameters is missing
    if (!area || !houseType || !initialPayment || !monthlyPayment) {
      setError(true); // Set error state to true if any parameter is missing
    } else {
      setError(false); // Reset error state if all parameters are present
    }
  }, [area, houseType, initialPayment, monthlyPayment]);

  // Continue rendering the page if all required parameters are present
  const allData = contentProperty[currentValues?.area || 'lekki'];
  const propertyContent = allData?.houseType?.[currentValues?.houseType];
  const result = propertyContent
    ? {
        ...propertyContent,
        ...allData,
        area: currentValues?.area,
        type: currentValues?.houseType,
        initialPayment: currentValues?.initialPayment || 0,
        monthlyPayment: currentValues?.monthlyPayment || 0,
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
  const [comfortLevel, setComfortLevel] = React.useState(40);
  const [output, setOutput] = React.useState({});
  const userIsEligible = output?.recommendations?.[0]?.title !== 'Ineligible';

  useEffect(() => {
    const findEligibilityResult = (comfortLevel) => {
      const recommendations = recommendBallersPlan({
        comfortLevel,
        result,
      });
      setOutput(recommendations);
    };
    findEligibilityResult(comfortLevel);
  }, [comfortLevel, result]);

  const allOutput = { ...result, ...output };

  return (
    <>
      <Section className="bg-white">
        <CheckEligibility result={result} userIsEligible={userIsEligible} />
      </Section>
      <Section className="search-result-section">
        <SearchResult result={result} />
      </Section>
      <Section className="bg-white">
        <EligibilityReport
          comfortLevel={comfortLevel}
          setComfortLevel={setComfortLevel}
          output={output}
          result={result}
          userIsEligible={userIsEligible}
        />
      </Section>
      <Section className="search-result-section">
        <AboutThisLocation result={result} />
        <PriceAnalysisAtLocation result={allOutput} />
      </Section>
    </>
  );
};

const Section = ({ children, className }) => {
  return (
    <section className={`container-fluid ${className}`}>
      <div className="row">
        <div className="col-xl-10 col-lg-11 mx-auto">{children}</div>
      </div>
    </section>
  );
};

const CheckEligibility = ({ result, userIsEligible }) => {
  return (
    <div className="mt-6 mb-7 text-center">
      {userIsEligible ? (
        <BuildingIcon />
      ) : (
        <div className="text-danger mb-4">
          <HouseNotAvailable />
        </div>
      )}
      <h3 className="mt-n1 text-xxl fw-semibold">
        {userIsEligible ? 'Congratulations' : 'You are almost there'}!
      </h3>
      <h4 className="mb-3 text-lg fw-semibold">
        {userIsEligible ? (
          <>
            You are eligible to own a
            <span className="text-secondary-800">{result.type}</span> in{' '}
            <span className="text-secondary-800">{result.area}</span>
            <p className="text-muted text-lg mb-3">
              with an initial payment of{' '}
              <span className="text-primary">
                {moneyFormatInNaira(result.initialPayment)}
              </span>{' '}
              and a monthly income of{' '}
              <span className="text-primary">
                {moneyFormatInNaira(result.monthlyPayment)}
              </span>{' '}
              <br />
            </p>
          </>
        ) : (
          <p className="lh-normal">
            The minimum price of{' '}
            <span className="text-secondary-800">{result.type}</span> in{' '}
            <span className="text-secondary-800">{result.area}</span> is
            <span className="text-primary">
              &nbsp;{moneyFormatInNaira(result.minimumPrice)}
            </span>
            <br />
            which might be above your budget.
            {/* <h5 className="mt-3">
              Let&apos;s find something perfect together!
            </h5> */}
          </p>
        )}{' '}
      </h4>

      <div className="my-4 d-flex flex-md-row flex-column justify-content-md-center">
        <RedefineEligibilityButton
          result={result}
          className="me-md-3 mb-md-0 mb-3"
        />
        <Button color="secondary" wide href="#eligibility-result-section">
          View Result
        </Button>
      </div>

      {userIsEligible && (
        <Realistic autorun={{ speed: 0.3, duration: 9_000 }} />
      )}
    </div>
  );
};

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

  return result && propertiesResult.length > 0 ? (
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

const EligibilityReport = ({
  result,
  comfortLevel,
  setComfortLevel,
  output,
  userIsEligible,
}) => {
  // 0 - 40 = comfortable
  // 41 - 60 = stretching
  // 61 - 100 = risky
  const comfortLevelText =
    comfortLevel == 0
      ? 'No Savings'
      : comfortLevel <= 40
      ? 'Comfortable'
      : comfortLevel <= 60
      ? 'Stretching'
      : 'Getting Risky';
  const comfortLevelColor =
    comfortLevel == 0
      ? 'gray'
      : comfortLevel <= 40
      ? 'success'
      : comfortLevel <= 60
      ? 'warning'
      : 'danger';

  const eligibilityClassName = userIsEligible ? 'secondary' : 'danger';

  return (
    <section id="eligibility-result-section">
      <section className="eligibility-section my-5 my-lg-6">
        <section className="card">
          <header className="p-4 text-center">
            <h3 className="mt-3 mt-md-5 mb-3 fw-semibold text-dark">
              Eligiblity Result for {result.type} in {result.area}
            </h3>

            <div className="bottom-range-border pb-3 pb-lg-4 mb-4 mb-lg-5"></div>
          </header>
          <div className="px-3 px-md-5 px-lg-6  text-center">
            <div className={`pb-4 text-${eligibilityClassName}-dark`}>
              {userIsEligible ? (
                <TickCircle size="96" variant="Bulk" />
              ) : (
                <InfoCircle size="96" variant="Bulk" />
              )}
            </div>
            <h2
              className={`mb-3 text-xl fw-semibold text-${eligibilityClassName}-dark`}
            >
              {userIsEligible
                ? 'Congratulations, You are eligible'
                : 'You are almost there!'}
            </h2>
            <h4
              className={`mb-5 pb-2 text-${eligibilityClassName}-dark fw-semibold lead-header`}
            >
              {userIsEligible ? (
                <>
                  {' '}
                  to own a {result.type} in {result.area}, {result.state}.
                </>
              ) : (
                <>
                  Prices of {result.type} in {result.area}, {result.state} may
                  be above your budget.
                </>
              )}
            </h4>

            <RecommendationCard
              userIsEligible={userIsEligible}
              result={output}
            />
            <section className="text-start">
              <div>
                <strong className="mt-4 mb-2">
                  Recommended Savings from your total Monthly Income: <br />
                </strong>
                <strong className={`text-${comfortLevelColor}-darker`}>
                  {comfortLevel}% ({comfortLevelText})
                </strong>
              </div>

              <div className={`mt-3 comfort-level ${comfortLevelColor}`}>
                <ReactRangeSlider
                  min={0}
                  max={90}
                  step={1}
                  tooltip={false}
                  value={comfortLevel}
                  onChange={(value) => {
                    setComfortLevel(value);
                  }}
                />
              </div>

              <div className="text-sm text-lighter mt-3">
                Move the slider above to adjust the percentage of your total
                monthly income saved.
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
                    <span className="list-dotted__label">
                      Minimum Property Price
                    </span>
                    <span className="list-dotted__value">
                      {moneyFormatInNaira(result.minimumPrice)}
                    </span>
                  </li>
                  <li>
                    <span className="list-dotted__label">
                      Average Property Price
                    </span>
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
                          Not Eligilble <InfoCircle size="32" variant="Bulk" />
                        </span>
                      )}
                    </span>
                  </li>
                </ul>{' '}
              </div>
            </div>
            <section className="mt-5 text-start">
              {userIsEligible && (
                <>
                  <h4 className="text-secondary-800">
                    Recommended Plans for You
                  </h4>
                  <div className="row row-eq-height">
                    {output?.recommendations?.map(
                      ({ title, advice }, index) => {
                        return (
                          <SingleRecommendationCard
                            title={title}
                            advice={advice}
                            key={index}
                            number={index + 1}
                          />
                        );
                      }
                    )}
                  </div>
                  <div className="bottom-range-border mb-5 pb-5"></div>
                </>
              )}

              <p className="text-sm mt-1 text-soft">
                * Accumulated savings for 5 years
              </p>
              <div className="button-container mb-7">
                <h4 className="">Next Step </h4>
                <p className="">
                  {userIsEligible
                    ? `Create an account now to begin your journey towards homeownership. Our team is here to assist you every step of the way.`
                    : `You're almost there! You can redefine your eligibility to adjust your criteria or create an account to explore more options.`}
                </p>

                <div className="my-4 d-flex flex-md-row flex-column">
                  <RedefineEligibilityButton
                    result={result}
                    className="me-md-3 mb-md-0 mb-3"
                  />
                  <Button wide color="secondary" href="/register">
                    Create a free account
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </section>
    </section>
  );
};

const RecommendationCard = ({ result, userIsEligible }) => {
  const eligibilityClassName = userIsEligible ? 'secondary' : 'light';
  return (
    <section
      className={`recommendation__card ${eligibilityClassName} mb-5 py-5`}
    >
      <p className="mb-0">You can buy a property valued up to: </p>

      <h2 className={`my-4 text-xl text-primary fw-bold`}>
        {moneyFormatInNaira(result?.yearlySavings)}{' '}
        <sup className="text-lg text-soft">*</sup>
      </h2>

      <p className="text-lg fw-light mb-0">
        with an initial investment of{' '}
        <strong className={`fw-normal text-${eligibilityClassName}-darker`}>
          {' '}
          {moneyFormatInNaira(result.initial)}
        </strong>
      </p>
      <p className="text-lg fw-light  mb-1">
        and a monthly savings of{' '}
        <strong className={`fw-normal text-${eligibilityClassName}-darker`}>
          {moneyFormatInNaira(result.monthlyContribution)}{' '}
        </strong>{' '}
      </p>
    </section>
  );
};

const SingleRecommendationCard = ({ title, advice }) => {
  return (
    <section className="col-sm-6 mb-4">
      <div className="recommendation-box h-100">
        <div className="d-flex flex-column">
          <h5 className={`text-primary fw-bold mb-1`}>{title}</h5>
          <p className="mt-2 text-primary-300 mb-0">{advice}</p>
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
    <p>Your proposed savings: </p>

    <h2 className="mb-3 text-secondary-dark">
      {moneyFormatInNaira(result?.yearlySavings)}
    </h2>
    <div className="search-result-price-range mt-4">
      <div className="row">
        <div className="col-lg-3 col-6 order-0 order-lg-0 text-start fw-bold">
          {nearestMillion(result.minimumPrice)}
        </div>
        <div className="col-lg-6 col-12 order-2 order-lg-1 text-center text-sm text-muted">
          Property price range in {result.area}
        </div>
        <div className="col-lg-3 col-6 order-1 order-lg-2 text-end fw-bold">
          {nearestMillion(result.maximumPrice)}
        </div>
      </div>
    </div>

    <h4 className="text-start mt-6 fw-semibold">
      Property Price Range in {result?.area}
    </h4>

    <div className="overflow-auto">
      <div className="text-start mt-5" style={{ height: '70vh' }}>
        <MyResponsiveLine
          data={generateLineChartData(result?.area)}
          yearlySavings={result?.yearlySavings}
        />
      </div>
    </div>
  </section>
);

export const RedefineEligibilityButton = ({ className, result }) => {
  const [showRedefineEligibilityModal, setShowRedefineEligibilityModal] =
    React.useState(false);
  return (
    <>
      <Button
        color="light"
        className={className}
        wide
        onClick={() => setShowRedefineEligibilityModal(true)}
      >
        <ArrowLeftIcon /> Redefine Eligibility
      </Button>
      <Modal
        show={showRedefineEligibilityModal}
        onHide={() => setShowRedefineEligibilityModal(false)}
        showFooter={false}
        size="lg"
      >
        <div className="tab-content modal-tab-content">
          <span
            className="float-end text-muted text-link"
            onClick={() => setShowRedefineEligibilityModal(false)}
          >
            <MdClose />
          </span>
          <h4 className="mb-3">Check Eligibility</h4>
          <SearchEligibilityForm
            initialValues={{
              location: result?.area,
              houseType: result?.type,
              initialPayment: result?.initialPayment,
              monthlyPayment: result?.monthlyPayment,
              budget: result?.budget,
            }}
            afterSave={() => setShowRedefineEligibilityModal(false)}
          />
        </div>
      </Modal>
    </>
  );
};

export default EligibilityResultPage;
