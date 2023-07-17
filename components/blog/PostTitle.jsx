export default function PostTitle({ children }) {
  return (
    <h1
      className="fw-bold tracking-tighter lh-tight mb-4 text-center text-md-start"
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
