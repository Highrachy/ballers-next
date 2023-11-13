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
import { Accordion } from 'react-bootstrap';
import { ContextAwareToggle } from 'components/common/FAQsAccordion';
import { useCurrentRole } from 'hooks/useUser';
import Textarea from '../forms/Textarea';
import InputFormat from '../forms/InputFormat';
import store from 'store2';
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

export const MilestonePayment = ({
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

export const AddOrResetMilestone = ({
  className,
  setToast,
  setProperty,
  property,
}) => {
  const [showAddMilestonesModal, setShowAddMilestonesModal] =
    React.useState(false);
  const [showResetMilestonesModal, setShowResetMilestonesModal] =
    React.useState(false);
  return (
    <>
      <span
        className="btn btn-secondary btn-xs btn-wide"
        onClick={() => setShowAddMilestonesModal(true)}
      >
        Add Milestone
      </span>
      &nbsp;&nbsp;
      <span
        className="btn btn-info btn-xs btn-wide"
        onClick={() => setShowResetMilestonesModal(true)}
      >
        Reset Milestone
      </span>
      <Modal
        title="Milestone"
        show={showAddMilestonesModal}
        onHide={() => setShowAddMilestonesModal(false)}
        showFooter={false}
        size="lg"
      >
        <MilestonePayment
          hideForm={() => setShowAddMilestonesModal(false)}
          setToast={setToast}
          setProperty={setProperty}
          property={property}
        />
      </Modal>
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

export const MoveToNextMilestone = ({ setToast, setProperty, property }) => {
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
  const milestoneText = isLastMilestone
    ? 'Complete All Milestones'
    : 'Move to Next Milestone';

  return (
    <>
      <Button
        className="btn btn-secondary btn-sm btn-wide"
        onClick={() => setShowModal(true)}
      >
        {milestoneText}
      </Button>
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
              {milestoneText}
            </Button>
          </div>
        </section>
      </Modal>
    </>
  );
};

export const MilestonePaymentList = ({ property, setProperty, setToast }) => {
  const [showEditMilestoneModal, setShowEditMilestoneModal] = useState(false);
  const [showDeleteMilestoneModal, setShowDeleteMilestoneModal] =
    useState(false);

  const [milestone, setMilestone] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteMilestone = () => {
    if (milestone) {
      const updatedMilestones = property?.milestonePayment;
      const index = updatedMilestones.findIndex(
        (item) => item.key === milestone.key
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

  const userIsVendor = useCurrentRole().isVendor;
  const milestones = property?.milestonePayment;
  const milestoneDetails = property?.milestoneDetails;
  const totalMilestoneDuration = getTotalMilestoneDuration(milestones);
  const lastMilestoneDate = getLastMilestoneDueDate(milestones);
  const milestoneHasStarted =
    milestoneDetails?.status !== MILESTONE_STATUS.PENDING;

  return (
    <>
      <div className="property__milestone-payments">
        <h4 className="header-content">Milestone Payments</h4>

        <Accordion>
          {milestones?.map((milestone, index) => (
            <Card key={index + 1}>
              <Card.Header>
                <ContextAwareToggle eventKey={index + 1}>
                  <strong className="fw-semibold">
                    Milestone {index + 1} :
                  </strong>{' '}
                  {milestone.title} - {milestone.percentage}%
                  <Spacing />
                  {milestoneHasStarted && (
                    <small className="fw-normal text-soft">
                      {index === milestoneDetails?.currentMilestone
                        ? '(In Progress)'
                        : milestone?.completed
                        ? '(Completed)'
                        : '(Not Started)'}
                    </small>
                  )}
                </ContextAwareToggle>
              </Card.Header>
              <Accordion.Collapse eventKey={index + 1}>
                <>
                  <Card.Body>
                    <div className="mt-n4">
                      {milestone.description}

                      <div className="fw-normal mt-2 text-md text-muted">
                        <span className="me-3">
                          Duration: {milestone.duration}{' '}
                          {Humanize.pluralize(milestone.duration, 'month')}
                        </span>{' '}
                        |
                        <span className="mx-3">
                          Due Date: {getTinyDate(milestone.dueDate)}
                        </span>
                        |
                        <span className="mx-3">
                          Completed: {milestone?.completed ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </Card.Body>

                  {userIsVendor && !milestoneHasStarted && (
                    <div className="mt-2 ms-3 mb-4 text-muted">
                      <span
                        className="btn btn-dark btn-xs me-2"
                        onClick={() => {
                          setMilestone({ ...milestone });
                          setShowEditMilestoneModal(true);
                        }}
                      >
                        Edit Milestone
                      </span>
                      {milestone.editable && (
                        <span
                          className="btn btn-xs btn-danger-light"
                          onClick={() => {
                            setMilestone({ ...milestone });
                            setShowDeleteMilestoneModal(true);
                          }}
                        >
                          Remove Milestone
                        </span>
                      )}
                    </div>
                  )}
                </>
              </Accordion.Collapse>
            </Card>
          ))}
          {/* Edit Milestone Modal */}
          <Modal
            title="Edit Milestone"
            show={showEditMilestoneModal}
            onHide={() => setShowEditMilestoneModal(false)}
            showFooter={false}
          >
            <MilestonePayment
              hideForm={() => setShowEditMilestoneModal(false)}
              property={property}
              setProperty={setProperty}
              setToast={setToast}
              milestone={milestone}
            />
          </Modal>

          {/* Delete Milestone Modal */}
          <Modal
            title="Delete Milestone"
            show={showDeleteMilestoneModal}
            onHide={() => setShowDeleteMilestoneModal(false)}
            showFooter={false}
          >
            <section className="row">
              <div className="col-md-12 my-3 text-center">
                <h3>{milestone?.title}</h3>
                <p className="my-4 confirmation-text fw-bold">
                  Are you sure you want to delete this Milestone Payment?
                </p>
                <Button
                  loading={loading}
                  className="btn btn-secondary mb-5"
                  onClick={deleteMilestone}
                >
                  Delete Milestone Payment
                </Button>
              </div>
            </section>
          </Modal>
        </Accordion>
        <MilestoneProgress
          currentStage={
            milestones?.[milestoneDetails?.currentMilestone]?.title ||
            'Not Started'
          }
          percentage={milestoneDetails?.currentMilestonePercentage || 0}
        />
        <div className="fw-bold me-3 mb-3">
          {userIsVendor ? (
            <>
              {milestoneDetails?.status === MILESTONE_STATUS.IN_PROGRESS && (
                <>
                  <span className="text-primary">Remaining Duration: </span>
                  <span className="text-muted">
                    {getSumOfRemainingMonths(milestones)} months (due on{' '}
                    {lastMilestoneDate})
                  </span>
                </>
              )}
              {milestoneDetails?.status === MILESTONE_STATUS.PENDING && (
                <>
                  <span className="text-primary">
                    Total Milestone Duration:{' '}
                  </span>
                  <span className="text-muted">
                    {totalMilestoneDuration} months (due on {lastMilestoneDate})
                  </span>
                </>
              )}
              {milestoneDetails?.status === MILESTONE_STATUS.COMPLETED && (
                <>
                  <span className="text-primary">Milestone Completed on </span>
                  <span className="text-success-darker">
                    {getLongDate(milestoneDetails?.currentMilestoneUpdated)}
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="text-primary">Delivery Date: </span>
              <span className="text-secondary">{lastMilestoneDate}</span>
            </>
          )}
        </div>
      </div>

      {userIsVendor && (
        <div className="row mt-3">
          <div className="col-12">
            {!milestoneHasStarted && (
              <AddOrResetMilestone
                className="btn btn-secondary btn-xs btn-wide"
                property={property}
                setToast={setToast}
                setProperty={setProperty}
              />
            )}
            {property?.milestoneDetails?.status ===
              MILESTONE_STATUS.IN_PROGRESS && (
              <MoveToNextMilestone
                property={property}
                setToast={setToast}
                setProperty={setProperty}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const MilestoneProgress = ({ currentStage, percentage }) => {
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
