import React from 'react';
import { Card } from 'react-bootstrap';
import Slider from 'react-slick';
import { LocalImage } from '../utils/Image';

const CarouselArrow = ({ className, style, onClick, image }) => (
  <LocalImage
    src={image}
    className={className}
    onClick={onClick}
    style={{ ...style, display: 'block' }}
    alt="carousel arrow"
    width="50"
    height="50"
    serveImageFromCloud={false}
  />
);

export const sliderSettings = {
  speed: 1500,
  infinite: true,
  centerMode: true,
  dots: true,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToScroll: 1,
  centerPadding: '0',
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        centerMode: true,
        centerPadding: '1.5rem',
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 576,
      settings: {
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 1,
      },
    },
  ],
  prevArrow: <CarouselArrow image="/img/icons/btn-prev.png" />,
  nextArrow: <CarouselArrow image="/img/icons/btn-next.png" />,
};

const BenefitsSection = ({ isVendor }) => {
  const USER_BALLERS_BENEFITS = [
    {
      title: 'Quality Homes & Locations',
      body: 'Get your dream home in a safe and cozy community. Pick from different styles, places and features that you like.',
      image: '/img/benefits/estate.png',
    },
    {
      title: 'Referral Bonuses',
      body: 'Make money by telling your friends and family about BALL. You will earn a part of their payments as a thank you gift.',
      image: '/img/benefits/referral.png',
    },
    {
      title: 'Real Estate Knowledge',
      body: 'Learn from the experts and get smart tips on real estate. You will also join exclusive events, webinars and newsletters to stay updated.',
      image: 'img/benefits/building.png',
    },
    {
      title: 'Community Support',
      body: 'Join a community of people who share your vision and goals. You will network, collaborate and celebrate with other BALLers on your way to home ownership.',
      image: 'img/benefits/community.png',
    },
    {
      title: 'Flexible Payment Plans',
      body: 'Choose a payment plan that fits your income and budget. You can pay monthly, quarterly or yearly towards owning your home.',
      image: 'img/benefits/transaction.png',
    },
    {
      title: 'Security & Accountability',
      body: 'Trust a secure and accountable platform that protects your money and your home. Your payment is not only secure but insured to ensure your peace of mind.',
      image: 'img/benefits/security.png',
    },
  ];

  const VENDOR_BALLERS_BENEFITS = [
    {
      title: 'Real-Time Analytics',
      body: 'Gain access to real-time data on your transactions. Monitor progress, view buyer activity, and manage your property sales with ease.',
      image: 'img/benefits/transparency.png',
    },
    {
      title: 'Seamless Tour Scheduling',
      body: 'Manage property tours effortlessly with our automated system. Get instant notifications, use an intuitive calendar, and collect useful feedback from prospective buyers.',
      image: '/img/benefits/tour.png',
    },
    {
      title: 'Personalized Support',
      body: 'Sell with assurance, supported by trustworthy and personalized support. Our community connections provide you with solid support at every stage of your selling journey.',
      image: '/img/benefits/support.png',
    },
    {
      title: 'Simplified Contract Management',
      body: 'Make selling your property simple with our automated contract management. Handle offers, streamline negotiations, and ensure smooth and secure transactions.',
      image: '/img/benefits/contract.png',
    },
    {
      title: 'Enhanced Visibility',
      body: 'Enhance your property listings effortlessly with dynamic interfaces and effective marketing tools. Reach a broader audience and increase your chances of successful sales on the BALL platform.',
      image: 'img/benefits/visibility.png',
    },
    {
      title: 'Convenient Payments & Withdrawal',
      body: 'Enjoy the convenience of convenient payments and withdrawals. Get prompt payments once the buyer completes the transaction, offering you a hassle-free financial experience.',
      image: 'img/benefits/payments.png',
    },
  ];

  const settings = sliderSettings;
  const benefits = isVendor ? VENDOR_BALLERS_BENEFITS : USER_BALLERS_BENEFITS;

  return (
    <section
      id="why-choose-ball"
      className="benefits bg-light-blue my-5 py-5 pb-7"
    >
      <div className="text-center">
        <h6 className="header-secondary">BENEFITS</h6>
        <h3>Why BALL is Special</h3>
      </div>
      <div className="container-fluid">
        <Slider {...settings}>
          {benefits.map((benefit, index) => (
            <Card key={index} className="mb-5">
              <Card.Img
                variant="top"
                src={benefit.image}
                className="img-fluid benefits-icon"
                alt={benefit.title}
              />
              <Card.Body>
                <h6 className="text-secondary mb-3">{benefit.title}</h6>
                <Card.Text>{benefit.body}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default BenefitsSection;
