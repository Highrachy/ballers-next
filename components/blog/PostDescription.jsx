import React from 'react';
import PropTypes from 'prop-types';

const PostDescription = ({ description }) => (
  <p className="post-description d-none d-xl-block">{description}</p>
);

PostDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default PostDescription;
