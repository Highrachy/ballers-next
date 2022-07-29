import React from 'react';
import ProfileIcon from 'assets/img/icons/profile-icon.png';
import GettingStartedIcon from 'assets/img/icons/geting-started-icon.png';
import SecurityIcon from 'assets/img/icons/security-icon.png';
import PaymentIcon from 'assets/img/icons/payment-icon.png';
import Link from 'next/link';

const faqs = {
  gettingStarted: {
    name: 'Getting Started',
    icon: GettingStartedIcon,
    description: (
      <>
        This are questions on the general topic on about BALL.{' '}
        <br className="d-none d-lg-block" /> Please go through this section if
        you need your questions answered.
      </>
    ),
    faqs: [
      {
        question: 'What is BALL?',
        answer:
          'BALL is an acronym for Become A Landlord. It is an online platform that you can use to plan your income properly and define a clear step-by-step process that will take you from your current financial position to owning your dream home.',
        showOnHomePage: true,
      },
      {
        question: <>What is special about BALL?</>,
        answer:
          'BALL is the only platform that gives you the flexibility to make convenient contributions towards owning your home inline with your income. BALL also avails you with a myriad of benefits including additional income via our referral program, and access to vast real estate knowledge via our community.',
        showOnHomePage: true,
      },
      {
        question: 'Why should I subscribe to the BALL platform?',
        answer:
          'BALL is not for everyone, but if you are keen on owning your home in the shortest possible time with the least amount of stress then you should sign up.',
        showOnHomePage: true,
      },
      {
        question: <>Is this a rent-to-own scheme?</>,
        answer:
          'No, BALL is a platform that you can use to enhance your eligibility to access available property acquisition options including rent-to-own, mortgages and spread payments.',
        showOnHomePage: false,
      },
      {
        question: <>What is the minimum amount to invest?</>,
        answer:
          'You can begin your subscription with as low as N50,000.00 with additional monthly payments of N10,000.00',
        showOnHomePage: true,
      },
      {
        question: <>How long does it take for me to own a home?</>,
        answer:
          '  The duration is based on several parameters including your disposable income, availability of savings that can be contributed at the beginning of the BALLing experience, type of home and Location of the property. However, if you have a substantial amount saved and can make significant monthly contributions, you can be handed the keys to your new home in less than 2 years.',
        showOnHomePage: true,
      },
      {
        question: <>How does BALL work?</>,
        answer: (
          <>
            It’s easy, just 1. Apply by filling the sign-up form 2. Begin to
            remit periodic payments in-line with your income streams 3. Convert
            your subscription by selecting your preferred form of property
            acquisition once your total amount is sufficient to access your
            dream home.
          </>
        ),
        showOnHomePage: false,
      },
      {
        question: <> Do I have to be a millionaire to BALL?</>,
        answer: (
          <>
            No you do not, you can start from wherever you currently are
            financially. However, we assure you that BALLing will definitely
            take you millionaire status.
          </>
        ),
        showOnHomePage: false,
      },
    ],
  },
  payment: {
    name: 'Payment',
    icon: PaymentIcon,
    description: (
      <>
        These are payment related questions about BALL. Please go through this
        section if you need your questions answered.
      </>
    ),
    faqs: [
      {
        question: 'How do I make my periodic payments?',
        answer:
          ' Via the payment gateway within your dashboard on this BALL platform.',
        showOnHomePage: false,
      },
      {
        question: 'Can I upgrade my saving plan in the future?',
        answer:
          'Yes you can, you are at liberty to alter your subscription amount to align with your reality which may mean an upward or downward review as convenient, you can also pause your contributions where unavoidable life requirements present themselves.',
        showOnHomePage: false,
      },
    ],
  },
  security: {
    name: 'Security',
    icon: SecurityIcon,
    description: (
      <>
        These are security related questions about BALL. Please go{' '}
        <br className="d-none d-lg-block" /> through this section if you need
        your questions answered.
      </>
    ),
    faqs: [
      {
        question: <>What Happens If I Lose My Password</>,
        answer:
          'You can reset your password by clicking on the reset password link. A link will be sent to your registered mail where you can change your password.',
        showOnHomePage: false,
      },
    ],
  },
  profile: {
    name: 'Profile',
    icon: ProfileIcon,
    description: (
      <>
        These are profile related questions about BALL. Please go{' '}
        <br className="d-none d-lg-block" /> through this section if you need
        your questions answered.
      </>
    ),
    faqs: [
      {
        question: <>How Do I Create My Profile</>,
        answer: (
          <>
            By completing the easy-to-fill application form. Kindly{' '}
            <Link href="/register">click here</Link>
          </>
        ),
        showOnHomePage: false,
      },
      {
        question: <>What Can I Do With My Profile?</>,
        answer:
          'You can do a multitude of things including check your amount contributed till date, see your amount earned, conduct property analysis, see a variety of acquisition options, and more.',
        showOnHomePage: false,
      },
      {
        question: <>What documents do I have to supply to apply?</>,
        answer:
          'To sign-up, all you need to do is fill the application form and select any of the available remittance options.',
        showOnHomePage: false,
      },
    ],
  },
};

export default faqs;
