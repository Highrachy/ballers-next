import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from '@reach/router';
import PaginatedContent from 'components/common/PaginatedContent';
import { Form, Formik } from 'formik';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import Select from 'components/forms/Select';
import { generateNumOptions, valuesToOptions } from 'utils/helpers';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import BackendPage from 'components/layout/BackendPage';
import { BadgesIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import Image from 'components/utils/Image';
import BadgePlaceholderImage from 'assets/img/placeholder/property.png';
import { DASHBOARD_PAGE, HOUSE_TYPES } from 'utils/constants';
import { useCurrentRole } from 'hooks/useUser';
import { API_ENDPOINT } from 'utils/URL';
import { Spacing } from 'components/common/Helpers';

const Badges = () => {
  return (
    <BackendPage>
      <PaginatedContent
        addNewUrl="/admin/badges/new"
        endpoint={API_ENDPOINT.getAllAssignedBadges()}
        pageName="Badge"
        pluralPageName="Badges"
        DataComponent={BadgesRowList}
        FilterComponent={FilterForm}
        PageIcon={<BadgesIcon />}
        queryName="badge"
      />
    </BackendPage>
  );
};

const BadgesRowList = ({ results, offset }) => {
  const isAdmin = useCurrentRole().isAdmin;
  return (
    <div className="container-fluid">
      <Card className="mt-2">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Image</th>
                <th>Name</th>
                {isAdmin && (
                  <>
                    <th>Role</th>
                    <th>No of users</th>
                    <th>&nbsp;</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((badge, index) => (
                <BadgesRow key={index} number={offset + index + 1} {...badge} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const BadgesRow = ({
  _id,
  number,
  name,
  image,
  assignedRole,
  noOfAssignedUsers,
}) => {
  const userType = useCurrentRole().name;
  const isAdmin = useCurrentRole().isAdmin;
  return (
    <tr>
      <td>{number}</td>
      <td>
        {image ? (
          <Link to={`/${userType}/badge/${_id}`}>
            <Image
              src={image}
              name={`badge ${_id}`}
              width="80"
              alt="badge"
              defaultImage={BadgePlaceholderImage}
            />
          </Link>
        ) : (
          <div className="icon-xl">
            <BadgesIcon />
          </div>
        )}
      </td>
      <td>{name}</td>
      {isAdmin && (
        <>
          <td>{Humanize.titleCase(DASHBOARD_PAGE[assignedRole] || 'All')}</td>
          <td>
            {noOfAssignedUsers} {Humanize.pluralize(noOfAssignedUsers, 'user')}
          </td>
          <td>
            <Spacing />
            <Spacing />
            <Link
              className="btn btn-xs btn-wide btn-secondary"
              to={`/${userType}/badge/${_id}`}
            >
              View badge
            </Link>
          </td>
        </>
      )}
    </tr>
  );
};

const FilterForm = ({ setFilterTerms }) => {
  return (
    <Formik
      initialValues={setInitialValues({})}
      onSubmit={(values, actions) => {
        setFilterTerms(
          { ...values },
          {
            houseType: `House Type : ${Humanize.titleCase(values.houseType)}`,
          }
        );
      }}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Card className="card-container">
            <section className="row">
              <div className="col-md-10 px-4">
                <h5 className="mb-4">Filter Badges</h5>
                <div className="form-row">
                  <Input
                    formGroupClassName="col-md-6"
                    label="Badge Name"
                    name="name"
                  />
                  <Input
                    formGroupClassName="col-md-6"
                    label="Price"
                    name="price"
                  />
                </div>
                <div className="form-row">
                  <Select
                    formGroupClassName="col-md-6"
                    label="Toilets"
                    name="toilets"
                    options={generateNumOptions(9, 'Toilet')}
                    placeholder="Select Toilets"
                  />
                  <Select
                    formGroupClassName="col-md-6"
                    label="House Type"
                    name="houseType"
                    options={valuesToOptions(HOUSE_TYPES)}
                    placeholder="House Type"
                  />
                </div>
              </div>
            </section>
          </Card>
          <DisplayFormikState {...props} showAll />
          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Filter Users
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default Badges;
