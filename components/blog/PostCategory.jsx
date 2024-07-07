import React from 'react';
import PropTypes from 'prop-types';
import { BLOG_STATUS } from '@/utils/constants';

const PostCategory = ({ category, status, isAdmin }) => (
  <div className="post-category mb-2">
    {category}
    {isAdmin && status === BLOG_STATUS.DRAFT && (
      <span className={`badge bg-danger rounded-pill ms-2`}>DRAFT</span>
    )}
  </div>
);

PostCategory.propTypes = {
  category: PropTypes.string.isRequired,
};

export default PostCategory;
