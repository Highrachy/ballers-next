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
    title: 'Referrals',
    to: '/admin/referrals',
    icon: <ReferralsIcon />,
    footer: true,
  },
];

export default adminMenu;
