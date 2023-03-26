import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { useMenu } from 'hooks/useMenu';
import { WelcomeHero } from './dashboard';

const Menu = () => {
  const menus = useMenu();
  return (
    <BackendPage>
      <WelcomeHero
        title="Menu"
        subtitle="Select a page to continue your BALL Journey"
      />
      <div className="col-sm-10 mx-4">
        <h4 className="my-4">Select Page</h4>
        {menus.map(({ title, to, icon }) => (
          <Card key={title} className="widget menu__card">
            <Link href={to} passHref>
              <a>
                <div className="menu__icon">{icon}</div>
                <h6 className="menu__title">{title}</h6>
              </a>
            </Link>
          </Card>
        ))}
      </div>
    </BackendPage>
  );
};

export default Menu;
