import React from 'react';
import PropTypes from 'prop-types';
import BPagination from 'react-bootstrap/Pagination';
import generatePagination, { ELLIPSIS } from 'utils/paginate';

const Pagination = ({ currentPage, lastPage, size, setCurrentPage }) => {
  const pagination = generatePagination(currentPage, lastPage);

  if (pagination.length <= 1) {
    return null;
  }

  return (
    <section className="container-fluid mt-3">
      <BPagination size={size}>
        {currentPage !== 1 && (
          <>
            <BPagination.First onClick={() => setCurrentPage(1)} />
            <BPagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
          </>
        )}

        {pagination.map((page) =>
          page === ELLIPSIS ? (
            <BPagination.Ellipsis key={page} />
          ) : (
            <BPagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </BPagination.Item>
          )
        )}

        {currentPage !== lastPage && (
          <>
            <BPagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
            <BPagination.Last onClick={() => setCurrentPage(lastPage)} />
          </>
        )}
      </BPagination>
    </section>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  lastPage: PropTypes.number,
  size: PropTypes.oneOf(['lg', 'sm']),
  setCurrentPage: PropTypes.func,
};

Pagination.defaultProps = {
  currentPage: 1,
  lastPage: 1,
  setCurrentPage: () => {},
  size: 'lg',
};

export default Pagination;
