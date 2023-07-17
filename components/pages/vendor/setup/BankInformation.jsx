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
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { UserContext } from 'context/UserContext';
import { bankSchema } from 'components/forms/schemas/vendorSchema';
import { getError, statusIsSuccessful } from 'utils/helpers';
import { VerificationComments } from './AccountSetup';

const BankInformation = () => (
  <BackendPage>
    <div className="container-fluid">
      <BankInformationForm />
    </div>
  </BackendPage>
);

export const BankInformationForm = ({ moveToNextStep, setStepToast }) => {
  const [toast, setToast] = useToast();
  const { userDispatch, userState } = React.useContext(UserContext);

  const TEST_DATA = {
    ...userState.vendor?.bankInfo,
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(bankSchema, TEST_DATA)}
      onSubmit={(values, actions) => {
        let payload = { vendor: { bankInfo: values } };

        Axios.put(`${BASE_API_URL}/user/vendor/update`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              userDispatch({
                type: 'user-profile-update',
                user: data.user,
              });

              const successMessage = {
                type: 'success',
                message: `Your Bank information has been successfully saved`,
              };
              setToast(successMessage);
              setStepToast(successMessage);
              actions.setSubmitting(false);
              actions.resetForm();
              moveToNextStep();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(bankSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} />
          <BankInfoForm
            {...props}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
          <DisplayFormikState {...props} showAll hide />
        </Form>
      )}
    </Formik>
  );
};

const BankInfoForm = ({ isSubmitting, handleSubmit }) => {
  return (
    <Card className="card-container">
      <section className="row">
        <div className="col-md-10 px-4">
          <h5 className="mb-4">Bank Information</h5>
          <VerificationComments step="2" />

          <Input
            label="Account Name"
            name="accountName"
            placeholder="Account Name"
          />

          <div className="form-row">
            <Input
              formGroupClassName="col-md-6"
              label="Bank Name"
              name="bankName"
            />
            <Input
              formGroupClassName="col-md-6"
              label="Account Number (NUBAN)"
              name="accountNumber"
            />
          </div>

          <Button
            className="btn-secondary my-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </section>
    </Card>
  );
};

export default BankInformation;
