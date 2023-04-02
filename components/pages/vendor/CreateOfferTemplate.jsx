import React from 'react';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Axios from 'axios';
import { BASE_API_URL, PAYMENT_OPTION } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  flattenErrorMessages,
  getError,
  statusIsSuccessful,
} from 'utils/helpers';
import {
  offerTemplateSchema,
  otherPaymentsSchema,
  otherTermsSchema,
} from 'components/forms/schemas/offerSchema';
import { ErrorIcon } from 'components/utils/Icons';
import { OfferLetterSharedForm } from './CreateOfferLetter';
import { OtherPaymentsForm } from './CreateOfferLetter';
import { OtherTermsForm } from './CreateOfferLetter';
import { AddMoreTermsAndConditionsForm } from './CreateOfferLetter';
import BackendPage from 'components/layout/BackendPage';
import { OfferFormContainer } from './CreateOfferLetter';
import Input from 'components/forms/Input';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { OfferIcon } from 'components/utils/Icons';
import { differenceInDays } from 'date-fns';

const pageOptions = {
  key: 'offer',
  pageName: 'Offer',
};

const CreateOfferTemplate = ({ id }) => {
  const [toast, setToast] = useToast();
  const [offerQuery, offer] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneOffer(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!offer}
        Icon={<OfferIcon />}
        query={offerQuery}
        name={pageOptions.pageName}
        toast={toast}
        loadingText="Loading Offer Information"
      >
        <CreateOfferTemplateForm
          toast={toast}
          setToast={setToast}
          offer={offer}
        />
      </ContentLoader>
    </BackendPage>
  );
};

export const CreateOfferTemplateForm = ({
  offer,
  toast,
  setToast,
  offerTemplateId,
}) => {
  const [additionalClause, setadditionalClause] = React.useState(['']);
  const expires = offerTemplateId
    ? offer.expires
    : differenceInDays(offer.createdAt, offer.expires) || 7;

  const paymentBreakdown =
    offer?.paymentBreakdown || PAYMENT_OPTION.INITIAL_DEPOSIT;

  return (
    <div className="container-fluid">
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...setInitialValues(offerTemplateSchema, {
            ...offer,
            expires,
          }),
          otherPayments: setInitialValues(otherPaymentsSchema, {
            ...offer?.otherPayments,
            paymentBreakdown,
          }),
          otherTerms: setInitialValues(otherTermsSchema, offer?.otherTerms),
        }}
        onSubmit={(values) => {
          const payload = {
            ...values,
            paymentBreakdown: values?.otherPayments?.paymentBreakdown,
          };

          delete payload.otherPayments.paymentBreakdown;

          Axios({
            method: offerTemplateId ? 'put' : 'post',
            url: `${BASE_API_URL}/offer/template`,
            data: offerTemplateId
              ? { ...payload, id: offerTemplateId }
              : payload,
            headers: { Authorization: getTokenFromStore() },
          })
            .then(function (response) {
              const { status } = response;
              if (statusIsSuccessful(status)) {
                setToast({
                  message: `Your offer template has been successfully ${
                    offerTemplateId ? 'updated' : 'added'
                  }`,
                  type: 'success',
                });
              }
            })
            .catch(function (error) {
              setToast({
                message: getError(error),
              });
            });
        }}
        validationSchema={createSchema({
          ...offerTemplateSchema,
          otherPayments: createSchema(otherPaymentsSchema),
          otherTerms: createSchema(otherTermsSchema),
        })}
      >
        {({ isSubmitting, handleSubmit, ...props }) => {
          const errors = flattenErrorMessages(props.errors);
          return (
            <Form>
              <Toast {...toast} />

              <OfferFormContainer
                title={` ${
                  offerTemplateId ? 'Update' : 'Create'
                } Offer Template`}
              >
                <Input
                  label="Name of Template"
                  name="name"
                  placeholder="Name"
                />
                <OfferLetterSharedForm />
              </OfferFormContainer>

              <OfferFormContainer title="Other Payments">
                <OtherPaymentsForm />
              </OfferFormContainer>

              <OfferFormContainer title="Terms and Condition">
                <OtherTermsForm />
              </OfferFormContainer>

              <OfferFormContainer title="Add Your Own Terms and Condition">
                <AddMoreTermsAndConditionsForm
                  setadditionalClause={setadditionalClause}
                  additionalClause={
                    offer?.additionalClause?.clauses || additionalClause
                  }
                />
              </OfferFormContainer>

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
                  {offerTemplateId ? 'Update' : 'Create'} Offer Template
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

export default CreateOfferTemplate;
