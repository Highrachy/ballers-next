import React from 'react';
import PropTypes from 'prop-types';

const PostCategory = ({ category }) => (
  <div className="post-category mb-2">{category}</div>
);

PostCategory.propTypes = {
  category: PropTypes.string.isRequired,
};

export default PostCategory;
