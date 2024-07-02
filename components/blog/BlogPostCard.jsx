import React from 'react';
import PropTypes from 'prop-types';
import PostImage from './PostImage';
import PostDate from './PostDate';
import PostCategory from './PostCategory';
import PostTitle from './PostTitle';
import PostDescription from './PostDescription';
import PostActionButtons from './PostActionButtons';

const BlogPostCard = ({ post, layout = BLOG_LAYOUT.POST_LIST }) => {
  const HeroPost = ({ post }) => (
    <article className="post hero-post d-flex flex-column align-items-start mb-3">
      <PostImage src={post.mainImage} alt={post.title} />
      <div className="post-content">
        <PostDate date={post.createdAt} />
        <PostCategory category={post.category} />
        <PostTitle slug={post.slug} title={post.title} />
        <PostDescription description={post.content} />
        <PostActionButtons post={post} />
      </div>
    </article>
  );

  const PostGrid = ({ post }) => (
    <div className="col-lg-4 col-md-6 mb-4">
      <article className="post grid-post">
        <PostImage src={post.mainImage} alt={post.title} />
        <div className="post-content">
          <PostDate date={post.createdAt} />
          <PostCategory category={post.category} />
          <PostTitle slug={post.slug} title={post.title} />
          <PostActionButtons post={post} />
        </div>
      </article>
    </div>
  );

  const PostList = ({ post }) => <PostGrid post={post} />;

  // const PostList = ({ post }) => (
  //   <article className="post list-post d-flex align-items-center mb-4">
  //     <div className="position-relative flex-shrink-0 me-3">
  //       <PostImage post={post} />
  //       <PostDate date={post.createdAt} />
  //     </div>
  //     <div className="post-content flex-grow-1 p-4">
  //       <PostCategory category={post.category} />
  //       <PostTitle slug={post.slug} title={post.title} />
  //       <PostDescription description={post.content} />
  //       <PostActionButtons name={post.slug} />
  //     </div>
  //   </article>
  // );

  switch (layout) {
    case BLOG_LAYOUT.HERO_POST:
      return <HeroPost post={post} />;
    case BLOG_LAYOUT.POST_GRID:
      return <PostGrid post={post} />;

    default:
      return <PostList post={post} />;
  }
};

export const BLOG_LAYOUT = {
  HERO_POST: 'HeroPost',
  POST_GRID: 'PostGrid',
  POST_LIST: 'PostList',
};

BlogPostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    mainImage: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  layout: PropTypes.oneOf(['HeroPost', 'PostGrid', 'PostListFull']).isRequired,
};

export default BlogPostCard;
