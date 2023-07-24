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
          <Link href={`/posts/${slug}`}>
            <a>
              <h5
                className="fw-semibold blog-card-title text-single-line"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </a>
          </Link>

          <div className="text-lead-after text-sm d-flex">
            <DateComponent dateString={date} />
            {/* <span>&nbsp; / &nbsp;</span>{' '}
            <Avatar author={author} noImage /> */}
          </div>

          <div className="position-relative mb-5">
            <div
              className="card-text mt-3 blog-text-content"
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
