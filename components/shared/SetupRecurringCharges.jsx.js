import Axios from 'axios';
import Modal from 'components/common/Modal';
import Button from 'components/forms/Button';
import React from 'react';
import { BASE_API_URL, RECURRING_CHARGES_DAY } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { Formik, Form, useFormikContext } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  onlinePaymentSchema,
  offlinePaymentSchema,
} from 'components/forms/schemas/transactionSchema';
import InputFormat from 'components/forms/InputFormat';
import { Card } from 'react-bootstrap';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import {
  calculateLocalTransactionFee,
  dataToOptions,
  getError,
  moneyFormatInNaira,
  objectToOptions,
  statusIsSuccessful,
  valuesToOptions,
} from 'utils/helpers';
import DatePicker from 'components/forms/DatePicker';
import Select from 'components/forms/Select';
import Upload from 'components/utils/Upload';
import ImagePlaceholder from 'assets/img/placeholder/image.png';
import Label from 'components/forms/Label';
import { refreshQuery } from 'hooks/useQuery';
import { useBankAccounts } from 'hooks/useBankAccounts';
import classNames from 'classnames';

const KEY = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};

const PAYMENT_TYPE = {
  [KEY.ONLINE]: 'Pay Online',
  [KEY.OFFLINE]: 'Bank Deposit/Transfer',
};

const SetupRecurringCharges = ({
  amount,
  model,
  setToast,
  className,
  buttonClassName,
  text = 'Setup Recurring Charges',
}) => {
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  return (
    <>
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        showFooter={false}
      >
        <OnlinePayment
          amount={amount}
          hideForm={() => setShowPaymentModal(false)}
          model={model}
          setToast={setToast}
        />
      </Modal>

      <button
        className={classNames(
          buttonClassName ||
            className ||
            'btn btn-danger-light btn-sm btn-wide fw-bold'
        )}
        onClick={() => setShowPaymentModal(true)}
      >
        {text}
      </button>
    </>
  );
};

const OnlinePayment = ({ setToast, amount, model }) => {
  return (
    <div className="mt-5">
      <h5 className="header-small">Setup Recurring Payment</h5>
      <Formik
        enableReinitialize={true}
        initialValues={setInitialValues(onlinePaymentSchema, {
          amount: Math.min(1_000_000, amount),
        })}
        onSubmit={({ amount, chargeType = null }, actions) => {
          const amountWithFee =
            amount * 1 + calculateLocalTransactionFee(amount);
          const payload = {
            amount: amountWithFee.toString(),
            model: {
              ...model,
              chargeType,
            },
          };
          Axios.post(`${BASE_API_URL}/payment/initiate`, payload, {
            headers: {
              Authorization: getTokenFromStore(),
            },
          })
            .then(function (response) {
              const { status, data } = response;
              if (statusIsSuccessful(status)) {
                window.location.href = data.payment.authorization_url;
              }
            })
            .catch(function (error) {
              setToast({
                message: getError(error),
              });
              actions.setSubmitting(false);
            });
        }}
        validationSchema={createSchema(onlinePaymentSchema)}
      >
        {({ isSubmitting, handleSubmit, ...props }) => (
          <Form>
            <PaystackRecurringChargesForm
              {...props}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
            />

            <DisplayFormikState {...props} showAll />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const PaystackRecurringChargesForm = ({ isSubmitting, handleSubmit }) => {
  const { values } = useFormikContext();
  const amount = values.amount;

  return (
    <Card className="card-container">
      <section className="row">
        <div className="px-3 col-sm-12">
          <InputFormat
            label="Amount"
            name="amount"
            placeholder="Transaction Amount"
            helpText="A 1.5% transaction fee will be charged on this transaction"
            formGroupClassName={'mb-1'}
          />
          <div className="mb-4">
            <p>
              <strong>Amount after fees: </strong>
              <span className="fw-bold">
                NGN{' '}
                {moneyFormatInNaira(
                  amount * 1 + calculateLocalTransactionFee(amount)
                )}
              </span>
            </p>
          </div>

          <Select
            label="Charge On"
            name="chargeType"
            options={objectToOptions(
              RECURRING_CHARGES_DAY,
              'Select days to charge',
              true
            )}
            placeholder="Select Payment type"
          />
          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Make Payment
          </Button>
        </div>
      </section>
    </Card>
  );
};

export default SetupRecurringCharges;
