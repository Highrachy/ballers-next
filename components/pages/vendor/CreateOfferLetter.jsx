import React from 'react';
import { Card } from 'react-bootstrap';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Axios from 'axios';
import {
  BASE_API_URL,
  OFFER_TEMPLATE_STATUS,
  PAYMENT_FREQUENCY,
  PAYMENT_OPTION,
  PAYMENT_OPTIONS_BREAKDOWN,
  PRICING_MODEL,
} from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import Select from 'components/forms/Select';
import {
  flattenErrorMessages,
  generateNumOptions,
  getError,
  objectToOptions,
} from 'utils/helpers';
import {
  offerLetterSchema,
  otherPaymentsSchema,
  otherTermsSchema,
} from 'components/forms/schemas/offerSchema';
import InputFormat from 'components/forms/InputFormat';
import Input from 'components/forms/Input';
import { addDays, addMonths, addYears, format, parseISO } from 'date-fns';
import Modal from 'components/common/Modal';
import OfferLetterTemplate from 'components/utils/OfferLetterTemplate';
import DatePicker from 'components/forms/DatePicker';
import { ErrorIcon, OfferIcon } from 'components/utils/Icons';
import { PlusIcon } from 'components/utils/Icons';
import { CloseIcon } from 'components/utils/Icons';
import { LinkSeparator } from 'components/common/Helpers';
import Label from 'components/forms/Label';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { useCurrentRole } from 'hooks/useUser';
import {
  getLastMilestoneDueDate,
  isMilestonePayment,
} from '@/utils/milestone-helper';
import { ContentLoader } from '@/components/utils/LoadingItems';
import WelcomeHero from '@/components/common/WelcomeHero';
import BackendPage from '@/components/layout/BackendPage';
import { EnquiryHeader } from '@/components/shared/SingleEnquiry';

const pageOptions = {
  key: 'enquiry',
  pageName: 'Create Offer Letter',
};

const CreateOfferLetter = ({ id }) => {
  const [toast, setToast] = useToast();
  const [enquiryQuery, enquiry = {}] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneEnquiry(id),
    refresh: true,
  });

  const defaultValue = {
    otherPayments: {
      agencyFee: 5,
      deedOfAssignmentExecution: 0,
      infrastructureDevelopment: 0,
      legalFee: 5,
      powerConnectionFee: 0,
      surveyPlan: 0,
    },
    otherTerms: {
      administrativeCharge: 10,
      bankDraftDue: 5,
      dateDue: 21,
      deductibleRefundPercentage: 5,
      gracePeriod: 6 * 30,
      terminationInterest: 4,
      terminationPeriod: 6 * 30,
    },
  };
  const [value, setValue] = React.useState(defaultValue);
  const [showOfferLetter, setShowOfferLetter] = React.useState(false);

  return (
    <BackendPage>
      <WelcomeHero
        title="Create Offer Letter"
        subtitle="View enquiries and create offer letters for applicants."
      />
      <ContentLoader
        hasContent={!!enquiry}
        Icon={<OfferIcon />}
        query={enquiryQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <>
          {showOfferLetter ? (
            <SubmitOfferLetter
              enquiry={enquiry}
              handleHideOfferLetter={() => setShowOfferLetter(false)}
              value={value}
            />
          ) : (
            <>
              <div className="container-fluid mt-5">
                <EnquiryHeader enquiry={enquiry} />
              </div>
              <CreateOfferLetterForm
                enquiry={enquiry}
                handleShowOfferLetter={() => setShowOfferLetter(true)}
                setValue={setValue}
                value={value}
              />
            </>
          )}
        </>
      </ContentLoader>
    </BackendPage>
  );
};

