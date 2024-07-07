import React from 'react';
import { API_ENDPOINT } from '@/utils/URL';
import PaginatedContent from '@/components/common/PaginatedContent';
import { BlogIcon } from '@/components/utils/Icons';
import BackendPage from '@/components/layout/BackendPage';
import BlogPostCard, { BLOG_LAYOUT } from '@/components/blog/BlogPostCard';

const BlogPosts = () => {
  return (
    <BackendPage>
      <PaginatedContent
        addNewUrl="/admin/blog/new"
        endpoint={API_ENDPOINT.getAllBlogs()}
        pageName="Blog Post"
        DataComponent={BlogPostsRowList}
        PageIcon={<BlogIcon />}
        queryName="blogPost"
      />
    </BackendPage>
  );
};

const BlogPostsRowList = ({ results, setToast }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {results.map((post, index) => (
          <BlogPostCard
            key={index}
            post={post}
            layout={BLOG_LAYOUT.POST_LIST}
            setToast={setToast}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
