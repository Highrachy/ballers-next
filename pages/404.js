import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Button from '@/components/forms/Button';

const Page404 = () => (
  <>
    <Header />
    <TitleSection
      name="Page Not Found"
      content="The requested page cannot be found."
    />
    <div className="text-center py-9 error-404">
      <p>Looks like you got lost</p>
      <h2>Page not found</h2>
      <Button color="secondary" href="/">
        Return to Home
      </Button>
    </div>
    <CommunityGallery />
    <Footer />
  </>
);

export default Page404;
