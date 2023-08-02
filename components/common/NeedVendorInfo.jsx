import React from 'react';
import { Card } from 'react-bootstrap';
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
  logoSchema,
  phoneNumbersSchema,
} from 'components/forms/schemas/vendorSchema';
import { getError, statusIsSuccessful, valuesToOptions } from 'utils/helpers';
import Address from 'components/utils/Address';
import Select from 'components/forms/Select';
import Upload from 'components/forms/UploadFormik';

const NeedVendorInfo = ({ setToast }) => {
  const { userDispatch, userState } = React.useContext(UserContext);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...setInitialValues(phoneNumbersSchema),
        ...setInitialValues(logoSchema),
        vendor: {
          ...setInitialValues(companyInfoSchema, userState.vendor),
          companyAddress: setInitialValues(
            addressSchema,
            userState?.vendor?.companyAddress
          ),
        },
      }}
      onSubmit={(values, actions) => {
        const companyLogo = values?.companyLogo;
        delete values.companyLogo;
        let payload = {
          ...values,
          vendor: {
            ...values.vendor,
            companyLogo,
            companyAddress: {
              ...values.vendor.companyAddress,
              country: 'Nigeria',
            },
          },
        };

        Axios.put(`${BASE_API_URL}/user/complete-fast-track-info`, payload, {
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
          <CompanyInfoForm />
          <CompanyLogo {...props} image={userState.vendor?.companyLogo} />
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

const CompanyLogo = () => {
  const { userState } = React.useContext(UserContext);
  return (
    <Card className="card-container mt-5 ">
      <section className="row">
        <div className="col-md-10 px-4">
          <h5 className="mb-4">Company Logo</h5>

          <Upload
            label="Upload your image"
            changeText="Update Picture"
            defaultImage={userState?.vendor?.companyLogo}
            imgOptions={{
              className: 'mb-3 img-xxl',
              width: 200,
              height: 300,
            }}
            name="companyLogo"
            uploadText={`Upload Company Logo`}
            folder={'company-logo'}
          />
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
export default NeedVendorInfo;
