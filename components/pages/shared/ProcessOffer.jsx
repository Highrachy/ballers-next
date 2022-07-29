import React from 'react';
import Modal from 'components/common/Modal';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL, INVALID_OFFER, OFFER_STATUS } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { reactivateOfferSchema } from 'components/forms/schemas/offerSchema';
import {
  generateNumOptions,
  getError,
  statusIsSuccessful,
} from 'utils/helpers';
import { refreshQuery } from 'hooks/useQuery';
import DatePicker from 'components/forms/DatePicker';
import Select from 'components/forms/Select';
import { useCurrentRole } from 'hooks/useUser';
import { addDays } from 'date-fns';
import { Spacing } from 'components/common/Helpers';
import { isPastDate } from 'utils/date-helpers';

export const ReactivateOfferForm = ({ setToast, offer }) => {
  const [showReactivateModal, setShowReactivateModal] = React.useState(false);
  const isVendor = useCurrentRole().isVendor;
  // TODO: Check expired
  const offerCanBeReactivated =
    isVendor &&
    isPastDate(offer.expires) &&
    (offer.status === OFFER_STATUS.GENERATED ||
      offer.status === OFFER_STATUS.EXPIRED);

  return (
    <>
      {offerCanBeReactivated && (
        <div className="mt-5">
          <button
            className="btn btn-secondary btn-wide hide-print"
            onClick={() => setShowReactivateModal(true)}
          >
            Reactivate Offer Letter
          </button>
        </div>
      )}
      <Modal
        title="Reactivate Offer Letter"
        show={showReactivateModal}
        onHide={() => setShowReactivateModal(false)}
        showFooter={false}
      >
        <Formik
          enableReinitialize={true}
          initialValues={setInitialValues(reactivateOfferSchema)}
          onSubmit={({ initialPaymentDate, expires }, actions) => {
            const payload = {
              expires: addDays(new Date(), expires),
              offerId: offer._id,
              initialPaymentDate: initialPaymentDate.date,
            };

            Axios({
              method: 'put',
              url: `${BASE_API_URL}/offer/reactivate`,
              data: payload,
              headers: { Authorization: getTokenFromStore() },
            })
              .then(function (response) {
                const { status } = response;
                if (statusIsSuccessful(status)) {
                  setToast({
                    type: 'success',
                    message: `Your Offer has been successfully activated`,
                  });
                  setShowReactivateModal(false);
                  refreshQuery('offer', true);
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
          validationSchema={createSchema(reactivateOfferSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <div className="px-1">
                <DatePicker
                  label="Initial Payment Due Date"
                  name="initialPaymentDate"
                  minDate={new Date()}
                />
                <Select
                  label="Offer Expires in"
                  name="expires"
                  options={generateNumOptions(11, 'Day', { startFrom: 5 })}
                  placeholder="Offer Expires in"
                />
                <Button
                  className="btn-secondary mb-5"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Reactivate Offer
                </Button>
                <Spacing />
                <Button
                  color="dark"
                  className="btn mb-5"
                  onClick={() => setShowReactivateModal(false)}
                >
                  Close
                </Button>
                <DisplayFormikState {...props} showAll />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export const AcceptOfferLetter = ({ setToast, offer, setOffer, signature }) => {
  const [showAcceptModal, setShowAcceptModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isUser = useCurrentRole().isUser;
  const offerCanBeAccepted =
    isUser && offer.status === OFFER_STATUS.GENERATED && !!signature;

  const acceptOffer = () => {
    const payload = { offerId: offer._id, signature };
    setLoading(true);

    Axios.put(`${BASE_API_URL}/offer/accept`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setToast({
            message: 'Your offer letter has been accepted',
            type: 'success',
          });
          setOffer({ ...offer, status: OFFER_STATUS.INTERESTED });
          setShowAcceptModal(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <>
      {offerCanBeAccepted && (
        <div className="mt-5">
          <button
            className="btn btn-success btn-wide hide-print"
            onClick={() => setShowAcceptModal(true)}
          >
            Accept Offer Letter
          </button>
        </div>
      )}
      <Modal
        title="Accept Offer Letter"
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 confirmation-text">
              Are you sure you want to accept this offer?
            </p>
            <Button
              color="success"
              loading={loading}
              className="btn mb-5"
              onClick={acceptOffer}
            >
              Accept Offer Letter
            </Button>
            <Spacing />
            <Button
              color="dark"
              className="btn mb-5"
              onClick={() => setShowAcceptModal(false)}
            >
              Close
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const CancelOfferLetter = ({ setToast, offer, setOffer }) => {
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isAdmin = useCurrentRole().isAdmin;
  const isVendor = useCurrentRole().isVendor;
  // TODO: Check all conditions here
  const offerCanBeCancelled =
    !(isPastDate(offer.expires) && offer.status === OFFER_STATUS.GENERATED) &&
    offer.status !== OFFER_STATUS.COMPLETED_PAYMENT &&
    ((isVendor &&
      !INVALID_OFFER.includes(offer.status) &&
      offer.status !== OFFER_STATUS.PRE_CANCELLED) ||
      (isAdmin && offer.status === OFFER_STATUS.PRE_CANCELLED));

  const cancelOffer = () => {
    const payload = { offerId: offer._id };
    setLoading(true);

    Axios.put(`${BASE_API_URL}/offer/cancel`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setToast({
            message: 'Your offer letter has been cancelled',
            type: 'success',
          });
          setOffer({ ...offer, status: OFFER_STATUS.CANCELLED });
          setShowCancelModal(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <>
      {/* Check Expired */}
      {(Date.now() < offer.expires &&
        offer.status === OFFER_STATUS.GENERATED) ||
        (offerCanBeCancelled && (
          <div className="mt-5 text-right">
            <button
              className="btn btn-sm btn-outline-danger btn-wide hide-print"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Offer Letter
            </button>
          </div>
        ))}
      <Modal
        title="Cancel Offer Letter"
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 confirmation-text">
              Are you sure you want to cancel this offer?
            </p>
            <Button
              color="danger"
              loading={loading}
              className="btn mb-5"
              onClick={cancelOffer}
            >
              Cancel Offer Letter
            </Button>
            <Spacing />
            <Button
              color="dark"
              className="btn mb-5"
              onClick={() => setShowCancelModal(false)}
            >
              Close
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const AssignOfferLetter = ({ setToast, offer, setOffer }) => {
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isVendor = useCurrentRole().isVendor;
  const offerCanBeAssigned =
    isVendor && offer.status === OFFER_STATUS.PRE_ASSIGNED;

  const assignOffer = () => {
    const payload = { offerId: offer._id };
    setLoading(true);

    Axios.put(
      `${BASE_API_URL}/offer/${offer._id}/confirm-assignment`,
      payload,
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setToast({
            message: 'Your offer letter has been assigned',
            type: 'success',
          });
          setOffer({ ...offer, status: OFFER_STATUS.ASSIGNED });
          setShowAssignModal(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <>
      {offerCanBeAssigned && (
        <div className="mt-5">
          <button
            className="btn btn-secondary btn-wide hide-print"
            onClick={() => setShowAssignModal(true)}
          >
            Assign Property
          </button>
        </div>
      )}
      <Modal
        title="Assign Property"
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 confirmation-text">
              Are you sure you want to assign this offer?
            </p>
            <Button
              color="secondary"
              loading={loading}
              className="btn mb-5"
              onClick={assignOffer}
            >
              Assign Property
            </Button>
            <Spacing />
            <Button
              color="dark"
              className="btn mb-5"
              onClick={() => setShowAssignModal(false)}
            >
              Close
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const AllocateOfferLetter = ({ setToast, offer, setOffer }) => {
  const [showAllocateModal, setShowAllocateModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isVendor = useCurrentRole().isVendor;
  const offerCanBeAllocated =
    isVendor && offer.status === OFFER_STATUS.PRE_ALLOCATED;

  const allocateOffer = () => {
    const payload = { offerId: offer._id };
    setLoading(true);

    Axios.put(
      `${BASE_API_URL}/offer/${offer._id}/confirm-allocation`,
      payload,
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setToast({
            message: 'Your offer letter has been allocated',
            type: 'success',
          });
          setOffer({ ...offer, status: OFFER_STATUS.ALLOCATED });
          setShowAllocateModal(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <>
      {offerCanBeAllocated && (
        <div className="mt-5">
          <button
            className="btn btn-secondary btn-wide hide-print"
            onClick={() => setShowAllocateModal(true)}
          >
            Allocate Property
          </button>
        </div>
      )}
      <Modal
        title="Cancel Property"
        show={showAllocateModal}
        onHide={() => setShowAllocateModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 confirmation-text">
              Are you sure you want to allocate this offer?
            </p>
            <Button
              color="secondary"
              loading={loading}
              className="btn mb-5"
              onClick={allocateOffer}
            >
              Allocate Property
            </Button>
            <Spacing />
            <Button
              color="dark"
              className="btn mb-5"
              onClick={() => setShowAllocateModal(false)}
            >
              Close
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const RevertOfferLetter = ({ setToast, offer, setOffer }) => {
  const [showRevertModal, setShowRevertModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isVendor = useCurrentRole().isVendor;
  const offerCanBeReverted =
    isVendor && offer.status === OFFER_STATUS.PRE_CANCELLED;

  const revertOffer = () => {
    const payload = { offerId: offer._id };
    setLoading(true);

    Axios.put(
      `${BASE_API_URL}/offer/${offer._id}/revert-cancellation`,
      payload,
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setToast({
            message: 'Your offer letter has been reverted',
            type: 'success',
          });
          setOffer({ ...offer, status: OFFER_STATUS.ASSIGNED });
          setShowRevertModal(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <>
      {offerCanBeReverted && (
        <div className="mt-5">
          <button
            className="btn btn-secondary btn-wide hide-print"
            onClick={() => setShowRevertModal(true)}
          >
            Revert Offer Letter
          </button>
        </div>
      )}
      <Modal
        title="Revert Offer Letter"
        show={showRevertModal}
        onHide={() => setShowRevertModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 confirmation-text">
              Are you sure you want to revert this offer?
            </p>
            <Button
              color="secondary"
              loading={loading}
              className="btn mb-5"
              onClick={revertOffer}
            >
              Revert Offer Letter
            </Button>
            <Spacing />
            <Button
              color="dark"
              className="btn mb-5"
              onClick={() => setShowRevertModal(false)}
            >
              Close
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};
