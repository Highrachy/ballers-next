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
import { Formik, Form, useFormikContext } from 'formik';
import {
  createSchema,
  addressSchema,
} from 'components/forms/schemas/schema-helpers';
import {
  ALL_PROPERTY_FEATURES,
  BASE_API_URL,
  DEFAULT_PROPERTY_FEATURES,
  HOUSE_TYPES,
  PRICING_MODEL,
  PRICING_MODEL_DESC,
  PROPERTY_DELIVERY_STATE,
  TITLE_DOCUMENTS,
} from 'utils/constants';
import {
  getTokenFromStore,
  storePropertyImage,
  getPropertyImage,
} from 'utils/localStorage';
import {
  complianceSchema,
  newPropertySchema,
} from 'components/forms/schemas/propertySchema';
import InputFormat from 'components/forms/InputFormat';
import {
  getError,
  getLocationFromAddress,
  valuesToOptions,
  generateNumOptions,
  statusIsSuccessful,
  setAutoComplete,
  objectToOptions,
  booleanOptions,
  getAutoCompleteAsString,
  getAutoCompleteAsArray,
} from 'utils/helpers';
import Address from 'components/utils/Address';
import Select from 'components/forms/Select';
import MapLocation from 'components/utils/MapLocation';
import Upload from '@/components/forms/UploadFormik';
import { useRouter } from 'next/router';
import AutoComplete from 'components/forms/AutoComplete';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { PropertyIcon } from 'components/utils/Icons';
import { setQueryCache } from 'hooks/useQuery';
import { refreshQuery } from 'hooks/useQuery';
import {
  generateDefaultMilestones,
  isMilestonePayment,
} from 'utils/milestone-helper';
import { generatePropertyDescription } from 'utils/property-helper';
import Modal from 'components/common/Modal';
import DatePicker from 'components/forms/DatePicker';
import MdEditor from '@/components/forms/MdEditor';
import helpGuide from '@/data/docs/vip-accounts/add-property-listings-vip.json';
import { HelpBox } from '@/components/dashboard/HelpBox';
import Textarea from '@/components/forms/Textarea';

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const PropertyForm = ({ id }) => {
  const [toast, setToast] = useToast();
  return (
    <BackendPage>
      <div className="container-fluid">
        {id ? (
          <EditPropertyForm id={id} toast={toast} setToast={setToast} />
        ) : (
          <NewPropertyForm toast={toast} setToast={setToast} />
        )}
        <div className="mt-7">
          <HelpBox helpGuide={helpGuide} />
        </div>
      </div>
    </BackendPage>
  );
};

const EditPropertyForm = ({ id, toast, setToast }) => {
  const [propertyQuery, property] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneProperty(id),
    refresh: true,
  });

  return (
    <ContentLoader
      hasContent={!!property}
      Icon={<PropertyIcon />}
      query={propertyQuery}
      name={pageOptions.pageName}
      toast={toast}
    >
      <NewPropertyForm toast={toast} setToast={setToast} property={property} />
    </ContentLoader>
  );
};

