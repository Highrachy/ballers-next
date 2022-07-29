import React from 'react';
import userSideMenu, { userLoadingMenu } from 'content/menu/userMenu';
import adminSideMenu from 'content/menu/adminMenu';
import editorSideMenu from 'content/menu/editorMenu';
import vendorSideMenu, {
  unVerifiedVendorSideMenu,
} from 'content/menu/vendorMenu';
import { USER_TYPES } from 'utils/constants';
import { UserContext } from 'context/UserContext';
import { getUserRoleFromStore } from 'utils/localStorage';

const SIDE_MENU = {
  [USER_TYPES.admin]: adminSideMenu,
  [USER_TYPES.editor]: editorSideMenu,
  [USER_TYPES.user]: userSideMenu,
  [USER_TYPES.vendor]: vendorSideMenu,
};

export const useMenu = () => {
  const { userState } = React.useContext(UserContext);

  // unverified vendor
  if (userState?.role === USER_TYPES.vendor && !userState?.vendor?.verified) {
    return unVerifiedVendorSideMenu;
  }

  //unloaded userState
  if (!userState.isLoggedIn) {
    return userLoadingMenu;
  }

  const currentUserRole = userState.role || getUserRoleFromStore();
  return SIDE_MENU[currentUserRole];
};
