import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'next/link';
import { useMenu } from 'hooks/useMenu';
import Image from 'next/image';
import ActiveLink from '../common/ActiveLink';
import BallersLogo from '../utils/BallersLogo';

const Sidebar = ({ showSidebar, closeSidebar, ...props }) => {
  const sideMenu = useMenu();

  return (
    <>
      <div
        className={classNames('backdrop', {
          showSidebar,
        })}
        onClick={closeSidebar}
      />
      <aside
        className={classNames('sidebar', {
          showSidebar,
        })}
      >
        <div className="sidebar__logo">
          <Link href="/" passHref>
            <a>
              <BallersLogo
                className="ballers-logo-footer"
                width="86"
                height="55"
              />
            </a>
          </Link>
          <div className="sidebar__close" onClick={closeSidebar}>
            <button
              aria-label="Close"
              className="close d-block d-sm-none"
              type="button"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>

        <Sidebar.Navigation closeSidebar={closeSidebar} menus={sideMenu} />

        <div className="clearfix" />
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  closeSidebar: PropTypes.func.isRequired,
  showSidebar: PropTypes.bool.isRequired,
};

Sidebar.Navigation = ({ menus, closeSidebar }) => {
  const sideMenu = menus && (
    <ul className="sidebar-menu">
      {menus.map(({ title, to, icon }) => (
        <li key={title}>
          <ActiveLink
            passHref
            href={to}
            onClick={closeSidebar}
            className="sidebar-menu__item"
          >
            <span className="sidebar__icon">{icon}</span>
            {title}
          </ActiveLink>
        </li>
      ))}
    </ul>
  );
  return <div>{sideMenu}</div>;
};

Sidebar.Navigation.propTypes = {
  closeSidebar: PropTypes.func.isRequired,
  menus: PropTypes.array.isRequired,
};

Sidebar.Navigation.displayName = 'Sidebar Navigation';

// const isActive = ({ isCurrent }) => {
//   return isCurrent
//     ? { className: 'sidebar-menu__item active' }
//     : { className: 'sidebar-menu__item' };
// };

export default Sidebar;
