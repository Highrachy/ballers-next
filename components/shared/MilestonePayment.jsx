import React, { useState } from 'react';
import Modal from 'components/common/Modal';
import { Card, ProgressBar } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  addMilestoneSchema,
  updateMilestoneSchema,
} from 'components/forms/schemas/propertySchema';
import Input from 'components/forms/Input';
import { useCurrentRole } from 'hooks/useUser';
import Textarea from '../forms/Textarea';
import InputFormat from '../forms/InputFormat';
import Select from '../forms/Select';
import { dataToOptions, getError, statusIsSuccessful } from '@/utils/helpers';
import {
  generateDefaultMilestones,
  generateMilestoneDueDates,
  getLastMilestoneDueDate,
  getTotalMilestoneDuration,
} from '@/utils/milestone-helper';
import { BASE_API_URL, MILESTONE_STATUS } from '@/utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from '@/utils/localStorage';
import { refreshQuery, setQueryCache } from '@/hooks/useQuery';
import Humanize from 'humanize-plus';
import { getLongDate, getTinyDate } from '@/utils/date-helpers';
import { Spacing } from '../common/Helpers';
import { Briefcase } from 'iconsax-react';
import { TiDelete } from 'react-icons/ti';
import { FaCircle, FaCircleNotch, FaClock } from 'react-icons/fa';
import { SuccessIcon, UploadIcon, WarningIcon } from '../utils/Icons';
import {
  AddPropertyUpdateMedia,
  GenerateMilestonePropertyUpdates,
} from './PropertyUpdate';
import { RiLoader2Line } from 'react-icons/ri';
import { AiOutlineStop } from 'react-icons/ai';

export const storeMilestone = (
  updatedMilestonesCopy,
  property,
  setProperty,
  setToast
) => {
  const propertyId = property?._id;
  const milestonePayment = generateMilestoneDueDates(
    updatedMilestonesCopy,
    property?.projectStartDate
  );

  Axios({
    method: 'put',
    url: `${BASE_API_URL}/property/update`,
    data: {
      id: propertyId,
      milestonePayment,
    },
    headers: { Authorization: getTokenFromStore() },
  })
    .then(function (response) {
      const { status, data } = response;
      if (statusIsSuccessful(status)) {
        setQueryCache(['property', propertyId], {
          property: data.property,
        });
        setToast({
          type: 'success',
          message: 'Your milestone has been successfully updated',
        });
        setProperty(data.property);
        refreshQuery('property');
      }
    })
    .catch(function (error) {
      setToast({
        message: getError(error),
      });
    });
};

