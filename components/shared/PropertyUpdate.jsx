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
import {
  BASE_API_URL,
  PRICING_MODEL,
  PROPERTY_UPDATE_MEDIA_STATUS,
} from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import {
  addPropertyUpdateSchema,
  propertyUpdateImageSchema,
} from 'components/forms/schemas/propertySchema';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Upload from 'components/forms/UploadFormik';
import Input from 'components/forms/Input';
import Image, { OnlineImage } from 'components/utils/Image';
import { DeleteXIcon, EditNoteIcon } from 'components/utils/Icons';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import { ArrowUpIcon } from 'components/utils/Icons';
import { LinkSeparator, Spacing } from 'components/common/Helpers';
import { useCurrentRole } from 'hooks/useUser';
import { setQueryCache } from 'hooks/useQuery';
import Textarea from '../forms/Textarea';
import { getTinyDate } from '@/utils/date-helpers';
import { TruncatedDescription } from './MilestonePayment';
import { isMilestonePayment } from '@/utils/milestone-helper';

const PropertyUpdatesForm = ({
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
          url: `${BASE_API_URL}/property/${property._id}/property-update`,
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

const AddPropertyUpdateMediaForm = ({
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
          url: `${BASE_API_URL}/property/${property._id}/property-update/${propertyUpdate._id}/media`,
          data: payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your image has been successfully added to property Update`,
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
              <Input label="Title" name="title" placeholder="Title" />
              <div className="my-4">
                <Upload
                  label="Upload your image"
                  changeText="Update Picture"
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
                className="btn-wide mt-2"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Add Media
              </Button>
              <DisplayFormikState {...props} showAll />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export const AddPropertyUpdatesCategory = ({
  className,
  setToast,
  setProperty,
  property,
}) => {
  const [showAddPropertyUpdatesModal, setShowAddPropertyUpdatesModal] =
    React.useState(false);

  if (isMilestonePayment(property)) return null;

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

export const AddPropertyUpdateMedia = ({
  content,
  property,
  setProperty,
  setToast,
  setPropertyUpdate,
  propertyUpdate,
}) => {
  const [showAddImageModal, setShowAddImageModal] = React.useState(false);

  return (
    <>
      {content ? (
        <div
          onClick={() => {
            setPropertyUpdate(propertyUpdate);
            setShowAddImageModal(true);
          }}
        >
          {content}
        </div>
      ) : (
        <Button
          color="secondary-light"
          className="btn-wide"
          onClick={() => {
            setPropertyUpdate(propertyUpdate);
            setShowAddImageModal(true);
          }}
        >
          Add Media
        </Button>
      )}
      <Modal
        title="Add Media"
        show={showAddImageModal}
        onHide={() => setShowAddImageModal(false)}
        showFooter={false}
      >
        <AddPropertyUpdateMediaForm
          hideForm={() => setShowAddImageModal(false)}
          property={property}
          setProperty={setProperty}
          setToast={setToast}
          propertyUpdate={propertyUpdate}
        />
      </Modal>
    </>
  );
};

export const PropertyUpdateImageViewModal = ({
  show,
  userIsVendor,
  media,
  onHide,
  property,
  propertyUpdate,
  setProperty,
  setToast,
}) => {
  const [deleteMode, setDeleteMode] = React.useState(false);

  React.useEffect(() => {
    setDeleteMode(false);
  }, [media]);

  if (!media) return null;

  const propertyId = property?._id;
  const mediaId = media?._id;

  const handleDelete = () => {
    Axios({
      method: 'delete',
      url: `${BASE_API_URL}/property/${propertyId}/property-update/${propertyUpdate?._id}/media`,
      headers: { Authorization: getTokenFromStore() },
      data: { imageId: mediaId },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Image deleted from property update successfully`,
          });
          setProperty(data.property);
          onHide();
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  };

  const imageCanBeDeleted =
    media.status === PROPERTY_UPDATE_MEDIA_STATUS.UPLOADED;

  return (
    <Modal
      title={`${propertyUpdate?.title} : ${media?.title}`}
      show={show}
      onHide={onHide}
      showFooter={false}
      size={deleteMode ? 'md' : 'lg'}
    >
      <section className="row">
        <div className="col-md-12 my-3 text-center">
          <Image
            src={media?.url}
            alt={media?.title}
            style={{
              maxWidth: '100%',
              maxHeight: deleteMode ? '200px' : '80vh',
            }}
          />
          {userIsVendor && (
            <>
              {deleteMode ? (
                <section className="delete-mode">
                  <p className="my-4 mx-3 confirmation-text fw-bold">
                    Are you sure you want to delete this media?
                  </p>
                  <Button
                    color="danger"
                    className="mb-5 me-3"
                    onClick={handleDelete}
                  >
                    Yes, Delete Media
                  </Button>
                  <Button
                    color="primary-light"
                    className="mb-5"
                    onClick={() => {
                      setDeleteMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                </section>
              ) : (
                <section className="view-mode mt-3">
                  {imageCanBeDeleted ? (
                    <Button
                      color="danger"
                      className="btn-wide"
                      onClick={() => setDeleteMode(true)}
                    >
                      Delete Media
                    </Button>
                  ) : (
                    <p className="text-md alert alert-warning">
                      Image is currently linked to the milestone
                    </p>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </Modal>
  );
};

export const PropertyUpdateSingleImage = ({
  media,
  handleImageClick = () => {},
}) => (
  <span className="hover-image me-2" onClick={() => handleImageClick(media)}>
    <Image
      key={media._id}
      src={media?.url}
      alt={media?.title}
      name={media?.title}
      className="property-updates-image"
      responsiveImage={false}
    />
  </span>
);

export const DeletePropertyUpdateMedia = ({
  media,
  property,
  setProperty,
  setToast,
  setShowImageModal,
}) => {
  const [showDeleteMediaModal, setShowDeleteMediaModal] = React.useState(false);
  const propertyId = property?._id;
  const mediaId = media?._id;

  const handleDelete = () => {
    Axios({
      method: 'delete',
      url: `${BASE_API_URL}/property/${propertyId}/property-update/${mediaId}/media`,
      headers: { Authorization: getTokenFromStore() },
      data: { imageId: mediaId },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Image deleted from property update successfully`,
          });
          setProperty(data.property);
          setShowImageModal(false);
          setShowDeleteMediaModal(false);
          hideForm();
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  };
  return (
    <>
      <Button
        color="danger"
        className="btn-wide"
        onClick={() => {
          console.log('yes');
          setShowImageModal(false);
          // setShowDeleteMediaModal(true);
        }}
      >
        Delete Media
      </Button>
      <Modal
        title="Add Media"
        show={showDeleteMediaModal}
        onHide={() => {
          setShowImageModal(true);
          setShowDeleteMediaModal(false);
        }}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 mx-3 confirmation-text fw-bold">
              Are you sure you want to delete this media?
            </p>
            <Button className="btn btn-danger mb-5" onClick={handleDelete}>
              Delete Media
            </Button>
            <Button
              className="btn btn-primary-light mb-5"
              onClick={() => {
                setShowImageModal(true);
                setShowDeleteMediaModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const EditPropertyUpdateCategory = ({
  property,
  setProperty,
  setToast,
  setPropertyUpdate,
  propertyUpdate,
}) => {
  const [showEditPropertyUpdatesModal, setShowEditPropertyUpdatesModal] =
    React.useState(false);

  return (
    <>
      <span
        className="text-link text-secondary icon-lg text-gray-light"
        onClick={() => {
          setPropertyUpdate(propertyUpdate);
          setShowEditPropertyUpdatesModal(true);
        }}
      >
        <EditNoteIcon />
      </span>
      <Modal
        title="Property Updates"
        show={showEditPropertyUpdatesModal}
        onHide={() => setShowEditPropertyUpdatesModal(false)}
        showFooter={false}
      >
        <PropertyUpdatesForm
          hideForm={() => setShowEditPropertyUpdatesModal(false)}
          property={property}
          setProperty={setProperty}
          setToast={setToast}
          propertyUpdate={propertyUpdate}
        />
      </Modal>
    </>
  );
};

const DeletePropertyUpdateCategory = ({
  property,
  setProperty,
  setToast,
  setPropertyUpdate,
  propertyUpdate,
}) => {
  const [showDeletePropertyUpdatesModal, setShowDeletePropertyUpdatesModal] =
    React.useState(false);

  const deletePropertyUpdate = () => {
    setLoading(true);
    Axios.delete(`${BASE_API_URL}/property/${property._id}/property-update`, {
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

  return (
    <>
      <div className="top-icon">
        <span
          className="text-link text-danger text-gray-light icon-lg"
          onClick={() => {
            setPropertyUpdate(propertyUpdate);
            setShowDeletePropertyUpdatesModal(true);
          }}
        >
          <DeleteXIcon />
        </span>
        <Modal
          title="Delete Property Update"
          show={showDeletePropertyUpdatesModal}
          onHide={() => setShowDeletePropertyUpdatesModal(false)}
          showFooter={false}
        >
          <section className="row">
            <div className="col-md-12 my-3 text-center">
              <p className="my-4 confirmation-text fw-bold">
                Are you sure you want to delete this Property Update?
              </p>
              <Button
                className="btn btn-secondary mb-5"
                onClick={() => deletePropertyUpdate()}
              >
                Delete Property Update
              </Button>
            </div>
          </section>
        </Modal>
      </div>
    </>
  );
};

export const PropertyUpdatesList = ({
  property,
  setProperty,
  setToast,
  isPublicPage,
}) => {
  const [propertyUpdate, setPropertyUpdate] = React.useState(null);
  const isVendor = useCurrentRole().isVendor;
  const userIsVendor = !isPublicPage && isVendor;
  const propertyIsTimeline = property?.pricingModel === PRICING_MODEL.Timeline;
  const vendorCanEdit = userIsVendor && propertyIsTimeline;
  const noPropertyUpdates = (property?.propertyUpdate || [])?.length === 0;

  if (!propertyIsTimeline) return null;

  return (
    <>
      <div className="property__updates mt-5">
        {(!noPropertyUpdates || userIsVendor) && (
          <h5 className="header-content">Property Updates</h5>
        )}
        {!noPropertyUpdates &&
          property?.propertyUpdate?.map((propertyUpdate) => {
            if (propertyUpdate?.media?.length === 0 && !userIsVendor)
              return null;
            return (
              <section
                key={propertyUpdate._id}
                className={`card-updates bg-light`}
              >
                {vendorCanEdit && (
                  <DeletePropertyUpdateCategory
                    property={property}
                    setProperty={setProperty}
                    setToast={setToast}
                    propertyUpdate={propertyUpdate}
                    setPropertyUpdate={setPropertyUpdate}
                  />
                )}

                <div className="container">
                  <div className="row">
                    <div className="col-xl-2 d-flex align-items-center">
                      <div className="mb-4 fw-bold text-muted text-uppercase">
                        {getTinyDate(propertyUpdate?.date)}
                      </div>
                    </div>
                    <div className="col-xl-6 d-flex align-items-center">
                      <div className="mb-4 mb-xl-0 text-primary">
                        <h4>
                          {propertyUpdate?.title}{' '}
                          {vendorCanEdit && (
                            <EditPropertyUpdateCategory
                              property={property}
                              setProperty={setProperty}
                              setToast={setToast}
                              propertyUpdate={propertyUpdate}
                              setPropertyUpdate={setPropertyUpdate}
                            />
                          )}
                        </h4>
                        <div className="fw-normal mb-2 text-md text-primary-light">
                          {propertyUpdate?.media?.length > 0 ? (
                            `Last Updated: ${getTinyDate(
                              propertyUpdate?.media?.[0].addedOn
                            )}`
                          ) : (
                            <span className="text-soft">
                              No Image has been added
                            </span>
                          )}
                        </div>
                        <TruncatedDescription
                          description={propertyUpdate?.description}
                          maxLength={60}
                          className="text-primary-light"
                        />

                        <div className="mt-4">
                          {propertyUpdate?.media?.map((media, mediaIndex) => (
                            <Image
                              key={media._id}
                              src={media?.url}
                              alt={media?.title}
                              name={media?.title}
                              className="property-updates-image"
                              responsiveImage={false}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 d-flex align-items-center justify-content-end">
                      {userIsVendor ? (
                        <AddPropertyUpdateMedia
                          property={property}
                          setProperty={setProperty}
                          setToast={setToast}
                          propertyUpdate={propertyUpdate}
                          setPropertyUpdate={setPropertyUpdate}
                        />
                      ) : (
                        <h5 className="text-muted text-md text-uppercase text-end">
                          {propertyUpdate?.media?.length} media
                        </h5>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
      </div>

      {vendorCanEdit && (
        <div className="row">
          <div className="col-12">
            <AddPropertyUpdatesCategory
              className="btn btn-secondary-light btn-sm btn-wide"
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

export const GenerateMilestonePropertyUpdates = ({
  setToast,
  property,
  setProperty,
  buttonText = 'Finalize Milestone',
  modalText = 'Are you sure you want to finalize this milestone? Once finalized, your changes will be saved, and this milestone will no longer be available for edits.',
  successText = 'Milestone Finalized Successfully!',
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isVendor = useCurrentRole().isVendor;

  if (property?.milestoneDetails?.hasPropertyUpdate) {
    return;
  }

  const generateMilestonePropertyUpdates = () => {
    setLoading(true);

    Axios.put(
      `${BASE_API_URL}/property/${property._id}/generateMilestonePropertyUpdate`,
      {},
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { data, status } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            message: 'Property Update generated successfully',
            type: 'success',
          });
          setProperty({ ...property, ...data.property });
          setShowModal(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <>
      <div className="mt-3">
        <button
          className="btn btn-success btn-wide"
          onClick={() => setShowModal(true)}
        >
          {buttonText}
        </button>
      </div>
      <Modal
        title={buttonText}
        show={showModal}
        onHide={() => setShowModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 confirmation-text">{modalText}</p>
            <Button
              color="success"
              loading={loading}
              className="btn mb-5"
              onClick={generateMilestonePropertyUpdates}
            >
              Confirm and Finalize
            </Button>
            <Spacing />
            <Button
              color="dark"
              className="btn mb-5"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};
