import React from 'react';
import TermsOfUse from '@/components/pages/frontend/TermsOfUse';
import SeoHead from '@/components/utils/SeoHead';

const TermsOfUsePage = () => {
  return (
    <>
      <SeoHead
        title="BALL Terms of Use | User Agreement and Legal Guidelines"
        description="Review the BALL Terms of Use to understand the rules, responsibilities and legal guidelines for using the BALL platform. Learn about acceptable use, account responsibilities and user rights."
        canonical="https://ballers.ng/terms-of-use"
        ogImage="https://www.ballers.ng/img/pages/og-default.png"
        keywords={[
          'BALL terms of use',
          'ballers nigeria policies',
          'user agreement',
          'legal guidelines',
          'ball platform rules',
          'ball real estate terms',
        ]}
      />
      <TermsOfUse />;
    </>
  );
};

export default TermsOfUsePage;
