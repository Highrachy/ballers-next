import React from 'react';
import PrivacyPolicy from '@/components/pages/frontend/PrivacyPolicy';
import SeoHead from '@/components/utils/SeoHead';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SeoHead
        title="BALL Privacy Policy | How We Protect Your Data"
        description="Review BALL's Privacy Policy to learn how your data is collected, used & protected, and understand your rights on the BALL platform."
        canonical="https://www.ballers.ng/privacy-policy"
        keywords={[
          'BALL privacy policy',
          'ballers nigeria privacy',
          'data protection nigeria',
          'user data policy',
          'real estate privacy policy',
          'ball platform privacy',
        ]}
      />
      <PrivacyPolicy />;
    </>
  );
};

export default PrivacyPolicyPage;
