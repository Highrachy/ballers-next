import React, { useEffect, useState } from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { Formik, Form } from 'formik';
import Axios from 'axios';
import Input from 'components/forms/Input';
import { setInitialValues } from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { demoAccountSchema } from 'components/forms/schemas/userSchema';
import CheckboxGroup from 'components/forms/CheckboxGroup';
import TitleSection, {
  EmptyTitleSection,
} from 'components/common/TitleSection';
import Toast, { useToast } from 'components/utils/Toast';
import { BASE_API_URL } from 'utils/constants';
import { getDemoLoginLink, getError } from 'utils/helpers';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import Link from 'next/link';
import { WarningIcon } from '@/components/utils/Icons';

const CreateDemoAccount = () => (
  <>
    <Header />
    <TitleSection
      name="Create a Demo Account"
      content="Elevate Your Presence: Customize Your BALL Demo Space"
    />
    <EmptyTitleSection>
      <Content />
    </EmptyTitleSection>
    <Footer />
  </>
);

const Content = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="page-sign">
      <div className="card card-sign">
        <div className="card-header">
          <h4 className="card-title my-3">Welcome to BALL DEMO! </h4>
          <p className="text-primary pb-4 border-bottom">
            Begin your journey by providing your details below!
          </p>
        </div>
        <div className="card-body pt-2">
          <DemoAccountForm showLogin={showLogin} setShowLogin={setShowLogin} />
        </div>
        <div className="card-footer py-4 mb-5">
          {showLogin ? (
            <div
              className="d-flex align-items-center justify-content-center text-warning-dark text-md my-4"
              role="alert"
            >
              <span className="me-2">
                <WarningIcon />
              </span>
              Attention: Your Demo Account will expire in 30 Days time!
            </div>
          ) : (
            <>
              Already have a demo account?{' '}
              <Link href={getDemoLoginLink()}>
                <a className="text-link text-secondary">Sign In</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DemoAccountForm = ({ showLogin, setShowLogin }) => {
  // State to store the company logo URL and logo history
  const [logoURL, setLogoURL] = useState(generateRandomLogoUrl());
  const [logoHistory, setLogoHistory] = useState([]);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(-1);

  const [toast, setToast] = useToast();

  const agreementText = (
    <small>
      I agree to{' '}
      <a href="/terms-of-use" className="text-secondary" target="_blank">
        Ballers Terms of Use
      </a>{' '}
      and acknowledge the{' '}
      <a href="/privacy-policy" className="text-secondary" target="_blank">
        Privacy Policy
      </a>
      .
    </small>
  );

  function handleNextButtonClick() {
    if (currentLogoIndex < logoHistory.length - 1) {
      // If there's a next logo in history, display it
      const nextIndex = currentLogoIndex + 1;
      setCurrentLogoIndex(nextIndex);
      setLogoURL(logoHistory[nextIndex]);
    } else {
      // Otherwise, generate a new random logo
      const newLogoUrl = generateRandomLogoUrl();
      setLogoHistory([...logoHistory, newLogoUrl]);
      setCurrentLogoIndex(logoHistory.length);
      setLogoURL(newLogoUrl);
    }
  }

  function handleBackButtonClick() {
    if (currentLogoIndex > 0) {
      const previousIndex = currentLogoIndex - 1;
      setCurrentLogoIndex(previousIndex);
      setLogoURL(logoHistory[previousIndex]);
    }
  }

  // Generate the first logo URL and add it to history
  useEffect(() => {
    const initialLogoUrl = generateRandomLogoUrl();
    setLogoURL(initialLogoUrl);
    setLogoHistory([initialLogoUrl]);
    setCurrentLogoIndex(0);
  }, []);

  return (
    <Formik
      initialValues={setInitialValues(demoAccountSchema, {
        agreement: [],
      })}
      onSubmit={(values, actions) => {
        delete values.agreement;
        const payload = {
          ...values,
          companyLogo:
            logoURL + `&text=${getFirstLettersOrWord(values.companyName)}`,
        };
        console.log('payload', payload);

        Axios.post(`${BASE_API_URL}/user/create-demo-account`, payload)
          .then(function (response) {
            const { status } = response;
            if (status === 201) {
              setToast({
                type: 'success',
                message: `Your demo account has been successfully created. Kindly activate your account via the confirmation link sent to your inbox (${values.email}).`,
              });
              setShowLogin(true);
              actions.resetForm();
            }
            actions.setSubmitting(false);
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(demoAccountSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => {
        const companyName = props?.values?.companyName;
        const companyLogo =
          logoURL + `&text=${getFirstLettersOrWord(companyName)}`;
        return (
          <div className="section">
            <Toast {...toast} />
            {showLogin ? (
              <>
                <Button
                  className="btn-secondary mt-5 btn-submit"
                  href={getDemoLoginLink()}
                >
                  Login to your Demo Account
                </Button>
              </>
            ) : (
              <Form>
                <Input
                  isValidMessage="Company Name looks good"
                  label="Company Name"
                  name="companyName"
                  placeholder="Company Name"
                />
                <Input
                  isValidMessage="Email address seems valid"
                  label={'Email'}
                  name="email"
                  placeholder="Email Address"
                />
                <div className="form-row">
                  <Input
                    formGroupClassName="mb-4"
                    isValidMessage="Password seems good"
                    label="Password"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                  <Input
                    formGroupClassName="mb-4"
                    isValidMessage="Awesome. Password matches"
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                  />
                </div>

                {companyName && (
                  <section className="mb-4">
                    <p className="mb-1 text-md">Generate Company Logo</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={companyLogo}
                      alt="company logo"
                      className="img-fluid img-sm"
                    />
                    <div className="my-3">
                      <Button
                        color="light"
                        className="btn-sm me-3 px-3"
                        onClick={handleBackButtonClick}
                        disabled={currentLogoIndex === 0}
                      >
                        <GrFormPrevious />
                        Prev
                      </Button>
                      <Button
                        color="light"
                        className="btn-sm px-3"
                        onClick={handleNextButtonClick}
                      >
                        Next <GrFormNext />
                      </Button>
                    </div>
                  </section>
                )}
                <div className="ms-0">
                  <CheckboxGroup
                    custom
                    inline
                    name="agreement"
                    options={[{ label: agreementText, value: true }]}
                  />
                </div>
                <Button
                  className="btn-secondary mt-4 btn-submit"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Create Demo Account
                </Button>

                {/* <DisplayFormikState {...props} showAll /> */}
              </Form>
            )}
          </div>
        );
      }}
    </Formik>
  );
};

/**
 * Generate a random logo URL with bgColor, fontColor, and fontName.
 * @returns {string} A single random logo URL.
 */
function generateRandomLogoUrl() {
  const width = 200; // Constant width
  const height = 120; // Constant height

  // Define possible values for bgColor, fontColor, and fontName with contrast
  const possibleColors = [
    { bgColor: '5F4B8B', fontColor: 'E69A8D' }, // Ultra Violet and Blooming Dahlia
    { bgColor: '42EADD', fontColor: 'CDB599' }, // Turquoise and Warm Sand
    { bgColor: '000000', fontColor: 'FFFFFF' }, // Black and White
    { bgColor: '00A4CC', fontColor: 'F95700' }, // Blue and Orange
    { bgColor: '00203F', fontColor: 'ADEFD1' }, // Sailor Blue and Mint
    { bgColor: '606060', fontColor: 'D6ED17' }, // Gray and Lime Punch
    { bgColor: 'ED2B33', fontColor: 'D85A7F' }, // Cherry Tomato and Rapture Rose
    { bgColor: '2C5F2D', fontColor: '97BC62' }, // Forest Green and Moss Green
    { bgColor: '00539C', fontColor: 'EEA47F' }, // Royal Blue and Peach
    { bgColor: '0063B2', fontColor: '9CC3D5' }, // Electric Blue Lemonade and Aquamarine
    { bgColor: 'D198C5', fontColor: 'E0C568' }, // Orchid and Cream Gold
    { bgColor: '101820', fontColor: 'FEE715' }, // Black and Blazing Yellow
    { bgColor: 'CBCE91', fontColor: 'EA738D' }, // Pale Green and Bubblegum Pink
    { bgColor: 'B1624E', fontColor: '5CC8D7' }, // Copper Coin and Aged Copper
    { bgColor: '89ABE3', fontColor: 'FCF6F5' }, // Sky Blue and White
    { bgColor: 'E3CD81', fontColor: 'B1B3B3' }, // Dusky Citron and Cool Gray
    { bgColor: '101820', fontColor: 'F2AA4C' }, // Black and Orange
    { bgColor: 'A07855', fontColor: 'D4B996' }, // Brown Sugar and Beige
    { bgColor: '195190', fontColor: 'A2A2A1' }, // Turkish Sea and Silver
    { bgColor: '603F83', fontColor: 'C7D3D4' }, // Royal Purple and Ice Flow
    { bgColor: '2BAE66', fontColor: 'FCF6F5' }, // Island Green and White
    { bgColor: 'FAD0C9', fontColor: '6E6E6D' }, // Pink Salt and Charcoal Gray
    { bgColor: '2D2926', fontColor: 'E94B3C' }, // Black and Cherry Tomato
    { bgColor: 'DAA03D', fontColor: '616247' }, // Mango Mojito and Terrarium Moss
    { bgColor: '990011', fontColor: 'FCF6F5' }, // Space Cherry and White
    { bgColor: '435E55', fontColor: 'D64161' }, // Hunter Green and Raspberry
    { bgColor: 'FAEBEF', fontColor: '333D79' }, // Pink and Navy Blue
    { bgColor: 'F93822', fontColor: 'FDD20E' }, // Bright Red and Cyber Yellow
    { bgColor: 'F2EDD7', fontColor: '755139' }, // Sweet Corn and Toffee
    { bgColor: '006B38', fontColor: '101820' }, // Dark Green and Black
    { bgColor: 'F95700', fontColor: 'FFFFFF' }, // Orange and White
    { bgColor: 'FFD662', fontColor: '00539C' }, // Aspen Gold and Princess Blue
    { bgColor: 'D7C49E', fontColor: '343148' }, // Soybean and Eclipse
    { bgColor: 'FFA177', fontColor: 'F5C7B8' }, // Cantaloupe and Blush
    { bgColor: 'DF6589', fontColor: '3C1053' }, // Rose Pink and Purple
    { bgColor: 'FFE77A', fontColor: '2C5F2D' }, // Mellow Yellow and Verdant Green
    { bgColor: 'DD4132', fontColor: '9E1030' }, // Fiesta and Jester Red
    { bgColor: 'F1F4FF', fontColor: 'A2A2A1' }, // Powdered Sugar and Silver
    { bgColor: 'FCF951', fontColor: '422057' }, // Lemon Tonic and Purple
    { bgColor: '4B878B', fontColor: 'D01C1F' }, // Teal and Fiery Red
    { bgColor: '1C1C1B', fontColor: 'CE4A7E' }, // Nebulosity and Pink Yarrow
    { bgColor: '00B1D2', fontColor: 'FDDB27' }, // Blue Atoll and Vibrant Yellow
    { bgColor: '79C000', fontColor: 'FF7F41' }, // Lime Green and Orange
    { bgColor: 'BD7F37', fontColor: 'A13941' }, // Inca Gold and Scarlet Sage
    { bgColor: 'CBCE91', fontColor: '9FC131' }, // Pale Lilac and Lime Green
    { bgColor: '00239C', fontColor: 'E10600' }, // Dark Blue and Red
  ];

  // Define possible values for fontName
  const possibleFontNames = [
    'Lato',
    'Roboto',
    'Montserrat',
    'Open Sans',
    'Raleway',
    'Source Sans Pro',
    'Oswald',
    'Playfair Display',
  ];

  // Shuffle the arrays randomly
  const shuffledColors = shuffleArray(possibleColors);
  const shuffledFontNames = shuffleArray(possibleFontNames);

  // Get random values from the shuffled arrays
  const randomColors =
    shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
  const randomFontName =
    shuffledFontNames[Math.floor(Math.random() * shuffledFontNames.length)];

  // Generate the logo URL
  const logoUrl = `https://placehold.co/${width}x${height}/${randomColors.bgColor}/${randomColors.fontColor}?font=${randomFontName}`;

  return logoUrl;
}

/**
 * Shuffle an array randomly.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function getFirstLettersOrWord(inputString) {
  // Split the input string by spaces
  const words = inputString.split(' ');

  // If there are multiple words, extract the first letter of each word
  if (words.length > 1) {
    const firstLetters = words.map((word) => word[0]);
    return firstLetters.join('');
  } else {
    if (inputString.length < 8) {
      return inputString;
    } else {
      return inputString.slice(0, 5);
    }
  }
}

export default CreateDemoAccount;
