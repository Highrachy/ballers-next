import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as BTooltip, OverlayTrigger } from 'react-bootstrap';

const Tooltip = ({ header, text, position, children }) => {
  if (!text) {
    return null;
  }
  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement={position}
      overlay={<BTooltip id="button-tooltip">{text}</BTooltip>}
    >
      <span>{children}</span>
    </OverlayTrigger>
  );
};

Tooltip.defaultProps = {
  header: 'Information',
  position: 'top',
  text: null,
};
Tooltip.propTypes = {
  header: PropTypes.string,
  text: PropTypes.any,
  position: PropTypes.string,
};

export default Tooltip;
