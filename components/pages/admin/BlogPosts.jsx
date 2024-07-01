import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { getDate } from 'utils/date-helpers';
import { API_ENDPOINT } from '@/utils/URL';
import PaginatedContent from '@/components/common/PaginatedContent';
import { EditNoteIcon } from '@/components/utils/Icons';
import BackendPage from '@/components/layout/BackendPage';

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

const BlogPostsRowList = ({ results, offset, setToast }) => {
  return (
    <div className="container-fluid">
      <Card className="mt-2">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Published At</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {results.map((post, index) => (
                <BlogPostsRow
                  key={index}
                  number={offset + index + 1}
                  blogPost={post}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const BlogPostsRow = ({ blogPost, number }) => {
  const authorName = `${blogPost.userInfo[0].firstName} ${blogPost.userInfo[0].lastName}`;

  return (
    <tr>
      <td>{number}</td>
      <td>{blogPost.title}</td>
      <td>{authorName}</td>
      <td>{blogPost.status}</td>
      <td>{getDate(blogPost.createdAt)}</td>
      <td>
        <p className="my-3">
          <Button
            variant="info"
            className="btn-xs btn-wide me-3"
            href={`/admin/blog/edit/${blogPost._id}`}
          >
            {' '}
            Edit
          </Button>
          <Button
            variant="secondary"
            className="btn-xs btn-wide"
            href={`/dashboard/blog/${blogPost._id}`}
          >
            View
          </Button>
        </p>
      </td>
    </tr>
  );
};

export default BlogPosts;
