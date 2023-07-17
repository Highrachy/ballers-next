export default function PostBody({ content }) {
  return (
    <div className="container">
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
