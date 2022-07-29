import React from 'react';
import { Link } from '@reach/router';
import { MenuIcon } from 'components/utils/Icons';
import { useMenu } from 'hooks/useMenu';

const FixedFooterMenu = () => {
  const sideMenu = useMenu();
  return (
    <footer className="footer-fixed">
      <ul className="list-group list-group-horizontal">
        {sideMenu.map(
          ({ title, to, icon, footer }) =>
            footer && (
              <li className="list-group-item flex-fill" key={title}>
                <Link getProps={isActive} to={to}>
                  <span className="footer-fixed__icon">{icon}</span>
                  <p className="footer-fixed__menu-title">{title}</p>
                </Link>{' '}
              </li>
            )
        )}
        <li className="list-group-item flex-fill">
          <Link to="/user/menu">
            <span className="footer-fixed__icon">
              <MenuIcon />
            </span>

            <p className="footer-fixed__menu-title">Menu</p>
          </Link>
        </li>
      </ul>
    </footer>
  );
};

const isActive = ({ isPartiallyCurrent }) =>
  isPartiallyCurrent && { className: 'text-secondary' };

export default FixedFooterMenu;
