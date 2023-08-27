import React from 'react';
import CoverImage from './CoverImage';
import DateComponent from './DateComponent';
import Avatar from './Avatar';
import Link from 'next/link';

const PostCard = ({
  title,
  featuredImage: coverImage,
  date,
  excerpt,
  author,
  categories,
  slug,
}) => {
  return (
    <div className="col-sm-6">
      <div className="card mb-4">
        <Link href={`/posts/${slug}`} passHref>
          <a className="card-img-top">
            <CoverImage title={title} coverImage={coverImage} slug={slug} />
          </a>
        </Link>
        <div className="card-body p-4">
          <div className="text-lead-after text-sm d-flex">
            <span className="start-dash start-dash__small">
              {categories?.edges[0]?.node?.name}
            </span>
          </div>

          <div className="position-relative blog-content mb-5">
            <Link href={`/posts/${slug}`}>
              <h5
                className="blog-card-title mt-3"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </Link>
            <div
              className="card-text blog-text-content"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
            <div className="gradient-overlay"></div>
          </div>

          <Link href={`/posts/${slug}`} passHref>
            <a className="btn btn-secondary-light">Read more...</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
