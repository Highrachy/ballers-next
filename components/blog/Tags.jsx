export default function Tags({ tags }) {
  if (!tags) return null;
  return (
    <div className="container">
      <p className="mt-4 tags fw-bold">
        Tags:{' '}
        {tags.edges.map((tag, index) => (
          <span key={index} className="me-2 tag fw-bold">
            {tag.node.name}
          </span>
        ))}
      </p>
    </div>
  );
}
