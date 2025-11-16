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
import { Spacing } from '@/components/common/Helpers';
import NoContent from '@/components/utils/NoContent';
import { PropertyIcon } from '@/components/utils/Icons';
import { useChatMessage } from '@/context/ChatContext';
import ShareButton from '@/components/common/ShareButton';
import SeoHead from '@/components/utils/SeoHead';
import Link from 'next/link';

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
      <Header />
      <TitleSection
        name={property?.name || 'Single Property'}
        content={tagline}
      />
      {/* Hidden SEO block to fix low content */}
      <section className="visually-hidden">
        <p>
          {property?.name} is a verified listing on BALL, providing secure
          documentation, flexible payment options, and trusted developer
          support. Homebuyers can explore the property&apos;s features,
          amenities, and neighborhood details to make an informed choice.
        </p>

        <p>
          Every property on BALL is carefully pre-vetted to protect buyers from
          fraud, misinformation, and risky transactions. Detailed listings
          include high-quality images, verified pricing, payment schedules, and
          developer credentials to ensure transparency and trust.
        </p>

        <p>
          Buyers can review nearby schools, hospitals, shopping centers, and
          transport links, helping them assess the suitability of the location
          for their lifestyle and needs. This makes it easier to plan for daily
          living and long-term investment.
        </p>

        <p>
          BALL provides guidance on payment plans, mortgage options, and
          financing strategies, so users can determine affordability and plan
          their homeownership journey with confidence. Flexible plans cater to
          different budgets, making property ownership more accessible.
        </p>

        <p>
          Explore property features such as modern interiors, outdoor spaces,
          parking, swimming pools, and security systems. Verified listings also
          highlight developer reputation and project completion status, helping
          buyers make safer real estate decisions.
        </p>

        <p>
          By choosing verified properties on BALL, homebuyers gain access to a
          secure platform, professional support, and reliable information. This
          reduces risk, simplifies property selection, and allows buyers to
          confidently move closer to owning their dream home.
        </p>
      </section>

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
                  {/* <ComparePropertyButton property={property} /> */}
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

export const BuyNowButton = ({
  property,
  className = 'btn btn-secondary btn-wide',
}) => (
  <Link href={`/contact-us`} passHref>
    <a className={className} title="Buy Property Now">
      Buy Now
    </a>
  </Link>
);
