import React from 'react';
import {
  HomeIcon,
  ProfileIcon,
  ReferIcon,
  BlogIcon,
  EditNoteIcon,
} from 'components/utils/Icons';

const editorMenu = [
  {
    title: 'Home',
    to: '/editor/dashboard',
    icon: <HomeIcon />,
    footer: true,
  },

  {
    title: 'Blog Posts',
    to: '/editor/blog',
    icon: <BlogIcon />,
    footer: true,
  },
  {
    title: 'Community',
    to: '/community',
    icon: <EditNoteIcon />,
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
