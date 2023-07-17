import Link from 'next/link';
import CoverImage from './CoverImage';
import DateComponent from './DateComponent';
import Avatar from './Avatar';
import SharerModal from '../utils/SharerModal';
import Tags from './Tags';
import Button from '../forms/Button';

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  tags,
}) {
  return (
    <article className="container-fluid articles-page">
      <h2 className="text-center">
        <Link href={`/posts/${slug}`}>
          <a
            className="text-decoration-none"
            dangerouslySetInnerHTML={{ __html: title }}
          ></a>
        </Link>
      </h2>

      {coverImage && (
        <div className="mt-4">
          <CoverImage title={title} coverImage={coverImage} slug={slug} />
        </div>
      )}
      <section className="row author-block mb-3">
        <div className="col-sm-6">
          <Avatar author={author} noImage />
          <div className="text-muted text-md me-3">
            <DateComponent dateString={date} /> . 4 min read
          </div>
        </div>
        <div className="col-sm-6 text-end">
          <SharerModal />
        </div>
      </section>

      <div className="row">
        <div
          className="text-lg mt-4 mb-4"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />

        {/* <Tags tags={tags} /> */}

        {/* <div className="d-flex mb-5">
            <LocalImage
            className="rounded-circle me-3 border my-auto"
            alt="Author"
            src={Author}
            height={50}
            />
            <div className="my-auto">
            <strong className="text-primary">Eronss Okojie</strong> is a
            Design Founder &amp; Advisor, Lasgidi School of Creative
            Leadership Executive MBA participant, Zuppie advisor, myprodgy
            co-founder, and Nordic Rose stakeholder.
            </div>
          </div> */}
      </div>
      <Button href={`/posts/${slug}`} className="btn btn-secondary-light">
        Read More
      </Button>
    </article>
  );
}
