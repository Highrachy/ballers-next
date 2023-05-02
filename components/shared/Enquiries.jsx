import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import { MessageIcon } from 'components/utils/Icons';
import Link from 'next/link';
import PaginatedContent from 'components/common/PaginatedContent';
import { API_ENDPOINT } from 'utils/URL';
import UserCard from 'components/common/UserCard';

const Enquiries = () => (
  <BackendPage>
    <PaginatedContent
      endpoint={API_ENDPOINT.getAllEnquiries()}
      initialFilter={{ approved: false }}
      pageName="Enquiry"
      pluralPageName="Enquiries"
      DataComponent={EnquiriesRowList}
      PageIcon={<MessageIcon />}
      queryName="enquiry"
    />
  </BackendPage>
);

const EnquiriesRowList = ({ results, offset }) => (
  <div className="container-fluid">
    <Card className="mt-2">
      <div className="table-responsive">
        <table className="table table-border table-hover">
          <thead>
            <tr>
              <th>S/N</th>
              <th>User</th>
              <th>Phone</th>
              <th>Property</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((enquiry, index) => (
              <EnquiriesRow
                key={index}
                number={offset + index + 1}
                {...enquiry}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

EnquiriesRowList.propTypes = {
  results: PropTypes.array.isRequired,
};

const EnquiriesRow = ({
  _id,
  number,
  title,
  firstName,
  lastName,
  email,
  phone,
  profileImage,
  propertyInfo,
}) => (
  <tr>
    <td>{number}</td>
    <td>
      <UserCard user={{ firstName, lastName, email, title, profileImage }} />
    </td>
    <td className="small">{phone}</td>
    <td>
      <UserCard
        user={{
          firstName: propertyInfo.name,
          email: propertyInfo.houseType,
          profileImage: propertyInfo.mainImage,
        }}
      />
    </td>
    <td>
      <Link href={`/vendor/enquiries/${_id}`} passHref>
        <a className="btn btn-sm btn-wide btn-secondary-light">View Enquiry</a>
      </Link>
    </td>
  </tr>
);

export default Enquiries;
