import React, { useEffect } from 'react';
import store from 'store2';
import { UserContext } from 'context/UserContext';
import BackendPage from 'components/layout/BackendPage';
import { navigate } from '@reach/router';
import { storeUserFirstName } from 'utils/localStorage';

const Logout = () => {
  const { userState, userDispatch } = React.useContext(UserContext);

  const firstName = userState.firstName;
  useEffect(() => {
    if (firstName) {
      store(false);
      userDispatch({ type: 'user-logout' });
      navigate('/');
      storeUserFirstName(firstName);
    }
  }, [userDispatch, firstName]);

  return (
    <BackendPage title="Log Out">
      <div className="main-app">
        <section className="app-content">Logging out</section>
      </div>
    </BackendPage>
  );
};

export default Logout;
