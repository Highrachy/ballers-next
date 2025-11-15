import React from 'react';
import PrivacyPolicy from '@/components/pages/frontend/PrivacyPolicy';
import SeoHead from '@/components/utils/SeoHead';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SeoHead
        title="BALL Privacy Policy | How We Protect Your Data"
        description="Review the BALL Privacy Policy to understand how your data is collected, used and protected, and learn your rights while using the BALL real estate platform."
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
