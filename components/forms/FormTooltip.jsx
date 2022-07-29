import React from 'react';
import PropTypes from 'prop-types';
import { Popover, OverlayTrigger } from 'react-bootstrap';

const FormTooltip = ({ header, text, position }) => {
  if (!text) {
    return null;
  }
  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement={position}
      overlay={
        <Popover>
          <Popover.Title as="h6">{header || 'Information'}</Popover.Title>
          <Popover.Content>{text}</Popover.Content>
        </Popover>
      }
    >
      <span className="form-help-icon">
        &nbsp;
        <InfoIcon />
      </span>
    </OverlayTrigger>
  );
};

FormTooltip.defaultProps = {
  header: 'Information',
  position: 'right',
  text: null,
};
FormTooltip.propTypes = {
  header: PropTypes.string,
  text: PropTypes.any,
  position: PropTypes.string,
};

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#979797"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-help-circle"
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1={12} y1={17} x2="12.01" y2={17} />
  </svg>
);

export default FormTooltip;
