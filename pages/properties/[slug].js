import React, { useEffect, useState } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { useToast } from 'components/utils/Toast';
import { API_ENDPOINT } from 'utils/URL';
import { useRouter } from 'next/router';
import {
  ComparePropertyButton,
  PropertyDescription,
  PropertyHeader,
  PropertyImage,
  ViewVendorButton,
} from '@/components/shared/SingleProperty';
import { ScheduleTourButton } from '@/components/pages/user/SingleUserProperty';
import Link from 'next/link';
import Axios from 'axios';
import { Card } from 'react-bootstrap';
import { FloorPlansList } from '@/components/shared/FloorPlans';
import { NeighborhoodList } from '@/components/shared/Neighborhood';
import { TestimonialsList } from '@/components/shared/Testimonials';
import { VideosList } from '@/components/shared/Video';
import SharerModal from '@/components/utils/SharerModal';
import Button from '@/components/forms/Button';
import { Spacing } from '@/components/common/Helpers';

const PublicPropertySingle = ({ property }) => {
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

  const [tagline, setTagline] = useState('');

  useEffect(() => {
    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
    setTagline(randomTagline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <>
      <section className="card-container mt-4 h-100 property-holder__big">
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
              <Button href="/contact-us">Make Enquiry</Button>
            </>
          }
        />
        <PropertyImage property={property} />
        <div className="row mt-5">
          <div className="col-sm-12">
            <PropertyDescription
              property={property}
              enquiryInfo={enquiryInfo}
              vendorInfo={vendorInfo}
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
                  <ViewVendorButton property={property} />
                </div>
              }
              isPortfolioPage={false}
            />
          </div>
        </div>

        {/* <div className="property-contact">
          <div className="row">
            <div className="col-md-12 interested-contact">
              <h5>Interested in this property?</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="media">
                <div className="media-body">
                  <h5 className="mt-0">
                    <span data-bs-toggle="modal" data-bs-target="#userContact">
                      080344543234 <br />
                    </span>{' '}
                    <a
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#userContact"
                    >
                      CALL US NOW
                    </a>{' '}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="media">
                <div className="media-body">
                  <h5 className="mt-0">
                    <span data-bs-toggle="modal" data-bs-target="#userContact">
                      23480987678 <br />
                    </span>{' '}
                    <a
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#userContact"
                    >
                      CHAT VIA WHATSAPP
                    </a>{' '}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="media">
                <img
                  src="/assets/static/main/images/b04784820fe20e9cfd4475b5303a0cc3-phone.png"
                  alt="..."
                />
                <div className="media-body">
                  <h5 className="mt-0">
                    {' '}
                    <a
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#messageAgent"
                    >
                      CONTACT US
                    </a>{' '}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <FloorPlansList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
        <NeighborhoodList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
        <TestimonialsList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
        <VideosList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
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
