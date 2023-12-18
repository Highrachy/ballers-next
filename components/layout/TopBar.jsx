import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import {
  NotificationIcon,
  ThreeDotsIcon,
  TourIcon,
} from 'components/utils/Icons';
import ProfileAvatar from 'assets/img/avatar/profile.png';
import { UserContext } from 'context/UserContext';
import { LocalImage } from 'components/utils/Image';
import { useCurrentRole } from 'hooks/useUser';
import TimeAgo from 'react-timeago';
import { NOTIFICATION_ACTION, NOTIFICATION_TYPE } from 'utils/constants';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore, removeTourValue } from 'utils/localStorage';
import { statusIsSuccessful } from 'utils/helpers';
import { refreshQuery } from 'hooks/useQuery';
import Image from 'next/image';
import BallersLogo from '../utils/BallersLogo';
import { useRouter } from 'next/router';
import { Popover, OverlayTrigger } from 'react-bootstrap';

// eslint-disable-next-line react/display-name
const Empty = React.forwardRef(({ children, onClick }, ref) => (
  <div className="top-nav-dropdown" ref={ref} onClick={onClick}>
    {children}
  </div>
));

const Header = () => {
  return (
    <>
      <Navbar
        fixed="top"
        className="dashboard-top-nav d-flex align-items-center"
        bg="transparent"
        expand="lg"
      >
        <div className="container-fluid py-0">
          <Link href="/">
            <Navbar.Brand className="p-0">
              <div className="me-5 d-md-none d-block">
                <BallersLogo
                  className="ballers-logo"
                  alt="Ballers logo"
                  width={60}
                  height={40}
                />
              </div>
            </Navbar.Brand>
          </Link>
          <NavForLoginUser />
        </div>
      </Navbar>
    </>
  );
};

export const NavForLoginUser = () => {
  let { userState } = React.useContext(UserContext);
  const userName = `${userState.firstName} ${userState.lastName}`;
  const isCompanyLogo =
    !userState.profileImage && userState.vendor && userState.vendor.companyLogo;
  const currentRole = useCurrentRole().name;
  const router = useRouter();
  return (
    <Nav className="ms-auto d-flex flex-row align-items-center">
      {userState?.isDemoAccount && (
        <>
          <Link href="/vendor/demo-account">
            <Nav.Link className="demo-account d-none d-xl-inline text-muted">
              Demo Account
            </Nav.Link>
          </Link>

          <span
            onClick={() => {
              removeTourValue();
              window.location.href = '/vendor/dashboard?tour=true';
            }}
          >
            <Nav.Link className="demo-account text-muted">
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement={'bottom'}
                overlay={
                  <Popover>
                    <Popover.Header as="h6">Start Tour</Popover.Header>
                    <Popover.Body>
                      Explore BALL features with our guided tour. Click to start
                      your experience.
                    </Popover.Body>
                  </Popover>
                }
              >
                <span className="form-help-icon">
                  &nbsp;
                  <TourIcon />
                </span>
              </OverlayTrigger>
            </Nav.Link>
          </span>
        </>
      )}
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
          <LocalImage
            name={userName}
            className={
              isCompanyLogo
                ? 'dashboard-top-nav__company-logo'
                : 'dashboard-top-nav__avatar'
            }
            defaultImage={`/img/avatar/profile.png`}
            rounded
            src={
              isCompanyLogo
                ? userState.vendor?.companyLogo
                : userState?.profileImage
            }
            options={{ h: 200 }}
          />{' '}
          <ThreeDotsIcon />
        </Dropdown.Toggle>

        <Dropdown.Menu className="top-nav-dropdown-menu">
          <Link href={`/${currentRole}/dashboard`} passHref>
            <Dropdown.Item>Dashboard</Dropdown.Item>
          </Link>
          <Link href={`/${currentRole}/mybadges`} passHref>
            <Dropdown.Item>Badges</Dropdown.Item>
          </Link>
          <Link href={`/${currentRole}/testimonials`} passHref>
            <Dropdown.Item>Testimonials</Dropdown.Item>
          </Link>
          <Link href="/user/settings" passHref>
            <Dropdown.Item>Settings</Dropdown.Item>
          </Link>
          <Link href="/logout">
            <a data-rr-ui-dropdown-item className="dropdown-item" role="button">
              Logout
            </a>
          </Link>
        </Dropdown.Menu>
      </Dropdown>

      {/* <Nav.Link as={Link} href="/register"></Nav.Link> */}
    </Nav>
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
