import React from 'react';
import Link from 'next/link';
import { MenuIcon } from 'components/utils/Icons';
import { useMenu } from 'hooks/useMenu';
import ActiveLink from '../common/ActiveLink';

const FixedFooterMenu = () => {
  const sideMenu = useMenu();
  return (
    <footer className="footer-fixed">
      <ul className="list-group list-group-horizontal">
        {sideMenu.map(
          ({ title, to, icon, footer }) =>
            footer && (
              <li className="list-group-item flex-fill" key={title}>
                <ActiveLink href={to} passHref>
                  <span className="footer-fixed__icon">{icon}</span>
                  <p className="footer-fixed__menu-title">{title}</p>
                </ActiveLink>
              </li>
            )
        )}
        <li className="list-group-item flex-fill">
          <Link href="/user/menu" passHref>
            <a>
              <span className="footer-fixed__icon">
                <MenuIcon />
              </span>

              <p className="footer-fixed__menu-title">Menu</p>
            </a>
          </Link>
        </li>
      </ul>
    </footer>
  );
};

const isActive = ({ isPartiallyCurrent }) =>
  isPartiallyCurrent && { className: 'text-secondary' };

export default FixedFooterMenu;
