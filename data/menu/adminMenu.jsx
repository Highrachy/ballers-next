import React from 'react';
import {
  PortfolioIcon,
  HomeIcon,
  TransactionIcon,
  ProfileIcon,
  ReferIcon,
  UserIcon,
  EnquiryIcon,
  NotificationIcon,
  OfferIcon,
  VasIcon,
  SupportIcon,
  BlogIcon,
  GameIcon,
} from 'components/utils/Icons';
// import { VisitationIcon } from 'components/utils/Icons';
// import { MessageIcon } from 'components/utils/Icons';
import { PropertyIcon } from 'components/utils/Icons';
import { ReferralsIcon } from 'components/utils/Icons';
// import { ArticlesIcon } from 'components/utils/Icons';

const adminMenu = [
  {
    title: 'Home',
    to: '/admin/dashboard',
    icon: <HomeIcon />,
    footer: true,
  },
  {
    title: 'Properties',
    to: '/admin/properties',
    icon: <PropertyIcon />,
    footer: true,
  },
  {
    title: 'Users',
    to: '/admin/users',
    icon: <UserIcon />,
    footer: false,
  },
  {
    title: 'Portfolios',
    to: '/admin/portfolios',
    icon: <PortfolioIcon />,
    footer: true,
  },
  {
    title: 'Offers',
    to: '/admin/offers',
    icon: <OfferIcon />,
    footer: true,
  },
  {
    title: 'Transaction',
    to: '/admin/transactions',
    icon: <TransactionIcon />,
    footer: true,
  },
  {
    title: 'Services',
    to: '/admin/service',
    icon: <VasIcon />,
    footer: true,
  },
  {
    title: 'Blog',
    to: '/admin/blog',
    icon: <BlogIcon />,
    footer: true,
  },
  {
    title: 'Game Results',
    to: '/admin/game-results',
    icon: <GameIcon />,
    footer: true,
  },
  {
    title: 'Support',
    to: '/admin/support-ticket',
    icon: <SupportIcon />,
    footer: false,
  },
  {
    title: 'Referrals',
    to: '/admin/referrals',
    icon: <ReferralsIcon />,
    footer: true,
  },
];

export default adminMenu;
