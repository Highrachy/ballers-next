import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { COLOR_STYLE } from 'utils/constants';
import BallersSpinner from 'components/utils/BallersSpinner';
import { Link } from '@reach/router';

export const BUTTON_TYPES = {
  SMALL: 'small',
};

const Button = ({
  className,
  loading,
  loadingText,
  showLoadingText,
  children,
  onClick,
  color,
  type,
  ...props
}) => (
  <button
    className={classNames(
      'btn',
      `btn-${color}`,
      { 'btn-xs btn-wide': type === BUTTON_TYPES.SMALL },
      className
    )}
    onClick={onClick}
    type="button"
    {...props}
  >
    {loading ? (
      <>
        <BallersSpinner small /> &nbsp;
        {showLoadingText && (loadingText || children)}
      </>
    ) : (
      children
    )}
  </button>
);

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.oneOf(COLOR_STYLE),
  loading: PropTypes.bool,
  loadingText: PropTypes.any,
  showLoadingText: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  children: 'Submit',
  className: null,
  color: COLOR_STYLE[2],
  loading: false,
  loadingText: null,
  showLoadingText: true,
  onClick: () => {},
};

export const AddNewButton = ({ children, to }) => {
  const isLink = typeof to !== 'function';
  const btnClassName = 'btn btn-dark btn-xs btn-wide';
  return (
    <div className="text-right">
      {isLink ? (
        <Link to={to} className={btnClassName}>
          {children}
        </Link>
      ) : (
        <button className={btnClassName} onClick={to}>
          {children}
        </button>
      )}
    </div>
  );
};

AddNewButton.propTypes = {
  children: PropTypes.any.isRequired,
  to: PropTypes.any.isRequired,
};

export default Button;
