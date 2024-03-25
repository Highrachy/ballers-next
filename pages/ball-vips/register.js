import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import TitleSection, {
  EmptyTitleSection,
} from '@/components/common/TitleSection';
import { Content } from 'pages/register';

const Register = () => (
  <>
    <Header />
    <TitleSection
      name="Sellers Registration Page"
      content="Create a new Seller account"
    />
    <EmptyTitleSection>
      <Content currentUser="vendor" showVendorOnly />
    </EmptyTitleSection>
    <Footer />
  </>
);

export default Register;
