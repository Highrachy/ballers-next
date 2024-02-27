import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { MdOutlineRocketLaunch } from 'react-icons/md';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { MdOutlineVpnKey } from 'react-icons/md';
import { MdOutlineHome } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { MdOutlineAssessment } from 'react-icons/md';
import Link from 'next/link';

const AboutUs = () => (
  <>
    <Header />
    <TitleSection
      name="BALL Documentation"
      content="Guiding Your Path to Homeownership and Real Estate Success with BALL"
    />
    <Documentation />
    <CommunityGallery />
    <Footer />
  </>
);

const FeaturedItem = ({ title, links, icon }) => {
  return (
    <section className="col-xl-4 col-lg-4 col-md-6">
      <div className="mb-6">
        <div className="docs__content">
          <h3 className="docs__title mb-2">
            <span className="docs__icon me-2">{icon}</span>
            {title}
          </h3>
          <div className="line"></div>
          <ul className="list-unstyled">
            {links.map((link, index) => (
              <li key={index}>
                <Link href={`docs/${link.url}`}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Documentation = () => {
  const featuredItems = [
    {
      title: 'Getting Started',
      icon: <MdOutlineRocketLaunch />,
      links: [
        {
          url: 'getting-started',
          label: 'Introduction to BALL Platform',
        },
        { url: 'create-account', label: 'Creating an Account' },
        { url: 'explore', label: 'Exploring Properties' },
        { url: 'payment-plan', label: 'Choosing a Payment Plan' },
        { url: 'making-plans', label: 'Making Payments' },
        { url: 'tracking-progress', label: 'Tracking Progress' },
      ],
    },
    {
      title: 'Property Eligibility',
      icon: <MdOutlineAssessment />,
      links: [
        { url: 'check-eligibility', label: 'Checking your Eligibility' },
        {
          url: 'check-eligibility',
          label: 'Searching for your preferred Property',
        },
        { url: 'property-eligibility', label: 'Buying Properties on BALL' },
        { url: 'payment-type', label: 'Understanding the Payments Type' },
        { url: 'mortgages', label: 'Making your first payment' },
      ],
    },
    {
      title: 'User Accounts',
      icon: <MdOutlineAccountCircle />,
      links: [
        { url: 'features-benefits', label: 'Features and Benefits' },
        { url: 'account-setup', label: 'Account Setup' },
        { url: 'payment-plans', label: 'Managing Payment Plans' },
        { url: 'redeem-rewards', label: 'Redeeming Rewards' },
        { url: 'referral-program', label: 'Referral Program' },
        { url: 'security-measures', label: 'Security Measures' },
      ],
    },
    {
      title: 'VIP Accounts',
      icon: <MdOutlineVpnKey />,
      links: [
        { url: 'features-benefits', label: 'Features and Benefits' },
        { url: 'account-setup', label: 'Account Setup' },
        {
          url: 'dashboard',
          label: 'Understanding your administrative section',
        },
        { url: 'property-listings', label: 'Managing Property Listings' },
        { url: 'tracking-transactions', label: 'Tracking Transactions' },
        { url: 'marketing-tools', label: 'Enhanced Marketing Tools' },
        { url: 'tour-analytics', label: 'Tour Analytics' },
        { url: 'support-services', label: 'VIP Support Services' },
      ],
    },
    {
      title: 'Property Management',
      icon: <MdOutlineHome />,
      links: [
        {
          url: 'listing-properties',
          label: 'Listing Properties',
        },
        { url: 'upload-details', label: 'Uploading Property Details' },
        { url: 'set-pricing', label: 'Setting Pricing and Payment Plans' },
        { url: 'enhance-listings', label: 'Enhancing Listings' },
        {
          url: 'managing-property-tours',
          label: 'Managing Property Tours',
        },
        { url: 'schedule-tours', label: 'Scheduling Tours' },
        { url: 'collect-feedback', label: 'Collecting Feedback' },
        {
          url: 'handling-contracts',
          label: 'Handling Contracts and Negotiations',
          subLinks: [
            { url: 'contract-management', label: 'Contract Management Tools' },
            { url: 'negotiation-strategies', label: 'Negotiation Strategies' },
            { url: 'closing-deals', label: 'Closing Deals' },
          ],
        },
      ],
    },
    {
      title: 'Support and Resources',
      icon: <MdOutlineSettings />,
      links: [
        { url: 'faqs', label: 'FAQs', external: true },
        { url: 'contact-support', label: 'Contacting Support' },
        { url: 'knowledge-base', label: 'Knowledge Base' },
        { url: 'community-forums', label: 'Community Forums' },
        { url: 'training-webinars', label: 'Training and Webinars' },
      ],
    },
  ];

  return (
    <div className="featured-area featured-bg pt-130 pb-100 p-relative">
      <div className="container">
        <div className="row mt-6">
          {featuredItems.map((item, index) => (
            <FeaturedItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
