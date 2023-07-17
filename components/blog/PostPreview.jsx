import CoverImage from './CoverImage';
import DateComponent from './DateComponent';
import Avatar from './Avatar';
import Link from 'next/link';

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <div className="col">
      <div className="card mb-4">
        {/* <Link href={`/posts/${slug}`} passHref>
          <a className="card-img-top">
            <CoverImage title={title} coverImage={coverImage} slug={slug} />
          </a>
        </Link> */}
        <div className="card-body">
          <Link href={`/posts/${slug}`}>
            <a className="text-decoration-none mt-4">
              <h4
                className="card-title"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </a>
          </Link>
          <Avatar author={author} noImage />
          <div className="d-flex text-muted text-sm justify-content-between align-items-center">
            <p className="mb-0">
              <DateComponent dateString={date} />
            </p>
          </div>
          <div
            className="card-text mt-4"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />

          <div className="d-flex justify-content-between align-items-center">
            <Link href={`/posts/${slug}`} passHref>
              <a className="btn btn-secondary-light">Read more...</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
