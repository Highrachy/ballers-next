import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL, VAS_TYPE } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { addVasSchema } from 'components/forms/schemas/vasSchema';
import {
  getError,
  objectToOptions,
  statusIsSuccessful,
  // valuesToOptions,
} from 'utils/helpers';
import { navigate } from '@reach/router';
import { setQueryCache } from 'hooks/useQuery';
import Select from 'components/forms/Select';
import { refreshQuery } from 'hooks/useQuery';
import InputFormat from 'components/forms/InputFormat';
import Textarea from 'components/forms/Textarea';

const AddVas = ({ id }) => (
  <BackendPage>
    <div className="container-fluid">
      {id ? <VasForm id={id} /> : <VasForm />}
    </div>
  </BackendPage>
);

export const VasForm = ({ vas, setShowEditVasModal }) => {
  const [toast, setToast] = useToast();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(addVasSchema, vas)}
      onSubmit={(payload, actions) => {
        console.log(`payload`, payload);

        Axios({
          method: vas?._id ? 'put' : 'post',
          url: `${BASE_API_URL}/vas`,
          data: vas?._id ? { ...payload, id: vas?._id } : payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your Services has been successfully ${
                  vas?._id ? 'updated' : 'added'
                }`,
              });
              setQueryCache(['vas', data.vas._id], data.vas);
              refreshQuery('vas', true);
              actions.setSubmitting(false);

              setTimeout(() => {
                vas?._id
                  ? setShowEditVasModal(false)
                  : navigate('/admin/service');
              }, 1000);
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(addVasSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />

          <Card className="card-container">
            <section className="row">
              <div className="col-md-10 px-4">
                <h5> {vas?._id ? 'Update' : 'Add'} Service</h5>
                <Input label="Name" name="name" placeholder="Name" />

                <div className="form-row">
                  <InputFormat
                    formGroupClassName="col-md-6"
                    label="Price"
                    name="price"
                    placeholder="Price"
                  />

                  <Select
                    label="Type"
                    formGroupClassName="col-md-6"
                    name="type"
                    options={objectToOptions(VAS_TYPE)}
                  />
                </div>

                <Textarea
                  name="description"
                  placeholder="Description"
                  rows="3"
                />

                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  {vas?._id ? 'Update' : 'Add'} Service
                </Button>
                <DisplayFormikState {...props} showAll />
              </div>
            </section>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default AddVas;
