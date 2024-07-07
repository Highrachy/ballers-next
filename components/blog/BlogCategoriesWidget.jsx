import Link from 'next/link';
import React from 'react';

const BlogCategoriesWidget = ({ categories = [] }) => {
  return (
    <div className="blog-widget widget-categories">
      <h4>Categories</h4>
      <ul className="blog-categories-list">
        {categories.map((category) => (
          <li key={category}>
            <Link href={`/blog/category/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogCategoriesWidget;
