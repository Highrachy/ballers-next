import React from 'react';
import { Card } from 'react-bootstrap';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import Humanize from 'humanize-plus';

import {
  flattenErrorMessages,
  getError,
  statusIsSuccessful,
} from 'utils/helpers';
import {
  otherPaymentsSchema,
  otherTermsSchema,
} from 'components/forms/schemas/offerSchema';
import Input from 'components/forms/Input';
import WelcomeHero from '@/components/common/WelcomeHero';
import BackendPage from '@/components/layout/BackendPage';
import {
  AddMoreTermsAndConditionsForm,
  OfferFormContainer,
  OtherPaymentsForm,
  OtherTermsForm,
} from './CreateOfferLetter';
import Upload from '@/components/forms/UploadFormik';
import { OnlineImage } from '@/components/utils/Image';
import { UserContext } from '@/context/UserContext';
import { offerTemplateSignatory } from '@/components/forms/schemas/vendorSchema';

const pageOptions = {
  key: 'setupOffer',
  pageName: 'Setup Offer Letter',
};

const OfferSetup = () => {
  const [toast, setToast] = useToast();

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

  return (
    <BackendPage>
      <WelcomeHero
        title="Setup Offer Letter"
        subtitle="Setup offer letters for applicants."
      />
      <SignatoriesForm />
    </BackendPage>
  );
};

const SignatoriesInfoForm = ({
  image,
  setImage,
  signature,
  setSignature,
  isSubmitting,
  handleSubmit,
  ...props
}) => {
  return (
    <section className="row">
      <div className="col-md-10 px-4">
        <h5 className="mb-4">Add Signature for Offer Letter </h5>

        <div className="form-row">
          <Input label="Signatory Name" name="name" />
        </div>

        <div className="mt-3">
          <Upload
            afterUpload={(image) => {
              setSignature(image);
            }}
            changeText={`Update Signature`}
            defaultImage={image}
            oldImage={image}
            name="signature"
            imgOptions={{ options: { h: 200 }, className: 'mb-3' }}
            uploadText={`Upload Signature`}
          />
          <div className="warning-alert mt-4">
            <h5 className="header-smaller">Note</h5>
            <p> Uploaded signature will be used to sign offer letters</p>
          </div>
        </div>

        <hr className="my-4" />

        <Button
          className="mt-4 btn-right"
          color="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Add New Signatory
        </Button>
      </div>
    </section>
  );
};

export const SignatoriesForm = () => {
  const [toast, setToast] = useToast();
  const { userState, userDispatch } = React.useContext(UserContext);
  const [image, setImage] = React.useState(null);
  const [signature, setSignature] = React.useState(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(offerTemplateSignatory)}
      onSubmit={(values, actions) => {
        let payload = { vendor: { directors: [{ ...values }] } };

        if (!signature) {
          setToast({
            message: 'You need to upload a signatory signature',
          });
          actions.setSubmitting(false);
          return;
        }

        payload.vendor.directors[0].isSignatory = true;
        payload.vendor.directors[0].phone = '08012345678';

        Axios.put(`${BASE_API_URL}/user/vendor/update`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              debugger;
              userDispatch({
                type: 'user-profile-update',
                user: data.user,
              });

              const successMessage = {
                type: 'success',
                message: `Signatory has been successfully Saved`,
              };
              setToast(successMessage);
              setImage(null);
              setSignature(null);
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
      validationSchema={createSchema(offerTemplateSignatory)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <div className="container-fluid">
          <Form>
            <Toast {...toast} />
            <Card className="card-container">
              <SignatoriesInfoForm
                {...props}
                image={image}
                setImage={setImage}
                signature={signature}
                setSignature={setSignature}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
              />
            </Card>

            <Card className="card-container mt-5">
              <ShowDirectorsTable
                directors={userState.vendor?.directors || []}
                setToast={setToast}
              />
            </Card>
            <DisplayFormikState {...props} showAll />
          </Form>
        </div>
      )}
    </Formik>
  );
};

export const ShowDirectorsTable = ({ directors, moveToNextStep, setToast }) => {
  const { userDispatch } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(0);
  const deleteSignatory = (id) => {
    setLoading(id);
    Axios.delete(`${BASE_API_URL}/user/vendor/director/${id}`, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Director has been successfully deleted`,
          });
          userDispatch({ type: 'user-info', user: data.user });
          setLoading(0);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(0);
      });
  };

  if (!directors || directors.length === 0) {
    return null;
  }

  const signatories = directors.filter(({ isSignatory }) => isSignatory);

  if (!signatories || signatories.length === 0) {
    return null;
  }

  return (
    <>
      <h3>
        You have {signatories.length}{' '}
        {Humanize.pluralize(signatories?.length, 'Signatory')}
      </h3>
      <div className="table-responsive table-bordered">
        <table className="table table-border mb-0 mt-5">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Signature</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {signatories.map((director, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{director.name}</td>
                <td>
                  {director.signature ? (
                    <OnlineImage
                      className="small-image mb-3"
                      name="image"
                      src={director.signature}
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <Button
                    loading={loading === director._id}
                    onClick={() => deleteSignatory(director._id)}
                    className="btn btn-xs btn-wide btn-danger"
                  >
                    Delete
                  </Button>{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {moveToNextStep && (
          <Button className="btn-secondary mt-5" onClick={moveToNextStep}>
            Save Changes
          </Button>
        )}
      </div>
    </>
  );
};

export default OfferSetup;
