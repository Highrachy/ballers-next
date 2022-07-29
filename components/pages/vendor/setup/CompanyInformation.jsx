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
import {
  addressSchema,
  createSchema,
} from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL, VENDOR_IDENTIFICATION_TYPE } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { UserContext } from 'context/UserContext';
import {
  companyInfoSchema,
  phoneNumbersSchema,
} from 'components/forms/schemas/vendorSchema';
import { getError, statusIsSuccessful, valuesToOptions } from 'utils/helpers';
import Address from 'components/utils/Address';
import Select from 'components/forms/Select';
import { VerificationComments } from './AccountSetup';
import Upload from 'components/utils/Upload';

const CompanyInformation = () => (
  <BackendPage>
    <div className="container-fluid">
      <CompanyInformationForm />
    </div>
  </BackendPage>
);

export const CompanyInformationForm = ({ moveToNextStep, setStepToast }) => {
  const [toast, setToast] = useToast();
  const { userDispatch, userState } = React.useContext(UserContext);
  const [logo, setLogo] = React.useState(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...setInitialValues(phoneNumbersSchema, userState),
        vendor: {
          ...setInitialValues(companyInfoSchema, userState.vendor),
          companyAddress: setInitialValues(
            addressSchema,
            userState?.vendor?.companyAddress
          ),
        },
      }}
      onSubmit={(values, actions) => {
        let payload = {
          ...values,
          vendor: {
            ...values.vendor,
            companyAddress: {
              ...values.vendor.companyAddress,
              country: 'Nigeria',
            },
          },
        };

        if (logo) {
          payload.vendor.companyLogo = logo;
        }

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
                message: `Company Information has been successfully saved`,
              };
              setToast(successMessage);
              setStepToast(successMessage);
              actions.setSubmitting(false);
              actions.resetForm();
              moveToNextStep();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema({
        ...phoneNumbersSchema,
        vendor: createSchema({
          ...companyInfoSchema,
          companyAddress: createSchema(addressSchema),
        }),
      })}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} />
          <CompanyInfoForm />
          <CompanyLogo
            {...props}
            image={logo || userState.vendor?.companyLogo}
            setImage={setLogo}
          />
          <CompanyAddress />
          <Button
            className="btn-secondary my-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>

          <DisplayFormikState {...props} />
        </Form>
      )}
    </Formik>
  );
};

const CompanyInfoForm = () => {
  return (
    <Card className="card-container">
      <section className="row">
        <div className="col-md-10 px-4">
          <h5 className="mb-4">Company Information</h5>

          <VerificationComments step="1" />

          <Input
            label="Company Name"
            name="vendor.companyName"
            placeholder="Company Name"
          />

          <div className="form-row">
            <Input
              formGroupClassName="col-md-6"
              label="Phone Number"
              name="phone"
            />
            <Input
              formGroupClassName="col-md-6"
              label="Phone Number 2"
              name="phone2"
              optional
            />
          </div>

          <div className="form-row">
            <Select
              formGroupClassName="col-md-6"
              label="Entity"
              name="vendor.entity"
              options={valuesToOptions(Object.keys(VENDOR_IDENTIFICATION_TYPE))}
              placeholder="Select Entity Type"
            />

            <Input
              formGroupClassName="col-md-6"
              label="Redan Number"
              name="vendor.redanNumber"
              optional
            />
          </div>
        </div>
      </section>
    </Card>
  );
};

const CompanyLogo = ({ image, setImage }) => {
  return (
    <Card className="card-container mt-5 ">
      <section className="row">
        <div className="col-md-10 px-4">
          <h5 className="mb-4">Company Logo</h5>

          <div className="my-4">
            <Upload
              afterUpload={(image) => setImage(image)}
              changeText={`Update Company Logo`}
              defaultImage={image}
              imgOptions={{ options: { h: 100 }, className: 'mb-3' }}
              uploadText={`Upload Company Logo`}
            />
          </div>
        </div>
      </section>
    </Card>
  );
};

const CompanyAddress = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10 px-4">
        <h5 className="mt-2 mb-4">Company Address (Head Office)</h5>

        <Address showCountry={false} companyAddress />
      </div>
    </section>
  </Card>
);

export default CompanyInformation;
