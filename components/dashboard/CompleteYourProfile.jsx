import { Form, Formik } from 'formik';
import React from 'react';
import Toast, { useToast } from '../utils/Toast';
import Input from '../forms/Input';
import Button from '../forms/Button';
import { DisplayFormikState, setInitialValues } from '../forms/form-helper';
import { completeProfileSchema } from '../forms/schemas/userSchema';
import { createSchema } from '../forms/schemas/schema-helpers';
import CheckboxGroup from '../forms/CheckboxGroup';
import { agreementText } from 'pages/create-a-new-ball-account';
import BackendPage from '../layout/BackendPage';
import WelcomeHero from '../common/WelcomeHero';
import { UserContext } from 'context/UserContext';
import Axios from 'axios';
import { getTokenFromStore } from '@/utils/localStorage';
import { statusIsSuccessful } from '@/utils/helpers';
import { BASE_API_URL, USER_TYPES } from '@/utils/constants';

const CompleteYourProfile = () => {
  const [toast, setToast] = useToast();
  const { userState, userDispatch } = React.useContext(UserContext);
  const isVendor = userState?.role === USER_TYPES.vendor;

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero isIndex />
      <div className="container-fluid py-0">
        <div className="card">
          <div className="row">
            <div className="p-5">
              <h3>Complete Your Registration</h3>
              <Formik
                initialValues={setInitialValues(completeProfileSchema())}
                onSubmit={(values, actions) => {
                  delete values.agreement;

                  const payload = {
                    ...values,
                  };

                  if (isVendor) {
                    payload = {
                      ...payload,
                      vendor: { companyName: payload.companyName },
                    };

                    delete payload.companyName;
                  }

                  Axios.put(`${BASE_API_URL}/user/complete-profile`, payload, {
                    headers: {
                      Authorization: getTokenFromStore(),
                    },
                  })
                    .then(function (response) {
                      const { status, data } = response;
                      console.log('data', data);
                      if (statusIsSuccessful(status)) {
                        setToast({
                          type: 'success',
                          message: `Your profile has been successfully updated`,
                        });
                        userDispatch({
                          type: 'complete-profile',
                          user: data.user,
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
                validationSchema={createSchema(completeProfileSchema())}
              >
                {({ isSubmitting, handleSubmit, ...props }) => (
                  <Form>
                    <Toast {...toast} />
                    {isVendor && (
                      <Input
                        isValidMessage="Company Name looks good"
                        label="Company Name"
                        name="companyName"
                        placeholder="Company Name"
                      />
                    )}
                    <div className="form-row">
                      <Input
                        formGroupClassName="col-md-6"
                        isValidMessage="Phone number looks good"
                        label="Phone"
                        name="phone"
                        placeholder="Phone"
                      />
                      <Input
                        formGroupClassName="col-md-6"
                        isValidMessage="Phone number looks good"
                        label="Alternative Phone"
                        name="phone2"
                        optional
                        placeholder="Alternative Phone"
                      />
                    </div>
                    <div className="form-row">
                      <Input
                        formGroupClassName="col-md-6"
                        isValidMessage="Password seems good"
                        label="Password"
                        name="password"
                        placeholder="Password"
                        type="password"
                      />
                      <Input
                        formGroupClassName="col-md-6"
                        isValidMessage="Awesome. Password matches"
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        type="password"
                      />
                    </div>
                    <div className="form-row ms-0">
                      <CheckboxGroup
                        custom
                        inline
                        name="agreement"
                        options={[{ label: agreementText, value: true }]}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="agreement"
                      ></label>
                    </div>
                    <Button
                      color={'secondary'}
                      className="mt-5"
                      wide
                      loading={isSubmitting}
                      onClick={handleSubmit}
                    >
                      Complete Profile
                    </Button>
                    <DisplayFormikState {...props} showAll />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </BackendPage>
  );
};

export default CompleteYourProfile;
