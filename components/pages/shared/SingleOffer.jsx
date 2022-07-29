import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import Modal from 'components/common/Modal';
import ReactToPrint from 'react-to-print';
import { BASE_API_URL, OFFER_STATUS } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import OfferLetterTemplate from 'components/utils/OfferLetterTemplate';
import Image from 'components/utils/Image';
import UploadImage from 'components/utils/UploadImage';
import { Form, Formik } from 'formik';
import Textarea from 'components/forms/Textarea';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import {
  raiseAConcernSchema,
  resolveAConcernSchema,
} from 'components/forms/schemas/offerSchema';
import Button from 'components/forms/Button';
import { Accordion, Card } from 'react-bootstrap';
import { ArrowDownIcon, WarningIcon } from 'components/utils/Icons';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import { useCurrentRole } from 'hooks/useUser';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from 'hooks/useQuery';
import { ContentLoader } from 'components/utils/LoadingItems';
import { OfferIcon } from 'components/utils/Icons';
import { ReactivateOfferForm } from './ProcessOffer';
import { AcceptOfferLetter } from './ProcessOffer';
import { CancelOfferLetter } from './ProcessOffer';
import { AssignOfferLetter } from './ProcessOffer';
import { AllocateOfferLetter } from './ProcessOffer';
import { RevertOfferLetter } from './ProcessOffer';
import { Link } from '@reach/router';
import { CopyToClipBoardIcon } from 'components/utils/Icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckIcon } from 'components/utils/Icons';

const pageOptions = {
  key: 'offer',
  pageName: 'Offer',
};

const SingleOffer = ({ id }) => {
  const componentRef = React.useRef();
  const [concerns, setConcerns] = React.useState(null);

  return (
    <BackendPage>
      <OfferLetterTemplateContainer
        offerId={id}
        ref={componentRef}
        setConcerns={setConcerns}
      />
      <ReactToPrint
        trigger={() => (
          <section className="container-fluid mt-5 text-right d-none d-md-block">
            <button className="btn btn-info">Print this out!</button>
          </section>
        )}
        content={() => componentRef.current}
      />
      <RaiseAConcern concerns={concerns} offerId={id} />
    </BackendPage>
  );
};

