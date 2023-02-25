import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'next/link';

const NoContent = ({
  text,
  linkText,
  linkTo,
  isButton,
  className,
  Icon,
  size,
}) => (
  <section
    className={classNames(
      className,
      'no-content text-center text-muted w-100',
      size
    )}
  >
    {Icon && Icon}
    <h4 className={classNames('text-muted pt-3', size)}>{text}</h4>
    {linkText && linkTo && (
      <Link
        className={classNames(
          { 'text-muted d-block': !isButton },
          {
            'btn btn-danger d-inline-block mt-3 btn-wide btn-transparent':
              isButton,
          }
        )}
        href={linkTo}
      >
        {linkText}
      </Link>
    )}
  </section>
);

NoContent.propTypes = {
  className: PropTypes.string,
  isButton: PropTypes.bool,
  Icon: PropTypes.node,
  linkText: PropTypes.string,
  linkTo: PropTypes.string,
  text: PropTypes.any.isRequired,
};

NoContent.defaultProps = {
  className: 'mt-5 mb-5',
  Icon: null,
  isButton: false,
  linkText: '',
  linkTo: '/',
};

export default NoContent;
