import React, { useEffect, useState } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Toast, { useToast } from 'components/utils/Toast';
import { API_ENDPOINT } from 'utils/URL';
import Axios from 'axios';
import SharerModal from '@/components/utils/SharerModal';
import Button from '@/components/forms/Button';
import NoContent from '@/components/utils/NoContent';
import { PropertyIcon } from '@/components/utils/Icons';
import { OnlineImage } from '@/components/utils/Image';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { moneyFormatInNaira } from '@/utils/helpers';
import { GoDotFill } from 'react-icons/go';
import { PropertyContact } from '@/components/shared/SingleProperty';
import { ServiceCard } from '.';

const PublicPropertySingle = ({ service, serviceLists }) => {
  if (!service) {
    return null;
  }

  return (
    <>
      <Header />
      <TitleSection
        name={service.name}
        content="Tranforming Spaces, building dreams"
      />
      <section className="row justify-content-center">
        <div className="col-md-10 mt-3">
          <LoadService {...service} serviceLists={serviceLists} />
        </div>
      </section>

      <CommunityGallery />
      <Footer />
    </>
  );
};

const pageOptions = {
  key: 'service',
  pageName: 'Service',
};

const LoadService = ({
  name,
  image,
  type,
  old_price,
  price,
  description,
  advantages,
  slug,
  serviceLists,
}) => {
  const [toast, setToast] = useToast();

  if (!name)
    return (
      <NoContent
        text={'Service not found or approved yet.'}
        Icon={<PropertyIcon />}
        className="mt-6"
      />
    );

  return (
    <>
      <section className="card-container mt-4 h-100 property-holder__big">
        <Toast {...toast} />
        <article className="services-details">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-8">
                <h2 className="property-holder__big-title">{name} </h2>
                <h3 className="text-secondary mb-2">
                  <span>{moneyFormatInNaira(price)}</span>
                  <span className="text-soft ms-3 text-price-strike">
                    {moneyFormatInNaira(old_price)}
                  </span>
                </h3>
              </div>
              <div className="col-sm-4 text-end">
                <Link href={`/user/property`} passHref>
                  <a className="btn btn-sm btn-wide btn-secondary">
                    Interested in this Service
                  </a>
                </Link>
              </div>
              <div className="hover-image">
                <OnlineImage
                  name={name}
                  src={`/img/services/${image}`}
                  alt={`Service: ${name}`}
                  className="img-fluid property-img"
                />
              </div>
            </div>
            <section className="row">
              <div className="col-lg-7">
                <div className="pe-4">
                  <div className="lead mt-5">{description}</div>
                  <div className="mt-3">
                    <p className="">
                      Here are the reasons why you should consider {name}
                    </p>
                    <ol className="list-unstyled">
                      {advantages.map((advantage, index) => (
                        <li key={index} className="mb-2">
                          <strong>
                            {index + 1}. {advantage.title}
                          </strong>
                          : {advantage.description}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="services-details__sidebar">
                  <div className="card mt-5 p-4">
                    <h4 className="contact-hello-heading">
                      Request for Service
                    </h4>
                    <form method="post" data-toggle="validator">
                      <div className="form-group">
                        <label htmlFor="name">Your Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="contact-name"
                          name="name"
                          required
                        />
                        <small className="help-block with-errors text-danger" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Your Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="contact-email"
                          name="email"
                          required
                        />
                        <small className="help-block with-errors text-danger" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">Your Message *</label>
                        <textarea
                          className="form-control"
                          id="contact-message"
                          name="message"
                          required
                        />
                        <small className="help-block with-errors text-danger" />
                      </div>
                      <button type="submit" className="btn btn-secondary">
                        Request for Service
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            <section className="row">
              <PropertyContact />
            </section>

            <section className="row">
              <h3 className="mt-7 mb-3">Other Recommended Services</h3>
              {serviceLists.map((service, index) => {
                return (
                  <div className="col-sm-6 mb-5" key={index}>
                    <ServiceCard {...service} />
                  </div>
                );
              })}
            </section>
          </div>
        </article>
      </section>
    </>
  );
};

export default PublicPropertySingle;

export async function getStaticProps({ params }) {
  const slug = params['slug'];
  const singleService = await Axios.get(API_ENDPOINT.getVasBySlug(slug));
  const servicesRes = await Axios.get(API_ENDPOINT.getAllVas());
  const serviceLists = servicesRes?.data?.result;

  const service = singleService.data.result?.[0] || {};

  // Shuffle the services array to get a random selection
  const shuffledServices = serviceLists
    .filter(
      (service) =>
        service.slug !== slug && service.assignedRole === service.assignedRole
    )
    .sort(() => Math.random() - 0.5);
  // Select the first 3 services from the shuffled array
  const randomServices = shuffledServices.slice(0, 2);

  return {
    props: {
      service,
      serviceLists: randomServices,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const servicesRes = await Axios.get(API_ENDPOINT.getAllVas());
  const serviceLists = servicesRes?.data?.result;
  return {
    paths: serviceLists.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: true,
  };
}
