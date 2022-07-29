import React, { useState } from 'react';
import Axios from 'axios';
import ProfileAvatar from 'assets/img/avatar/profile.png';
import { getTokenFromStore } from 'utils/localStorage';
import { UserContext } from 'context/UserContext';
import BallersSpinner from 'components/utils/BallersSpinner';
import Image from './Image';
import { BASE_API_URL } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getError } from 'utils/helpers';

const UploadProfileImage = () => {
  const MAX_IMG_SIZE = 500000; //500kb

  // Context
  let { userState, userDispatch } = React.useContext(UserContext);

  // HOOKS
  const [toast, setToast] = useToast();
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    setLoading(true);
    setToast({ message: null });
    const file = event.target.files[0];
    if (file.size > MAX_IMG_SIZE) {
      setToast({
        message: `'${
          file.name
        }' is too large, please pick a file smaller than ${
          MAX_IMG_SIZE / 1000
        }kb`,
      });
      setLoading(false);
    } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setToast({
        message:
          "Unsupported format. Only '.png' and '.jpg' files are supported",
      });
      setLoading(false);
    } else {
      const data = new FormData();
      data.append('image', file);

      Axios.post(`${BASE_API_URL}/user/profile-image`, data, {
        headers: { Authorization: getTokenFromStore() },
      })
        .then(function (response) {
          const { status, data } = response;
          if (status === 200) {
            userDispatch({
              type: 'user-profile-image',
              profileImage: data.profileImage,
            });
            setLoading(false);
          }
        })
        .catch(function (error) {
          setToast({
            message: getError(error),
          });
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className="upload-button text-center mb-5">
        <Toast {...toast} showToastOnly />
        <Image
          bordered
          rounded
          className="avatar--large uploaded-image mb-3"
          name={userState.firstName + ' ' + userState.lastName}
          src={userState.profileImage.url || ProfileAvatar}
        />
        <input id="image" onChange={onChangeHandler} type="file" />
        <label
          className="btn btn-info btn-sm btn-wide btn-transparent"
          htmlFor="image"
        >
          {loading ? (
            <>
              <BallersSpinner small /> &nbsp; &nbsp;Uploading
            </>
          ) : (
            'Change Image'
          )}
        </label>
      </div>
    </>
  );
};

export default UploadProfileImage;
