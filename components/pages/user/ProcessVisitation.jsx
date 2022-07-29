import React from 'react';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { getTokenFromStore } from 'utils/localStorage';
import {
  scheduleTourSchema,
  updateScheduleTourSchema,
  cancelScheduleTourSchema,
} from 'components/forms/schemas/propertySchema';
import DatePicker from 'components/forms/DatePicker';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Textarea from 'components/forms/Textarea';

export const ScheduleVisitForm = ({ propertyId, hideForm, setToast }) => {
  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          initialValues={setInitialValues(scheduleTourSchema)}
          onSubmit={(values, actions) => {
            const payload = {
              propertyId,
              ...values,
              visitDate: values.visitDate.date || values.visitDate,
            };

            Axios.post(`${BASE_API_URL}/visitation/schedule`, payload, {
              headers: { Authorization: getTokenFromStore() },
            })
              .then(function (response) {
                const { status } = response;
                if (status === 201) {
                  setToast({
                    type: 'success',
                    message: `Your visitation has been scheduled. We will contact you within 24 hours).`,
                  });
                  hideForm();
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
          validationSchema={createSchema(scheduleTourSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <Input
                isValidMessage="Name looks good"
                label="Name"
                name="visitorName"
                placeholder="Name"
              />
              <Input
                isValidMessage="Email address seems valid"
                label="Email"
                name="visitorEmail"
                placeholder="Email Address"
              />
              <Input
                isValidMessage="Phone number looks good"
                label="Phone"
                name="visitorPhone"
                placeholder="Phone"
              />

              <DatePicker
                label="Visitation Date"
                name="visitDate"
                minDate={new Date()}
                placeholder="Visit Date"
              />
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Schedule
              </Button>
              <DisplayFormikState {...props} showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export const RescheduleVisitForm = ({ visitationInfo, hideForm, setToast }) => {
  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          initialValues={setInitialValues(updateScheduleTourSchema, {
            visitDate: { date: visitationInfo.visitDate },
          })}
          onSubmit={(values, actions) => {
            const payload = {
              visitationId: visitationInfo._id,
              visitDate: values.visitDate.date || values.visitDate,
              reason: values.reason,
            };

            Axios.put(`${BASE_API_URL}/visitation/reschedule`, payload, {
              headers: { Authorization: getTokenFromStore() },
            })
              .then(function (response) {
                const { status } = response;
                if (statusIsSuccessful(status)) {
                  setToast({
                    type: 'success',
                    message: `Your visitation has been successfully rescheduled.`,
                  });
                  hideForm();
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
          validationSchema={createSchema(updateScheduleTourSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <DatePicker
                label="Visitation Date"
                name="visitDate"
                minDate={new Date()}
                placeholder="Visit Date"
              />
              <Textarea label="Reason" name="reason" />
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                ReSchedule
              </Button>
              <DisplayFormikState {...props} showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export const CancelVisitForm = ({ visitationInfo, hideForm, setToast }) => {
  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          initialValues={setInitialValues(cancelScheduleTourSchema)}
          onSubmit={(values, actions) => {
            const payload = {
              visitationId: visitationInfo._id,
              reason: values.reason,
            };

            Axios.put(`${BASE_API_URL}/visitation/cancel`, payload, {
              headers: { Authorization: getTokenFromStore() },
            })
              .then(function (response) {
                const { status } = response;
                if (statusIsSuccessful(status)) {
                  setToast({
                    type: 'success',
                    message: `Your visitation has been successfully cancelled.`,
                  });
                  hideForm();
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
          validationSchema={createSchema(cancelScheduleTourSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => (
            <Form>
              <Textarea label="Reason" name="reason" />
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Cancel Visitation
              </Button>
              <DisplayFormikState {...props} showAll />
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};
