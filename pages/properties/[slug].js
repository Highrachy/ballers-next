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
import Button from '@/components/forms/Button';
import { Spacing } from '@/components/common/Helpers';
import NoContent from '@/components/utils/NoContent';
import { PropertyIcon } from '@/components/utils/Icons';
import { useChatMessage } from '@/context/ChatContext';
import ShareButton from '@/components/common/ShareButton';
import SeoHead from '@/components/utils/SeoHead';

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
      <SeoHead
        title={`${property?.name || 'Property'} — BALL Verified Property`}
        description={
          property?.metaDescription ||
          `${property?.name} is a verified property listed on BALL with flexible payment plans, trusted developers and secure buying options.`
        }
        canonical={`https://www.ballers.ng/properties/${property?.slug}`}
        ogImage={property?.mainImage || property?.images?.[0] || ''}
        keywords={[
          property?.name,
          `${property?.location?.area} homes`,
          'lagos property for sale',
          'nigeria real estate',
          'ball properties',
        ]}
      />

      {/* Hidden SEO block to fix low content */}
      <section className="visually-hidden">
        <h1>{property?.name} — Verified BALL Property</h1>
        <p>
          {property?.name} is a verified listing on BALL, offering secure
          documentation, flexible payments and trusted developer backing.
          Homebuyers can explore this property’s features, payment options,
          amenities and neighbourhood insights.
        </p>
        <p>
          BALL ensures every listed property is pre-vetted to protect buyers
          from fraud, misinformation and risky transactions. Explore pictures,
          pricing details, payment schedules and location highlights to make a
          confident real estate decision.
        </p>
      </section>
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
              <ShareButton
                className="btn-wide px-4"
                hasIcon={false}
                header="Share This Property"
                text={`Check out this property on BALL: ${property?.name}`}
              />
              <Spacing />
              <BuyNowButton property={property} />
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

export const BuyNowButton = ({ property, className = 'btn-wide' }) => (
  <Button
    className={className}
    href={`/contact-us?text=Hello, I am interested in buying the ${property?.name} property. Please provide further details&subject=Property Application: ${property?.name}`}
  >
    Buy Now
  </Button>
);
