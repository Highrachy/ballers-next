import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import PaginatedContent from 'components/common/PaginatedContent';
import { API_ENDPOINT } from 'utils/URL';
import ProfileAvatar from 'assets/img/avatar/profile.png';
import { moneyFormatInNaira } from 'utils/helpers';
import { ACTIVE_OFFER_STATUS, OFFER_STATUS } from 'utils/constants';
import { SuccessIcon } from 'components/utils/Icons';
import { InfoIcon } from 'components/utils/Icons';
import { useCurrentRole } from 'hooks/useUser';
import { OfferIcon } from 'components/utils/Icons';
import UserCard from 'components/common/UserCard';
import Modal from 'components/common/Modal';
import Button from 'components/forms/Button';
import { Form, Formik } from 'formik';
import Textarea from 'components/forms/Textarea';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import {
  requestTermsReviewSchema,
  respondTermsReviewSchema,
} from 'components/forms/schemas/offerSchema';
import { Spacing } from 'components/common/Helpers';
import Link from 'next/link';
import { OnlineImage } from '../utils/Image';

const PendingOffers = () => (
  <BackendPage>
    <PaginatedContent
      childrenKey="offer"
      endpoint={API_ENDPOINT.getAllOffers()}
      initialFilter={{
        limit: 100,
        status: useCurrentRole().isAdmin
          ? OFFER_STATUS.PENDING_ADMIN_APPROVAL
          : OFFER_STATUS.PENDING_VENDOR_REVIEW,
      }}
      pageName="Pending Offers"
      pluralPageName="Offers"
      DataComponent={OffersRowList}
      PageIcon={<OfferIcon />}
      queryName="pendingOffers"
      refresh
    />
  </BackendPage>
);

export const OffersRowList = ({ results, offset, setToast }) => {
  const [offer, setOffer] = React.useState(null);
  const [showTermsModal, setShowTermsModal] = React.useState(false);

  const showTermsAndConditionsModal = (offer) => {
    setOffer(offer);
    setShowTermsModal(true);
  };

  return (
    <div className="container-fluid mb-5">
      <Card>
        <div className="table-responsive">
          <table className="table table-border table-hover mb-0">
            <tbody>
              {results?.map((offer, index) => (
                <OffersRow
                  key={index}
                  number={offset + index + 1}
                  offer={offer}
                  showTermsAndConditionsModal={showTermsAndConditionsModal}
                />
              ))}
            </tbody>
          </table>
        </div>
        {useCurrentRole().isAdmin ? (
          <ModalToShowTermsForAdmin
            offer={offer}
            showTermsModal={showTermsModal}
            setShowTermsModal={setShowTermsModal}
            setToast={setToast}
          />
        ) : (
          <ModalToShowTermsForVendor
            offer={offer}
            showTermsModal={showTermsModal}
            setShowTermsModal={setShowTermsModal}
            setToast={setToast}
          />
        )}
      </Card>
    </div>
  );
};

const ModalToShowTermsForAdmin = ({
  offer,
  showTermsModal,
  setShowTermsModal,
  setToast,
}) => {
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [showApprovalMessage, setShowApprovalMessage] = React.useState(false);
  return (
    <Modal
      title="Additional Terms and Conditions"
      show={showTermsModal}
      onHide={() => setShowTermsModal(false)}
      showFooter={false}
    >
      {showCommentForm && (
        <AddReviewCommentForm
          offer={offer}
          setToast={setToast}
          setShowCommentForm={setShowCommentForm}
          setShowTermsModal={setShowTermsModal}
        />
      )}
      {showApprovalMessage && (
        <TermsApprovalMessage
          offer={offer}
          setToast={setToast}
          setShowApprovalMessage={setShowApprovalMessage}
          setShowTermsModal={setShowTermsModal}
        />
      )}
      {!showCommentForm && !showApprovalMessage && (
        <section>
          <ul>
            {offer?.additionalClause?.clauses?.map((clause, index) => (
              <li key={index}>
                <p>{clause}</p>
              </li>
            ))}
          </ul>

          <ShowTermsComments comments={offer?.additionalClause?.comments} />

          <Button
            className="btn-secondary mt-4"
            onClick={() => setShowApprovalMessage(true)}
          >
            Approve Terms
          </Button>
          <Spacing />
          <Spacing />
          <Button
            className="btn-danger mt-4"
            onClick={() => setShowCommentForm(true)}
          >
            Reject Terms
          </Button>
        </section>
      )}
    </Modal>
  );
};

