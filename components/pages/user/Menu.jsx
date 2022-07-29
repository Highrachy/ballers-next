import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import { Link } from '@reach/router';
import { useMenu } from 'hooks/useMenu';

const Menu = () => {
  const menus = useMenu();
  return (
    <BackendPage>
      <div className="col-sm-10 mx-2">
        <h4 className="my-4">Menu</h4>
        {menus.map(({ title, to, icon }) => (
          <Card key={title} className="menu__card">
            <Link to={to}>
              <div className="menu__icon">{icon}</div>
              <h6 className="menu__title">{title}</h6>
            </Link>
          </Card>
        ))}
      </div>
    </BackendPage>
  );
};

export default Menu;
