import React from 'react';
import ProfileAvatar from 'assets/img/placeholder/user.jpg';
import Image from 'components/utils/Image';
import { USER_TYPES } from 'utils/constants';
import { Link } from '@reach/router';
import { useCurrentRole } from 'hooks/useUser';
import { UserIcon } from 'components/utils/Icons';

const UserCard = ({ user, hideImage, nameOnly }) => {
  const {
    _id = '',
    title = '',
    firstName = '',
    lastName = '',
    email = '',
    role = 1,
    profileImage,
    banned = { status: false },
    vendor = {},
  } = user;

  const isVendor = role === USER_TYPES.vendor;
  const roleIsAdmin = useCurrentRole().isAdmin;

  const userInitialName = `${title} ${firstName} ${lastName}`;
  const vendorName = vendor?.companyName || userInitialName;
  const userName = isVendor ? vendorName : userInitialName;

  const image = role === USER_TYPES.vendor ? vendor?.companyLogo : profileImage;

  const UserInfo = (
    <>
      {!hideImage ? (
        <div className="user-avatar">
          <Image
            alt={firstName}
            defaultImage={ProfileAvatar}
            src={image}
            title={firstName}
            name={firstName}
            width="80"
          />
        </div>
      ) : (
        <UserIcon />
      )}

      {!nameOnly ? (
        <div className="user-info">
          <span className={`user-name ${banned.status ? 'text-danger' : ''}`}>
            {userName}
          </span>
          <small className="user-email">{email}</small>
        </div>
      ) : (
        <div className="user-name ms-0">
          <span
            className={`${banned.status ? 'text-danger ' : ''}${
              hideImage ? 'user-name-normal' : undefined
            }`}
          >
            {firstName ? userName : email}
          </span>
        </div>
      )}
    </>
  );

  return (
    <>
      {roleIsAdmin ? (
        <Link className="user-card" to={`/admin/user/${_id}`}>
          {UserInfo}
        </Link>
      ) : (
        <div className="user-card">{UserInfo}</div>
      )}
    </>
  );
};

export default UserCard;