const AddReviewCommentForm = ({
  offer,
  setToast,
  setShowTermsModal,
  setShowCommentForm,
}) => {
  return (
    <section className="row">
      <div className="col-md-12 my-3">
        <Formik
          initialValues={setInitialValues(requestTermsReviewSchema)}
          onSubmit={({ comment }, actions) => {
            const payload = {
              comment,
            };
            Axios.put(
              `${BASE_API_URL}/offer/${offer._id}/request-terms-review`,
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
                    message: `Comment has been successfully submitted`,
                  });
                  actions.setSubmitting(false);
                  actions.resetForm();
                  setShowTermsModal(false);
                }
              })
              .catch(function (error) {
                setToast({
                  message: getError(error),
                });
                actions.setSubmitting(false);
              });
          }}
          validationSchema={createSchema(requestTermsReviewSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <Textarea
                name="comment"
                label="Reason for rejecting the Terms and Conditions"
                placeholder="Your Comment"
                rows="3"
              />

              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Add Comment
              </Button>
              <Spacing />
              <Spacing />
              <Button
                className="btn-danger mt-4"
                onClick={() => setShowCommentForm(false)}
              >
                Back
              </Button>
              <DisplayFormikState {...props} hide showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

const TermsApprovalMessage = ({
  offer,
  setToast,
  setShowTermsModal,
  setShowApprovalMessage,
}) => {
  const [loading, setLoading] = React.useState(false);

  const approveTerms = () => {
    setLoading(true);
    Axios.put(
      `${BASE_API_URL}/offer/${offer._id}/approve-terms`,
      {},
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `The offer terms and conditions has been successfully approved`,
          });
          setLoading(false);
          setShowTermsModal(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };
  return (
    <section className="row">
      <div className="col-md-12 my-3 text-center">
        <h5 className="my-2 confirmation-text">
          Are you sure you want to approve this Terms and Conditions?
        </h5>
        <Button
          className="btn btn-secondary mt-4"
          onClick={approveTerms}
          loading={loading}
        >
          Yes, Approve
        </Button>
        <Spacing />
        <Spacing />
        <Button
          className="btn-danger mt-4"
          onClick={() => setShowApprovalMessage(false)}
        >
          Back
        </Button>
      </div>
    </section>
  );
};

const ModalToShowTermsForVendor = ({
  offer,
  showTermsModal,
  setShowTermsModal,
  setToast,
}) => {
  const [showFixCommentForm, setShowFixCommentForm] = React.useState(false);
  const [showRemovalMessage, setShowRemovalMessage] = React.useState(false);
  return (
    <Modal
      title="Additional Terms and Conditions"
      show={showTermsModal}
      onHide={() => setShowTermsModal(false)}
      showFooter={false}
    >
      {showFixCommentForm && (
        <FixReviewCommentForm
          offer={offer}
          setToast={setToast}
          setShowFixCommentForm={setShowFixCommentForm}
          setShowTermsModal={setShowTermsModal}
        />
      )}
      {showRemovalMessage && (
        <TermsRemovalMessage
          offer={offer}
          setToast={setToast}
          setShowRemovalMessage={setShowRemovalMessage}
          setShowTermsModal={setShowTermsModal}
        />
      )}
      {!showFixCommentForm && !showRemovalMessage && (
        <section>
          <ul>
            {offer?.additionalClause?.clauses?.map((clause, index) => (
              <li key={index}>
                <p>{clause}</p>
              </li>
            ))}
          </ul>

          <ShowTermsComments comments={offer?.additionalClause?.comments} />

          <Button
            className="btn-secondary mt-4"
            onClick={() => setShowRemovalMessage(true)}
          >
            Remove Terms
          </Button>
          <Spacing />
          <Spacing />
          <Button
            className="btn-danger mt-4"
            onClick={() => setShowFixCommentForm(true)}
          >
            Fix Terms
          </Button>
        </section>
      )}
    </Modal>
  );
};

const ShowTermsComments = ({ comments }) => (
  <section className="my-3">
    {comments?.length > 0 && <h6 className="">Comments</h6>}
    {comments?.map(({ comment, response }, index) => (
      <p key={index} className="speech-bubble">
        {index !== 0 ? (
          <strike>
            {comment} <br /> <small>{response}</small>
          </strike>
        ) : (
          <>
            {comment}
            <br /> <small>{response}</small>
          </>
        )}
      </p>
    ))}
  </section>
);

const FixReviewCommentForm = ({
  offer,
  setToast,
  setShowTermsModal,
  setShowFixCommentForm,
}) => {
  const lastComment = offer.additionalClause.comments[0];
  return (
    <section className="row">
      <div className="col-md-12 my-3">
        <Formik
          initialValues={setInitialValues(respondTermsReviewSchema)}
          onSubmit={({ response }, actions) => {
            const payload = {
              response,
              commentId: lastComment._id,
            };
            Axios.put(
              `${BASE_API_URL}/offer/${offer._id}/respond-terms-review`,
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
                    message: `Your response has been successfully submitted`,
                  });
                  actions.setSubmitting(false);
                  actions.resetForm();
                  setShowTermsModal(false);
                }
              })
              .catch(function (error) {
                setToast({
                  message: getError(error),
                });
                actions.setSubmitting(false);
              });
          }}
          validationSchema={createSchema(respondTermsReviewSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <h5>Last Comment</h5>
              <p className="speech-bubble mb-4">{lastComment?.comment}</p>
              <Textarea
                name="response"
                label="Response"
                placeholder="Your response"
                rows="3"
              />

              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Fix Terms
              </Button>
              <Spacing />
              <Spacing />
              <Button
                className="btn-danger mt-4"
                onClick={() => setShowFixCommentForm(false)}
              >
                Back
              </Button>
              <DisplayFormikState {...props} hide showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

const TermsRemovalMessage = ({
  offer,
  setToast,
  setShowTermsModal,
  setShowRemovalMessage,
}) => {
  const [loading, setLoading] = React.useState(false);

  const removeTerms = () => {
    setLoading(true);
    Axios.put(
      `${BASE_API_URL}/offer/${offer._id}/remove-additional-terms`,
      {},
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `The offer terms and conditions has been successfully removed`,
          });
          setLoading(false);
          setShowTermsModal(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };
  return (
    <section className="row">
      <div className="col-md-12 my-3 text-center">
        <h5 className="my-2 confirmation-text">
          Are you sure you want to remove this Terms and Conditions?
        </h5>
        <Button
          className="btn btn-secondary mt-4"
          onClick={removeTerms}
          loading={loading}
        >
          Remove Terms
        </Button>
        <Spacing />
        <Spacing />
        <Button
          className="btn-danger mt-4"
          onClick={() => setShowRemovalMessage(false)}
        >
          Back
        </Button>
      </div>
    </section>
  );
};

const OffersRow = ({ offer, number, showTermsAndConditionsModal }) => {
  const { status, totalAmountPayable, vendorInfo, userInfo, propertyInfo } =
    offer;
  return (
    <>
      <tr>
        <td>{number}</td>
        <td>
          <OnlineImage
            alt={propertyInfo.name}
            className="img-fluid avatar--medium--small rounded"
            src={
              propertyInfo.mainImage ? propertyInfo.mainImage : ProfileAvatar
            }
            title={propertyInfo.name}
          />
        </td>
        <td>
          <strong>{propertyInfo.name}</strong>
          <br />
          <small>
            {propertyInfo.address.city}, {propertyInfo.address.state}
          </small>
        </td>
        <td>
          <strong>{moneyFormatInNaira(totalAmountPayable)}</strong>
        </td>
        {useCurrentRole().isUser ? (
          <td>
            <strong>{vendorInfo?.vendor?.companyName}</strong>
            <br />
            <small>{vendorInfo?.phone}</small>
          </td>
        ) : (
          <td>
            <UserCard user={userInfo} />
          </td>
        )}
        <td>
          {ACTIVE_OFFER_STATUS.includes(status) ? (
            <span className="text-green">
              <SuccessIcon />{' '}
            </span>
          ) : (
            <span className="text-danger">
              <InfoIcon />
            </span>
          )}
        </td>
        <td>
          <Button
            className="btn-xs"
            onClick={() => showTermsAndConditionsModal(offer)}
          >
            View Terms
          </Button>
          <Spacing />
          <Spacing />
          <Link
            className="btn btn-primary btn-xs"
            href={`/${useCurrentRole().name}/offer/${offer._id}`}
          >
            View Offer
          </Link>
        </td>
      </tr>
    </>
  );
};

export default PendingOffers;
