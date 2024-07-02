import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const PostImage = ({ src, alt, url }) => (
  <div className="post-thumbnail">
    <Image src={src} className="img-fluid" alt={alt} />
  </div>
);

PostImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default PostImage;
