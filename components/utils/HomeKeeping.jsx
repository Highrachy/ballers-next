import React from 'react';
import { getTokenFromStore, storeUserRole } from 'utils/localStorage';
import axios from 'axios';
import { UserContext } from 'context/UserContext';
import { BASE_API_URL } from 'utils/constants';

export const HomeKeeping = ({ children, location }) => {
  const { userState, userDispatch } = React.useContext(UserContext);
  React.useEffect(() => {
    if (!userState.isLoggedIn && getTokenFromStore()) {
      axios
        .get(`${BASE_API_URL}/user/who-am-i`, {
          headers: {
            Authorization: getTokenFromStore(),
          },
        })
        .then(function (response) {
          const { status, data } = response;
          if (status === 200) {
            userDispatch({ type: 'user-info', user: data.user });
            storeUserRole(data.type);
          }
        })
        .catch(function (error) {});
    }
  }, [userDispatch, userState.isLoggedIn]);

  React.useEffect(() => {
    try {
      // trying to use new API - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      // just a fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
  return children;
};
