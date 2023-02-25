import React from 'react';
import {
  PropertyIcon,
  HomeIcon,
  ProfileIcon,
  ReferIcon,
} from 'components/utils/Icons';
import { ArticlesIcon } from 'components/utils/Icons';
// import { ArticlesIcon } from 'components/utils/Icons';

const editorMenu = [
  {
    title: 'Home',
    to: '/editor/dashboard',
    icon: <HomeIcon />,
    footer: true,
  },

  {
    title: 'Content Properties',
    to: '/editor/content-property',
    icon: <PropertyIcon />,
    footer: true,
  },
  {
    title: 'Knowledgebase',
    to: '/editor/knowledgebase',
    icon: <ArticlesIcon />,
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

export default editorMenu;
