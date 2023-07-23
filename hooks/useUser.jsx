import React from 'react';
import { DASHBOARD_PAGE, USER_TYPES } from 'utils/constants';
import { UserContext } from 'context/UserContext';
import { getUserRoleFromStore } from 'utils/localStorage';

export const useCurrentRole = () => {
  const { userState } = React.useContext(UserContext);

  const role = userState?.role || getUserRoleFromStore();
  return {
    isAdmin: role === USER_TYPES.admin,
    isEditor: role === USER_TYPES.editor,
    isUser: role === USER_TYPES.user,
    isVendor: role === USER_TYPES.vendor,
    name: DASHBOARD_PAGE[userState?.role],
    role,
  };
};
