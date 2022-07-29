import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';

const BallersSpinner = ({ small }) => (
  <Spinner
    as="span"
    animation="border"
    role="status"
    aria-hidden="true"
    size={small ? 'sm' : 'lg'}
  />
);

BallersSpinner.propTypes = {
  small: PropTypes.bool,
};

BallersSpinner.defaultProps = {
  small: false,
};

export default BallersSpinner;
