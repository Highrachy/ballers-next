import React from 'react';
import PropTypes from 'prop-types';

const PostDescription = ({ description }) => (
  <p className="post-description">{description}</p>
);

PostDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default PostDescription;
