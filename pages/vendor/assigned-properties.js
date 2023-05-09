import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import LoadItems from 'components/utils/LoadingItems';
import NoContent from 'components/utils/NoContent';
import { getError } from 'utils/helpers';
import { MessageIcon } from 'components/utils/Icons';
import TopTitle from 'components/utils/TopTitle';
import Link from 'next/link';

const AssignedProperties = () => {
  const [toast, setToast] = useToast();
  const [enquiries, setEnquiries] = React.useState(null);
  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/offer/admin/all`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        if (status === 200) {
          setEnquiries(data.offers);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [setToast]);
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <TopTitle>Assigned Properties</TopTitle>
      <AllEnquiries enquiries={enquiries} toast={toast} />
    </BackendPage>
  );
};

const AllEnquiries = ({ enquiries }) => (
  <LoadItems
    Icon={<MessageIcon />}
    items={enquiries}
    loadingText="Loading your Enquiries"
    noContent={<NoContent isButton text="No Enquiries found" />}
  >
    <EnquiriesRowList enquiries={enquiries || []} />
  </LoadItems>
);

const EnquiriesRowList = ({ enquiries }) => (
  <div className="container-fluid">
    <Card className="mt-2">
      <div className="table-responsive">
        <table className="table table-border table-hover">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Date</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Property</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry, index) => (
              <EnquiriesRow key={index} number={index + 1} {...enquiry} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

EnquiriesRowList.propTypes = {
  enquiries: PropTypes.array.isRequired,
};

const EnquiriesRow = ({
  _id,
  number,
  title,
  firstName,
  lastName,
  email,
  phone,
  propertyInfo,
}) => (
  <tr>
    <td>{number}</td>
    <td>
      {title} {firstName} {lastName}
    </td>

    <td>{email}</td>
    <td>{phone}</td>
    <td>{propertyInfo[0] && propertyInfo[0].name}</td>
    <td>
      <Link passHref href={`/admin/enquiry/${_id}`}>
        <a className="btn btn-sm btn-secondary"></a>
        View Enquiry
      </Link>
    </td>
  </tr>
);

export default AssignedProperties;