const CreateOfferLetterForm = ({
  enquiry,
  handleShowOfferLetter,
  setValue,
  value,
}) => {
  const [toast, setToast] = useToast();
  const [additionalClause, setAdditionalClause] = React.useState(['']);
  const [showOtherPaymentsForm, setShowOtherPaymentsForm] =
    React.useState(false);
  const [showOtherTermsForm, setShowOtherTermsForm] = React.useState(false);
  const [showAddMoreTermsForm, setShowAddMoreTermsForm] = React.useState(false);

  const handOverDate = isMilestonePayment(enquiry.propertyInfo)
    ? getLastMilestoneDueDate(enquiry.propertyInfo.milestonePayment)
    : addYears(new Date(), 1);

  const initialOfferValues = {
    propertySellingPrice: enquiry?.propertyInfo?.price,
    allocationInPercentage: 100,
    initialPayment: enquiry.initialInvestmentAmount,
    initialPaymentDate: enquiry.investmentStartDate,
    periodicPayment: enquiry.periodicInvestmentAmount,
    paymentFrequency: enquiry.investmentFrequency,
    expires: '7',
    handOverDate: format(new Date(handOverDate), 'yyyy-MM-dd'),
  };

  const isMilestonePaymentModel = isMilestonePayment(enquiry.propertyInfo);

  return (
    <div className="container-fluid">
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...setInitialValues(offerLetterSchema, {
            ...initialOfferValues,
          }),
          otherPayments: setInitialValues(
            otherPaymentsSchema,
            value?.otherPayments
          ),
          otherTerms: setInitialValues(otherTermsSchema, value?.otherTerms),
        }}
        onSubmit={(submittedValues) => {
          const clauses = additionalClause.filter((clause) => clause !== '');
          const payload = {
            ...submittedValues,
            title: enquiry.propertyInfo.titleDocument,
            deliveryState: enquiry.propertyInfo.deliveryState,
            additionalClause: clauses.length > 0 ? clauses : [],
            initialPaymentDate:
              submittedValues.initialPaymentDate?.date ||
              submittedValues?.initialPaymentDate ||
              value?.initialPaymentDate,
            handOverDate:
              submittedValues.handOverDate?.date ||
              submittedValues?.handOverDate,
          };

          if (isMilestonePaymentModel) {
            payload.paymentFrequency = enquiry.investmentFrequency;
            payload.periodicPayment = enquiry.periodicInvestmentAmount;
          }
          setValue(payload);
          handleShowOfferLetter();
        }}
        validationSchema={createSchema({
          ...offerLetterSchema,
          otherPayments: createSchema(otherPaymentsSchema),
          otherTerms: createSchema(otherTermsSchema),
        })}
      >
        {({ isSubmitting, handleSubmit, ...props }) => {
          const errors = flattenErrorMessages(props.errors);
          return (
            <Form>
              <Toast {...toast} />

              {/* <ShowTemplateButton
                setToast={setToast}
                handleValue={handleValue}
              /> */}

              <OfferFormContainer title="Create Offer Letter">
                <OfferLetterForm enquiry={enquiry} />
              </OfferFormContainer>

              {showOtherPaymentsForm && (
                <OfferFormContainer title="Other Payments">
                  <OtherPaymentsForm />
                </OfferFormContainer>
              )}

              {showOtherTermsForm && (
                <OfferFormContainer title="Terms and Condition">
                  <OtherTermsForm />
                </OfferFormContainer>
              )}

              {showAddMoreTermsForm && (
                <OfferFormContainer title="Add Your Own Terms and Condition">
                  <AddMoreTermsAndConditionsForm
                    setAdditionalClause={setAdditionalClause}
                    additionalClause={
                      value?.additionalClause || additionalClause
                    }
                  />
                </OfferFormContainer>
              )}

              <section className="my-3">
                {!showOtherPaymentsForm && (
                  <>
                    <span
                      className="text-link text-muted"
                      onClick={() => setShowOtherPaymentsForm(true)}
                    >
                      Add Other Payments
                    </span>
                    <LinkSeparator />
                  </>
                )}
                {!showOtherTermsForm && (
                  <>
                    <span
                      className="text-link  text-muted"
                      onClick={() => setShowOtherTermsForm(true)}
                    >
                      Set Terms and Conditions Values
                    </span>
                    <LinkSeparator />
                  </>
                )}
                {!showAddMoreTermsForm && (
                  <>
                    <span
                      className="text-link  text-muted"
                      onClick={() => setShowAddMoreTermsForm(true)}
                    >
                      Add Your Own Terms and Conditions
                    </span>
                  </>
                )}
              </section>

              {errors.length > 0 ? (
                <div className="card d-flex flex-row toast-alert error">
                  <div className="span toast-icon-holder icon-xl">
                    <ErrorIcon />
                  </div>
                  <span className="d-inline-block ms-2 toast-message-content">
                    <p className="mt-2">
                      You need to fix the values below to view your offer
                      letter.
                    </p>
                    <ul className="text-danger">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </span>
                </div>
              ) : (
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  View Offer Letter
                </Button>
              )}

              <DisplayFormikState {...props} showAll />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const ShowTemplateButton = ({ setToast, handleValue }) => {
  const [showTemplateModal, setShowTemplateModal] = React.useState(false);

  // load all offer templates
  const axiosOptionForOffers = {
    params: { limit: 0, status: OFFER_TEMPLATE_STATUS.APPROVED },
  };

  const [offersQuery] = useGetQuery({
    axiosOptions: axiosOptionForOffers,
    childrenKey: 'offerTemplate',
    key: 'offerTemplates',
    name: ['offerTemplates', axiosOptionForOffers],
    endpoint: API_ENDPOINT.getAllOfferTemplates(),
    refresh: true,
    setToast,
  });

  const offerTemplate = offersQuery?.data?.result || [];

  const isVendor = useCurrentRole().isVendor;

  const selectedTemplate = (offerId) => {
    const selectedTemplate = offerTemplate.find(({ _id }) => offerId === _id);
    handleValue(selectedTemplate);
    setShowTemplateModal(false);
  };

  return (
    <>
      {isVendor && offerTemplate?.length > 0 && (
        <div className="mt-5 text-end">
          <button
            type="button"
            className="btn btn-dark btn-wide"
            onClick={() => setShowTemplateModal(true)}
          >
            Use Offer Template
          </button>
        </div>
      )}
      <Modal
        title="Select Offer Template"
        show={showTemplateModal}
        onHide={() => setShowTemplateModal(false)}
        showFooter={false}
      >
        {offerTemplate?.map((template, index) => (
          <button
            key={index}
            type="button"
            className="btn btn-block btn-outline-dark"
            onClick={() => selectedTemplate(template._id)}
          >
            {template.name}
          </button>
        ))}
      </Modal>
    </>
  );
};

export const OfferFormContainer = ({ title, children }) => (
  <Card className="mt-4">
    <section className="row">
      <div className="col-md-10 p-5">
        <h4 className="mb-3">{title}</h4>
        {children}
      </div>
    </section>
  </Card>
);

const OfferLetterForm = ({ enquiry }) => {
  return (
    <>
      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Property Selling Price"
          name="propertySellingPrice"
          placeholder="Property Selling Price"
        />
        <DatePicker
          formGroupClassName="col-md-6"
          label="Hand Over Date"
          name="handOverDate"
          minDate={new Date()}
        />
      </div>
      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Initial Payment"
          name="initialPayment"
          placeholder="Initial Payment"
        />
        <DatePicker
          formGroupClassName="col-md-6"
          label="Initial Payment Due Date"
          name="initialPaymentDate"
          minDate={new Date()}
        />
      </div>
      {!isMilestonePayment(enquiry?.propertyInfo) && (
        <div className="form-row">
          <InputFormat
            formGroupClassName="col-md-6"
            label="Periodic Payment"
            name="periodicPayment"
            placeholder="Periodic Payment"
          />
          <Select
            formGroupClassName="col-md-6"
            label="Payment Frequency"
            name="paymentFrequency"
            placeholder="Payment Frequency"
            options={objectToOptions(PAYMENT_FREQUENCY, null, true)}
          />
        </div>
      )}
      <OfferLetterSharedForm />
    </>
  );
};

export const OfferLetterSharedForm = () => (
  <>
    <div className="form-row">
      <Select
        formGroupClassName="col-md-6"
        label="Offer Expires in"
        name="expires"
        options={generateNumOptions(11, 'Day', { startFrom: 5 })}
        placeholder="Offer Expires in "
      />
      <Input
        formGroupClassName="col-md-6"
        label="Allocation In Percentage"
        name="allocationInPercentage"
        type="number"
        max={100}
        min={0}
        placeholder="Allocation"
        tooltipText="The number of deposits to be made before prpoerty is allocated"
      />
    </div>
  </>
);

export const OtherPaymentsForm = () => {
  const paymentOptions = objectToOptions(PAYMENT_OPTIONS_BREAKDOWN, null, true);
  return (
    <>
      <Select
        label="Payment Breakdown"
        name="otherPayments.paymentBreakdown"
        options={paymentOptions}
        defaultValue={paymentOptions[0]}
      />
      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Legal Fee (in percentage)"
          name="otherPayments.legalFee"
          type="number"
          suffix="%"
          prefix=""
          tooltipText="Between 0 - 20%"
        />
        <InputFormat
          formGroupClassName="col-md-6"
          label="Agency Fee (in percentage)"
          name="otherPayments.agencyFee"
          type="number"
          suffix="%"
          prefix=""
          tooltipText="Between 0 - 20%"
        />
      </div>

      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Infrastructure Development"
          name="otherPayments.infrastructureDevelopment"
        />

        <InputFormat
          formGroupClassName="col-md-6"
          label="Deed of Assignment Execution"
          name="otherPayments.deedOfAssignmentExecution"
        />
      </div>

      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Power Connection Fee"
          name="otherPayments.powerConnectionFee"
        />
        <InputFormat
          formGroupClassName="col-md-6"
          label="Survey Plan"
          name="otherPayments.surveyPlan"
        />
      </div>
    </>
  );
};

export const OtherTermsForm = () => {
  return (
    <>
      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Administrative Charge (in percentage)"
          name="otherTerms.administrativeCharge"
          type="number"
          suffix="%"
          prefix=""
          tooltipText="Between 0 - 10%"
        />
        <InputFormat
          formGroupClassName="col-md-6"
          label="Bank Draft Due (in days)"
          name="otherTerms.bankDraftDue"
          type="number"
          suffix=" days"
          prefix=""
          tooltipText="Between 2 - 7 days"
        />
      </div>
      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Date Due (in days)"
          name="otherTerms.dateDue"
          type="number"
          suffix=" days"
          prefix=""
          tooltipText="Between 14 - 30 days"
        />
        <InputFormat
          formGroupClassName="col-md-6"
          label="Deductible Refund Percentage"
          name="otherTerms.deductibleRefundPercentage"
          type="number"
          suffix="%"
          prefix=""
          tooltipText="Between 0 - 10%"
        />
      </div>
      <div className="form-row">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Grace Period (in days)"
          name="otherTerms.gracePeriod"
          type="number"
          suffix=" days"
          prefix=""
          tooltipText="Between 0 - 365 days"
        />
        <InputFormat
          formGroupClassName="col-md-6"
          label="Termination Interest (in percentage)"
          name="otherTerms.terminationInterest"
          suffix="%"
          prefix=""
          tooltipText="Between 0 - 10%"
        />
      </div>
      <div className="form-row ms-n3">
        <InputFormat
          formGroupClassName="col-md-6"
          label="Termination Period (in days)"
          name="otherTerms.terminationPeriod"
          type="number"
          suffix=" days"
          prefix=""
          tooltipText="Between 0 - 1000 days"
        />
      </div>
    </>
  );
};

export const AddMoreTermsAndConditionsForm = ({
  setAdditionalClause,
  additionalClause,
}) => {
  const [fields, setFields] = React.useState(additionalClause);

  // handle click event of the Remove button
  const handleChange = (i, event) => {
    const values = [...fields];
    values[i] = event.target.value;
    setFields(values);
    setAdditionalClause(values);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (i) => {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setFields([...fields, '']);
  };
  // allowAddNew: get last array value
  const allowAddNew = fields.length < 1 || !!fields[fields.length - 1];
  return (
    <>
      <p className="text-primary pb-4">
        Note: Contents added here may be subjected to administrative review
      </p>
      {fields.map((_, index) => (
        <React.Fragment key={index}>
          <Label
            name={`additionalClause[${index}]`}
            text={`Personalized Terms and Conditions ${index + 1}`}
            optional
          />
          <textarea
            className="form-control"
            onChange={(e) => handleChange(index, e)}
            name={`additionalClause[${index}]`}
            value={fields[index]}
          />

          <p
            className="text-link text-muted text-danger d-block mb-5 text-small"
            onClick={() => handleRemoveClick(index)}
          >
            <CloseIcon /> Remove Terms and Conditions {index + 1}
          </p>
        </React.Fragment>
      ))}
      <br />
      {allowAddNew && (
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={handleAddClick}
        >
          <PlusIcon /> Add more Terms and Conditions
        </button>
      )}
    </>
  );
};

const SubmitOfferLetter = ({ enquiry, handleHideOfferLetter, value }) => {
  const [toast, setToast] = useToast();
  const { propertySellingPrice, initialPayment, periodicPayment } = value;
  const rangePrice = propertySellingPrice - initialPayment;
  const noOfMonths =
    rangePrice / periodicPayment > 1
      ? Math.floor(rangePrice / periodicPayment)
      : 1;
  const [showSubmitOfferModal, setShowSubmitOfferModal] = React.useState(false);

  const submitOfferLetter = () => {
    console.log('Submitting Offer Letter');
    console.log('value', value);
    const expires = addDays(new Date(), value.expires);
    const enquiryId = enquiry._id;
    const payload = {
      ...value,
      enquiryId,
      expires,
      handOverDate: parseISO(value.handOverDate?.date || value.handOverDate),
      paymentBreakdown:
        value?.otherPayments?.paymentBreakdown ||
        PAYMENT_OPTION.INITIAL_DEPOSIT, // todo: remove
    };

    console.log(payload);

    delete payload.otherPayments.paymentBreakdown;

    Axios.post(`${BASE_API_URL}/offer/create`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (status === 201) {
          setShowSubmitOfferModal(false);
          setToast({
            message: 'Your offer letter has been created',
            type: 'success',
          });
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  };

  const SubmitOfferModal = () => (
    <Modal
      title="Submit Offer"
      show={showSubmitOfferModal}
      onHide={() => setShowSubmitOfferModal(false)}
      showFooter={false}
    >
      <section className="row">
        <div className="col-md-12">
          <p className="confirmation-text">
            Are you sure you wish to submit the offer letter? Ensure you have
            confirm all the offer information as this process is irreversible.
          </p>

          <button
            className="btn btn-secondary mb-3"
            onClick={submitOfferLetter}
          >
            Submit Offer Letter
          </button>
        </div>
      </section>
    </Modal>
  );

  return (
    <div className="container-fluid">
      <Toast {...toast} />
      <h5 className="mb-3 text-center">
        Offer Letter (Expires in {value.expires} days)
      </h5>
      <OfferLetterTemplate
        enquiryInfo={enquiry}
        offerInfo={value}
        propertyInfo={enquiry.propertyInfo}
        vendorInfo={enquiry.vendorInfo}
      />
      <button
        className="btn btn-secondary btn-wide mt-5"
        onClick={() => setShowSubmitOfferModal(true)}
      >
        Submit Offer Letter
      </button>
      &nbsp;&nbsp;
      <button
        onClick={handleHideOfferLetter}
        className="btn btn-danger btn-wide mt-5"
      >
        Back to Form
      </button>
      <SubmitOfferModal />
    </div>
  );
};

export default CreateOfferLetter;
