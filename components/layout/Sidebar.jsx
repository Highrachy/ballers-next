import React from 'react';
import PropTypes from 'prop-types';
import BallersLogo from 'assets/img/logo/ballers-logo.png';
import classNames from 'classnames';
import { Link } from '@reach/router';
import { useMenu } from 'hooks/useMenu';

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
          <Link to="/">
            <img alt="Ballers Logo" src={BallersLogo} />
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
          <Link
            getProps={isActive}
            onClick={closeSidebar}
            to={to}
            className="sidebar-menu__item"
          >
            <span className="sidebar__icon">{icon}</span> &nbsp;
            {title}
          </Link>
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

const isActive = ({ isCurrent }) => {
  return isCurrent
    ? { className: 'sidebar-menu__item active' }
    : { className: 'sidebar-menu__item' };
};

export default Sidebar;
