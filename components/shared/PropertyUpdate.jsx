import React from 'react';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import Modal from 'components/common/Modal';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import {
  addPropertyUpdateSchema,
  propertyUpdateImageSchema,
} from 'components/forms/schemas/propertySchema';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Upload from 'components/forms/UploadFormik';
import Input from 'components/forms/Input';
import Image, { OnlineImage } from 'components/utils/Image';
import { Accordion } from 'react-bootstrap';
import { ArrowDownIcon } from 'components/utils/Icons';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import { ArrowUpIcon } from 'components/utils/Icons';
import { LinkSeparator } from 'components/common/Helpers';
import { useCurrentRole } from 'hooks/useUser';
import { setQueryCache } from 'hooks/useQuery';
import Textarea from '../forms/Textarea';
import { getShortDate, getTinyDate, getYear } from '@/utils/date-helpers';

export const PropertyUpdatesForm = ({
  hideForm,
  setToast,
  setProperty,
  property,
  propertyUpdate,
}) => {
  const [toast] = useToast();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(addPropertyUpdateSchema, propertyUpdate)}
      onSubmit={({ title, description }, actions) => {
        const payload = {
          title,
          description,
        };

        Axios({
          method: propertyUpdate?._id ? 'put' : 'post',
          url: `${BASE_API_URL}/property/${property._id}/propertyUpdate`,
          data: propertyUpdate?._id
            ? { ...payload, propertyUpdateId: propertyUpdate?._id }
            : payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your progress report has been successfully ${
                  propertyUpdate?._id ? 'updated' : 'added'
                }`,
              });
              hideForm();
              setProperty(data.property);
              setQueryCache([pageOptions.key, property._id], {
                property: data.property,
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
      validationSchema={createSchema(addPropertyUpdateSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />
          <section className="row">
            <div className="col-md-10 px-4">
              <h5>Add Property Updates</h5>
              <Input label="Title" name="title" placeholder="Title" />
              <Textarea
                label="Description"
                name="description"
                placeholder="Description"
                optional
              />
              {/* <div className="my-4">
                <Upload
                  label="Upload your image"
                  changeText="Update Picture"
                  // defaultImage="/assets/img/placeholder/image.png"
                  imgOptions={{
                    className: 'mb-3 img-xxl',
                    width: 200,
                    height: 300,
                  }}
                  name="companyLogo"
                  uploadText={`Upload Picture`}
                  folder={'company-logo'}
                />
              </div> */}
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                {propertyUpdate?._id ? 'Update' : 'Add'} Property Update
              </Button>
              <DisplayFormikState {...props} showAll />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export const AddPropertyUpdateImage = ({
  hideForm,
  setToast,
  setProperty,
  property,
  propertyUpdate,
}) => {
  const [toast] = useToast();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(propertyUpdateImageSchema)}
      onSubmit={(payload, actions) => {
        Axios({
          method: 'post',
          url: `${BASE_API_URL}/property/${property._id}/propertyUpdate/${propertyUpdate._id}/media`,
          data: payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your image has been successfully added to propertyUpdate`,
              });
              hideForm();
              setProperty(data.property);
              setQueryCache([pageOptions.key, property._id], {
                property: data.property,
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
      validationSchema={createSchema(propertyUpdateImageSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />
          <section className="row">
            <div className="col-md-10 px-4">
              <h5>Add Image to Property Update</h5>
              <Input label="Title" name="title" placeholder="Title" />
              <div className="my-4">
                <Upload
                  label="Upload your image"
                  changeText="Update Picture"
                  // defaultImage="/assets/img/placeholder/image.png"
                  imgOptions={{
                    className: 'mb-3 img-xxl',
                    width: 200,
                    height: 300,
                  }}
                  name="url"
                  uploadText={`Upload Picture`}
                  folder={'propertyUpdate'}
                />
              </div>
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Add Image
              </Button>
              <DisplayFormikState {...props} showAll />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export const AddPropertyUpdates = ({
  className,
  setToast,
  setProperty,
  property,
}) => {
  const [showAddPropertyUpdatesModal, setShowAddPropertyUpdatesModal] =
    React.useState(false);
  return (
    <>
      <span
        className={className}
        onClick={() => setShowAddPropertyUpdatesModal(true)}
      >
        Add Property Updates
      </span>

      <Modal
        title="Property Updates"
        show={showAddPropertyUpdatesModal}
        onHide={() => setShowAddPropertyUpdatesModal(false)}
        showFooter={false}
        size="lg"
      >
        <PropertyUpdatesForm
          hideForm={() => setShowAddPropertyUpdatesModal(false)}
          setToast={setToast}
          setProperty={setProperty}
          property={property}
        />
      </Modal>
    </>
  );
};

const pageOptions = {
  key: 'property',
  pageName: 'Property Updates',
};

export const PropertyUpdatesList = ({ property, setProperty, setToast }) => {
  const [showManageBar, setShowManageBar] = React.useState(null);
  const [showAddImageModal, setShowAddImageModal] = React.useState(false);
  const [showEditPropertyUpdatesModal, setShowEditPropertyUpdatesModal] =
    React.useState(false);
  const [showDeletePropertyUpdatesModal, setShowDeletePropertyUpdatesModal] =
    React.useState(false);

  const [propertyUpdate, setPropertyUpdate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const deletePropertyUpdate = () => {
    setLoading(true);
    Axios.delete(`${BASE_API_URL}/property/${property._id}/propertyUpdate`, {
      headers: { Authorization: getTokenFromStore() },
      data: { propertyUpdateId: propertyUpdate._id },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Property Update has been successfully deleted`,
          });
          setProperty(data.property);
          setQueryCache([pageOptions.key, property._id], {
            property: { ...property, ...data.property }, // review
          });
          setShowDeletePropertyUpdatesModal(false);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };
  const userIsVendor = useCurrentRole().isVendor;
  const noPropertyUpdates = property?.propertyUpdates?.length === 0;
  return (
    <>
      <div className="property__floor-plans">
        {(!noPropertyUpdates || userIsVendor) && (
          <h5 className="header-smaller mb-3 mt-5">Property Updates</h5>
        )}
        {!noPropertyUpdates &&
          property?.propertyUpdate?.map((propertyUpdate, index) => (
            <Card key={propertyUpdate._id} className="mb-3">
              <div className="container propertyUpdate-container">
                <div className="row">
                  <div className="col-md-2 propertyUpdate-date">
                    {getTinyDate(propertyUpdate?.date)}
                    <br />
                  </div>
                  <div className="col-md-6">
                    <h4 className="propertyUpdate-title">
                      {propertyUpdate?.title}
                    </h4>
                    <p className="propertyUpdate-description">
                      {propertyUpdate?.description}
                    </p>
                  </div>
                  <div className="col-md-4">
                    {propertyUpdate?.media?.map((media, mediaIndex) => (
                      <Image
                        key={media._id}
                        src={media?.url}
                        alt={media?.title}
                        name={media?.title}
                        className="propertyUpdate-image"
                        responsiveImage={false}
                      />
                    ))}
                    {userIsVendor && (
                      <div
                        className="text-danger text-sm text-end"
                        onClick={() =>
                          setShowManageBar(
                            showManageBar === index ? null : index
                          )
                        }
                      >
                        {showManageBar === index
                          ? 'Close Menu'
                          : 'Manage PropertyUpdate'}
                      </div>
                    )}
                  </div>
                </div>
                {userIsVendor && showManageBar === index && (
                  <>
                    <div className="dotted-border my-3"></div>
                    <p className="px-4">
                      <span
                        className="text-link text-muted"
                        onClick={() => {
                          setPropertyUpdate(propertyUpdate);
                          setShowAddImageModal(true);
                        }}
                      >
                        Add Image
                      </span>
                      <LinkSeparator />
                      <span
                        className="text-link text-muted"
                        onClick={() => {
                          setPropertyUpdate(propertyUpdate);
                          setShowEditPropertyUpdatesModal(true);
                        }}
                      >
                        Edit Property Update
                      </span>
                      <LinkSeparator />
                      <span
                        className="text-link  text-muted"
                        onClick={() => {
                          setPropertyUpdate(propertyUpdate);
                          setShowDeletePropertyUpdatesModal(true);
                        }}
                      >
                        Delete Property Update
                      </span>
                    </p>
                  </>
                )}
              </div>
              <Modal
                title="Add Image"
                show={showAddImageModal}
                onHide={() => setShowAddImageModal(false)}
                showFooter={false}
              >
                <AddPropertyUpdateImage
                  hideForm={() => setShowAddImageModal(false)}
                  property={property}
                  setProperty={setProperty}
                  setToast={setToast}
                  propertyUpdate={propertyUpdate}
                />
              </Modal>

              {/* Edit Property Updates Modal */}
              <Modal
                title="Property Updates"
                show={showEditPropertyUpdatesModal}
                onHide={() => setShowEditPropertyUpdatesModal(false)}
                showFooter={false}
              >
                {JSON.stringify(propertyUpdate, null, 2)}
                <PropertyUpdatesForm
                  hideForm={() => setShowEditPropertyUpdatesModal(false)}
                  property={property}
                  setProperty={setProperty}
                  setToast={setToast}
                  propertyUpdate={propertyUpdate}
                />
              </Modal>

              {/* Delete Property Updates Modal */}
              <Modal
                title="Verify Vendor"
                show={showDeletePropertyUpdatesModal}
                onHide={() => setShowDeletePropertyUpdatesModal(false)}
                showFooter={false}
              >
                <section className="row">
                  <div className="col-md-12 my-3 text-center">
                    <p className="my-4 confirmation-text fw-bold">
                      Are you sure you want to delete this PropertyUpdate?
                    </p>
                    <Button
                      loading={loading}
                      className="btn btn-secondary mb-5"
                      onClick={() => deletePropertyUpdate()}
                    >
                      Delete Property Update
                    </Button>
                  </div>
                </section>
              </Modal>
            </Card>
          ))}
      </div>

      {userIsVendor && (
        <div className="row">
          <div className="col-12">
            <AddPropertyUpdates
              className="btn btn-secondary btn-xs btn-wide"
              property={property}
              setToast={setToast}
              setProperty={setProperty}
            />
          </div>
        </div>
      )}
    </>
  );
};