const ListConcerns = ({ concerns, offerId, title }) => {
  const isVendor = useCurrentRole().isVendor;
  if (!concerns || concerns.length === 0) {
    return null;
  }
  return (
    <section className="mb-5">
      <h5 className="secondary-text">{title}</h5>
      <Accordion className="offer-letter-accordion">
        {concerns.map(({ _id, question, response, dateAsked }, index) => (
          <Card key={index + 1}>
            <Accordion.Toggle
              as={Card.Header}
              variant="link"
              eventKey={index + 1}
            >
              <ContextAwareToggle
                iconOpen={<ArrowDownIcon />}
                iconClose={<ArrowDownIcon />}
                eventKey={index + 1}
              >
                {question}
              </ContextAwareToggle>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body>
                {response ? (
                  response
                ) : isVendor ? (
                  <div className="text-muted">
                    <ResolveConcern offerId={offerId} concernId={_id} />
                  </div>
                ) : (
                  <p className="text-danger">
                    <WarningIcon /> &nbsp;&nbsp; Awaiting Response from the
                    Vendor
                  </p>
                )}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </section>
  );
};

const RaiseAConcern = ({ offerId, concerns }) => {
  const [toast, setToast] = useToast();

  const allConcerns =
    concerns &&
    concerns.reduce(
      (acc, concern) => {
        concern.status === 'Pending'
          ? acc.pending.push(concern)
          : acc.answered.push(concern);
        return acc;
      },
      { pending: [], answered: [] }
    );

  return (
    <section className="mt-5">
      <div className="container-fluid">
        {allConcerns && (
          <ListConcerns
            offerId={offerId}
            concerns={allConcerns.pending}
            title="Pending Concerns"
          />
        )}
        {allConcerns && (
          <ListConcerns
            offerId={offerId}
            concerns={allConcerns.answered}
            title="Answered Concerns"
          />
        )}
        {useCurrentRole().isUser && (
          <Formik
            initialValues={setInitialValues(raiseAConcernSchema)}
            onSubmit={(values, actions) => {
              const payload = { offerId, ...values };
              Axios.put(`${BASE_API_URL}/offer/raise-concern`, payload, {
                headers: { Authorization: getTokenFromStore() },
              })
                .then(function (response) {
                  const { status } = response;
                  if (status === 200) {
                    setToast({
                      type: 'success',
                      message: `Your concern has been duly noted.`,
                    });
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
            validationSchema={createSchema(raiseAConcernSchema)}
          >
            {({ isSubmitting, handleSubmit, ...props }) => (
              <Form>
                <Toast {...toast} />
                <p>
                  <strong>Have any concerns? Ask your Question here:</strong>
                </p>
                <Textarea
                  name="question"
                  placeholder="Raise a concern regarding this offer letter"
                  rows="3"
                />

                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Submit Concern
                </Button>
                <DisplayFormikState {...props} hide showAll />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </section>
  );
};

export const ResolveConcern = ({ offerId, concernId }) => {
  const [toast, setToast] = useToast();
  const [showFlagModal, setShowFlagModal] = React.useState(false);

  return (
    <>
      <Button
        className="btn-secondary btn-sm mt-4"
        onClick={() => setShowFlagModal(true)}
      >
        Resolve Concern
      </Button>

      {/* Resolve Concern Modals */}
      <Modal
        title="Resolve Concern"
        show={showFlagModal}
        onHide={() => setShowFlagModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3">
            <Formik
              initialValues={setInitialValues(resolveAConcernSchema)}
              onSubmit={({ response }, actions) => {
                const payload = {
                  offerId,
                  concernId,
                  response,
                };
                Axios.put(`${BASE_API_URL}/offer/resolve-concern`, payload, {
                  headers: { Authorization: getTokenFromStore() },
                })
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
              validationSchema={createSchema(resolveAConcernSchema)}
            >
              {({ isSubmitting, handleSubmit, ...props }) => (
                <Form>
                  <Textarea
                    name="response"
                    label="Response"
                    placeholder="Response to the concern"
                    rows="3"
                  />

                  <Button
                    className="btn-secondary btn-sm mt-4"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Resolve Concern
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

const DisplayOfferLetterTemplate = ({ offerId, setConcerns }) => {
  const [toast, setToast] = useToast();
  const [image, setImage] = React.useState(null);
  const [signature, setSignature] = React.useState(null);
  const [offerQuery, offer, setOffer] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, offerId],
    setToast,
    endpoint: API_ENDPOINT.getOneOffer(offerId),
    refresh: true,
  });

  const isUser = useCurrentRole().isUser;
  const isVendor = useCurrentRole().isVendor;

  React.useEffect(() => {
    if (offer?.concern?.length > 0) {
      setConcerns(offer.concern);
    }
  }, [offer, setConcerns]);

  return (
    <>
      <ContentLoader
        hasContent={offer?.enquiryInfo}
        Icon={<OfferIcon />}
        query={offerQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        {offer && (
          <>
            {/* add current status here for admin / vendor */}
            {isVendor && (
              <div className="my-5 text-right">
                <Link
                  className="btn btn-dark btn-wide"
                  to={`/vendor/offer/template/${offer._id}`}
                >
                  Create Offer Template
                </Link>
              </div>
            )}

            {!isUser && (
              <h6 className="mt-5 hide-print">
                Current Offer Status: {offer.status}
              </h6>
            )}
            <OfferLetterTemplate
              enquiryInfo={offer.enquiryInfo}
              offerInfo={offer}
              propertyInfo={offer.propertyInfo}
              signature={signature}
              showSignaturePad
              vendorInfo={offer.vendorInfo}
            >
              {offer.status === OFFER_STATUS.GENERATED && isUser && (
                <>
                  <div className="mt-5">
                    <DigitalSignaturePad setSignature={setSignature} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <UploadSignature
                      image={image}
                      setImage={setImage}
                      setSignature={setSignature}
                    />
                  </div>
                </>
              )}

              <AcceptOfferLetter
                setOffer={setOffer}
                setToast={setToast}
                offer={offer}
                signature={signature}
              />
              <AssignOfferLetter
                setOffer={setOffer}
                setToast={setToast}
                offer={offer}
              />
              <AllocateOfferLetter
                setOffer={setOffer}
                setToast={setToast}
                offer={offer}
              />
              <ReactivateOfferForm
                setToast={setToast}
                setOffer={setOffer}
                offer={offer}
              />
              <RevertOfferLetter
                setToast={setToast}
                setOffer={setOffer}
                offer={offer}
              />
              <CancelOfferLetter
                setOffer={setOffer}
                setToast={setToast}
                offer={offer}
              />

              <div>
                <SharePublicLink
                  link={`${process.env.REACT_APP_HOST}/offer/${offer._id}`}
                />
                <Link
                  to={`${process.env.REACT_APP_HOST}/offer/${offer._id}`}
                  className="btn btn-sm btn-dark btn-wide"
                >
                  View Public Offer
                </Link>
              </div>
            </OfferLetterTemplate>
          </>
        )}
      </ContentLoader>
    </>
  );
};

const SharePublicLink = ({ link }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <div className="my-6 border-top"></div>
      <label htmlFor="offerLink mt-5">
        Share Your Offer Link with other people
      </label>
      <div className="input-group">
        <input
          type="text"
          name="offerLink"
          className="form-control"
          aria-label="offer code"
          value={link}
          readOnly
        />
        <div className="input-group-append">
          <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
            {copied ? (
              <span className="input-group-text btn-success text-white disabled">
                <CheckIcon />
              </span>
            ) : (
              <span className="input-group-text btn btn-light">
                <CopyToClipBoardIcon />
              </span>
            )}
          </CopyToClipboard>
        </div>
      </div>
      <div className="mt-2">
        {copied && (
          <div className="small text-success text-center">
            Your offer link has been successfully copied!
          </div>
        )}
      </div>
    </>
  );
};
class OfferLetterTemplateContainer extends React.Component {
  render() {
    const { offerId, setConcerns } = this.props;
    return (
      <div className="container-fluid">
        <DisplayOfferLetterTemplate
          offerId={offerId}
          setConcerns={setConcerns}
        />
      </div>
    );
  }
}

export const DigitalSignaturePad = ({ setSignature }) => {
  const [showDigital, setShowDigital] = React.useState(false);
  const [input, setInput] = React.useState('');

  return (
    <>
      <Modal
        title="Signature"
        show={showDigital}
        onHide={() => setShowDigital(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-10">
            <h5>Type your Signature here</h5>
            <input
              className="form-control my-3"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              className="btn btn-secondary mb-5"
              onClick={() => {
                setShowDigital(false);
                setSignature(input);
              }}
            >
              Sign Digitally
            </button>

            <h3 className="signature-pad in-dialog">{input}</h3>
          </div>
        </section>
      </Modal>
      <button
        className="btn btn-outline-secondary btn-sm btn-wide hide-print"
        onClick={() => setShowDigital(true)}
      >
        Sign Digitally
      </button>
    </>
  );
};

export const UploadSignature = ({ image, setImage, setSignature }) => {
  const [showSignature, setShowSignature] = React.useState(false);

  return (
    <>
      <Modal
        title="Signature"
        show={showSignature}
        onHide={() => setShowSignature(false)}
        showFooter={false}
      >
        <div className="row">
          <div className="mt-4 px-4">
            <h6 className="mb-3">Upload Your Signature</h6>
            {image && (
              <Image
                className="img-fluid uploaded-image mb-3"
                name="Signature"
                src={image}
              />
            )}
            <UploadImage
              afterUpload={(image) => setImage(image)}
              defaultImage={image}
              uploadText="Upload your Signature"
              changeText="Change Signature"
            />

            {image && (
              <button
                className="btn btn-success mb-5"
                onClick={() => {
                  setShowSignature(false);
                  setSignature(image);
                }}
              >
                Upload Signature
              </button>
            )}
          </div>
        </div>
      </Modal>
      <button
        className="btn btn-outline-dark btn-sm btn-wide hide-print"
        type="button"
        onClick={() => {
          setShowSignature(true);
        }}
      >
        Upload Signature
      </button>
    </>
  );
};
export default SingleOffer;
