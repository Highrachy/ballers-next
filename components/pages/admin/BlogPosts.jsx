import React from 'react';
import { API_ENDPOINT } from '@/utils/URL';
import PaginatedContent from '@/components/common/PaginatedContent';
import { EditNoteIcon } from '@/components/utils/Icons';
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
        PageIcon={<EditNoteIcon />}
        queryName="blogPost"
      />
    </BackendPage>
  );
};

const BlogPostsRowList = ({ results }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {results.map((post, index) => (
          <BlogPostCard
            key={index}
            post={post}
            layout={BLOG_LAYOUT.POST_LIST}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
