import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import BallersLogo from 'assets/img/logo/ballers-logo.png';
import Image from 'next/image';
import Link from 'next/link';

import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
  const MENUS = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'A-Z of Ball', href: '/a-z-of-ball' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact Us', href: '/contact-us' },
  ];
  return (
    <>
      <Navbar fixed="top" bg="transparent" expand="lg">
        <div className="container-fluid">
          <Navbar.Brand as={Link} href="/">
            <div className="me-5">
              <Image
                className="ballers-logo"
                src={BallersLogo}
                alt="Ballers logo"
                width={96}
                height={64}
              />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="ballers-nav" />
          <Navbar.Collapse id="ballers-nav">
            <Nav className="me-auto">
              {MENUS.map(({ name, href }) => (
                <Link href={href} passHref key={name}>
                  <Nav.Link>{name}</Nav.Link>
                </Link>
              ))}
            </Nav>
            <Nav>
              <Link href="/login" passHref>
                <Nav.Link>Sign In</Nav.Link>
              </Link>
              <Link href="/register" passHref>
                <Nav.Link className="btn btn-secondary">
                  Register for Free
                </Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
