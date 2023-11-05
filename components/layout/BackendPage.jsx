import React, { useContext } from 'react';
import Sidebar from 'components/layout/Sidebar';
import TopBar from 'components/layout/TopBar';
import { useRouter } from 'next/router';
import { UserContext } from 'context/UserContext';
import { getTokenFromStore } from 'utils/localStorage';
import FixedFooterMenu from './FixedFooterMenu';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Placeholder from './Placeholder';

const BackendPage = ({ children }) => {
  const router = useRouter();
  const token = getTokenFromStore();

  const { userState, loginUser, logoutUser } = useContext(UserContext);
  const [showSidebar, setShowSidebar] = React.useState(false);

  const closeSidebar = () => {
    document.body.classList.remove('modal-open');
    setShowSidebar(false);
  };

  React.useEffect(() => {
    const cancelLoginRequest = (message = null) => {
      console.log('cancelled', message);
      logoutUser();
      router.push('/login');
    };

    async function confirmPreviousLogin() {
      console.log('confirming previous login');
      try {
        const response = await axios.get(`${BASE_API_URL}/user/who-am-i`, {
          headers: {
            Authorization: getTokenFromStore(),
          },
        });

        console.log('response', response);
        if (response.status !== 200) {
          console.log('wrong status');
          cancelLoginRequest('Wrong Status');
        } else {
          loginUser(response.data.user);
          console.log('logging user in');
        }
      } catch (error) {
        cancelLoginRequest(`catch error: ${error}`);
      }
    }

    if (!token) {
      cancelLoginRequest(`token: ${token}`);
    } else {
      !userState?.isLoggedIn && confirmPreviousLogin();
      console.log('confirming previous login');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="dashboard-page">
      <Sidebar closeSidebar={closeSidebar} showSidebar={showSidebar} />
      {userState?.isLoggedIn ? (
        <>
          {/* Content Page */}
          <div className="content-page">
            <TopBar />
            {children}
            <FixedFooterMenu />
          </div>
        </>
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

const LoadingState = () => <Placeholder />;
export default BackendPage;
