import React, { useEffect } from 'react';
import store from 'store2';
import { UserContext } from 'context/UserContext';
import BackendPage from 'components/layout/BackendPage';
import { storeUserFirstName } from 'utils/localStorage';
import { useRouter } from 'next/router';

const Logout = () => {
  const { userState, userDispatch } = React.useContext(UserContext);
  const router = useRouter();

  const firstName = userState.firstName;
  useEffect(() => {
    if (firstName) {
      store(false);
      userDispatch({ type: 'user-logout' });
      router.push('/');
      storeUserFirstName(firstName);
    }
  }, [userDispatch, firstName, router]);

  return (
    <BackendPage title="Log Out">
      <div className="main-app">
        <section className="app-content">Logging out</section>
      </div>
    </BackendPage>
  );
};

export default Logout;
