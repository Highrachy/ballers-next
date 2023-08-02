import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card, Tabs, Tab } from 'react-bootstrap';
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
  createSchema,
  addressSchema,
} from 'components/forms/schemas/schema-helpers';
import {
  preferenceSchema,
  personalInfoSchema,
  changePasswordSchema,
} from 'components/forms/schemas/userSchema';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { UserContext } from 'context/UserContext';
import Address from 'components/utils/Address';
import { feedback } from 'components/forms/form-helper';
import { getError, generateBudgetOptions, ONE_MILLION } from 'utils/helpers';
import Select from 'components/forms/Select';
import { useAvailableOptions } from 'hooks/useAvailableOptions';
import ProfileAvatar from 'assets/img/avatar/profile.png';
import Upload from 'components/utils/Upload';
import { bankSchema } from 'components/forms/schemas/vendorSchema';
import WelcomeHero from '@/components/common/WelcomeHero';

const Settings = () => (
  <BackendPage>
    <WelcomeHero
      title="Settings"
      subtitle="Personalize your experience and manage your account settings with ease"
    />
    <div className="container-fluid mt-5">
      <h4 className="mb-3">Your Profile</h4>
      <Card className="card-container">
        <Tabs defaultActiveKey="0">
          <Tab eventKey="0" title="Profile" fill>
            <div className="card-tab-content py-5">
              <ProfileForm />
            </div>
          </Tab>
          {/* <Tab eventKey="1" title="Property Preference">
            <div className="card-tab-content py-5">
              <PropertyPreferenceForm />
            </div>
          </Tab> */}
          <Tab eventKey="2" title="Change Password" fill>
            <div className="card-tab-content py-5">
              <ChangePasswordForm />
            </div>
          </Tab>
          <Tab eventKey="4" title="Bank Information" fill>
            <div className="card-tab-content py-5">
              <BankInformationForm />
            </div>
          </Tab>
        </Tabs>
      </Card>
    </div>
  </BackendPage>
);

