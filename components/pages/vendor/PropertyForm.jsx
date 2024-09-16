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
  createSchema,
  addressSchema,
} from 'components/forms/schemas/schema-helpers';
import {
  ALL_PROPERTY_FEATURES,
  BASE_API_URL,
  DEFAULT_PROPERTY_FEATURES,
  HOUSE_TYPES,
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
} from 'utils/helpers';
import Address from 'components/utils/Address';
import Select from 'components/forms/Select';
import MapLocation from 'components/utils/MapLocation';
import Upload from 'components/utils/Upload';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import AutoComplete from 'components/forms/AutoComplete';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { PropertyIcon } from 'components/utils/Icons';
import { setQueryCache } from 'hooks/useQuery';
import { refreshQuery } from 'hooks/useQuery';
import { useRouter } from 'next/router';

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const PropertyForm = () => {
  const [toast, setToast] = useToast();
  const router = useRouter();
  const { id } = router.query;
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

const NewPropertyForm = ({ property, toast, setToast }) => {
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
          mainImage: image || property?.mainImage,
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
          <PropertyImage
            image={image}
            setImage={saveImage}
            oldImage={property?.mainImage}
          />
          <MapLocation
            setLocation={setLocation}
            mapAddress={getLocationFromAddress(props.values.address)}
          />
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

          <Textarea
            label="Description"
            name="description"
            placeholder="A detailed description of the property"
          />

          <AutoComplete
            name="features"
            label="Features"
            suggestions={setAutoComplete(ALL_PROPERTY_FEATURES)}
          />

          <Textarea
            label="Title Document"
            name="titleDocument"
            optional
            placeholder="Title Document"
          />
        </div>
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
            defaultImage={PropertyPlaceholderImage}
            imgOptions={{ className: 'mb-3', watermark: true }}
            name="mainImage"
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
