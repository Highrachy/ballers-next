import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostTitle = ({ slug, title }) => (
  <h4 className="post-title">
    <Link href={`/${slug}`}>{title}</Link>
  </h4>
);

PostTitle.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default PostTitle;
