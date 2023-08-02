export const DashboardTable = ({ children, title, className }) => {
  return (
    <div className={classNames('table-responsive card mb-5', className)}>
      <table className="table table-border table-striped">
        <thead>
          <tr>
            <th colSpan="6">
              <h5 className="my-3">{title}</h5>
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
