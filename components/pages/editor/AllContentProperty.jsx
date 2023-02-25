import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import { PropertyIcon } from 'components/utils/Icons';
import Link from 'next/link';
import { API_ENDPOINT } from 'utils/URL';
import PaginatedContent from 'components/common/PaginatedContent';

const AllContentProperty = () => {
  return (
    <BackendPage>
      <PaginatedContent
        addNewUrl={'/editor/content-property/new'}
        endpoint={API_ENDPOINT.getAllContentProperty()}
        pageName="Content Property"
        pluralPageName="Content Properties"
        DataComponent={ContentPropertyRowList}
        // FilterComponent={FilterForm}
        PageIcon={<PropertyIcon />}
        queryName="portfolio"
        limit={2}
      />
      <div className="container-fluid">
        <Link href="/editor/content-property/upload" className="btn btn-dark">
          Upload From Excel
        </Link>
      </div>
    </BackendPage>
  );
};

const ContentPropertyRowList = ({ results, offset }) => {
  const [toast, setToast] = useToast();
  return (
    <div className="container-fluid">
      <Toast {...toast} showToastOnly />
      <Card className="mt-4">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Area</th>
                <th>State</th>
                <th className="text-center">Properties</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((contentProperty, index) => (
                <ContentPropertyRow
                  key={index}
                  setToast={setToast}
                  number={offset + index + 1}
                  {...contentProperty}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

ContentPropertyRowList.propTypes = {
  contentProperty: PropTypes.array.isRequired,
};

const ContentPropertyRow = ({ _id, area, number, numOfProperties, state }) => {
  return (
    <tr>
      <td>{number}</td>
      <td>{area}</td>
      <td>{state}</td>
      <td className="text-center">{numOfProperties}</td>
      <td>
        <Link
          className="btn btn-sm btn-secondary"
          href={`/editor/content-property/area/${_id}`}
        >
          View Properties
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link
          className="btn btn-sm btn-danger"
          href={`/editor/area/edit/${_id}`}
        >
          Edit Area
        </Link>
      </td>
    </tr>
  );
};

export default AllContentProperty;
