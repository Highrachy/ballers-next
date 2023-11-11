import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import {
  addEnquirySchema,
  addMilestoneEnquirySchema,
} from 'components/forms/schemas/enquirySchema';
import { Card } from 'react-bootstrap';
import DatePicker from 'components/forms/DatePicker';
import {
  BASE_API_URL,
  PAYMENT_FREQUENCY,
  PRICING_MODEL,
  TITLES,
} from 'utils/constants';
import Address from 'components/utils/Address';
import {
  createSchema,
  addressSchema,
} from 'components/forms/schemas/schema-helpers';
import { UserContext } from 'context/UserContext';
import {
  getError,
  getLocationFromAddress,
  objectToOptions,
  valuesToOptions,
} from 'utils/helpers';
import { getTokenFromStore } from 'utils/localStorage';
import InputFormat from 'components/forms/InputFormat';
import Select from 'components/forms/Select';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { MessageIcon } from 'components/utils/Icons';
import { useRouter } from 'next/router';
import {
  PropertyHeader,
  PropertyImage,
} from '@/components/shared/SingleProperty';
import WelcomeHero from '@/components/common/WelcomeHero';
import { isMilestonePayment } from '@/utils/milestone-helper';

const pageOptions = {
  key: 'property',
  pageName: 'Property Enquiries',
};

const PropertyEnquiry = ({ id }) => {
  const [toast, setToast] = useToast();
  const [propertyQuery, property] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneProperty(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!property}
        Icon={<MessageIcon />}
        query={propertyQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <WelcomeHero
          title="Buy Property"
          subtitle={` ${property?.name} - ${
            property?.address?.street1 &&
            getLocationFromAddress(property?.address)
          }`}
        />
        <section className="container-fluid">
          <Card className="card-container mb-4 h-100 property-holder__big">
            <PropertyImage property={property} hideGallery />
            <div className="my-4">
              <PropertyHeader property={property} isPortfolioPage />
            </div>
          </Card>
          <EnquiryForm id={id} setToast={setToast} property={property} />
        </section>
      </ContentLoader>
    </BackendPage>
  );
};

const EnquiryForm = ({ id, setToast, property }) => {
  const router = useRouter();
  const { userState } = React.useContext(UserContext);
  const isMilestonePayment = isMilestonePayment(property);
  const currentSchema = isMilestonePayment
    ? addMilestoneEnquirySchema
    : addEnquirySchema;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...setInitialValues(currentSchema, {
          ...userState,
        }),
        address: setInitialValues(addressSchema, userState.address),
      }}
      onSubmit={(values, actions) => {
        console.log('values', values);
        console.log('property', property);
        // delete optional fields
        !values.address.street2 && delete values.address.street2;
        !values.address.otherName && delete values.address.otherName;

        const firstMilestone = property?.milestonePayment[0];

        const firstMilestonePercentage = firstMilestone?.percentage || 100;
        const initialMilestoneInvestmentAmount =
          (firstMilestonePercentage / 100) * property?.price;

        const payload = {
          ...values,
          investmentStartDate:
            values?.investmentStartDate?.date ||
            values?.investmentStartDate ||
            firstMilestone?.dueDate,
          investmentFrequency: values?.investmentFrequency || -1,
          periodicInvestmentAmount: values?.periodicInvestmentAmount || 0,
          initialInvestmentAmount:
            values?.initialInvestmentAmount || initialMilestoneInvestmentAmount,
          propertyId: id,
          email: userState.email,
          phone: userState.phone,
        };

        Axios.post(`${BASE_API_URL}/enquiry/add`, payload, {
          headers: {
            Authorization: getTokenFromStore(),
          },
        })
          .then(function (response) {
            const { status } = response;
            if (status === 201) {
              setToast({
                type: 'success',
                message: 'Your enquiry has been successfully submitted',
              });
              router.push(`/user/property/${id}`);
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
        ...currentSchema,
        address: createSchema(addressSchema),
      })}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <ClientDetailsForm />
          <PropertyAddress />
          <PropertyDetailsForm />
          {!isMilestonePayment && <InvestmentDetailsForm />}
          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit Enquiry
          </Button>
          <DisplayFormikState {...props} showAll />
        </Form>
      )}
    </Formik>
  );
};

const ClientDetailsForm = () => (
  <Card className="card-container">
    <section className="row">
      <div className="col-md-10">
        <h5>Client Details</h5>
        <div className="form-row">
          <Select
            placeholder="Select Title"
            formGroupClassName="col-md-6"
            label="Title"
            name="title"
            options={valuesToOptions(TITLES)}
          />
          <Input
            formGroupClassName="col-md-6"
            label="First Name"
            name="firstName"
            placeholder="First Name"
          />
        </div>
        <div className="form-row">
          <Input
            formGroupClassName="col-md-6"
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
          />
          <Input
            formGroupClassName="col-md-6"
            label="Other Names"
            name="otherName"
            optional
            placeholder="Other Names"
          />
        </div>
        <Input
          formGroupClassName="col-md-12 mt-4"
          label="Occupation/Nature of Business"
          name="occupation"
          placeholder="Occupation/Nature of Business"
        />
      </div>
    </section>
  </Card>
);

const PropertyAddress = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10">
        <h5>Address</h5>

        <Address />
      </div>
    </section>
  </Card>
);

const PropertyDetailsForm = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10">
        <h5>Property Details</h5>

        <Input
          label="Name on Title Document"
          name="nameOnTitleDocument"
          placeholder="Name on Title Document"
        />
      </div>
    </section>
  </Card>
);

const InvestmentDetailsForm = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10">
        <h5>Investment Details</h5>

        <div className="form-row">
          <DatePicker
            formGroupClassName="col-md-6"
            label="Start Date"
            helpText="The date you want to start paying"
            name="investmentStartDate"
            placeholder="State Date"
          />

          <InputFormat
            formGroupClassName="col-md-6"
            label="Initial Investment Amount"
            name="initialInvestmentAmount"
            helpText="The initial amount you want pay."
            placeholder="Initial Investment"
          />
        </div>

        <div className="form-row">
          <InputFormat
            formGroupClassName="col-md-6"
            label="Periodic Investment"
            name="periodicInvestmentAmount"
            helpText="The amount you want to pay periodically"
            placeholder="Periodic Investment"
          />
          <Select
            formGroupClassName="col-md-6"
            label="Investment Frequency"
            name="investmentFrequency"
            helpText="The frequency of your periodic investment"
            placeholder="Investment Frequency"
            options={objectToOptions(PAYMENT_FREQUENCY, null, true)}
          />
        </div>
      </div>
    </section>
  </Card>
);

export default PropertyEnquiry;
