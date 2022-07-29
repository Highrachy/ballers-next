import React from 'react';
import { Card } from 'react-bootstrap';
import PaginatedContent from 'components/common/PaginatedContent';
import { Form, Formik } from 'formik';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import Select from 'components/forms/Select';
import {
  generateNumOptions,
  getError,
  moneyFormatInNaira,
  statusIsSuccessful,
} from 'utils/helpers';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import BackendPage from 'components/layout/BackendPage';
import { VasIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import { Spacing } from 'components/common/Helpers';
import Modal from 'components/common/Modal';
import { VasForm } from './AddVas';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import axios from 'axios';
import { refreshQuery } from 'hooks/useQuery';
import { VasRequestsList } from '../shared/VasRequests';

const Vas = () => {
  return (
    <BackendPage>
      <PaginatedContent
        addNewUrl="/admin/service/new"
        endpoint={API_ENDPOINT.getAllVas()}
        pageName="Service"
        pluralPageName="Services"
        DataComponent={VasRowList}
        FilterComponent={FilterForm}
        PageIcon={<VasIcon />}
        queryName="vas"
      />
      <section className="mt-5">
        <VasRequestsList />
      </section>
    </BackendPage>
  );
};

const VasRowList = ({ results, offset, setToast }) => {
  const [vas, setVas] = React.useState(null);
  const [showVasModal, setShowVasModal] = React.useState(false);
  const [showEditVasModal, setShowEditVasModal] = React.useState(false);
  const [showDeleteVasModal, setShowDeleteVasModal] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const deleteVas = () => {
    setLoading(true);
    axios
      .delete(`${BASE_API_URL}/vas/${vas._id}`, {
        headers: { Authorization: getTokenFromStore() },
        data: {},
      })
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `'${vas.name}'' has been successfully deleted`,
          });
          refreshQuery('vas', true);
          setLoading(false);
          setShowDeleteVasModal(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  const setShowVas = (vas) => {
    setVas(vas);
    setShowVasModal(true);
  };

  const setEditVas = (vas) => {
    setVas(vas);
    setShowEditVasModal(true);
  };
  const setDeleteVas = (vas) => {
    setVas(vas);
    setShowDeleteVasModal(true);
  };

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
                <th>Type</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {results.map((vas, index) => (
                <VasRow
                  key={index}
                  number={offset + index + 1}
                  vas={vas}
                  setShowVas={setShowVas}
                  setEditVas={setEditVas}
                  setDeleteVas={setDeleteVas}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        title="Services"
        show={showVasModal}
        onHide={() => setShowVasModal(false)}
        showFooter={false}
        size="lg"
      >
        <ViewVas {...vas} />
      </Modal>

      {/* edit vas */}
      <Modal
        title="Edit Services"
        show={showEditVasModal}
        onHide={() => setShowEditVasModal(false)}
        showFooter={false}
        size="lg"
      >
        <VasForm vas={vas} setShowEditVasModal={setShowEditVasModal} />
      </Modal>

      {/* Delete Vas Modal */}
      <Modal
        title="Verify Vendor"
        show={showDeleteVasModal}
        onHide={() => setShowDeleteVasModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <h4>{vas?.name}</h4>
            <p className="my-4 confirmation-text font-weight-bold">
              Are you sure you want to delete this Service?
            </p>

            <Button
              loading={loading}
              className="btn btn-secondary mb-5"
              onClick={() => deleteVas()}
            >
              Delete Service
            </Button>
          </div>
        </section>
      </Modal>
    </div>
  );
};

const ViewVas = ({ name, price, type, description }) => {
  return (
    <section>
      <h4>{name}</h4>
      <p>{description}</p>
      <p>Price: {moneyFormatInNaira(price)}</p>
      <p>Type: {type}</p>
    </section>
  );
};

const VasRow = ({ number, vas, setShowVas, setEditVas, setDeleteVas }) => {
  const { name, price, type } = vas;
  return (
    <tr>
      <td>{number}</td>
      <td>{name}</td>
      <td>{moneyFormatInNaira(price)}</td>
      <td>{type}</td>
      <td>
        <Button
          color="primary"
          onClick={() => setShowVas(vas)}
          className="btn-xs btn-wide"
        >
          View
        </Button>
        <Spacing />
        <Spacing />
        <Button onClick={() => setEditVas(vas)} className="btn-xs btn-wide">
          Edit
        </Button>
        <Spacing />
        <Spacing />
        <Button
          color="danger"
          onClick={() => setDeleteVas(vas)}
          className="btn-xs btn-wide"
        >
          Delete
        </Button>
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
            // houseType: `House Type : ${Humanize.titleCase(values.houseType)}`,
          }
        );
      }}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Card className="card-container">
            <section className="row">
              <div className="col-md-10 px-4">
                <h5 className="mb-4">Filter Vas</h5>
                <div className="form-row">
                  <Input
                    formGroupClassName="col-md-6"
                    label="Vas Name"
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

export default Vas;
