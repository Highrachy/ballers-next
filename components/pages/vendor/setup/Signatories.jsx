import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { UserContext } from 'context/UserContext';
import { signatorySchema } from 'components/forms/schemas/vendorSchema';
import { getError, isValidURL, statusIsSuccessful } from 'utils/helpers';
import Select from 'components/forms/Select';
import Image, { OnlineImage } from 'components/utils/Image';
import { VerificationComments } from './AccountSetup';
import { UploadSignature } from '@/components/shared/SingleOffer';
import Switch from '@/components/forms/Switch';
import Upload from '@/components/utils/Upload';

const Signatories = () => (
  <BackendPage>
    <div className="container-fluid">
      <SignatoriesForm />
    </div>
  </BackendPage>
);

export const SignatoriesForm = ({ moveToNextStep }) => {
  const [toast, setToast] = useToast();
  const { userState, userDispatch } = React.useContext(UserContext);
  const [image, setImage] = React.useState(null);
  const [signature, setSignature] = React.useState(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(signatorySchema)}
      onSubmit={(values, actions) => {
        let payload = { vendor: { directors: [{ ...values }] } };

        if (values.isSignatory && !signature) {
          setToast({
            message: 'You need to upload a signatory signature',
          });
          actions.setSubmitting(false);
          return;
        }

        if (values.isSignatory) {
          payload.vendor.directors[0].signature = signature;
        }

        payload.vendor.directors[0].isSignatory = !!values.isSignatory;

        Axios.put(`${BASE_API_URL}/user/vendor/update`, payload, {
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              userDispatch({
                type: 'user-profile-update',
                user: data.user,
              });

              const successMessage = {
                type: 'success',
                message: `Director Has been successfully Saved`,
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
      validationSchema={createSchema(signatorySchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
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
            <ShowDirectorsTable
              moveToNextStep={moveToNextStep}
              directors={userState.vendor?.directors || []}
              setToast={setToast}
            />
          </Card>
          <DisplayFormikState {...props} showAll hide />
        </Form>
      )}
    </Formik>
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
        <h5 className="mb-4">Add a New Signatory / Director </h5>
        <VerificationComments step="3" />

        <div className="form-row">
          <Switch
            label="Director is a Signatory?"
            labelClassName="text-lg"
            name="isSignatory"
          />
        </div>

        <div className="form-row">
          <Input
            label="Director Name"
            name="name"
            formGroupClassName="col-md-6"
          />
          <Input
            formGroupClassName="col-md-6"
            label="Phone Number"
            name="phone"
          />
        </div>

        {props.values.isSignatory && (
          <div className="mt-3">
            {/* {signature && (
              <h3 className="signature-pad">
                <>
                  {isValidURL(signature) ? (
                    <OnlineImage
                      className="signature-image uploaded-image mb-3"
                      name="Signature"
                      src={signature}
                    />
                  ) : (
                    signature
                  )}
                </>
              </h3>
            )}
            <UploadSignature
              image={image}
              setImage={setImage}
              setSignature={setSignature}
            /> */}
            <Upload
              afterUpload={(image) => {
                setSignature(image);
              }}
              changeText={`Update Signature`}
              defaultImage={image}
              oldImage={image}
              name="Signature"
              imgOptions={{ options: { h: 200 }, className: 'mb-3' }}
              uploadText={`Upload Signature`}
            />
            {/* <div className="text-md mt-2">
              Note: Uploaded signature will be used to sign offer letters
            </div> */}
            <div className="warning-alert mt-4">
              <h5 className="header-smaller">Note</h5>
              <p> Uploaded signature will be used to sign offer letters</p>
            </div>
          </div>
        )}

        <hr className="my-4" />

        <Button
          className="mt-4 btn-right"
          color="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Add New Director
        </Button>
      </div>
    </section>
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

  return (
    <>
      <div className="table-responsive">
        <table className="table table-border mb-0 mt-5">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Is Signatory</th>
              <th>Signature</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {directors.map((director, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{director.name}</td>
                <td>{director.phone}</td>
                <td>{director.isSignatory ? 'Yes' : 'No'}</td>
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

export default Signatories;
