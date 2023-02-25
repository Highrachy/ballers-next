import React, { useContext } from 'react';
import Sidebar from 'components/layout/Sidebar';
import TopBar from 'components/layout/TopBar';
import { useRouter } from 'next/router';
import { UserContext } from 'context/UserContext';
import { getTokenFromStore } from 'utils/localStorage';
import FixedFooterMenu from './FixedFooterMenu';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';

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
      try {
        const response = await axios.get(`${BASE_API_URL}/user/who-am-i`, {
          headers: {
            Authorization: getTokenFromStore(),
          },
        });
        if (response.status !== 200) {
          cancelLoginRequest('Wrong Status');
        } else {
          loginUser(response.data.user);
        }
      } catch (error) {
        cancelLoginRequest(error);
      }
    }
    if (!token) {
      cancelLoginRequest(`token: ${token}`);
    } else {
      !userState.isLoggedIn && confirmPreviousLogin();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="dashboard-page">
      {userState?.isLoggedIn ? (
        <>
          <Sidebar closeSidebar={closeSidebar} showSidebar={showSidebar} />

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

const LoadingState = () => <h2>Loading...</h2>;
export default BackendPage;
