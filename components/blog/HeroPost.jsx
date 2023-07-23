import Link from 'next/link';
import CoverImage from './CoverImage';
import DateComponent from './DateComponent';
import Avatar from './Avatar';
import SharerModal from '../utils/SharerModal';
import Tags from './Tags';
import Button from '../forms/Button';
import PostHeader from './PostHeader';

const HeroPost = ({ excerpt, ...props }) => {
  return (
    <article>
      <PostHeader {...props} heroImage />
      <div
        className="lead text-lead mt-4 mb-4"
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      <Button
        href={`/posts/${props.slug}`}
        className="btn btn-secondary btn-wide"
      >
        Read More
      </Button>
    </article>
  );
};

export default HeroPost;
