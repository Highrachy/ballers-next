import cn from 'classnames';
import Link from 'next/link';

export default function CoverImage({
  title,
  coverImage,
  slug,
  heroImage = false,
}) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      className={cn('img-fluid img-cover', {
        'blog-card-img': slug && !heroImage,
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
