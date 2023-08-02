import StepperPage from '@/components/layout/StepperPage';
import { BankInformationForm } from '@/components/pages/vendor/setup/BankInformation';
import { CertificatesForm } from '@/components/pages/vendor/setup/Certificates';
import { CompanyInformationForm } from '@/components/pages/vendor/setup/CompanyInformation';
import { ReviewInfoForm } from '@/components/pages/vendor/setup/ReviewInfo';
import { SignatoriesForm } from '@/components/pages/vendor/setup/Signatories';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import React from 'react';
import Toast, { useToast } from 'components/utils/Toast';
import {
  ADD_ENTERTAINER_STEPS,
  getCompletedSteps,
} from '@/components/pages/vendor/setup/AccountSetup';
import BackendPage from '@/components/layout/BackendPage';
import WelcomeHero from '@/components/common/WelcomeHero';

const Single = () => {
  const router = useRouter();
  const { id = 1 } = router.query;
  const [initialStep, setInitialStep] = React.useState(id);
  const { userState } = React.useContext(UserContext);

  React.useEffect(() => {
    if (id?.toString() !== initialStep?.toString()) setInitialStep(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [toast, setToast] = useToast();

  const moveToStep = (number) => setInitialStep(number);

  const ALL_STEPS = [
    null,
    <CompanyInformationForm
      key="1"
      moveToNextStep={() => moveToStep(2)}
      setStepToast={setToast}
    />,
    <BankInformationForm
      key="2"
      moveToNextStep={() => moveToStep(3)}
      setStepToast={setToast}
    />,
    <SignatoriesForm
      key="3"
      moveToNextStep={() => moveToStep(4)}
      setStepToast={setToast}
    />,
    <CertificatesForm
      key="4"
      moveToNextStep={() => moveToStep(5)}
      setStepToast={setToast}
    />,
    <ReviewInfoForm key="5" />,
  ];

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title="Vendor Verification"
        isApproved={userState?.vendor?.verified}
      />
      <StepperPage
        allSteps={ALL_STEPS}
        doneStatus={getCompletedSteps(userState)}
        initialStep={parseInt(initialStep, 10) || 1}
        pageSteps={ADD_ENTERTAINER_STEPS}
        title="Vendor Setup"
      />
    </BackendPage>
  );
};

export default Single;
