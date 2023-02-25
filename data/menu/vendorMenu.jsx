import React from 'react';
import {
  HomeIcon,
  ProfileIcon,
  ReferIcon,
  PortfolioIcon,
  TransactionIcon,
} from 'components/utils/Icons';
import { MessageIcon } from 'components/utils/Icons';
import { FileIcon } from 'components/utils/Icons';
import {} from 'components/utils/Icons';
import { OfferIcon } from 'components/utils/Icons';
import { PropertyIcon } from 'components/utils/Icons';
import { VasIcon } from 'components/utils/Icons';

const vendorMenu = [
  {
    title: 'Home',
    to: '/vendor/dashboard',
    icon: <HomeIcon />,
    footer: true,
  },
  {
    title: 'Properties',
    to: '/vendor/properties',
    icon: <PropertyIcon />,
    footer: true,
  },
  {
    title: 'Offers',
    to: '/vendor/offers',
    icon: <OfferIcon />,
    footer: false,
  },
  {
    title: 'Portfolios',
    to: '/vendor/portfolios',
    icon: <PortfolioIcon />,
    footer: true,
  },
  {
    title: 'Transaction',
    to: '/vendor/transactions',
    icon: <TransactionIcon />,
    footer: true,
  },
  {
    title: 'Services',
    to: '/vendor/service',
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
    title: 'Refer to Earn',
    to: '/user/refer-and-earn',
    icon: <ReferIcon />,
    footer: true,
  },
];

export const unVerifiedVendorSideMenu = [
  {
    title: 'Home',
    to: '/vendor/dashboard',
    icon: <HomeIcon />,
    footer: false,
  },
  {
    title: 'Company Info',
    to: '/vendor/setup/1',
    icon: <PortfolioIcon />,
    footer: true,
  },
  {
    title: 'Bank Information',
    to: '/vendor/setup/2',
    icon: <TransactionIcon />,
    footer: true,
  },
  {
    title: 'Signatories',
    to: '/vendor/setup/3',
    icon: <MessageIcon />,
    footer: true,
  },
  {
    title: 'Certificates',
    to: '/vendor/setup/4',
    icon: <FileIcon />,
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
    footer: false,
  },
];

export default vendorMenu;
