import React from 'react';
import { Card } from 'react-bootstrap';
import PaginatedContent from 'components/common/PaginatedContent';
import { Form, Formik } from 'formik';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import Select from 'components/forms/Select';
import { generateNumOptions, moneyFormatInNaira } from 'utils/helpers';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import BackendPage from 'components/layout/BackendPage';
import { VasRequestIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import { API_ENDPOINT } from 'utils/URL';
import Link from 'next/link';
import { useCurrentRole } from 'hooks/useUser';
import MakePayment from './MakePayment';
import { MODEL } from '@/utils/constants';

const VasRequests = () => (
  <BackendPage>
    <VasRequestsList />
  </BackendPage>
);

export const VasRequestsList = () => (
  <PaginatedContent
    endpoint={API_ENDPOINT.getAllVasRequests()}
    pageName="Service Request"
    DataComponent={VasRequestsRowList}
    FilterComponent={FilterForm}
    PageIcon={<VasRequestIcon />}
    queryName="vasRequest"
  />
);

const VasRequestsRowList = ({ results, offset, setToast }) => {
  return (
    <div className="container-fluid">
      <Card className="mt-2">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {results.map((vasRequest, index) => (
                <VasRequestsRow
                  key={index}
                  number={offset + index + 1}
                  setToast={setToast}
                  {...vasRequest}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const VasRequestsRow = ({ _id, number, status, vasInfo, setToast }) => {
  const userType = useCurrentRole().name;
  return (
    <tr>
      <td>{number}</td>
      <td>{vasInfo?.name}</td>
      <td>{moneyFormatInNaira(vasInfo?.price)}</td>
      <td>{status}</td>
      <td>
        <Link href={`/${userType}/service/requests/${_id}`} passHref>
          <a className="btn btn-xs btn-secondary me-3 btn-wide">View Request</a>
        </Link>

        <MakePayment
          buttonClassName="btn btn-danger btn-wide btn-xs"
          setToast={setToast}
          amount={vasInfo.price || 0}
          model={{
            vasRequestId: _id,
            type: MODEL.VAS_REQUEST,
          }}
        />
      </td>
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
                <h5 className="mb-4">Filter VasRequests</h5>
                <div className="form-row">
                  <Input
                    formGroupClassName="col-md-6"
                    label="VasRequest Name"
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

export default VasRequests;
