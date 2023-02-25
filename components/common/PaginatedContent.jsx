import React from 'react';
import { UserIcon } from 'components/utils/Icons';
import TopTitle from 'components/utils/TopTitle';
import Humanize from 'humanize-plus';
import Pagination from 'components/common/Pagination';
import 'react-slidedown/lib/slidedown.css';
import { CloseIcon } from 'components/utils/Icons';
import { useToast } from 'components/utils/Toast';
import { usePaginationQuery } from 'hooks/useQuery';
import { ContentLoader } from 'components/utils/LoadingItems';
import { FilterIcon } from 'components/utils/Icons';
import Modal from './Modal';

const PaginatedContent = ({
  addNewUrl,
  childrenKey,
  DataComponent,
  initialFilter = {},
  filter,
  FilterComponent,
  limit,
  PageIcon,
  pageName,
  pluralPageName,
  endpoint,
  queryName,
  hidePagination,
  hideNoContent,
  hideTitle,
  showFetching,
  ...props
}) => {
  const [filters, setFilters] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [toast, setToast] = useToast();

  const pluralizePageName = pluralPageName || Humanize.pluralize(2, pageName);
  const Icon = PageIcon || <UserIcon />;

  const [query, results] = usePaginationQuery({
    axiosOptions: {
      params: { limit, page: currentPage, ...filters, ...initialFilter },
    },
    key: 'result',
    name: queryName || pageName.toLowerCase(),
    setToast,
    endpoint,
    childrenKey: childrenKey || queryName,
    refresh: true,
  });

  const pagination = query?.latestData?.pagination;

  const showTitle = !hideTitle && !(hideNoContent && results?.length === 0);

  return (
    <>
      {showTitle && (
        <TopTitle buttonText={`New ${pageName}`} href={addNewUrl}>
          {pagination?.total}{' '}
          {Humanize.pluralize(pagination?.total, pageName, pluralizePageName)}
        </TopTitle>
      )}

      {FilterComponent && (
        <TopFilter
          FilterComponent={FilterComponent}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      <ContentLoader
        hasContent={results?.length > 0}
        Icon={Icon}
        query={query}
        name={pageName}
        toast={toast}
        noContentText={`No ${pluralizePageName} found`}
        hideNoContent={hideNoContent}
        showFetching={showFetching || Object.keys(filters)?.length > 0}
      >
        <DataComponent
          results={results || []}
          offset={pagination?.offset || 0}
          setToast={setToast}
          {...props}
        />

        {!hidePagination && (
          <Pagination
            currentPage={pagination?.currentPage}
            lastPage={pagination?.totalPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </ContentLoader>
    </>
  );
};

const TopFilter = ({ FilterComponent, filters, setFilters }) => {
  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterInWords, setFilterInWords] = React.useState({});

  const setFilterTerms = (terms, filterInWords) => {
    setFilters({ ...terms, tz: new Date().getTimezoneOffset() / 60 });
    setFilterInWords(filterInWords);
    setOpenFilter(false);
  };

  const removeFilterTerm = (property) => {
    setFilters({ ...filters, [property]: null });
    setFilterInWords({ ...filterInWords, [property]: null });
    setOpenFilter(false);
  };

  const currentFilters = () => {
    if (Object.keys(filters).length === 0) return null;
    let output = [];
    for (let item in filters) {
      if (
        filters?.[item] && // filter is not empty
        Object.prototype.hasOwnProperty.call(filters, item) && // property is present in filter terms
        filters[item] !== JSON.stringify('') && // not an empty string
        item !== 'tz' // not timezone filter
      ) {
        output.push(
          <button className="btn badge badge-filters" key={item}>
            {filterInWords?.[item] || filters[item]}{' '}
            <span
              className="icon icon-cancel"
              onClick={() => removeFilterTerm(item)}
            >
              <CloseIcon />
            </span>
          </button>
        );
      }
    }
    return output;
  };

  return (
    <>
      <section className="container-fluid">
        <div className="row">
          <div className="col-sm-12 mt-2">
            <div
              className="text-end fw-bold"
              onClick={() => {
                setOpenFilter(true);
              }}
            >
              <FilterIcon /> Filter Results
            </div>

            <small className="small--2 mt-2 d-block">{currentFilters()}</small>
          </div>
        </div>
      </section>

      <Modal
        title="Filter Results"
        show={openFilter}
        onHide={() => setOpenFilter(false)}
        className="modal-right"
      >
        <FilterComponent setFilterTerms={setFilterTerms} />
      </Modal>
    </>
  );
};
export default PaginatedContent;
