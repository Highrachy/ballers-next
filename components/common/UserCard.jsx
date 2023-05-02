import React from 'react';
import { OnlineImage } from 'components/utils/Image';
import { USER_TYPES } from 'utils/constants';
import Link from 'next/link';
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
          <OnlineImage
            alt={firstName}
            defaultImage={'/img/placeholder/user.jpg'}
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
        <Link passHref href={`/admin/user/${_id}`}>
          <a className="user-card">{UserInfo}</a>
        </Link>
      ) : (
        <div className="user-card">{UserInfo}</div>
      )}
    </>
  );
};

export default UserCard;
