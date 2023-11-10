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
import { newPropertySchema } from 'components/forms/schemas/propertySchema';
import Textarea from 'components/forms/Textarea';
import InputFormat from 'components/forms/InputFormat';
import {
  getError,
  getLocationFromAddress,
  valuesToOptions,
  generateNumOptions,
  statusIsSuccessful,
  setAutoComplete,
  getAutoComplete,
  objectToOptions,
} from 'utils/helpers';
import Address from 'components/utils/Address';
import Select from 'components/forms/Select';
import MapLocation from 'components/utils/MapLocation';
import Upload from 'components/utils/Upload';
import { useRouter } from 'next/router';
import AutoComplete from 'components/forms/AutoComplete';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { PropertyIcon } from 'components/utils/Icons';
import { setQueryCache } from 'hooks/useQuery';
import { refreshQuery } from 'hooks/useQuery';
import { generateDefaultMilestones } from '@/utils/milestone-helper';
import MDEditor from '@/components/forms/MDEditor';
import { generatePropertyDescription } from '@/utils/property-helper';
import Modal from '@/components/common/Modal';
import DatePicker from '@/components/forms/DatePicker';

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
          features: property?.features
            ? setAutoComplete(property?.features)
            : setAutoComplete(DEFAULT_PROPERTY_FEATURES),
        }),
        address: setInitialValues(addressSchema, {
          ...property?.address,
          country: 'Nigeria',
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
          features: getAutoComplete(values.features),
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
        const isMileStonePayment =
          payload?.pricingModel === PRICING_MODEL.Milestone;
        const isEmptyMilestonePayment = payload?.milestonePayment?.length === 0;

        if (
          (isNewProperty && isMileStonePayment) ||
          (!isNewProperty && isMileStonePayment && isEmptyMilestonePayment)
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
            mapAddress={getLocationFromAddress(props.values.address)}
          /> */}
          <Button
            className="btn-secondary mt-4"
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

export const PropertyInfoForm = () => {
  const [displayForm, setDisplayForm] = React.useState({ eventType: false });
  const toggleForm = (value) => {
    setDisplayForm({ [value]: !displayForm[value] });
  };

  return (
    <>
      <Card className="card-container">
        <section className="row">
          <div className="col-md-10 px-4">
            <h5 className="mb-4">Property Information</h5>
            <Input
              label="Property Name"
              name="name"
              placeholder="Property Name"
            />

            <div className="form-row">
              {displayForm.houseType ? (
                <Input
                  formGroupClassName="col-md-6"
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
                  formGroupClassName="col-md-6"
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
              <Select
                formGroupClassName="col-md-6"
                label="Bedrooms"
                name="bedrooms"
                options={generateNumOptions(9, 'Bedroom')}
                placeholder="Select Bedrooms"
              />
            </div>

            <div className="form-row">
              <Select
                formGroupClassName="col-md-6"
                label="Bathrooms"
                name="bathrooms"
                options={generateNumOptions(9, 'Bathroom')}
                placeholder="Select Bathrooms"
              />
              <Select
                formGroupClassName="col-md-6"
                label="Toilets"
                name="toilets"
                options={generateNumOptions(9, 'Toilet')}
                placeholder="Select Toilets"
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
    <Card className="card-container mt-5">
      <section className="row">
        <div className="col-md-10 px-4">
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

            <Select
              name="titleDocument"
              optional
              placeholder="Title Document"
              label="Title Document"
              formGroupClassName="col-md-6"
              options={valuesToOptions(TITLE_DOCUMENTS)}
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
    <Card className="card-container mt-5">
      <section className="row">
        <div className="col-md-10 px-4">
          <h5 className="mb-4">Property Description</h5>
          <MDEditor
            label="Description"
            name="description"
            placeholder="A detailed description of the property"
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
            <div className="text-muted text-sm mt-n2">
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
            <div className="col-md-12 my-3 px-5 text-center">
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
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10 px-4">
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
          />
        </div>
      </div>
    </section>
  </Card>
);

export const PropertyAddress = () => (
  <Card className="card-container mt-5">
    <section className="row">
      <div className="col-md-10">
        <h5>Address</h5>

        <Address showCountry={false} />
      </div>
    </section>
  </Card>
);

export default PropertyForm;
