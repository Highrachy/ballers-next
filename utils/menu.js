import {
  BsBook,
  BsHouseDoor,
  BsQuestionSquare,
  BsPeople,
  BsBuilding,
  BsCreditCard,
  BsTools,
  BsChatQuote,
  BsGearWideConnected,
  BsNewspaper,
} from 'react-icons/bs';

const howItWorksDropdown = [
  {
    title: 'A - Z of BALL',
    description:
      'Comprehensive guide covering how to become a Landlord in 3 simple steps',
    icon: <BsBook />,
    link: '/a-z-of-ball',
  },
  {
    title: 'Benefits of BALL',
    description:
      'Explore the advantages of using BALL for your home ownership journey',
    icon: <BsHouseDoor />,
    link: '/#why-choose-ball',
  },
  {
    title: 'FAQs',
    description: 'Find answers to frequently asked questions about BALL',
    icon: <BsQuestionSquare />,
    link: '/#faqs',
  },
];

const learnDropdown = [
  {
    title: 'Blog',
    description:
      'Access insightful articles and updates on real estate and home ownership',
    icon: <BsNewspaper />,
    link: '/blog',
  },
  {
    title: 'Guides',
    description:
      'Comprehensive guides and resources for navigating the home ownership process',
    icon: <BsHouseDoor />,
    link: '/guides',
  },
  {
    title: 'Community',
    description:
      'Join the BALL community to learn from others and share your experiences',
    icon: <BsPeople />,
    link: '/community',
  },
];

const forBuyers = [
  { title: 'Getting Started', link: '/getting-started' },
  { title: 'Creating an Account', link: '/creating-an-account' },
  { title: 'Confirm Your Eligibility', link: '/confirm-your-eligibility' },
  { title: 'FAQs', link: '/buyer-faqs' },
];

const forSellers = [
  { title: 'Getting Started', link: '/getting-started' },
  { title: 'Why Sell on BALL', link: '/why-sell-on-ball' },
  { title: 'Creating an Account', link: '/creating-an-account' },
  { title: 'Becoming a VIP', link: '/becoming-a-vip' },
  { title: 'FAQs', link: '/seller-faqs' },
];

const moreDropdown = [
  {
    title: 'About Us',
    description: 'Learn about the story, mission, and commitment behind BALL',
    icon: <BsPeople />,
    link: '/about-us',
  },
  {
    title: 'Services',
    description: 'Explore value-added services offered by BALL',
    icon: <BsGearWideConnected />,
    link: '/services',
  },
  {
    title: 'Contact Us',
    description: 'Reach out to us for any questions or assistance',
    icon: <BsChatQuote />,
    link: '/contact-us',
  },
];

export const Menus = [
  {
    name: 'How it Works',
    href: '/how-it-works',
    children: howItWorksDropdown,
  },
  { name: 'Properties', href: '/properties' },
  { name: 'Learn', href: '/docs' },
  // {
  //   name: 'Learn',
  //   href: '/learn',
  //   children: learnDropdown,
  //   additionalResources: [
  //     {
  //       title: 'For Buyers',
  //       links: forBuyers,
  //     },
  //     {
  //       title: 'For Sellers',
  //       links: forSellers,
  //     },
  //   ],
  // },
  { name: 'More', href: '/more', children: moreDropdown },
];

export const sellerDropdown = [
  {
    title: 'About BALL VIP',
    description:
      'Discover the benefits and features of becoming a BALL VIP member',
    icon: <BsBuilding />,
    link: '/ball-vips',
  },
  {
    title: 'Become a BALL VIP',
    description:
      'Find out how you can become a BALL VIP and unlock exclusive benefits',
    icon: <BsCreditCard />,
    link: '/ball-vips/register',
  },
  {
    title: 'Create a Demo Account',
    description:
      "Explore BALL's features and functionalities by creating a demo account",
    icon: <BsTools />,
    link: '/ball-vips/create-demo-account',
  },
];
