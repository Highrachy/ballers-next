import Avatar from './Avatar';
import Categories from './Categories';
import CoverImage from './CoverImage';
import DateComponent from './DateComponent';
import PostTitle from './PostTitle';

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
  categories,
}) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="d-none d-md-block mb-4">
        <Avatar author={author} />
      </div>
      {coverImage && (
        <div className="mt-4">
          <CoverImage title={title} coverImage={coverImage} slug={slug} />
        </div>
      )}
      <div className="container">
        <div className="d-block d-md-none">
          <Avatar author={author} />
        </div>
        <div className="mb-3">
          Posted <DateComponent dateString={date} />
          <Categories categories={categories} />
        </div>
      </div>
    </>
  );
}
