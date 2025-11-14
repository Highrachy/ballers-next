import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { COLOR_STYLE } from 'utils/constants';
import BallersSpinner from 'components/utils/BallersSpinner';
import Link from 'next/link';

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
  href,
  wide,
  ...props
}) => {
  const isLink = !!href;
  const btnClassName = classNames(
    'btn',
    `btn-${color}`,
    { 'btn-wide': wide },
    { 'btn-xs btn-wide': type === BUTTON_TYPES.SMALL },
    className
  );
  return isLink ? (
    <Link href={href} passHref>
      <a
        className={btnClassName}
        role="button"
        rel="nofollow noopener noreferrer"
        data-nosnippet="true"
        {...props}
      >
        {children}
      </a>
    </Link>
  ) : (
    <button className={btnClassName} onClick={onClick} type="button" {...props}>
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
};

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

export const AddNewButton = ({ children, href }) => {
  const isLink = typeof href !== 'function';
  const btnClassName = 'btn btn-primary-light btn-sm btn-wide';
  return (
    <div className="text-end">
      {isLink ? (
        <Link href={href}>
          <a className={btnClassName}>{children}</a>
        </Link>
      ) : (
        <button className={btnClassName} onClick={href}>
          {children}
        </button>
      )}
    </div>
  );
};

AddNewButton.propTypes = {
  children: PropTypes.any.isRequired,
  href: PropTypes.any.isRequired,
};

export default Button;
