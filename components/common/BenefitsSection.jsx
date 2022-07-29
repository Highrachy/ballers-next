import React from 'react';
import { Card } from 'react-bootstrap';
import Income from 'assets/img/icons/income.png';
import Estates from 'assets/img/icons/estates.png';
import Credible from 'assets/img/icons/credible.png';
import Investment from 'assets/img/icons/investment.png';
import Fluid from 'assets/img/icons/fluid.png';
import PrevArrow from 'assets/img/icons/btn-prev.png';
import NextArrow from 'assets/img/icons/btn-next.png';
import Slider from 'react-slick';

const BenefitsSection = () => {
  const BALLERS_BENEFITS = [
    {
      title: 'Recurring Income',
      body:
        'You can create several income generating streams from just becoming a member; referral income (the best in the industry), bonus points, interest on your contribution.',
      image: Income,
    },
    {
      title: 'Existing Estates',
      body:
        'We brought you the I-Factor and then Blissville, you can clearly see that our mantra is value driven quality real estate that enhances your overall living experience.',
      image: Estates,
    },
    {
      title: 'Credibility',
      body:
        'Powered by a team of seasoned professionals with extensive track record.',
      image: Credible,
    },
    {
      title: 'Investment Oriented',
      body:
        'For every contribution you make you get immediate bonus points that can easily be redeemed for a wide range of relaxing and sumptuous social activities.',
      image: Investment,
    },
    {
      title: 'Fluidity & Flexibility',
      body:
        'You can choose any amount to contribute once you have started and  you can pause or exit the scheme if so desired.',
      image: Fluid,
    },
  ];
  const CarouselArrow = ({ className, style, onClick, image }) => (
    <img
      src={image}
      className={className}
      onClick={onClick}
      style={{ ...style, display: 'block' }}
      alt="previous arrow"
    />
  );

  const settings = {
    speed: 1500,
    infinite: true,
    centerMode: true,
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
    prevArrow: <CarouselArrow image={PrevArrow} />,
    nextArrow: <CarouselArrow image={NextArrow} />,
  };

  return (
    <section className="benefits bg-light-blue pb-5">
      <div className="text-center">
        <h6 className="header-secondary">BENEFITS</h6>
        <h3>Why Ballers is Special</h3>
      </div>
      <div className="container-fluid">
        <Slider {...settings}>
          {BALLERS_BENEFITS.map((benefit, index) => (
            <Card key={index}>
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
