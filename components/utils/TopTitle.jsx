import React from 'react';
import PropTypes from 'prop-types';
import { AddNewButton } from 'components/forms/Button';
import { PlusIcon } from './Icons';

const TopTitle = ({ children, buttonText, to }) => {
  return (
    <div className="container-fluid">
      <h4>
        {children}
        {buttonText && to && (
          <div className="float-right">
            <AddNewButton to={to}>
              {<PlusIcon />} {buttonText}
            </AddNewButton>
          </div>
        )}
      </h4>
    </div>
  );
};

TopTitle.propTypes = {
  buttonText: PropTypes.string,
  children: PropTypes.node.isRequired,
  to: PropTypes.any,
};

TopTitle.defaultProps = {
  buttonText: null,
  to: null,
};

export default TopTitle;
