import React from 'react';
import PropTypes from 'prop-types';
import { Toast as BoostrapToast } from 'react-bootstrap';
import {
  SuccessIcon,
  InfoIcon,
  WarningIcon,
  ErrorIcon,
} from 'components/utils/Icons';

export const useToast = () => {
  const initial = {
    message: null,
    type: 'error',
  };
  const [toast, setToast] = React.useState(initial);
  const toastIsClosed = () => setToast(null);

  return [{ ...toast, toastIsClosed }, setToast];
};

export const AlertToast = ({ message, type }) => (
  <div
    className={`card d-flex flex-row toast-alert ${
      TOAST_STYLE[type] ? type : 'error'
    }`}
  >
    <div className="span toast-icon-holder">
      {TOAST_STYLE[type] ? TOAST_STYLE[type].icon : <ErrorIcon />}
    </div>
    <span className="d-inline-block ml-2 toast-message-content">{message}</span>
  </div>
);

const Toast = ({
  message,
  type,
  toastIsClosed,
  showAlertMessageOnly,
  showToastOnly,
}) => {
  const [show, setShow] = React.useState(true);
  const [msg, setMessage] = React.useState(null);
  const [alertType, setAlertType] = React.useState('error');

  React.useEffect(() => {
    message && setShow(true);
    message && setMessage(message);
    type && setAlertType(type);
  }, [message, type]);

  // increase interval for showToastOnly

  const toastInterval = showToastOnly ? 10000 : 5000;

  React.useEffect(() => {
    if (message) {
      const interval = setInterval(() => {
        setShow(false);
        toastIsClosed();
      }, toastInterval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [show, toastInterval, toastIsClosed, message]);

  if (!message) {
    if (msg && !showToastOnly) {
      return <AlertToast message={msg} type={alertType} />;
    }
    return null;
  }

  return (
    <>
      {!showAlertMessageOnly && (
        <BoostrapToast
          show={show}
          onClose={() => {
            setShow(false);
            toastIsClosed();
          }}
          className={`toast-container toast__top-right ${
            TOAST_STYLE[type] ? type : 'error'
          }`}
        >
          <BoostrapToast.Header>
            <div className="toast-icon-holder">
              {TOAST_STYLE[type] ? TOAST_STYLE[type].icon : <ErrorIcon />}
            </div>
            <strong className="mr-auto">
              {TOAST_STYLE[type]
                ? TOAST_STYLE[type].name
                : TOAST_STYLE['error'].name}
            </strong>
          </BoostrapToast.Header>
          <BoostrapToast.Body>{message}</BoostrapToast.Body>
        </BoostrapToast>
      )}
      {!showToastOnly && <AlertToast message={message} type={type} />}
    </>
  );
};

Toast.propTypes = {
  message: PropTypes.any,
  type: PropTypes.string,
  toastIsClosed: PropTypes.func,
  showAlertMessageOnly: PropTypes.bool,
  showToastOnly: PropTypes.bool,
};

Toast.defaultProps = {
  message: null,
  type: null,
  toastIsClosed: () => {},
  showAlertMessageOnly: false,
  showToastOnly: false,
};

const TOAST_STYLE = {
  error: {
    icon: <ErrorIcon />,
    name: 'Error',
  },
  info: {
    icon: <InfoIcon />,
    name: 'Information',
  },
  success: {
    icon: <SuccessIcon />,
    name: 'Success',
  },
  warning: {
    icon: <WarningIcon />,
    name: 'Warning',
  },
};

export const InfoBox = ({ children }) => (
  <div className="card d-flex flex-row toast-alert info">
    <div className="span toast-icon-holder">
      <InfoIcon />
    </div>
    <span className="d-block ml-2 w-100 toast-message-content">{children}</span>
  </div>
);

export default Toast;
