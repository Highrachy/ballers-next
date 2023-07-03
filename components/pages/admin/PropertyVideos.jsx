import React from 'react';
import { Card } from 'react-bootstrap';
import PaginatedContent from 'components/common/PaginatedContent';
import { Form, Formik } from 'formik';
import {
  DisplayFormikState,
  processFilterValues,
  setInitialValues,
} from 'components/forms/form-helper';
import Select from 'components/forms/Select';
import { formatFilterString, valuesToOptions } from 'utils/helpers';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import BackendPage from 'components/layout/BackendPage';
import { PropertyVideosIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import { PROPERTY_VIDEO_STATUS } from 'utils/constants';
import { API_ENDPOINT } from 'utils/URL';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Modal from 'components/common/Modal';
import { PropertyAvatar } from 'components/common/PropertyCard';
import { requestVideoReviewSchema } from 'components/forms/schemas/propertySchema';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import Textarea from 'components/forms/Textarea';
import { LinkSeparator } from 'components/common/Helpers';
import { SuccessIcon } from 'components/utils/Icons';
import { ErrorIcon } from 'components/utils/Icons';
import { PropertyIcon } from 'components/utils/Icons';
import { VideoModal, VideoYoutubeImage } from '@/components/shared/Video';

const PropertyVideos = () => {
  return (
    <BackendPage>
      <PaginatedContent
        endpoint={API_ENDPOINT.getAllPropertyVideos()}
        pageName="PropertyVideo"
        pluralPageName="PropertyVideos"
        DataComponent={PropertyVideosRowList}
        FilterComponent={FilterForm}
        PageIcon={<PropertyVideosIcon />}
        queryName="PropertyVideo"
      />
    </BackendPage>
  );
};

const ApprovalModal = ({
  video,
  showApprovalModal,
  setShowApprovalModal,
  setToast,
}) => {
  const isApproved = video?.action === PROPERTY_VIDEO_STATUS.APPROVED;
  const currentAction = isApproved ? 'approve' : 'disapprove';
  const currentSchema = !isApproved ? requestVideoReviewSchema : {};

  return (
    <Modal
      title="Process Video"
      show={showApprovalModal}
      onHide={() => setShowApprovalModal(false)}
      showFooter={false}
    >
      <section className="row">
        <div className="col-md-12 my-3">
          <Formik
            initialValues={setInitialValues(currentSchema)}
            onSubmit={(values, actions) => {
              const payload = {
                ...values,
              };
              Axios.put(
                `${BASE_API_URL}/property-video/${video._id}/${currentAction}`,
                { ...payload },
                {
                  headers: { Authorization: getTokenFromStore() },
                }
              )
                .then(function (response) {
                  const { status } = response;
                  if (statusIsSuccessful(status)) {
                    setToast({
                      type: 'success',
                      message: `The Video has been successfully ${currentAction}d`,
                    });
                    actions.setSubmitting(false);
                    actions.resetForm();
                    setShowApprovalModal(false);
                  }
                })
                .catch(function (error) {
                  setToast({
                    message: getError(error),
                  });
                  actions.setSubmitting(false);
                });
            }}
            validationSchema={createSchema(currentSchema)}
          >
            {({ isSubmitting, handleSubmit, ...props }) => (
              <Form>
                {isApproved && (
                  <p className="mb-3 text-center confirmation-text">
                    Are you sure you want to approve this video?
                  </p>
                )}

                <div className="mb-4">
                  {video?._id && <VideoYoutubeImage {...video} />}
                </div>

                {!isApproved && (
                  <Textarea
                    name="comment"
                    label="Reason for disapproving the Video"
                    placeholder="Your Comment"
                    rows="3"
                  />
                )}

                <Button
                  color={isApproved ? 'secondary' : 'danger'}
                  className="mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isApproved ? <SuccessIcon /> : <ErrorIcon />}{' '}
                  {Humanize.titleCase(currentAction)} Video
                </Button>
                <DisplayFormikState {...props} hide showAll />
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </Modal>
  );
};

const PropertyVideosRowList = ({ results, offset, setToast }) => {
  const [video, setVideo] = React.useState(null);
  const [showApprovalModal, setShowApprovalModal] = React.useState(false);

  const showVideoApprovalModal = (video, action) => {
    setVideo({ ...video, action });
    setShowApprovalModal(true);
  };

  return (
    <div className="container-fluid">
      <Card className="mt-2 p-4">
        <div className="row">
          {results?.map((video, index) => (
            <div key={index} className="col-md-4 mb-4">
              <VideoModal video={video} key={video._id} />
              <div className="text-primary text-small py-1 text-truncate">
                {video.title}
              </div>
              <div className="text-secondary text-small mb-2">
                <PropertyIcon />{' '}
                <PropertyAvatar
                  property={video?.propertyInfo}
                  className=""
                  nameOnly
                />
              </div>
              <div className="mb-3">
                {video.status !== PROPERTY_VIDEO_STATUS.APPROVED && (
                  <small
                    className="text-link text-secondary text-muted"
                    onClick={() =>
                      showVideoApprovalModal(
                        video,
                        PROPERTY_VIDEO_STATUS.APPROVED
                      )
                    }
                  >
                    <SuccessIcon /> Approve Video
                  </small>
                )}
                {video.status ===
                  PROPERTY_VIDEO_STATUS.PENDING_ADMIN_REVIEW && (
                  <LinkSeparator />
                )}
                {video.status !== PROPERTY_VIDEO_STATUS.DISAPPROVED && (
                  <small
                    className="text-link text-danger text-muted"
                    onClick={() =>
                      showVideoApprovalModal(
                        video,
                        PROPERTY_VIDEO_STATUS.DISAPPROVED
                      )
                    }
                  >
                    <ErrorIcon /> Disapprove Video
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>

        <ApprovalModal
          video={video}
          showApprovalModal={showApprovalModal}
          setShowApprovalModal={setShowApprovalModal}
          setToast={setToast}
        />
      </Card>
    </div>
  );
};

const FilterForm = ({ setFilterTerms }) => {
  return (
    <Formik
      initialValues={{}}
      onSubmit={(values) => {
        const payload = processFilterValues(values);
        setFilterTerms(payload, {
          title: formatFilterString('Title', values.title),
          status: formatFilterString('Status', values.status),
        });
      }}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Input label="Title" name="title" />

          <Select
            label="Status"
            name="status"
            options={valuesToOptions(Object.values(PROPERTY_VIDEO_STATUS))}
          />
          <DisplayFormikState {...props} showAll />
          <Button
            className="btn-secondary mt-4"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Filter Property Video
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default PropertyVideos;
