import React from 'react';
import { Formik, Form } from 'formik';
import { isDevEnvironment } from '@/utils/helpers';
import Button from './Button';
import { DisplayFormikState, setInitialValues } from './form-helper';
import { createSchema } from './schemas/schema-helpers';
import { Persist } from 'formik-persist';

const FormikForm = ({
  buttonText,
  buttonColor,
  children,
  initialValues,
  handleSubmit,
  name,
  schema,
  showFormikState,
  persistForm,
  showAllFormikState,
  useSubmitButton,
}) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(schema, initialValues)}
      onSubmit={handleSubmit}
      validationSchema={createSchema(schema)}
    >
      {({ isSubmitting, handleSubmit: submitForm, ...props }) => (
        <Form>
          {children}

          {useSubmitButton && (
            <Button
              color={buttonColor}
              loading={isSubmitting}
              onClick={submitForm}
            >
              {buttonText}
            </Button>
          )}

          {persistForm && <Persist name={name} />}
          {isDevEnvironment() && (showFormikState || showAllFormikState) && (
            <DisplayFormikState {...props} showAll={showAllFormikState} />
          )}
        </Form>
      )}
    </Formik>
  );
};

FormikForm.defaultProps = {
  buttonText: 'Submit',
  buttonColor: 'danger',
  initialValues: {},
  useSubmitButton: false,
};

export default FormikForm;
