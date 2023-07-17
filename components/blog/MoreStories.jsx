import PostPreview from './PostPreview';

export default function MoreStories({ posts }) {
  return (
    <section>
      <h2 className="my-5 h1 fw-bold tracking-tighter">More Stories</h2>
      <div className="row row-cols-1 row-cols-md-2 gap-4 gap-md-5 gap-lg-7 gap-xl-8 mb-5 border-bottom">
        {posts.map(({ node }) => (
          <PostPreview
            key={node.slug}
            title={node.title}
            coverImage={node.featuredImage}
            date={node.date}
            author={node.author}
            slug={node.slug}
            excerpt={node.excerpt}
          />
        ))}
      </div>
    </section>
  );
}
