import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
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
import { BASE_API_URL, DEFAULT_PROPERTY_FEATURES } from 'utils/constants';
import {
  getTokenFromStore,
  storePropertyImage,
  getPropertyImage,
} from 'utils/localStorage';
import { newPropertySchema } from 'components/forms/schemas/propertySchema';
import {
  getError,
  getLocationFromAddress,
  statusIsSuccessful,
  setAutoComplete,
  getAutoComplete,
} from 'utils/helpers';
import MapLocation from 'components/utils/MapLocation';
import { navigate } from '@reach/router';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { PropertyIcon } from 'components/utils/Icons';
import { setQueryCache } from 'hooks/useQuery';
import { refreshQuery } from 'hooks/useQuery';
import { PropertyInfoForm } from './PropertyForm';
import { PropertyAddress } from './PropertyForm';
import { PropertyImage } from '../shared/SingleProperty';

const pageOptions = {
  key: 'propertyTemplate',
  pageName: 'PropertyTemplate',
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
    endpoint: API_ENDPOINT.getOnePropertyTemplate(id),
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
          url: `${BASE_API_URL}/property/template`,
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
                message: `Your property template  has been successfully ${
                  property?._id ? 'updated' : 'added'
                }`,
              });

              navigate(`/vendor/property/${data.property?._id}`);
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

export default PropertyForm;
