import React from 'react';
import PropTypes from 'prop-types';
import PostImage from './PostImage';
import PostDate from './PostDate';
import PostCategory from './PostCategory';
import PostTitle from './PostTitle';
import PostDescription from './PostDescription';
import PostActionButtons from './PostActionButtons';
import { truncateText } from '@/utils/helpers';
import { useCurrentRole } from '@/hooks/useUser';

const BlogPostCard = ({ post, isPublic = false, setToast = () => {} }) => {
  const isAdmin = useCurrentRole().isAdmin;

  const BlogContent = ({ post }) => (
    <>
      <PostImage src={post.mainImage} alt={post.title} />
      <div className="post-content">
        <PostDate date={post.createdAt} />
        <PostCategory {...post} isAdmin={isAdmin} />
        <PostTitle slug={post.slug} title={post.title} />
        <PostDescription description={truncateText(post.content)} />
        <PostActionButtons
          post={post}
          setToast={setToast}
          isAdmin={isAdmin}
          isPublic={isPublic}
        />
      </div>
    </>
  );

  const HeroPost = ({ post }) => (
    <article className="mb-3 post hero-post d-flex flex-column align-items-start">
      <BlogContent post={post} />
    </article>
  );

  const PostGrid = ({ post }) => (
    <div className="mb-4 col-lg-4 col-md-6">
      <article className="post grid-post">
        <BlogContent post={post} />
      </article>
    </div>
  );

  if (isPublic) return <HeroPost post={post} />;
  else return <PostGrid post={post} />;
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
  isPublic: PropTypes.bool,
};

export default BlogPostCard;
