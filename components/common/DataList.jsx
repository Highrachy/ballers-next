export const DataList = ({ header, subheader, children }) => (
  <>
    <header>
      {header && <h5 className="header-title-small">{header}</h5>}
      {subheader && <p>{subheader}</p>}
    </header>

    <section className="card card-bordered mt-2">
      <ul className="data-list">{children}</ul>
    </section>
  </>
);

export const DataItem = ({ label, value, children }) => (
  <li className="data-item">
    <div className="data-col">
      <div className="data-label">{label}</div>
      {value && <div className="data-value">{value}</div>}
    </div>
  </li>
);

export default DataList;
