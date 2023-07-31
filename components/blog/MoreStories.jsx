import PostCard from './PostCard';
// import PostPreview from './PostPreview';

export default function MoreStories({ posts }) {
  return (
    <section>
      <div className="row mb-5">
        {posts.map(({ node }) => (
          <PostCard key={node.slug} {...node} />
        ))}
      </div>
    </section>
  );
}
