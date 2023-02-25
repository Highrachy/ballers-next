import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { NotificationIcon, ThreeDotsIcon } from 'components/utils/Icons';
import ProfileAvatar from 'assets/img/avatar/profile.png';
import { UserContext } from 'context/UserContext';
import { OnlineImage } from 'components/utils/Image';
import { useCurrentRole } from 'hooks/useUser';
import TimeAgo from 'react-timeago';
import { NOTIFICATION_ACTION, NOTIFICATION_TYPE } from 'utils/constants';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { statusIsSuccessful } from 'utils/helpers';
import { refreshQuery } from 'hooks/useQuery';

// eslint-disable-next-line react/display-name
const Empty = React.forwardRef(({ children, onClick }, ref) => (
  <div className="top-nav-dropdown" ref={ref} onClick={onClick}>
    {children}
  </div>
));

const Header = () => {
  let { userState } = React.useContext(UserContext);
  const userName = `${userState.firstName} ${userState.lastName}`;
  const isCompanyLogo =
    !userState.profileImage && userState.vendor && userState.vendor.companyLogo;
  const currentRole = useCurrentRole().name;
  return (
    <>
      <Navbar
        fixed="top"
        className="dashboard-top-nav d-flex align-items-center"
        bg="transparent"
        expand="lg"
      >
        <div className="container-fluid">
          <Nav className="ms-auto d-flex flex-row align-items-center">
            {userState?.notifications?.length === 0 ? (
              <Link href={`/${currentRole}/notifications`}>
                <Nav.Link className="notifications">
                  <NotificationIcon />
                </Nav.Link>
              </Link>
            ) : (
              <NotificationsDropdown
                notifications={userState?.notifications?.slice(0, 3)}
                currentRole={currentRole}
              />
            )}

            <Dropdown>
              <Dropdown.Toggle as={Empty} id="user-dropdown">
                <OnlineImage
                  name={userName}
                  className={
                    isCompanyLogo
                      ? 'dashboard-top-nav__company-logo'
                      : 'dashboard-top-nav__avatar'
                  }
                  defaultImage={ProfileAvatar}
                  rounded
                  src={
                    isCompanyLogo
                      ? userState.vendor.companyLogo
                      : userState.profileImage
                  }
                  options={{ h: 200 }}
                />{' '}
                <ThreeDotsIcon />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-children">
                <Link href={`/${currentRole}/mybadges`}>
                  <Dropdown.Item>Badges</Dropdown.Item>
                </Link>
                <Link href={`/${currentRole}/testimonials`}>
                  <Dropdown.Item>Testimonials</Dropdown.Item>
                </Link>
                <Link href="/user/settings">
                  <Dropdown.Item>Settings</Dropdown.Item>
                </Link>
                <Link href="/logout">
                  <Dropdown.Item>Logout</Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown>

            {/* <Nav.Link as={Link} href="/register"></Nav.Link> */}
          </Nav>
        </div>
      </Navbar>
    </>
  );
};

export const isActive = ({ isCurrent }) => {
  return isCurrent ? { className: 'active fw-bold nav-link' } : null;
};

export const NotificationsDropdown = ({ notifications, currentRole }) => {
  const generateURL = (id, action, actionId) => {
    Axios.put(
      `${BASE_API_URL}/notification/read/${id}/`,
      {},
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          refreshQuery('notification', true);
        }
      })
      .catch();
    if (
      action === NOTIFICATION_ACTION.OFFLINE_PAYMENT ||
      action === NOTIFICATION_ACTION.TRANSACTION
    ) {
      navigate(`/${currentRole}/transactions`);
    } else {
      navigate(`/${currentRole}/notifications`);
    }
    console.log(`actionId`, actionId);
  };

  return (
    <Dropdown className="notifications">
      <Dropdown.Toggle as={Empty} id="notifications-dropdown">
        <div className="notifications__icon">
          <NotificationIcon />
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>
          <span>Notifications</span>
          <Link href={`/${currentRole}/notifications`}>View All</Link>
        </Dropdown.Header>
        {notifications?.map(
          ({ _id, createdAt, description, type, action, actionId }, index) => (
            <Dropdown.Item
              onClick={() => generateURL(_id, action, actionId)}
              key={index}
            >
              <div className="notification-item dropdown-inner">
                <div className="notification-icon">
                  <span
                    className={`icon-circle icon-circle__${NOTIFICATION_TYPE[type]}`}
                  ></span>
                </div>
                <div className="notification-content overflow-hidden">
                  <div className="notification-text text-truncate">
                    {description}
                  </div>
                  <div className="notification-time">
                    <TimeAgo date={createdAt} />
                  </div>
                </div>
              </div>
            </Dropdown.Item>
          )
        )}

        <Link href={`/${currentRole}/notifications`}>
          <Dropdown.Item eventKey="20">
            <div className="notification-text py-2">View All Notifications</div>
          </Dropdown.Item>
        </Link>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Header;
