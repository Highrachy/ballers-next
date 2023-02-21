import React from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'react-bootstrap';
import { COLOR_STYLE } from 'utils/constants';

const AlertMessage = ({ type, message }) => {
  return (
    message && (
      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
      </Toast>
    )
  );
};

AlertMessage.propTypes = {
  message: PropTypes.any,
  variant: PropTypes.oneOf(COLOR_STYLE),
};

AlertMessage.defaultProps = {
  message: null,
  type: COLOR_STYLE[3],
};

// AlertMessage.Text
AlertMessage.Text = ({ type, message }) => {
  return (
    <div className="small pb-4">
      {message && <div className={`text-${type}`}>{message && message}</div>}
    </div>
  );
};

AlertMessage.Text.propTypes = {
  message: PropTypes.any,
  type: PropTypes.oneOf(['success', 'error', 'primary', 'info']),
};

AlertMessage.Text.defaultProps = {
  message: null,
  type: 'primary',
};

export default AlertMessage;