export const NewPropertyForm = ({ property, toast, setToast }) => {
  const router = useRouter();
  const [location, setLocation] = React.useState(null);
  const [image, setImage] = React.useState(
    property?.mainImage || getPropertyImage()
  );

  const saveImage = (image) => {
    setImage(image);
    storePropertyImage(image);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...setInitialValues(newPropertySchema, {
          ...property,
          features: property?.features || DEFAULT_PROPERTY_FEATURES,
        }),
        address: setInitialValues(addressSchema, {
          ...property?.address,
          country: 'Nigeria',
        }),
        compliance: setInitialValues(complianceSchema, {
          location: '',
          registeredTitle: '',
          buildingApprovalStatus: '',
          buildingApprovalNumber: '',
          registeredDocument1: '',
          registeredDocument2: '',
          ...property?.compliance,
        }),
      }}
      onSubmit={(values, actions) => {
        let payload;

        const payloadData = {
          ...values,
          projectStartDate:
            values?.projectStartDate?.date || values?.projectStartDate,
          mainImage:
            image ||
            property?.mainImage ||
            `https://placehold.co/800x500/black/white?text=${values.name}`,
          titleDocument:
            getAutoCompleteAsString(values.titleDocument) || 'None',
          features: getAutoCompleteAsArray(values.features),
        };

        payload = location
          ? {
              ...payloadData,
              mapLocation: {
                longitude: location.latLng.lng.toString(),
                latitude: location.latLng.lat.toString(),
              },
            }
          : payloadData;

        const isNewProperty = !property?._id;
        const isMilestonePaymentModel = isMilestonePayment(payload);
        const isEmptyMilestonePayment = payload?.milestonePayment?.length === 0;

        if (
          (isNewProperty && isMilestonePaymentModel) ||
          (!isNewProperty && isMilestonePaymentModel && isEmptyMilestonePayment)
        ) {
          payload.milestonePayment = generateDefaultMilestones(
            payload?.deliveryState,
            payload?.projectStartDate
          );
        }

        Axios({
          method: property?._id ? 'put' : 'post',
          url: property?._id
            ? `${BASE_API_URL}/property/update`
            : `${BASE_API_URL}/property/add`,
          data: property?._id ? { ...payload, id: property?._id } : payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setQueryCache([pageOptions.key, data.property._id], {
                property: data.property,
              });
              setToast({
                type: 'success',
                message: `Your property has been successfully ${
                  property?._id ? 'updated' : 'added'
                }`,
              });

              router.push(`/vendor/property/${data.property?._id}`);
              refreshQuery('property');
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
        ...newPropertySchema,
        address: createSchema(addressSchema),
        compliance: createSchema(complianceSchema),
      })}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} />
          <PropertyInfoForm image={image} setImage={saveImage} {...props} />
          <PropertyAddress />
          <PropertyDescription />
          <PropertyImage
            image={image}
            setImage={saveImage}
            oldImage={property?.mainImage}
          />
          {/* <MapLocation
            setLocation={setLocation}
            // mapAddress={getLocationFromAddress(props.values.address)}
          /> */}
          <PropertyCompliance />
          <Button
            className="mt-4 btn-secondary"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            {property?._id ? 'Update' : 'Add New'} Property
          </Button>
          <DisplayFormikState {...props} showAll />
        </Form>
      )}
    </Formik>
  );
};

export const PropertyInfoForm = (props) => {
  const [displayForm, setDisplayForm] = React.useState({ houseType: false });
  const toggleForm = (value) => {
    setDisplayForm({ [value]: !displayForm[value] });
  };

  return (
    <>
      <Card className="card-container">
        <section className="row">
          <div className="px-4 col-md-10">
            <h5 className="mb-4">Property Information</h5>
            <Input
              label="Property Name"
              name="name"
              placeholder="Property Name"
            />

            <div className="form-row">
              {displayForm.houseType || props?.values?.houseType ? (
                <Input
                  // formGroupClassName="col-md-6"
                  label="House Type"
                  name="houseType"
                  placeholder="House Type"
                  labelLink={{
                    onClick: () => toggleForm('houseType'),
                    text: 'Select House Type',
                    to: '',
                  }}
                />
              ) : (
                <Select
                  placeholder="Select House Type"
                  // formGroupClassName="col-md-6"
                  label="House Type"
                  labelLink={{
                    onClick: () => toggleForm('houseType'),
                    text: 'Type Manually',
                    to: '',
                  }}
                  name="houseType"
                  options={valuesToOptions(HOUSE_TYPES)}
                />
              )}
            </div>

            <div className="form-row">
              <Select
                formGroupClassName="col-md-6"
                label="Bedrooms"
                name="bedrooms"
                options={generateNumOptions(9, 'Bedroom')}
                placeholder="Select Bedrooms"
              />
              <Select
                formGroupClassName="col-md-6"
                label="Bathrooms"
                name="bathrooms"
                options={generateNumOptions(9, 'Bathroom')}
                placeholder="Select Bathrooms"
              />
            </div>

            <div className="form-row">
              <Select
                formGroupClassName="col-md-6"
                label="Toilets"
                name="toilets"
                options={generateNumOptions(9, 'Toilet')}
                placeholder="Select Toilets"
              />
              <Select
                formGroupClassName="col-md-6"
                label="Has BQ or Maids Room"
                name="hasBQ"
                options={booleanOptions()}
                placeholder="Has BQ"
              />
            </div>

            <AutoComplete
              name="features"
              label="Features"
              suggestions={setAutoComplete(ALL_PROPERTY_FEATURES)}
            />
          </div>
        </section>
      </Card>

      <PropertyDetailsForm />
    </>
  );
};

