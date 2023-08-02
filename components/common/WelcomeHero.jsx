import React from 'react';
import SquareBubbles from './SquareBubbles';
import { UserContext } from '@/context/UserContext';
import { USER_TYPES } from '@/utils/constants';
import classNames from 'classnames';

export const WelcomeHero = ({
  title,
  subtitle,
  isIndex = false,
  isApproved = true,
}) => {
  const { userState } = React.useContext(UserContext);
  const isVendor = userState?.role === USER_TYPES.vendor;
  const isAdmin = userState?.role === USER_TYPES.admin;

  return (
    <section className="position-relative mt-n5">
      <div
        className={classNames('dashboard-hero mb-3', {
          'index-page': isIndex,
          'onboarding-user': !isApproved,
          vendor: isApproved && isVendor,
          admin: isApproved && isAdmin,
        })}
      >
        <SquareBubbles />
        <div className="px-4 py-6">
          <h2 className="text-white mt-4 mt-md-0">
            {title || `Hello, ${userState?.firstName}`}{' '}
          </h2>
          <p className="lead">
            {subtitle ||
              `Welcome to BALL - your dream home is just a few clicks away.`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeHero;
