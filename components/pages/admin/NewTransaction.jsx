import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { addTransactionSchema } from 'components/forms/schemas/transactionSchema';
import Textarea from 'components/forms/Textarea';
import InputFormat from 'components/forms/InputFormat';
import { getError } from 'utils/helpers';
import DatePicker from 'components/forms/DatePicker';

const NewTransaction = ({ id }) => (
  <BackendPage>
    <div className="container-fluid">
      <NewTransactionForm />
    </div>
  </BackendPage>
);

export const NewTransactionForm = ({
  offerId,
  propertyId,
  userId,
  amount,
  hideForm,
}) => {
  const [toast, setToast] = useToast();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(addTransactionSchema, { amount })}
      onSubmit={(values, actions) => {
        const payload = {
          ...values,
          offerId,
          propertyId,
          userId,
          paidOn: values.paidOn.date,
          paymentSource: 'Website',
        };

        Axios.post(`${BASE_API_URL}/transaction/add`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status } = response;
            if (status === 201) {
              setToast({
                type: 'success',
                message: `Your transaction has been successfully added`,
              });
              hideForm();
              actions.setSubmitting(false);
              actions.resetForm();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(addTransactionSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />
          <TransactionInfoForm {...props} />
          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Add New Transaction
          </Button>
          <DisplayFormikState {...props} showAll />
        </Form>
      )}
    </Formik>
  );
};

const TransactionInfoForm = () => {
  return (
    <Card className="card-container">
      <section className="row">
        <div className="px-3 col-sm-12">
          <InputFormat
            label="Amount"
            name="amount"
            placeholder="Transaction Amount"
          />

          <DatePicker label="Paid on" name="paidOn" placeholder="Paid On" />

          <Textarea
            label="Additional Info"
            name="additionalInfo"
            placeholder="Additional Info"
          />
        </div>
      </section>
    </Card>
  );
};

export default NewTransaction;
