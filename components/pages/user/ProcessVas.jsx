import React from 'react';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { getTokenFromStore } from 'utils/localStorage';
import { vasRequestSchema } from 'components/forms/schemas/vasSchema';
import {
  dataToOptions,
  getError,
  manualWait,
  moneyFormatInNaira,
  statusIsSuccessful,
} from 'utils/helpers';
import Select from 'components/forms/Select';
import { refreshQuery } from 'hooks/useQuery';
import { useCurrentRole } from 'hooks/useUser';
import { navigate } from '@reach/router';

export const ProcessVasForm = ({ hideForm, setToast, vasInfo, propertyId }) => {
  const userType = useCurrentRole().name;
  return (
    <section className="row">
      <div className="col-md-10">
        <Formik
          initialValues={setInitialValues(vasRequestSchema)}
          onSubmit={({ vasId }, actions) => {
            const payload = {
              vasId,
              propertyId,
            };

            Axios.post(`${BASE_API_URL}/vas/request`, payload, {
              headers: { Authorization: getTokenFromStore() },
            })
              .then(function (response) {
                const { status } = response;
                if (statusIsSuccessful(status)) {
                  setToast({
                    type: 'success',
                    message: `Your Service has been successfully requested.`,
                  });
                  hideForm();
                  refreshQuery('vasRequest', true);
                  actions.setSubmitting(false);
                  actions.resetForm();
                  manualWait(() => navigate(`/${userType}/service`), 1000);
                }
              })
              .catch(function (error) {
                setToast({
                  message: getError(error),
                });
                actions.setSubmitting(false);
              });
          }}
          validationSchema={createSchema(vasRequestSchema)}
        >
          {({ isSubmitting, handleSubmit, ...props }) => {
            const { values } = props;

            const currentVas = vasInfo.find(({ _id }) => values.vasId === _id);

            return (
              <Form>
                <Select
                  label="Select Service"
                  name="vasId"
                  options={dataToOptions(vasInfo, 'name')}
                />

                {currentVas && (
                  <>
                    <h3 className="header-smaller">{currentVas?.name}</h3>
                    <h5 className="text-secondary">
                      {moneyFormatInNaira(currentVas?.price)}
                    </h5>
                    <p>{currentVas.description}</p>
                  </>
                )}
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Proceed
                </Button>
                <DisplayFormikState {...props} showAll />
              </Form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};
