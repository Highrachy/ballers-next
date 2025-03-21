import React, { useEffect, useState } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Toast, { useToast } from 'components/utils/Toast';
import { API_ENDPOINT } from 'utils/URL';
import {
  ComparePropertyButton,
  PropertyDescription,
  PropertyHeader,
  PropertyImage,
  PropertyLists,
  ViewEligibilityButton,
} from '@/components/shared/SingleProperty';
import { ScheduleTourButton } from '@/components/pages/user/SingleUserProperty';
import Axios from 'axios';
import SharerModal from '@/components/utils/SharerModal';
import Button from '@/components/forms/Button';
import { Spacing } from '@/components/common/Helpers';
import NoContent from '@/components/utils/NoContent';
import { PropertyIcon } from '@/components/utils/Icons';
import { useChatMessage } from '@/context/ChatContext';

const taglines = [
  'BALL: Where Dreams Take Shape - Discover Your Perfect Home, Defined by Elegance and Tranquility',
  'Unveil Home Perfection: Experience Bliss with BALL',
  'A Place to Call Your Own: Uncover the Essence of True Belonging',
  'Elevate Your Lifestyle: Find Your Bliss in This Exquisite Residence',
  'Unlock the Beauty Within: Embrace Your Dream Home through BALL',
  'Embrace Luxury, Embrace BALL: Find Your Sanctuary in Style',
  'Where Dreams Reside: Find Your Forever Home with BALL',
  'Envision Home Serenity: Let BALL Guide You to Your Haven',
];

const PublicPropertySingle = ({ property }) => {
  const { setMessage } = useChatMessage();

  const [tagline, setTagline] = useState('');

  useEffect(() => {
    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
    setTagline(randomTagline);
  }, []);

  useEffect(() => {
    setMessage(
      `Hello! I am interested in: ${property?.name}. Can you provide more details about this property?`
    );
  }, [property, setMessage]);

  if (!property) {
    return null;
  }

  return (
    <>
      <Header />
      <TitleSection name="Single Property" content={tagline} />
      <section className="row justify-content-center">
        <div className="col-md-10 mt-3">
          <LoadProperty property={property} />
        </div>
      </section>

      <CommunityGallery />
      <Footer />
    </>
  );
};

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const LoadProperty = ({ property }) => {
  const [toast, setToast] = useToast();
  const enquiryInfo = property?.enquiryInfo;
  const vendorInfo = property?.vendorInfo;
  const setProperty = () => {};

  if (!property?.name)
    return (
      <NoContent
        text={'Property not found or approved yet.'}
        Icon={<PropertyIcon />}
        className="mt-6"
      />
    );

  return (
    <>
      <section className="card-container mt-4 h-100 property-holder__big">
        <Toast {...toast} />
        <PropertyHeader
          property={property}
          enquiryInfo={enquiryInfo}
          vendorInfo={vendorInfo}
          isPortfolioPage={false}
          hideBuyNowButton
          actionButton={
            <>
              <SharerModal />
              <Spacing />
              <Button
                href={`/contact-us?text=Hello, I am interested in the ${property?.name} property. Please provide further details&subject=Property Application: ${property?.name}`}
              >
                Make Enquiry
              </Button>
            </>
          }
        />
        <PropertyImage property={property} />
        <div className="row">
          <div className="col-sm-12">
            <PropertyDescription
              property={property}
              enquiryInfo={enquiryInfo}
              vendorInfo={vendorInfo}
              isPublicPage
              Actionbar={
                <div className="mt-3 d-flex">
                  <ComparePropertyButton property={property} />
                  <Spacing />
                  <ScheduleTourButton
                    property={property}
                    visitationInfo={[]}
                    setToast={setToast}
                    userHasScheduledVisit={false}
                  />
                  <Spacing />
                  <ViewEligibilityButton property={property} />
                </div>
              }
              isPortfolioPage={false}
            />
          </div>
        </div>

        <PropertyLists
          property={property}
          setToast={setToast}
          setProperty={setProperty}
          isPublicPage
        />
      </section>
    </>
  );
};

export default PublicPropertySingle;

export async function getStaticProps({ params }) {
  const slug = params['slug'];
  const singleProperty = await Axios.get(API_ENDPOINT.getPropertyBySlug(slug));

  const property = singleProperty.data.result?.[0] || {};

  return {
    props: {
      property,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const propertiesRes = await Axios.get(API_ENDPOINT.getAllProperties());
  const propertyLists = propertiesRes?.data?.result;
  return {
    paths: propertyLists.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: true,
  };
}
