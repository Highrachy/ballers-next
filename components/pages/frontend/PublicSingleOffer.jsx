import React from 'react';
import Toast, { useToast } from 'components/utils/Toast';
import Modal from 'components/common/Modal';
import ReactToPrint from 'react-to-print';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError } from 'utils/helpers';
import OfferLetterTemplate from 'components/utils/OfferLetterTemplate';
import Image, { OnlineImage } from 'components/utils/Image';
import UploadImage from 'components/utils/UploadImage';
import { Form, Formik } from 'formik';
import Textarea from 'components/forms/Textarea';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import { raiseAConcernSchema } from 'components/forms/schemas/offerSchema';
import Button from 'components/forms/Button';
import { Accordion, Card } from 'react-bootstrap';
import { ArrowDownIcon } from 'components/utils/Icons';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import { useCurrentRole } from 'hooks/useUser';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from 'hooks/useQuery';
import { ContentLoader } from 'components/utils/LoadingItems';
import { OfferIcon } from 'components/utils/Icons';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';

const pageOptions = {
  key: 'offer',
  pageName: 'Offer',
};

const SingleOffer = ({ id }) => {
  const componentRef = React.useRef();
  const [concerns, setConcerns] = React.useState(null);

  return (
    <>
      <Header />
      <OfferLetterTemplateContainer
        offerId={id}
        ref={componentRef}
        setConcerns={setConcerns}
      />
      <ReactToPrint
        trigger={() => (
          <section className="container-fluid mt-5 text-end d-none d-md-block">
            <button className="btn btn-info">Print this out!</button>
          </section>
        )}
        content={() => componentRef.current}
      />
      <RaiseAConcern concerns={concerns} offerId={id} />
      <Footer />
    </>
  );
};

const ListConcerns = ({ concerns, title }) => {
  if (!concerns || concerns.length === 0) {
    return null;
  }
  return (
    <section className="mb-5">
      <h5 className="secondary-text">{title}</h5>
      <Accordion className="offer-letter-accordion">
        {concerns.map(({ question, answer, status }, index) => (
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
                {answer || 'Awaiting Response from the Vendor'}
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
            concerns={allConcerns.pending}
            title="Pending Concerns"
          />
        )}
        {allConcerns && (
          <ListConcerns
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
                  Submit Question
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

const DisplayOfferLetterTemplate = ({ offerId, setConcerns }) => {
  const [toast, setToast] = useToast();
  const [offerQuery, offer] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, offerId],
    setToast,
    endpoint: API_ENDPOINT.getOneOffer(offerId),
    refresh: true,
  });

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
            <OfferLetterTemplate
              enquiryInfo={offer.enquiryInfo}
              offerInfo={offer}
              propertyInfo={offer.propertyInfo}
              signature={''}
              showSignaturePad
              vendorInfo={offer.vendorInfo}
            ></OfferLetterTemplate>
          </>
        )}
      </ContentLoader>
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
              <OnlineImage
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
