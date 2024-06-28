import React from 'react';
import {
  PortfolioIcon,
  HomeIcon,
  TransactionIcon,
  ProfileIcon,
  ReferIcon,
  PropertyIcon,
  VasIcon,
  SupportIcon,
} from 'components/utils/Icons';

const userMenu = [
  {
    title: 'Home',
    to: '/user/dashboard',
    icon: <HomeIcon />,
    footer: true,
  },
  {
    title: 'My Portfolio',
    to: '/user/portfolio',
    icon: <PortfolioIcon />,
    footer: true,
  },
  {
    title: 'Transaction',
    to: '/user/transactions',
    icon: <TransactionIcon />,
    footer: false,
  },
  {
    title: 'Just For You',
    to: '/user/just-for-you',
    icon: <PropertyIcon />,
    footer: true,
  },
  {
    title: 'Services',
    to: '/user/services',
    icon: <VasIcon />,
    footer: false,
  },
  {
    title: 'Settings',
    to: '/user/settings',
    icon: <ProfileIcon />,
    footer: false,
  },
  {
    title: 'Support',
    to: '/user/support-ticket',
    icon: <SupportIcon />,
    footer: false,
  },
  {
    title: 'Refer to Earn',
    to: '/user/refer-and-earn',
    icon: <ReferIcon />,
    footer: true,
  },
];

export const userLoadingMenu = [
  {
    title: 'Home',
    to: '/user/dashboard',
    icon: <HomeIcon />,
    footer: true,
  },
  {
    title: 'Settings',
    to: '/user/settings',
    icon: <ProfileIcon />,
    footer: false,
  },
  {
    title: 'Refer to Earn',
    to: '/user/refer-and-earn',
    icon: <ReferIcon />,
    footer: true,
  },
];
export default userMenu;
