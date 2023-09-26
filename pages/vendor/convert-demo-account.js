import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { Home } from 'iconsax-react';
import WelcomeHero from '@/components/common/WelcomeHero';
import { InfoBox } from '@/components/dashboard/InfoBox';
import Textarea from '@/components/forms/Textarea';
import { Card } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import Button from '@/components/forms/Button';

const DemoAccount = () => {
  const [toast, setToast] = useToast();
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title="Convert Demo Account"
        subtitle="Exploring BALL's Features: Your Path to Real Estate Success"
      />
      <AdditionalContent />
    </BackendPage>
  );
};

const AdditionalContent = ({
  demoDaysRemaining = 29,
  onConvertClick = () => {},
}) => {
  return (
    <>
      <div className="container-fluid">
        <div className="mt-5">
          <InfoBox
            color="primary"
            title="Unlock the Full Potential"
            Icon={<Home variant="Bulk" />}
          >
            <p>
              You have{' '}
              <span className="fw-bold">{demoDaysRemaining} days &nbsp;</span>
              remaining to explore the powerful features and benefits of BALL.
            </p>
            <p>
              Ready to take your property journey to the next level? Convert
              your demo account into an active one and unlock a world of
              opportunities:
            </p>
            <ul>
              <li>Streamlined property management tools</li>
              <li>Access to a vast network of potential customers</li>
              <li>Valuable insights and analytics to optimize your business</li>
              <li>And much more!</li>
            </ul>
            <p>
              Don&apos;t miss out on the benefits of an active account. Click
              the button below to initiate the conversion process:
            </p>
            <button className="btn btn-success mt-2" onClick={onConvertClick}>
              Request Conversion
            </button>
          </InfoBox>
        </div>
      </div>
    </>
  );
};

export default DemoAccount;
