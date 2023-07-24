export default function Avatar({ author, noImage = false }) {
  const isAuthorHaveFullName =
    author?.node?.firstName && author?.node?.lastName;
  const name = isAuthorHaveFullName
    ? `${author.node.firstName} ${author.node.lastName}`
    : author.node.name || null;

  return (
    <div className="d-flex align-items-center">
      <p className="mb-0 me-2">By, {name}</p>
      {!noImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.node.avatar.url}
          className="rounded-circle img-fluid img-xs"
          alt={name}
        />
      )}
    </div>
  );
}
