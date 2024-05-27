import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import { getError, statusIsSuccessful } from '@/utils/helpers';
import { clearStorage, storeToken, storeUserRole } from '@/utils/localStorage';
import { UserContext } from '@/context/UserContext';
import Toast, { useToast } from '../utils/Toast';

const GoogleLoginButton = ({ isLoginPage = true, isVendor = false }) => {
  const { loginUser } = React.useContext(UserContext);
  const [toast, setToast] = useToast();

  const errorMessage = (error) => {
    setToast({
      message: getError(error),
    });
  };

  const responseMessage = (result) => {
    axios
      .post(`${BASE_API_URL}/user/google`, {
        credential: result?.credential,
        isLoginPage,
        isVendor,
      })
      .then(({ status, data }) => {
        // Check if response status is 200
        if (statusIsSuccessful(status)) {
          clearStorage();
          storeToken(data.user.token);
          storeUserRole(data.user.role);
          loginUser(data.user, data.user.token);
        } else {
          // Handle other response statuses
          setToast({
            message: getError(error),
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
        // Handle error
        setToast({
          message: getError(error),
        });
      });
  };

  return (
    <>
      <div className="text-start">
        <Toast showToastOnly {...toast} />
      </div>
      <div className="d-flex justify-content-center pb-4">
        <GoogleLogin
          onSuccess={responseMessage}
          onError={errorMessage}
          text={isLoginPage ? 'signin_with' : 'signup_with'}
          useOneTap={isLoginPage}
          cancel_on_tap_outside
          context={isLoginPage ? 'signin' : 'signup'}
        />
      </div>
    </>
  );
};

export default GoogleLoginButton;
