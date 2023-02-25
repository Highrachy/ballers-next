import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import PaginatedContent from 'components/common/PaginatedContent';
import Select from 'components/forms/Select';
import { generateNumOptions, valuesToOptions } from 'utils/helpers';
import Input from 'components/forms/Input';
import BackendPage from 'components/layout/BackendPage';
import { PropertyIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import Image from 'components/utils/Image';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import { HOUSE_TYPES } from 'utils/constants';
import { useCurrentRole } from 'hooks/useUser';
import { API_ENDPOINT } from 'utils/URL';
import UserCard from 'components/common/UserCard';

import { Form, Formik } from 'formik';
import Textarea from 'components/forms/Textarea';
import Button from 'components/forms/Button';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import { flagPropertySchema } from 'components/forms/schemas/propertySchema';
import Modal from 'components/common/Modal';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import { Spacing } from 'components/common/Helpers';

const ReportedProperties = () => {
  const addNewUrl = useCurrentRole().isVendor ? '/vendor/property/new' : '';
  return (
    <BackendPage>
      <PaginatedContent
        addNewUrl={addNewUrl}
        endpoint={API_ENDPOINT.getAllReportedProperties()}
        initialFilter={{ sortBy: 'createdAt', sortDirection: 'desc' }}
        pageName="Reported Property"
        pluralPageName="Reported Properties"
        DataComponent={ReportedPropertiesRowList}
        FilterComponent={FilterForm}
        PageIcon={<PropertyIcon />}
        queryName="reportedProperty"
      />
    </BackendPage>
  );
};

const ReportedPropertiesRowList = ({ results, offset, setToast }) => (
  <div className="container-fluid">
    <Card>
      <div className="table-responsive">
        <table className="table table-border table-hover">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Image</th>
              <th>Name</th>
              <th>Reason</th>
              <th>Reported By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((property, index) => (
              <ReportedPropertiesRow
                key={index}
                number={offset + index + 1}
                setToast={setToast}
                {...property}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const ReportedPropertiesRow = ({
  _id,
  number,
  propertyInfo,
  reportedBy = {},
  reason,
  setToast,
}) => {
  const userType = useCurrentRole().name;

  return (
    <tr>
      <td>{number}</td>
      <td>
        <Link href={`/${userType}/property/${_id}`}>
          <Image
            src={propertyInfo?.mainImage}
            name={`property ${propertyInfo?._id}`}
            width="80"
            alt="property"
            defaultImage={PropertyPlaceholderImage}
          />
        </Link>
      </td>
      <td>{propertyInfo?.name} </td>
      <td>{reason}</td>
      <td>
        <UserCard user={reportedBy} />
      </td>
      <td>
        <Link href={`/${userType}/property/${propertyInfo?._id}`}>
          <a className="btn btn-xs btn-secondary">View</a>
        </Link>
        <Spacing />
        <FlagProperty
          property={propertyInfo}
          reportId={_id}
          setToast={setToast}
        />
      </td>
    </tr>
  );
};

export const FlagProperty = ({
  property,
  setToast,
  reportId,
  bigButton,
  className,
}) => {
  const [showFlagModal, setShowFlagModal] = React.useState(false);

  return (
    <>
      <Button
        className={`btn ${
          className ? className : bigButton ? 'btn-wide' : 'btn-xs'
        } btn-danger`}
        onClick={() => setShowFlagModal(true)}
      >
        Flag {bigButton && ' Property'}
      </Button>

      {/* Flag Property Modals */}
      <Modal
        title="Flag Property"
        show={showFlagModal}
        onHide={() => setShowFlagModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3">
            <Formik
              initialValues={setInitialValues(flagPropertySchema)}
              onSubmit={({ reason, notes }, actions) => {
                const payload = {
                  propertyId: property._id,
                  reason,
                  reportId,
                  notes,
                };
                Axios.put(
                  `${BASE_API_URL}/property/flag`,
                  { ...payload },
                  {
                    headers: { Authorization: getTokenFromStore() },
                  }
                )
                  .then(function (response) {
                    const { status } = response;
                    if (statusIsSuccessful(status)) {
                      setToast({
                        type: 'success',
                        message: `The property has been successfully flagged`,
                      });
                      actions.setSubmitting(false);
                      actions.resetForm();
                      setShowFlagModal(false);
                    }
                  })
                  .catch(function (error) {
                    setToast({
                      message: getError(error),
                    });
                    actions.setSubmitting(false);
                  });
              }}
              validationSchema={createSchema(flagPropertySchema)}
            >
              {({ isSubmitting, handleSubmit, ...props }) => (
                <Form>
                  <Textarea
                    name="reason"
                    label="Reason for Flaging"
                    placeholder="Flag Property"
                    rows="3"
                  />

                  <Textarea name="notes" label="Additional Notes" rows="2" />

                  <Button
                    className="btn-secondary mt-4"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Flag Property
                  </Button>
                  <DisplayFormikState {...props} hide showAll />
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </Modal>
    </>
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
          <section>
            <Input label="Property Name" name="name" />
            <Input label="Price" name="price" />
            <Select
              label="Toilets"
              name="toilets"
              options={generateNumOptions(9, 'Toilet')}
              placeholder="Select Toilets"
            />
            <Select
              label="House Type"
              name="houseType"
              options={valuesToOptions(HOUSE_TYPES)}
              placeholder="House Type"
            />
          </section>
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

export default ReportedProperties;
