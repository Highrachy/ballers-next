import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import ImagePlaceholder from 'assets/img/placeholder/image.png';
import { CameraIcon } from 'components/utils/Icons';
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
import { addGallerySchema } from 'components/forms/schemas/propertySchema';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Upload from 'components/utils/Upload';
import Input from 'components/forms/Input';
import Link from 'next/link';
import BackendPage from 'components/layout/BackendPage';
import Image, { OnlineImage } from 'components/utils/Image';
import { SlideDown } from 'react-slidedown';
import { PlusIcon } from 'components/utils/Icons';
import { CloseIcon } from 'components/utils/Icons';
import { EditIcon } from 'components/utils/Icons';
import { DeleteIcon } from 'components/utils/Icons';
import { LinkSeparator } from 'components/common/Helpers';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { setQueryCache } from 'hooks/useQuery';

const pageOptions = {
  key: 'property',
  pageName: 'Gallery',
};
const Gallery = ({ propertyId }) => {
  const [toast, setToast] = useToast();
  const [showGalleryForm, setShowGalleryForm] = React.useState(false);

  const hideForm = () => setShowGalleryForm(false);

  const [propertyQuery, property, setProperty] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, propertyId],
    setToast,
    endpoint: API_ENDPOINT.getOneProperty(propertyId),
  });

  return (
    <BackendPage>
      <div className="container-fluid">
        <Toast {...toast} showToastOnly />

        <h4>
          Gallery
          <div className="float-end">
            {showGalleryForm ? (
              <Button
                className="btn btn-danger btn-xs btn-wide"
                onClick={() => setShowGalleryForm(false)}
              >
                {<CloseIcon />} Close Form
              </Button>
            ) : (
              <Button
                className="btn btn-dark btn-xs btn-wide"
                onClick={() => setShowGalleryForm(true)}
              >
                {<PlusIcon />} Add Image
              </Button>
            )}
          </div>
        </h4>
        <p className="fw-bold">{property?.name}</p>

        <SlideDown className={''}>
          {showGalleryForm && (
            <GalleryForm
              property={property}
              setProperty={setProperty}
              setToast={setToast}
              hideForm={hideForm}
            />
          )}
        </SlideDown>

        <ContentLoader
          hasContent={!!property?.gallery?.length > 0}
          Icon={<CameraIcon />}
          query={propertyQuery}
          name={pageOptions.pageName}
          noContentText="No images in Gallery"
          toast={toast}
        >
          {property?.gallery.length > 0 && (
            <GalleryImages
              property={property}
              setProperty={setProperty}
              setToast={setToast}
            />
          )}
        </ContentLoader>

        <Link
          className="btn btn-secondary btn-wide mt-5"
          href={`/vendor/property/${property?._id}`}
        >
          Back to Property
        </Link>
      </div>
    </BackendPage>
  );
};