const PropertyDetailsForm = () => {
  return (
    <Card className="mt-5 card-container">
      <section className="row">
        <div className="px-4 col-md-10">
          <h5 className="mb-4">Property Details</h5>
          <div className="form-row">
            <InputFormat
              formGroupClassName="col-md-6"
              label="Price"
              name="price"
              placeholder="Price"
            />
            <Input
              type="number"
              formGroupClassName="col-md-6"
              label="Units"
              name="units"
              placeholder="Available Units"
            />
          </div>

          <div className="form-row">
            <DatePicker
              formGroupClassName="col-md-6"
              label="Project Start Date"
              helpText="The commencement date of this project"
              name="projectStartDate"
              placeholder="Start Date"
            />

            <AutoComplete
              name="titleDocument"
              optional
              placeholder="Title Document"
              label="Title Document"
              formGroupClassName="col-md-6"
              suggestions={valuesToOptions(TITLE_DOCUMENTS)}
            />
          </div>
          <div className="form-row">
            <Select
              placeholder="Select Pricing Model"
              formGroupClassName="col-md-6"
              label="Pricing Model"
              name="pricingModel"
              options={objectToOptions(PRICING_MODEL_DESC, null, true)}
            />
            <Select
              placeholder="Select Delivery State"
              formGroupClassName="col-md-6"
              label="Pricing Delivery State"
              name="deliveryState"
              options={objectToOptions(PROPERTY_DELIVERY_STATE)}
            />
          </div>
        </div>
      </section>
    </Card>
  );
};

const PropertyDescription = () => {
  const { setFieldValue, values } = useFormikContext();
  const showGenerateButton =
    values?.name &&
    values?.houseType &&
    values?.address?.city &&
    values?.bedrooms;

  const [showGenerateDescriptionModal, setShowGenerateDescriptionModal] =
    React.useState(false);

  return (
    <Card className="mt-5 card-container">
      <section className="row">
        <div className="px-4 col-md-10">
          <h5 className="mb-4">Property Description</h5>
          <Textarea
            label="Description"
            name="description"
            placeholder="A detailed description of the property"
            rows={5}
          />

          {showGenerateButton ? (
            <Button
              color="info-light"
              className="btn-sm btn-wide"
              onClick={() => setShowGenerateDescriptionModal(true)}
            >
              Autogenerate
            </Button>
          ) : (
            <div className="text-sm text-muted mt-n2">
              Please fill in the required fields to enable the auto generate a
              description button
            </div>
          )}
        </div>
        <Modal
          title="Autogenerate Description"
          show={showGenerateDescriptionModal}
          onHide={() => setShowGenerateDescriptionModal(false)}
          size="md"
          showFooter={false}
        >
          <section className="row">
            <div className="px-5 my-3 text-center col-md-12">
              <p className="my-4 confirmation-text">
                {values?.description ? (
                  <div className="text-danger">
                    Please be aware that proceeding will overwrite your existing
                    property description.
                  </div>
                ) : (
                  <>Are you sure you want to autogenerate the description?</>
                )}
              </p>
              <Button
                color="info"
                className="mb-5"
                onClick={() => {
                  // Set the field value when the button is clicked
                  setFieldValue(
                    'description',
                    generatePropertyDescription(values)
                  );
                  setShowGenerateDescriptionModal(false);
                }}
              >
                Autogenerate Description
              </Button>
            </div>
          </section>
        </Modal>
      </section>
    </Card>
  );
};

