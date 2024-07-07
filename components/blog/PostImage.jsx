import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const PostImage = ({ src, alt, url }) => (
  <div className="post-thumbnail">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} className="img-fluid img-cover" alt={alt} />
  </div>
);

PostImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default PostImage;
