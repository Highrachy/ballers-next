export default function Categories({ categories }) {
  return (
    <span className="ms-1">
      under
      {categories.edges.length > 0 ? (
        categories.edges.map((category, index) => (
          <span key={index} className="ms-1">
            {category.node.name}
          </span>
        ))
      ) : (
        <span className="ms-1">{categories.edges[0].node.name}</span>
      )}
    </span>
  );
}