export const PropertyImage = ({ setImage, oldImage }) => (
  <Card className="mt-5 card-container">
    <section className="row">
      <div className="px-4 col-md-10">
        <h5 className="mb-4">Property Image</h5>
        <div className="my-4">
          <Upload
            afterUpload={(image) => setImage(image)}
            changeText={`Update Property Image`}
            defaultImage={`/img/placeholder/property.png`}
            imgOptions={{ className: 'mb-3' }}
            name="property-image"
            oldImage={oldImage}
            uploadText={`Upload Property Image`}
            folder={'company-image'}
          />
        </div>
      </div>
    </section>
  </Card>
);

export const PropertyAddress = () => (
  <Card className="mt-5 card-container">
    <section className="row">
      <div className="col-md-10">
        <h5>Address</h5>

        <Address showCountry={false} />
      </div>
    </section>
  </Card>
);

const PropertyCompliance = () => {
  const { values } = useFormikContext();

  return (
    <Card className="mt-5 card-container">
      <section className="row">
        <div className="px-4 col-md-10">
          <h5 className="mb-4">Property Verification</h5>

          <div className="my-4 warning-alert">
            <h5 className="header-smaller text-md">Note</h5>
            This section is for <strong>internal use only</strong> and will not
            be displayed to the buyers. This will be used in investigating and
            approving your property.
          </div>

          {/* Location Select Dropdown */}
          <Select
            label="Access to Property Location"
            name="compliance.location"
            optional
            options={[
              {
                value: 'fully_accessible',
                label: 'Fully Accessible by All Vehicles (Tiled Roads)',
              },
              {
                value: 'partially_accessible',
                label: 'Accessible by Some Vehicles Only (Motorable)',
              },
              {
                value: 'not_accessible',
                label: 'Not Accessible by Most Vehicles',
              },
            ]}
          />

          {/* Registered Title Select Dropdown */}
          <Select
            label="A copy of the Registered Title"
            name="compliance.registeredTitle"
            optional
            options={[
              {
                value: 'Yes, the property has a registered title',
                label: 'Yes, the property has a registered title',
              },
              {
                value: 'The title document is currently being processed',
                label: 'The title document is currently being processed',
              },
              {
                value: 'No title document available yet',
                label: 'No title document available yet',
              },
            ]}
          />

          {/* Conditional Rendering of Registered Document Upload */}
          {values.compliance.registeredTitle ===
            'Yes, the property has a registered title' && (
            <Upload
              allowPdf
              imgOptions={{
                className: 'mb-3 img-sm',
              }}
              label="Registered Document"
              name="compliance.registeredDocument1"
              uploadText="Upload Registered Document"
              folder="registered-titles"
            />
          )}

          {/* Building Approval Status Select Dropdown */}
          <Select
            label="Building Approval Status"
            name="compliance.buildingApprovalStatus"
            optional
            options={[
              { value: 'completed_processing', label: 'Completed Processing' },
              { value: 'in_progress', label: 'Still in Progress' },
              { value: 'not_started', label: 'Not Started' },
            ]}
          />

          {/* Conditional Rendering of Building Approval Details */}
          {values.compliance.buildingApprovalStatus ===
            'completed_processing' && (
            <>
              <Input
                label="Building Approval Number"
                name="compliance.buildingApprovalNumber"
                placeholder="Building Approval Number"
              />
              <Upload
                allowPdf
                imgOptions={{
                  className: 'mb-3 img-sm',
                }}
                label="Building Approval Document"
                name="compliance.registeredDocument2"
                uploadText="Upload Approval Document"
                folder="approval-docs"
                optional
              />
            </>
          )}
        </div>
      </section>
    </Card>
  );
};

export default PropertyForm;
