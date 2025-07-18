// GameButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'next/link';

export default function GameButton({
  children,
  color = 'gold',
  className = '',
  leftIcon = null,
  rightIcon = null,
  href,
  target = '_blank',
  rel,
  ...rest
}) {
  const baseClass = classNames('btn-game', `btn-game--${color}`, className);

  // ----- link variant ------------------------------------------------
  if (href) {
    const content = (
      <>
        {leftIcon && <span className="me-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ms-2">{rightIcon}</span>}
      </>
    );

    // Use Next.js <Link> for internal links, fallback to plain <a> otherwise
    const isInternal = href.startsWith('/') && !href.startsWith('//');

    return isInternal ? (
      <Link href={href} passHref legacyBehavior>
        <a className={baseClass} {...rest}>
          {content}
        </a>
      </Link>
    ) : (
      <a
        className={baseClass}
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        {...rest}
      >
        {content}
      </a>
    );
  }

  // ----- button variant ---------------------------------------------
  return (
    <button className={baseClass} type="button" {...rest}>
      {leftIcon && <span className="me-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ms-2">{rightIcon}</span>}
    </button>
  );
}

GameButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
};
