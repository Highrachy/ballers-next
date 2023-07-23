import React from 'react';
import Link from 'next/link';
import Avatar from './Avatar';
import Categories from './Categories';
import CoverImage from './CoverImage';
import DateComponent from './DateComponent';
import PostTitle from './PostTitle';

const PostHeader = ({
  title,
  featuredImage,
  slug,
  date,
  noLink,
  // author,
  categories,
  heroImage,
}) => {
  const category = categories?.edges[0].node.name;
  const postTitle = (
    <h2 className="blog-title" dangerouslySetInnerHTML={{ __html: title }} />
  );

  return (
    <>
      <CoverImage
        title={title}
        coverImage={featuredImage}
        {...(!noLink && { slug })}
        heroImage
      />

      <div className="start-dash">{category}</div>

      {noLink ? (
        postTitle
      ) : (
        <Link href={`/posts/${slug}`}>
          <a>{postTitle}</a>
        </Link>
      )}

      <div className="my-4 text-lead-after d-flex">
        <DateComponent dateString={date} />

        {/* <span>&nbsp; / &nbsp;</span>{' '}
        <Avatar author={author} noImage /> */}
      </div>
    </>
  );
};

export default PostHeader;