const ProfileForm = () => {
  const [toast, setToast] = useToast();
  const { userState, userDispatch } = React.useContext(UserContext);
  const [image, setImage] = React.useState(null);

  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...setInitialValues(personalInfoSchema, userState),
            address: setInitialValues(addressSchema, userState.address),
          }}
          onSubmit={(values, actions) => {
            const payload = { ...values };

            if (image) {
              payload.profileImage = image;
            }

            Axios.put(`${BASE_API_URL}/user/update`, payload, {
              headers: { Authorization: getTokenFromStore() },
            })
              .then(function (response) {
                const { status, data } = response;
                if (status === 200) {
                  userDispatch({
                    type: 'user-profile-update',
                    user: data.user,
                  });
                  setToast({
                    type: 'success',
                    message: `Your profile has been successfully updated`,
                  });
                  actions.setSubmitting(false);
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
            ...personalInfoSchema,
            address: createSchema(addressSchema),
          })}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <Toast {...toast} />

              <div className="text-center">
                <Upload
                  defaultImage={userState.profileImage || ProfileAvatar}
                  uploadText="Upload Image"
                  changeText="Change Image"
                  afterUpload={setImage}
                  maxFileSize={512_000}
                  imgOptions={{
                    className: 'avatar-display',
                  }}
                />
              </div>
              <div className="form-row">
                <Input
                  formGroupClassName="col-md-6"
                  isValidMessage="First Name looks good"
                  label="First Name"
                  name="firstName"
                  placeholder="First Name"
                />
                <Input
                  formGroupClassName="col-md-6"
                  isValidMessage="Last Name looks good"
                  label="Last Name"
                  name="lastName"
                  placeholder="Last Name"
                />
              </div>
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

              <Address />
              <Button
                color="secondary"
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
              <DisplayFormikState {...props} hide showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

// const PropertyPreferenceForm = () => {
//   const [toast, setToast] = useToast();
//   const { userState, userDispatch } = React.useContext(UserContext);
//   const availableOptions = useAvailableOptions();

//   return (
//     <section className="row">
//       <div className="col-md-10">
//         <Formik
//           enableReinitialize={true}
//           initialValues={setInitialValues(
//             preferenceSchema,
//             userState.preferences
//           )}
//           onSubmit={(values, actions) => {
//             // remove values less than 1 million
//             Number(values.minPrice) < ONE_MILLION && delete values.minPrice;
//             Number(values.maxPrice) < ONE_MILLION && delete values.maxPrice;
//             !values.houseType && delete values.houseType;
//             !values.location && delete values.location;

//             const payload = {
//               firstName: userState.firstName,
//               lastName: userState.lastName,
//               phone: userState.phone,
//               preferences: values,
//             };

//             Axios.put(`${BASE_API_URL}/user/update`, payload, {
//               headers: { Authorization: getTokenFromStore() },
//             })
//               .then(function (response) {
//                 const { status, data } = response;
//                 if (status === 200) {
//                   userDispatch({
//                     type: 'user-profile-update',
//                     user: data.updatedUser,
//                   });
//                   setToast({
//                     type: 'success',
//                     message: `Your preferences has been successfully updated`,
//                   });
//                   actions.setSubmitting(false);
//                 }
//               })
//               .catch(function (error) {
//                 setToast({
//                   message: getError(error),
//                 });
//                 actions.setSubmitting(false);
//               });
//           }}
//           validationSchema={createSchema(preferenceSchema)}
//         >
//           {({ isSubmitting, handleSubmit, ...props }) => (
//             <Form>
//               <Toast {...toast} />
//               <div className="form-row">
//                 <Select
//                   formGroupClassName="col-md-6"
//                   label="Minimum Budget"
//                   name="minPrice"
//                   placeholder="Not Applicable"
//                   options={generateBudgetOptions({
//                     showBlankOption: true,
//                   })}
//                   showFeedback={feedback.ERROR}
//                 />
//                 <Select
//                   formGroupClassName="col-md-6"
//                   label="Maximum Budget"
//                   name="maxPrice"
//                   placeholder="Not Applicable"
//                   options={generateBudgetOptions({
//                     showBlankOption: true,
//                   })}
//                   showFeedback={feedback.ERROR}
//                 />
//               </div>
//               <div className="form-row">
//                 <Select
//                   formGroupClassName="col-md-6"
//                   label="Preferred State"
//                   name="location"
//                   placeholder="Any State"
//                   options={availableOptions.states}
//                   showFeedback={feedback.ERROR}
//                 />
//                 <Select
//                   formGroupClassName="col-md-6"
//                   label="Preferred HouseType"
//                   name="houseType"
//                   placeholder="Any House Type"
//                   options={availableOptions.houseTypes}
//                   showFeedback={feedback.ERROR}
//                 />
//               </div>

//               <Button
//                 className="btn-secondary mt-4"
//                 loading={isSubmitting}
//                 onClick={handleSubmit}
//               >
//                 Save Changes
//               </Button>
//               <DisplayFormikState {...props} showAll />
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </section>
//   );
// };

const ChangePasswordForm = () => {
  const [toast, setToast] = useToast();
  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          initialValues={setInitialValues(changePasswordSchema)}
          onSubmit={(values, actions) => {
            Axios.put(`${BASE_API_URL}/user/change-password`, values, {
              headers: { 'x-access-token': getTokenFromStore() },
            })
              .then(function (response) {
                const { status } = response;
                if (status === 200) {
                  setToast({
                    type: 'success',
                    message: `Your password has been successfully updated`,
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
          validationSchema={createSchema(preferenceSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <Toast {...toast} />
              <Input
                isValidMessage="Password seems good"
                label="Old Password"
                name="oldPassword"
                placeholder="Old Password"
                showFeedback={feedback.ERROR}
                type="password"
              />
              <Input
                isValidMessage="Password seems good"
                label="New Password"
                name="password"
                placeholder="New Password"
                showFeedback={feedback.ERROR}
                type="password"
              />
              <Input
                isValidMessage="Password matches"
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm Password"
                showFeedback={feedback.ERROR}
                type="password"
              />
              <Button
                className="btn-danger btn-wide btn-transparent mt-3"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Update Password
              </Button>
              <DisplayFormikState {...props} hide showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

const BankInformationForm = () => {
  const [toast, setToast] = useToast();
  const { userState, userDispatch } = React.useContext(UserContext);

  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...setInitialValues(bankSchema),
            ...userState?.additionalInfo?.bankInfo,
          }}
          onSubmit={(values, actions) => {
            const payload = { additionalInfo: { bankInfo: { ...values } } };

            Axios.put(`${BASE_API_URL}/user/update`, payload, {
              headers: { Authorization: getTokenFromStore() },
            })
              .then(function (response) {
                const { status, data } = response;
                if (status === 200) {
                  userDispatch({
                    type: 'user-profile-update',
                    user: data.user,
                  });
                  setToast({
                    type: 'success',
                    message: `Your profile has been successfully updated`,
                  });
                  actions.setSubmitting(false);
                }
              })
              .catch(function (error) {
                setToast({
                  message: getError(error),
                });
                actions.setSubmitting(false);
              });
          }}
          validationSchema={createSchema(bankSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <Toast {...toast} />
              <Input
                label="Account Name"
                name="accountName"
                placeholder="Account Name"
              />

              <div className="form-row">
                <Input
                  formGroupClassName="col-md-6"
                  label="Bank Name"
                  name="bankName"
                />
                <Input
                  formGroupClassName="col-md-6"
                  label="Account Number (NUBAN)"
                  name="accountNumber"
                />
              </div>

              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
              <DisplayFormikState {...props} hide showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Settings;