export const MilestonePaymentForm = ({
  hideForm,
  setToast,
  setProperty,
  property,
  milestone,
}) => {
  // Deep copy of milestones to avoid mutating the original data
  const updatedMilestones = JSON.parse(
    JSON.stringify(property?.milestonePayment || [])
  );

  const handleUpdateMilestone = (values) => {
    let currentMilestone = milestone;
    let updatedMilestonesCopy = [...updatedMilestones];

    if (values?.addAfter) {
      const addAfterItem = values.addAfter;
      delete values?.addAfter;
      const newMilestoneId = values.title.toLowerCase().replace(' ', '-');
      const insertAfterIndex = updatedMilestonesCopy.findIndex(
        (item) => item.key === addAfterItem
      );

      if (insertAfterIndex !== -1) {
        updatedMilestonesCopy.splice(insertAfterIndex + 1, 0, {
          ...values,
          key: newMilestoneId,
          editable: true,
        });
        currentMilestone = { ...values, key: newMilestoneId };
      } else {
        setToast({
          type: 'error',
          message: 'Invalid position selected for the new milestone.',
        });
        return;
      }
    }

    // Find the index of the milestone to be updated
    const index = updatedMilestonesCopy.findIndex(
      (item) => item.key === currentMilestone.key
    );

    if (index !== -1) {
      const difference = values.percentage - currentMilestone.percentage;
      const totalPercentage = updatedMilestonesCopy
        .slice(1) // Exclude the first milestone
        .reduce((sum, item) => sum + Number(item.percentage), 0);

      if (totalPercentage + difference <= 90) {
        // Total percentage (excluding the first milestone) plus difference is less than or equal to 90%
        updatedMilestonesCopy[index] = {
          ...updatedMilestonesCopy[index],
          ...values,
        };
      } else {
        // Calculate the maximum percentage value for the update
        const maxPercentage =
          90 - totalPercentage + Number(currentMilestone.percentage);

        setToast({
          type: 'error',
          message: `The maximum percentage you can set for ${currentMilestone.title} is ${maxPercentage}%.`,
        });
        return;
      }

      // Ensure that the sum is always 100%
      const sumExcludingFirst = updatedMilestonesCopy
        .slice(1)
        .reduce((sum, item) => sum + Number(item.percentage), 0);
      updatedMilestonesCopy[0].percentage = (
        100 - sumExcludingFirst
      ).toString();

      storeMilestone(updatedMilestonesCopy, property, setProperty, setToast);
      hideForm();
      setToast({
        type: 'success',
        message: 'Your milestone has been successfully updated',
      });
    }
  };

  const currentSchema = !milestone?.key
    ? addMilestoneSchema
    : updateMilestoneSchema;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(currentSchema, {
        duration: 3,
        ...milestone,
      })}
      onSubmit={(values, actions) => handleUpdateMilestone(values)}
      validationSchema={createSchema(currentSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <section className="row">
            <div className="col-md-10 px-4">
              <Input label="Title" name="title" placeholder="Title" />
              {milestone?.key !== 'initiation' && (
                <InputFormat
                  label="Percentage"
                  formGroupClassName="mb-4"
                  suffix="%"
                  prefix=""
                  name="percentage"
                />
              )}

              <InputFormat
                label="Duration (In Months)"
                formGroupClassName="mb-4"
                suffix=" months"
                prefix=""
                name="duration"
              />

              {!milestone?.key && (
                <Select
                  label="Place new milestone after"
                  name="addAfter"
                  options={dataToOptions(updatedMilestones, 'title', 'key')}
                  placeholder="Select Entity Type"
                />
              )}

              <Textarea label="Description" name="description" />
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                {milestone?.key ? 'Update' : 'Add'} Milestone
              </Button>
              <DisplayFormikState {...props} showAll />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export const AddMilestoneButton = ({ setToast, setProperty, property }) => {
  const [showAddMilestonesModal, setShowAddMilestonesModal] =
    React.useState(false);
  return (
    <>
      <span
        className="btn btn-secondary btn-sm btn-wide"
        onClick={() => setShowAddMilestonesModal(true)}
      >
        Add Milestone
      </span>
      <Modal
        title="Milestone"
        show={showAddMilestonesModal}
        onHide={() => setShowAddMilestonesModal(false)}
        showFooter={false}
        size="lg"
      >
        <MilestonePaymentForm
          hideForm={() => setShowAddMilestonesModal(false)}
          setToast={setToast}
          setProperty={setProperty}
          property={property}
        />
      </Modal>
    </>
  );
};

export const ResetMilestoneButton = ({ setToast, setProperty, property }) => {
  const [showResetMilestonesModal, setShowResetMilestonesModal] =
    React.useState(false);
  return (
    <>
      <span
        className="btn btn-info btn-sm btn-wide"
        onClick={() => setShowResetMilestonesModal(true)}
      >
        Reset
      </span>
      {/* Reset Milestone Modal */}
      <Modal
        title="Reset Milestone"
        show={showResetMilestonesModal}
        onHide={() => setShowResetMilestonesModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <p className="my-4 mx-3 confirmation-text fw-bold">
              Are you sure you want to reset this Milestone Payment to the
              default Milestone for {property.deliveryState}?
            </p>
            <Button
              className="btn btn-info mb-5"
              onClick={() => {
                storeMilestone(
                  generateDefaultMilestones(
                    property?.deliveryState,
                    property?.projectStartDate
                  ),
                  property,
                  setProperty,
                  setToast
                );
                setShowResetMilestonesModal(false);
              }}
            >
              Reset Milestone Payment
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const EditMilestoneButton = ({
  setToast,
  setProperty,
  property,
  currentMilestone,
}) => {
  const [showEditMilestoneModal, setShowEditMilestoneModal] = useState(false);
  return (
    <>
      <span
        className="btn btn-info-light btn-xs mt-3"
        onClick={() => {
          setShowEditMilestoneModal(true);
        }}
      >
        Edit Milestone
      </span>
      <Modal
        title="Edit Milestone"
        show={showEditMilestoneModal}
        onHide={() => setShowEditMilestoneModal(false)}
        showFooter={false}
      >
        <MilestonePaymentForm
          hideForm={() => setShowEditMilestoneModal(false)}
          property={property}
          setProperty={setProperty}
          setToast={setToast}
          milestone={currentMilestone}
        />
      </Modal>
    </>
  );
};

export const DeleteMilestoneButton = ({
  setToast,
  setProperty,
  property,
  currentMilestone,
}) => {
  const [showDeleteMilestoneModal, setShowDeleteMilestoneModal] =
    useState(false);

  const deleteMilestone = () => {
    if (currentMilestone) {
      const updatedMilestones = property?.milestonePayment;
      const index = updatedMilestones.findIndex(
        (item) => item.key === currentMilestone.key
      );

      if (index !== -1) {
        const deletedPercentage = Number(updatedMilestones[index].percentage);

        // Only add the percentage to the first milestone if it's not the first milestone itself.
        if (index !== 0) {
          updatedMilestones[0].percentage = (
            Number(updatedMilestones[0].percentage) + deletedPercentage
          ).toString();
        }

        updatedMilestones.splice(index, 1);
        storeMilestone(updatedMilestones, property, setProperty, setToast);
      }
    }
    setToast({
      type: 'success',
      message: `Your milestone has been successfully deleted`,
    });
    setShowDeleteMilestoneModal(false);
  };

  if (!currentMilestone?.editable) return null;
  return (
    <>
      <div className="position-relative">
        <div className="position-absolute end-0">
          <span
            className="cursor-pointer"
            onClick={() => {
              setShowDeleteMilestoneModal(true);
            }}
          >
            <TiDelete className="text-gray-light" size={32} />
          </span>
        </div>
      </div>
      <Modal
        title="Delete Milestone"
        show={showDeleteMilestoneModal}
        onHide={() => setShowDeleteMilestoneModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <h3>{currentMilestone?.title}</h3>
            <p className="my-4 confirmation-text fw-bold">
              Are you sure you want to delete this Milestone Payment?
            </p>
            <Button
              className="btn btn-secondary mb-5"
              onClick={deleteMilestone}
            >
              Delete Milestone Payment
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const AddOrResetMilestoneButtons = ({
  setToast,
  setProperty,
  property,
}) => {
  return (
    <div className="row">
      <div className="col-12">
        <>
          <AddMilestoneButton
            className="btn btn-secondary btn-xs btn-wide"
            property={property}
            setToast={setToast}
            setProperty={setProperty}
          />
          <Spacing />
          <ResetMilestoneButton
            className="btn btn-secondary btn-xs btn-wide"
            property={property}
            setToast={setToast}
            setProperty={setProperty}
          />
        </>
      </div>
    </div>
  );
};

export const MoveToNextMilestoneButton = ({
  setToast,
  setProperty,
  property,
  buttonText,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const moveToNextMilestoneStep = () => {
    setLoading(true);

    Axios.put(
      `${BASE_API_URL}/property/${property._id}/moveToNextMilestone`,
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

  // check if milestoneDetails.currentMilestone is the last milestone
  const currentMilestone = property?.milestoneDetails?.currentMilestone;
  const lastMilestone = property?.milestonePayment?.length - 1;
  const isLastMilestone = currentMilestone === lastMilestone;
  const propertyUpdate = property?.propertyUpdate?.[currentMilestone];
  const MINIMUM_PROPERTY_UPDATE = 2;
  const uploadedMedia = propertyUpdate?.media?.length || 0;
  const milestoneText = isLastMilestone
    ? 'Complete All Milestones'
    : 'Move to Next Milestone';
  const hasUploadedProjectUpdates = uploadedMedia >= MINIMUM_PROPERTY_UPDATE;

  return (
    <div className="row text-end">
      <div className="col-12">
        {hasUploadedProjectUpdates ? (
          <Button
            color="secondary"
            className="btn-sm btn-wide"
            onClick={() => setShowModal(true)}
          >
            {buttonText || milestoneText}
          </Button>
        ) : (
          <AddPropertyUpdateMedia
            property={property}
            setProperty={setProperty}
            setToast={setToast}
            propertyUpdate={propertyUpdate}
            setPropertyUpdate={() => {}}
            content={
              <div className="icon-lg text-gray-light text-link text-center">
                <UploadIcon />
              </div>
            }
          />
        )}
        <Modal
          title={milestoneText}
          show={showModal}
          onHide={() => setShowModal(false)}
          showFooter={false}
          size="md"
        >
          <section className="row">
            <div className="col-md-12 my-3 text-center">
              <p className="mx-3 confirmation-text fw-bold">
                {isLastMilestone
                  ? 'Are you sure you want to mark this as the final completed milestone?'
                  : 'Are you sure you want to mark the current milestone as completed and move to the next one?'}
              </p>
              <Button
                className="btn btn-secondary mb-5"
                onClick={moveToNextMilestoneStep}
                loading={loading}
              >
                {buttonText || milestoneText}
              </Button>
            </div>
          </section>
        </Modal>
      </div>
    </div>
  );
};

export const MilestoneInformation = ({ userIsVendor, property }) => {
  const { milestoneDetails, milestonePayment: milestones } = property;

  const totalMilestoneDuration = getTotalMilestoneDuration(milestones);
  const lastMilestoneDate = getLastMilestoneDueDate(milestones);

  return (
    <div className="fw-bold me-3 mb-3">
      {userIsVendor ? (
        <>
          {milestoneDetails?.status === MILESTONE_STATUS.IN_PROGRESS && (
            <>
              <span className="text-primary">
                <FaClock className="me-1" /> Remaining Timeline:{' '}
              </span>
              <span className="text-muted">
                {getSumOfRemainingMonths(milestones)} months (due on{' '}
                {lastMilestoneDate})
              </span>
            </>
          )}
          {milestoneDetails?.status === MILESTONE_STATUS.PENDING && (
            <>
              <span className="text-primary">
                <FaClock className="me-1" /> Total Timeline:{' '}
              </span>
              <span className="text-muted">
                {totalMilestoneDuration} months (due on {lastMilestoneDate})
              </span>
            </>
          )}
          {milestoneDetails?.status === MILESTONE_STATUS.COMPLETED && (
            <>
              <span className="text-primary">Completed on </span>
              <span className="text-success-darker">
                {getLongDate(milestoneDetails?.currentMilestoneUpdated)}
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <span className="text-primary">
            <FaClock className="me-1" /> Delivery Date:{' '}
          </span>
          <span className="text-secondary">{lastMilestoneDate}</span>
        </>
      )}
    </div>
  );
};

export const MilestoneNextStep = ({ userIsVendor, property }) => {
  return (
    <div className="alert state-alert" role="alert">
      <strong>Next Steps</strong>
      <ol>
        <li>
          Click on the <strong>Add Milestone</strong> or{' '}
          <strong>Edit Milestone</strong> to manage Milestone
        </li>
        <li>
          When ready, click on the <strong>Generate Property Update</strong> to
          start adding updates to your Milestone
        </li>
      </ol>
    </div>
  );
};

const MilestoneContent = ({
  setToast,
  setProperty,
  property,
  currentMilestone: milestone,
  userIsVendor,
  index,
}) => {
  const milestoneDetails = property?.milestoneDetails;
  const milestoneHasStarted =
    milestoneDetails?.status !== MILESTONE_STATUS.PENDING;

  const statusClassName =
    index === milestoneDetails?.currentMilestone
      ? 'in-progress'
      : milestone?.completed
      ? 'completed'
      : 'pending';

  return (
    <section className={`milestone-content ${statusClassName}`}>
      {!milestoneHasStarted && (
        <DeleteMilestoneButton
          property={property}
          setProperty={setProperty}
          setToast={setToast}
          currentMilestone={milestone}
        />
      )}
      <div className="container">
        <div className="row">
          <div className="col-xl-2 d-flex align-items-center">
            <div className="mb-4 fw-bold text-primary-lighter text-uppercase">
              Milestone {index + 1}:
            </div>
          </div>
          <div className="col-xl-6 d-flex align-items-center">
            <div className="mb-4 mb-xl-0">
              <h4 className="text-white">
                {milestone.title} - {milestone.percentage}%
              </h4>
              <div className="fw-normal mb-2 text-md text-gray-light">
                Timeline: {milestone.duration}{' '}
                {Humanize.pluralize(milestone.duration, 'month')} (due on{' '}
                {getTinyDate(milestone.dueDate)})
              </div>
              <TruncatedDescription
                description={milestone.description}
                maxLength={60}
              />

              {userIsVendor && !milestoneHasStarted && (
                <EditMilestoneButton
                  property={property}
                  setProperty={setProperty}
                  setToast={setToast}
                  currentMilestone={milestone}
                />
              )}

              <div className="help-text text-md text-muted pt-3">
                Milestone was completed on 23rd June, 2023
              </div>
            </div>
          </div>
          <div className="col-xl-4 d-flex align-items-center justify-content-end">
            {milestoneHasStarted && (
              <>
                {index === milestoneDetails?.currentMilestone ? (
                  userIsVendor ? (
                    <MoveToNextMilestoneButton
                      property={property}
                      setToast={setToast}
                      setProperty={setProperty}
                      buttonText="Mark as Completed"
                    />
                  ) : (
                    <span className="text-primary-lighter icon-lg">
                      <RiLoader2Line />
                    </span>
                  )
                ) : milestone?.completed ? (
                  <>
                    <span className="text-success-light icon-lg">
                      <SuccessIcon />
                    </span>
                  </>
                ) : (
                  <span className="text-gray-light icon-lg">
                    <AiOutlineStop />
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const MilestonePaymentList = ({
  property,
  setProperty,
  setToast,
  isPublicPage,
}) => {
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const isVendor = useCurrentRole().isVendor;
  const userIsVendor = !isPublicPage && isVendor;
  const milestones = property?.milestonePayment || [];
  const milestoneDetails = property?.milestoneDetails || {};
  const milestoneHasStarted =
    milestoneDetails?.status !== MILESTONE_STATUS.PENDING;
  const milestoneIsPending =
    milestoneDetails?.status === MILESTONE_STATUS.PENDING;
  const handleToggleMilestonesView = () => {
    setShowAllMilestones((prevShowAllMilestones) => !prevShowAllMilestones);
  };
  const currentMilestone = milestones[milestoneDetails?.currentMilestone || 0];

  return (
    <>
      <div className="property__milestone-payments mt-5">
        <div className="mb-3 d-flex flex-column flex-xl-row align-items-start  justify-content-between">
          <div>
            <h4 className="header-content my-2">Milestone Payments</h4>
            <MilestoneInformation
              property={property}
              userIsVendor={userIsVendor}
            />
          </div>
          {milestoneHasStarted && (
            <Button
              className="btn-wide btn-sm"
              color="purple-light"
              onClick={handleToggleMilestonesView}
            >
              {showAllMilestones
                ? 'Show Current Milestone'
                : 'Show All Milestones'}
            </Button>
          )}
          {userIsVendor && !milestoneHasStarted && (
            <AddOrResetMilestoneButtons
              property={property}
              setProperty={setProperty}
              setToast={setToast}
            />
          )}
        </div>

        {milestoneIsPending || showAllMilestones ? (
          milestones?.map((milestone, index) => (
            <MilestoneContent
              currentMilestone={milestone}
              index={index}
              key={index}
              property={property}
              setProperty={setProperty}
              setToast={setToast}
              userIsVendor={userIsVendor}
            />
          ))
        ) : (
          <>
            <MilestoneContent
              currentMilestone={currentMilestone}
              index={milestoneDetails?.currentMilestone}
              property={property}
              setProperty={setProperty}
              userIsVendor={userIsVendor}
              setToast={setToast}
            />
          </>
        )}

        <MilestoneProgress property={property} />
      </div>

      {/* <MilestoneNextStep property={property} userIsVendor={userIsVendor} /> */}
      <GenerateMilestonePropertyUpdates
        className="btn btn-success btn-xs btn-wide"
        property={property}
        setToast={setToast}
        setProperty={setProperty}
      />
    </>
  );
};

export const MilestoneProgress = ({ milestonePayment, milestoneDetails }) => {
  const milestones = milestonePayment;

  const currentStage =
    milestones?.[milestoneDetails?.currentMilestone]?.title || 'Not Started';
  const percentage = milestoneDetails?.currentMilestonePercentage || 0;
  const completedAllSteps = percentage === 100;
  const notStarted = percentage === 0;
  if (notStarted) {
    return null;
  }
  return (
    <div className="row">
      <div className="col-sm-12 my-4">
        <div className="text-md mb-2">
          <span className={'text-primary'}>
            {completedAllSteps
              ? 'Completed All Milestones'
              : `Current Stage: ${currentStage}`}
          </span>
          <span className="float-end">{`${percentage}%`}</span>
        </div>
        <ProgressBar
          variant={completedAllSteps ? 'success' : 'secondary'}
          now={percentage}
          style={{
            height: '10px',
          }}
          srOnly
        />
      </div>
    </div>
  );
};

const getSumOfRemainingMonths = (milestones) => {
  return Object.values(milestones).reduce((sum, milestone) => {
    if (!milestone.completed) {
      return sum + (milestone.duration || 0);
    }
    return sum;
  }, 0);
};

export const TruncatedDescription = ({
  description,
  maxLength = 600,
  className = 'text-white',
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const shouldTruncate = description.length > maxLength;
  const truncatedText = shouldTruncate
    ? description.slice(0, maxLength) + '...'
    : description;

  return (
    <>
      <div className="position-relative">
        {showFullDescription ? (
          <>{description}</>
        ) : (
          <>
            {truncatedText}
            {shouldTruncate && (
              <>
                <span
                  className={`show-more-button ${className}`}
                  onClick={() => setShowFullDescription(true)}
                >
                  Show All
                </span>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
