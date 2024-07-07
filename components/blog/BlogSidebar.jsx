import React from 'react';
import BlogSearchWidget from './BlogSearchWidget';
import BlogCategoriesWidget from './BlogCategoriesWidget';

const BlogSidebar = ({ categories }) => {
  return (
    <aside className="col-lg-4 col-sm-12">
      <BlogSearchWidget />
      <BlogCategoriesWidget categories={categories} />
    </aside>
  );
};

export default BlogSidebar;
