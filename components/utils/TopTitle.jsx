import React from 'react';
import PropTypes from 'prop-types';
import { AddNewButton } from 'components/forms/Button';
import { PlusIcon } from './Icons';

const TopTitle = ({ children, buttonText, href }) => {
  return (
    <div className="container-fluid">
      <h4>
        {children}
        {buttonText && href && (
          <div className="float-end">
            <AddNewButton href={href}>
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
  href: PropTypes.any,
};

TopTitle.defaultProps = {
  buttonText: null,
  href: null,
};

export default TopTitle;
