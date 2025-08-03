import React from 'react';
import Modal from 'components/common/Modal';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  addPaymentPlanSchema,
  updatePaymentPlanSchema,
} from 'components/forms/schemas/propertySchema';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import {
  getError,
  statusIsSuccessful,
  moneyFormatInNaira,
} from 'utils/helpers';
import Input from 'components/forms/Input';
import InputFormat from 'components/forms/InputFormat';
import { useCurrentRole } from 'hooks/useUser';
import { setQueryCache } from 'hooks/useQuery';
import Switch from 'components/forms/Switch';
import { BuyNowButton } from 'pages/properties/[slug]';

/* ────────────────────────────────────────── */
/* Shared helpers                             */
/* ────────────────────────────────────────── */
const pageOptions = { key: 'property', pageName: 'Payment plan' };

const calcMonthly = ({ totalPayment, initialPayment, numberOfMonths }) =>
  numberOfMonths && totalPayment && initialPayment
    ? Math.round((totalPayment - initialPayment) / numberOfMonths)
    : 0;
/* ────────────────────────────────────────── */
/* 1.  Form                                   */
/* ────────────────────────────────────────── */
export const PaymentPlanForm = ({
  hideForm,
  setToast,
  setProperty,
  property,
  paymentPlan, // undefined for add
}) => {
  const [toast] = useToast();

  return (
    <Formik
      enableReinitialize
      initialValues={setInitialValues(
        paymentPlan ? updatePaymentPlanSchema : addPaymentPlanSchema,
        paymentPlan
      )}
      validationSchema={createSchema(
        paymentPlan ? updatePaymentPlanSchema : addPaymentPlanSchema
      )}
      onSubmit={(values, actions) => {
        const url = `${BASE_API_URL}/property/${property._id}/payment-plan`;

        const method = paymentPlan?._id ? 'put' : 'post';
        const isPreferred = !!values?.isPreferred;
        Axios({
          method,
          url,
          data: paymentPlan?._id
            ? { ...values, paymentPlanId: paymentPlan._id, isPreferred }
            : { ...values, isPreferred },
          headers: { Authorization: getTokenFromStore() },
        })
          .then(({ status, data }) => {
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Payment plan ${
                  paymentPlan ? 'updated' : 'added'
                } successfully`,
              });
              setProperty(data.property);
              setQueryCache([pageOptions.key, property._id], {
                property: data.property,
              });
              hideForm();
            }
          })
          .catch((err) => {
            setToast({ message: getError(err) });
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting, handleSubmit, ...props }) => {
        // live monthly calc (front-end only for display; backend recalcs too)
        const { values } = props;
        const monthlyPayment = calcMonthly(values);
        // Validation for monthly payment and total payment
        const showMonthlyError =
          monthlyPayment <= 0 ||
          values.totalPayment < property.price ||
          values.totalPayment > property.price * 1.2;

        return (
          <Form>
            <Toast {...toast} showToastOnly />
            <section className="row">
              <div className="col-md-10 px-4">
                <h5>{paymentPlan ? 'Edit' : 'Add'} Payment Plan</h5>
                <div className="mt-2 text-muted">
                  Property price:{' '}
                  <strong>{moneyFormatInNaira(property.price)}</strong>
                </div>

                <Input
                  label="Plan name"
                  name="name"
                  placeholder="e.g. 24-Month Plan"
                  optional
                />

                <InputFormat
                  label="Initial payment"
                  name="initialPayment"
                  placeholder="₦0.00"
                  prefix="₦ "
                  thousandSeparator
                  allowNegative={false}
                />

                <InputFormat
                  label="Total payment"
                  name="totalPayment"
                  placeholder="₦0.00"
                  prefix="₦ "
                  thousandSeparator
                  allowNegative={false}
                />

                <InputFormat
                  label="Number of months"
                  name="numberOfMonths"
                  placeholder="24"
                  allowNegative={false}
                  prefix=""
                  suffix=" months"
                  isNumericString
                />

                <p>Monthly Payment</p>
                <h4>{moneyFormatInNaira(monthlyPayment)}</h4>

                <div className="my-3">
                  <Switch name="isPreferred" label="Set as preferred" />
                </div>

                {showMonthlyError ? (
                  <div className="alert alert-warning mt-3">
                    <strong>Note:</strong>{' '}
                    {monthlyPayment <= 0
                      ? 'Monthly payment must be greater than 0.'
                      : values.totalPayment < property.price
                      ? `Your Payment Plan's total payment must not be less than property price (${moneyFormatInNaira(
                          property.price
                        )}).`
                      : `Your Payment Plan's total payment (${moneyFormatInNaira(
                          values.totalPayment
                        )}) must not exceed 120% of property price (${moneyFormatInNaira(
                          property.price * 1.2
                        )}).`}
                  </div>
                ) : (
                  <Button
                    className="btn-secondary mt-3"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {paymentPlan ? 'Update' : 'Add'} Plan
                  </Button>
                )}
                <DisplayFormikState showAll {...props} />
              </div>
            </section>
          </Form>
        );
      }}
    </Formik>
  );
};

/* ────────────────────────────────────────── */
/* 2.  “Add” trigger wrapper                  */
/* ────────────────────────────────────────── */
export const AddPaymentPlanButton = ({
  property,
  setProperty,
  setToast,
  className = 'btn btn-secondary-light btn-sm btn-wide',
}) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <span className={className} onClick={() => setShowModal(true)}>
        Add Payment Plan
      </span>

      <Modal
        title="Payment Plan"
        show={showModal}
        onHide={() => setShowModal(false)}
        showFooter={false}
      >
        <PaymentPlanForm
          hideForm={() => setShowModal(false)}
          setToast={setToast}
          setProperty={setProperty}
          property={property}
        />
      </Modal>
    </>
  );
};

/* ────────────────────────────────────────── */
/* 3.  List / edit / delete / set-preferred   */
/* ────────────────────────────────────────── */
export const PaymentPlanList = ({
  property,
  setProperty,
  setToast,
  isPublicPage,
}) => {
  const isVendor = useCurrentRole().isVendor;
  const userIsVendor = !isPublicPage && isVendor;
  const [modalInfo, setModalInfo] = React.useState({
    show: false,
    plan: null,
    mode: 'edit',
  });
  const [deleteInfo, setDeleteInfo] = React.useState({
    show: false,
    plan: null,
    loading: false,
  });
  const [preferredInfo, setPreferredInfo] = React.useState({
    show: false,
    plan: null,
    loading: false,
  });

  const plans = property?.paymentPlans || [];
  const noPlans = plans.length === 0;

  /* -- delete helper -- */
  const deletePlan = () => {
    setDeleteInfo({ ...deleteInfo, loading: true });
    Axios.delete(
      `${BASE_API_URL}/property/${property._id}/payment-plan/${deleteInfo.plan._id}`,
      { headers: { Authorization: getTokenFromStore() } }
    )
      .then(({ status, data }) => {
        if (statusIsSuccessful(status)) {
          setToast({ type: 'success', message: 'Payment plan deleted' });
          setProperty(data.property);
          setDeleteInfo({ show: false, plan: null, loading: false });
        }
      })
      .catch((err) => {
        setToast({ message: getError(err) });
        setDeleteInfo({ ...deleteInfo, loading: false });
      });
  };

  /* -- set preferred helper -- */
  const setPreferred = (plan) => {
    setPreferredInfo({ ...preferredInfo, loading: true });
    Axios.put(
      `${BASE_API_URL}/property/${property._id}/payment-plan/${plan._id}/set-preferred`,
      {},
      { headers: { Authorization: getTokenFromStore() } }
    )
      .then(({ status, data }) => {
        if (statusIsSuccessful(status)) {
          setToast({ type: 'success', message: 'Preferred plan updated' });
          setProperty(data.property);
          setPreferredInfo({ show: false, plan: null, loading: false });
        }
      })
      .catch((err) => {
        setToast({ message: getError(err) });
        setPreferredInfo({ ...preferredInfo, loading: false });
      });
  };

  return (
    <>
      <div className="property__payment-plans">
        {(!noPlans || userIsVendor) && (
          <h5 className="header-content">Payment Plans</h5>
        )}

        <section className="row">
          {!noPlans &&
            plans.map((plan) => (
              <PaymentPlanCard
                key={plan._id}
                plan={plan}
                onEdit={() => setModalInfo({ show: true, plan, mode: 'edit' })}
                onDelete={() =>
                  setDeleteInfo({ show: true, plan, loading: false })
                }
                onSetPreferred={() =>
                  setPreferredInfo({ show: true, plan, loading: false })
                }
                isPreferred={plan.isPreferred}
                isVendor={userIsVendor}
                isPublicPage={isPublicPage}
                property={property}
              />
            ))}
        </section>

        {userIsVendor && (
          <AddPaymentPlanButton
            property={property}
            setToast={setToast}
            setProperty={setProperty}
          />
        )}
      </div>

      {/* Edit modal */}
      {modalInfo.show && (
        <Modal
          title="Payment Plan"
          show={modalInfo.show}
          onHide={() => setModalInfo({ show: false, plan: null })}
          showFooter={false}
        >
          <PaymentPlanForm
            hideForm={() => setModalInfo({ show: false, plan: null })}
            setToast={setToast}
            setProperty={setProperty}
            property={property}
            paymentPlan={modalInfo.plan}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteInfo.show && (
        <Modal
          title="Delete Payment Plan"
          show={deleteInfo.show}
          onHide={() => setDeleteInfo({ show: false, plan: null })}
          showFooter={false}
        >
          <section className="row">
            <div className="col-md-12 my-3 text-center">
              <p className="my-4 confirmation-text fw-bold">
                Are you sure you want to delete&nbsp;
                {deleteInfo.plan.name || 'this plan'}?
              </p>
              <Button
                className="btn btn-danger mb-5 me-3"
                loading={deleteInfo.loading}
                onClick={deletePlan}
              >
                Yes, Delete
              </Button>
              <Button
                color="primary-light"
                className="btn mb-5"
                onClick={() => setDeleteInfo({ show: false, plan: null })}
              >
                Cancel
              </Button>
            </div>
          </section>
        </Modal>
      )}

      {/* Set Preferred confirm */}
      {preferredInfo.show && (
        <Modal
          title="Set as Preferred Plan"
          show={preferredInfo.show}
          onHide={() => setPreferredInfo({ show: false, plan: null })}
          showFooter={false}
        >
          <section className="row">
            <div className="col-md-12 my-3 text-center">
              <p className="my-4 confirmation-text fw-bold">
                Are you sure you want to set&nbsp;
                {preferredInfo.plan.name || 'this plan'} as the preferred plan?
              </p>
              <Button
                className="btn btn-secondary mb-5 me-3"
                loading={preferredInfo.loading}
                onClick={() => setPreferred(preferredInfo.plan)}
              >
                Yes, Set as Preferred
              </Button>
              <Button
                color="primary-light"
                className="btn mb-5"
                onClick={() => setPreferredInfo({ show: false, plan: null })}
              >
                Cancel
              </Button>
            </div>
          </section>
        </Modal>
      )}
    </>
  );
};

const PaymentPlanCard = ({
  plan,
  onEdit,
  onDelete,
  onSetPreferred,
  isPreferred,
  isVendor,
  isPublicPage = false,
  property = {},
}) => {
  return (
    <aside className="col-md-6 col-lg-4">
      <div className="card border rounded shadow-sm p-4 mb-4">
        <header className="text-center">
          <h6 className="text-uppercase text-muted fw-bold mb-1 pt-3">
            {plan.name || `${plan.numberOfMonths}-Month Plan`}{' '}
            {isPreferred && '(Preferred)'}
          </h6>
          <h3
            className={`fw-bold ${
              isPreferred ? 'text-secondary' : 'text-secondary'
            } mt-2 mb-0`}
          >
            {moneyFormatInNaira(plan.initialPayment)}
          </h3>
          <p className="text-muted small">Initial Payment</p>
        </header>

        <ul className="list-dotted list-unstyled">
          <li>
            <span className="list-dotted__label">Monthly Payment</span>
            <span className="list-dotted__value">
              {moneyFormatInNaira(plan.monthlyPayment)}
            </span>
          </li>
          <li>
            <span className="list-dotted__label">Duration</span>
            <span className="list-dotted__value">
              {plan.numberOfMonths} Months
            </span>
          </li>
          <li>
            <span className="list-dotted__label">Total Payment</span>
            <span
              className={`list-dotted__value ${
                isPreferred ? 'text-secondary' : 'text-secondary'
              }`}
            >
              {moneyFormatInNaira(plan.totalPayment)}
            </span>
          </li>
        </ul>

        {isVendor && !isPublicPage ? (
          <div className="d-flex gap-2">
            <Button color="primary-light" className="btn-sm" onClick={onEdit}>
              Edit Plan
            </Button>
            <Button color="danger-light" className="btn-sm" onClick={onDelete}>
              Delete Plan
            </Button>
            {!isPreferred && (
              <Button
                color="success-light"
                className="btn-sm"
                onClick={onSetPreferred}
              >
                Set as Preferred
              </Button>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center my-3">
            <BuyNowButton property={property} />
          </div>
        )}
      </div>
    </aside>
  );
};
