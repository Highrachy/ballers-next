import React from 'react';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import BallersLogo from '../utils/BallersLogo';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import { UserContext } from '@/context/UserContext';
import { getTokenFromStore } from '@/utils/localStorage';
import { statusIsSuccessful } from '@/utils/helpers';
import { NavForLoginUser } from './TopBar';
import { Menus, sellerDropdown } from '@/utils/menu';

const Header = () => {
  let { userState, loginUser } = React.useContext(UserContext);
  const token = getTokenFromStore();

  React.useEffect(() => {
    async function checkIfUserIsLoggedIn() {
      try {
        const response = await axios.get(`${BASE_API_URL}/user/who-am-i`, {
          headers: {
            Authorization: getTokenFromStore(),
          },
        });

        if (statusIsSuccessful(response?.status)) {
          loginUser(response.data.user);
        }
      } catch (error) {
        console.log('error', error);
      }
    }

    if (token && !userState?.isLoggedIn) {
      checkIfUserIsLoggedIn();
    } else {
      axios
        .get(`${BASE_API_URL}/`)
        .then(function () {})
        .catch(function () {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar fixed="top" bg="white" expand="lg">
        <div className="container-fluid">
          <Link href="/">
            <Navbar.Brand>
              <BallersLogo
                className="ballers-logo"
                alt="Ballers logo"
                width={96}
                height={64}
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="ballers-nav" />
          <Navbar.Collapse id="ballers-nav">
            <Nav className="me-auto">
              {Menus.map(
                ({ name, href, children, additionalResources }, index) =>
                  children ? (
                    <MegaNavDropdown
                      key={index}
                      name={name}
                      additionalResources={additionalResources}
                    >
                      {children}
                    </MegaNavDropdown>
                  ) : (
                    <Link href={href} passHref key={name}>
                      <Nav.Link>{name}</Nav.Link>
                    </Link>
                  )
              )}
            </Nav>
            {userState?.isLoggedIn ? (
              <NavForLoginUser />
            ) : (
              <Nav>
                <MegaNavDropdown name="Sell Your Property">
                  {sellerDropdown}
                </MegaNavDropdown>
                <Link href="/login" passHref>
                  <Nav.Link>Sign In</Nav.Link>
                </Link>
                <Link href="/create-a-new-ball-account" passHref>
                  <Nav.Link className="btn btn-secondary-light d-none d-lg-inline">
                    Register{' '}
                    <span className=" d-inline d-lg-none d-xl-inline">
                      for Free
                    </span>
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

const MegaNavDropdown = ({ name, children, additionalResources }) => {
  return (
    <NavDropdown
      title={name}
      className={`mega-menu mega-menu__${
        additionalResources ? 'two-sides' : 'single-side'
      }`}
      id={`${name}-dropdown`}
    >
      <>
        <div className="dropdown-side dropdown-side--left">
          <ul className="list-unstyled">
            {children.map((item, index) => (
              <li key={index}>
                <a className="dropdown-menu-single-item" href={item.link}>
                  <div className="dropdown-menu-icon">{item.icon}</div>
                  <div className="dropdown-menu-text">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {additionalResources && (
          <div className="dropdown-side dropdown-side--right">
            {additionalResources.map((resource, index) => (
              <ul className="list-unstyled mb-5" key={index}>
                <div className="dropdown-menu-label">{resource.title}</div>
                {resource.links.map((link, index) => (
                  <li key={index} className="dropdown-menu-text">
                    <a href={link.link}>{link.title}</a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </>
    </NavDropdown>
  );
};

export default Header;