export const GallerySlideShow = ({ images }) => {
  const [index, setIndex] = React.useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {images.map(({ title, url }) => (
        <Carousel.Item key={url}>
          <OnlineImage className="d-block w-100" src={url} alt={title} />
          <Carousel.Caption>
            <p>{title}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export const GalleryList = ({ property }) => {
  const [showSlideShowModal, setShowSlideShowModal] = React.useState(false);
  const galleryLength = property.gallery.length || 0;
  const SIDE_GALLERY_IMAGES = 4;
  const neededGalleryImages =
    property.gallery
      .slice(Math.max(galleryLength - 3, 0), galleryLength)
      .reverse() || [];
  const viewMoreImage =
    galleryLength >= SIDE_GALLERY_IMAGES
      ? property.gallery
          .slice(Math.max(galleryLength - 4, 0), Math.max(galleryLength - 3, 1))
          ?.pop() || []
      : neededGalleryImages.pop();

  return (
    <>
      <div className="col-sm-2">
        <aside className="row gallery-row">
          {neededGalleryImages.slice(0, 3).map(({ _id, title, url }) => (
            <div className="gallery-col col-3 col-md-12" key={_id}>
              <OnlineImage
                src={url}
                alt={title}
                className="img-fluid gallery-thumbnails property-img"
              />
            </div>
          ))}

          <div className="gallery-col col-3 col-md-12">
            <div
              onClick={() => setShowSlideShowModal(true)}
              className="overlay overlay__secondary"
            >
              <OnlineImage
                src={viewMoreImage?.url}
                alt={viewMoreImage?.title || 'property'}
                className="img-fluid gallery-thumbnails property-img mb-0"
              />
              <span className="overlay__content">
                <CameraIcon /> <br />
                View Gallery
              </span>
            </div>
          </div>
        </aside>
      </div>
      <Modal
        title="Gallery"
        show={showSlideShowModal}
        onHide={() => setShowSlideShowModal(false)}
        showFooter={false}
        size="lg"
      >
        <GallerySlideShow images={property?.gallery} />
      </Modal>
    </>
  );
};

export const GalleryForm = ({
  hideForm,
  setToast,
  setProperty,
  property,
  gallery,
}) => {
  const [toast] = useToast();
  const [image, setImage] = React.useState(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(addGallerySchema, {
        title: gallery?.title,
      })}
      onSubmit={({ title }, actions) => {
        const payload = {
          title,
          url: image || gallery?.url,
        };

        if (!payload.url) {
          setToast({ message: 'Kindly upload a Gallery Image' });
          return;
        }

        Axios({
          method: gallery?._id ? 'put' : 'post',
          url: `${BASE_API_URL}/property/${property._id}/gallery`,
          data: gallery?._id ? { ...payload, imageId: gallery?._id } : payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status, data } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your gallery has been successfully ${
                  gallery?._id ? 'updated' : 'added'
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
      validationSchema={createSchema(addGallerySchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />

          <Card className="card-container">
            <section className="row">
              <div className="col-md-10 px-4">
                <h5>Add Image to Gallery</h5>
                <Input label="Title" name="title" placeholder="Title" />
                <div className="my-4">
                  <Upload
                    afterUpload={(image) => setImage(image)}
                    changeText={`Update Gallery Image`}
                    defaultImage={ImagePlaceholder}
                    imgOptions={{ className: 'mb-3', watermark: true }}
                    name="gallery-image"
                    oldImage={gallery?.url}
                    uploadText={`Upload Gallery Image`}
                  />
                </div>
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  {gallery?._id ? 'Update' : 'Add'} Gallery Image
                </Button>
                <DisplayFormikState {...props} showAll />
              </div>
            </section>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export const GalleryImages = ({ property, setProperty, setToast }) => (
  <>
    <Card className="card-container mb-5">
      <div className="row">
        {property?.gallery.reverse().map((image, index) => (
          <SingleGalleryImage
            key={index}
            {...image}
            property={property}
            setProperty={setProperty}
            setToast={setToast}
          />
        ))}
      </div>
    </Card>
  </>
);

const SingleGalleryImage = ({
  _id,
  title,
  url,
  property,
  setProperty,
  setToast,
}) => {
  const [showEditGalleryModal, setShowEditGalleryModal] = React.useState(false);
  const [showDeleteGalleryModal, setShowDeleteGalleryModal] =
    React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const deleteGalleryImage = (id) => {
    setLoading(true);
    Axios.delete(`${BASE_API_URL}/property/${property._id}/gallery`, {
      headers: { Authorization: getTokenFromStore() },
      data: { imageId: _id },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `Image has been successfully deleted`,
          });
          setProperty(data.property);
          setQueryCache([pageOptions.key, property._id], {
            property: data.property,
          });
          setShowDeleteGalleryModal(false);
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
    <article className="col-6 col-md-4">
      <section className="property-card border">
        <div className="content-image">
          <Image src={url} alt={`${title}`} name={title} className="small" />
        </div>
        <div className="property-item">
          <h6 className="mb-0">{title}</h6>
          {/* Details */}
          <div className="property-details property-spacing">
            <span
              className="text-link text-small"
              onClick={() => setShowEditGalleryModal(true)}
            >
              <EditIcon /> Edit Image
            </span>
            <LinkSeparator />
            <span
              className="text-link text-small text-muted text-danger"
              onClick={() => setShowDeleteGalleryModal(true)}
            >
              <DeleteIcon /> Delete Image
            </span>
          </div>
        </div>
      </section>
      {/* Edit Gallery Modal */}
      <Modal
        title="Gallery"
        show={showEditGalleryModal}
        onHide={() => setShowEditGalleryModal(false)}
        showFooter={false}
      >
        <GalleryForm
          hideForm={() => setShowEditGalleryModal(false)}
          property={property}
          setProperty={setProperty}
          setToast={setToast}
          gallery={{ _id, title, url }}
        />
      </Modal>

      {/* Delete Gallery Modal */}
      <Modal
        title="Verify Vendor"
        show={showDeleteGalleryModal}
        onHide={() => setShowDeleteGalleryModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <OnlineImage
              src={url}
              name={title}
              options={{ h: 200 }}
              responsiveImage={false}
            />
            <p className="my-4 fw-bold confirmation-text">
              Are you sure you want to delete this image?
            </p>
            <Button
              loading={loading}
              className="btn btn-secondary mb-5"
              onClick={() => deleteGalleryImage(_id)}
            >
              Delete Image
            </Button>
          </div>
        </section>
      </Modal>
    </article>
  );
};

export default Gallery;
