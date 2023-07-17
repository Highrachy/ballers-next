import cn from 'classnames';
import Link from 'next/link';

export default function CoverImage({ title, coverImage, slug }) {
  const image = (
    <img
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      className={cn('shadow-sm img-fluid img-cover', {
        'hover:shadow-md transition-shadow duration-200': slug,
      })}
    />
  );
  return (
    <div className="mx-sm-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
