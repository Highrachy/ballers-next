import React from 'react';
import PrivacyPolicy from '@/components/pages/frontend/PrivacyPolicy';
import SeoHead from '@/components/utils/SeoHead';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SeoHead
        title="BALL Privacy Policy | How We Protect Your Data"
        description="Review the BALL Privacy Policy to understand how your personal data is collected, used, stored and protected on the BALL platform. Learn about your rights and our commitment to secure real estate transactions."
        canonical="https://ballers.ng/privacy-policy"
        ogImage="https://www.ballers.ng/img/pages/og-default.png"
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
