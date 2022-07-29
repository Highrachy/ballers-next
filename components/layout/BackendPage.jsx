import React from 'react';
import Sidebar from 'components/layout/Sidebar';
import TopBar from 'components/layout/TopBar';
import { navigate, useLocation } from '@reach/router';
import { UserContext } from 'context/UserContext';
import { getTokenFromStore } from 'utils/localStorage';
import FixedFooterMenu from './FixedFooterMenu';

const BackendPage = ({ children }) => {
  let { userDispatch } = React.useContext(UserContext);
  const location = useLocation();

  const [showSidebar, setShowSidebar] = React.useState(false);
  const closeSidebar = () => {
    document.body.classList.remove('modal-open');
    setShowSidebar(false);
  };

  // CHECK IF USER HAS PREVIOUSLY SIGNED IN
  React.useEffect(() => {
    if (!getTokenFromStore()) {
      userDispatch({
        type: 'no-token',
      });
      navigate(`/login?url=${location.pathname}`);
    }
  }, [userDispatch, location]);

  return (
    <div className="dashboard-page">
      <Sidebar closeSidebar={closeSidebar} showSidebar={showSidebar} />

      {/* Content Page */}
      <div className="content-page">
        <TopBar />
        {children}
        <FixedFooterMenu />
      </div>
    </div>
  );
};

export default BackendPage;
