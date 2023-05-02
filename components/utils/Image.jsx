/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import queryString from 'query-string';
import { isValidURL } from '@/utils/helpers';

// https://github.com/lijinke666/react-image-process/blob/abf8db4b81a22cab2a12c2786718ce0029696401/example/example.js

const Image = ({
  src,
  defaultImage,
  name,
  className,
  bordered,
  responsiveImage,
  rounded,
  circle,
  options,
  serveImageFromCloud,
  ...otherProps
}) => {
  const IMAGE_SERVE_URL = '//images.weserv.nl';

  const query = {
    url: src,
    ...options,
  };

  const imgSrc = !src
    ? defaultImage
    : serveImageFromCloud
    ? `${IMAGE_SERVE_URL}?${queryString.stringify(query)}`
    : src;

  console.log('imgSrc', imgSrc);

  const classes = classNames(
    className,
    {
      'img-fluid': responsiveImage,
    },
    {
      'img-thumbnail': bordered,
    },
    {
      rounded: rounded,
    },
    {
      'rounded-circle': circle,
    }
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={name}
      className={classes}
      src={imgSrc}
      title={name}
      {...otherProps}
    />
  );
};

Image.propTypes = {
  bordered: PropTypes.bool,
  className: PropTypes.string,
  defaultImage: PropTypes.any,
  name: PropTypes.string.isRequired,
  options: PropTypes.object,
  responsiveImage: PropTypes.bool,
  rounded: PropTypes.bool,
  serveImageFromCloud: PropTypes.bool,
  src: PropTypes.string,
};

Image.defaultProps = {
  bordered: false,
  className: '',
  defaultImage: 'assets/img/placeholder/image.png',
  options: {},
  responsiveImage: true,
  rounded: false,
  serveImageFromCloud: true,
  src: null,
};

export const LocalImage = (props) => (
  <Image name={props.alt || 'image'} {...props} serveImageFromCloud={false} />
);
export const OnlineImage = (props) => (
  <Image {...props} serveImageFromCloud={isValidURL(props?.src)} />
);

export default Image;
