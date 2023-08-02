import React from 'react';
import PropTypes from 'prop-types';
import { getIn, useFormikContext } from 'formik';
import { getRange, isDevEnvironment } from 'utils/helpers';

const validityOptions = {
  valid: 'is-valid',
  invalid: 'is-invalid',
};

const feebackOptions = {
  valid: 'valid-feedback',
  invalid: 'invalid-feedback',
};

const showErrors = ({ showFeedback, formik }) => {
  return (
    formik.submitCount > 0 || // Errors should be shown if form is submitted
    showFeedback === feedback.ALL ||
    showFeedback === feedback.ERROR
  );
};

const showSuccess = ({ showFeedback, formik }) => {
  return showFeedback === feedback.ALL || showFeedback === feedback.SUCCESS;
};

export const feedback = {
  ALL: 'ALL',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  NONE: 'NONE',
};

export const getValidityClass = (
  formik,
  name,
  showFeedback,
  options = validityOptions
) => {
  const error = getIn(formik.errors, name);
  const touch = getIn(formik.touched, name);
  if (!!touch && !!error && showErrors({ formik, showFeedback })) {
    // mark as invalid
    return options.invalid;
  } else if (!!touch && !error && showSuccess({ showFeedback, formik })) {
    // mark as valid
    return options.valid;
  }
  return; //not touched
};

export const FeedbackMessage = ({
  helpText,
  name,
  showFeedback,
  validMessage,
}) => {
  const formik = useFormikContext();
  const className = getValidityClass(
    formik,
    name,
    showFeedback,
    feebackOptions
  );
  const message = getIn(formik.errors, name) || validMessage;
  return className && message ? (
    <div className={className}>
      {typeof message === 'object' ? message.date : message}
    </div>
  ) : (
    helpText && <HelpText name={name} text={helpText} />
  );
};

FeedbackMessage.propTypes = {
  helpText: PropTypes.string,
  name: PropTypes.string.isRequired,
  showFeedback: PropTypes.string.isRequired,
  validMessage: PropTypes.string,
};

FeedbackMessage.defaultProps = {
  helpText: null,
  validMessage: null,
};

export const HelpText = ({ name, text }) => (
  <small className="form-text text-muted" id={`${name}-help-block`}>
    {text}
  </small>
);

HelpText.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export const DisplayFormikState = (props) => {
  const displayFormikValues = (
    <div className="formik-values">
      <div className="container">
        <div className="col-md-9">
          <pre className="form-control text-small p-3">
            {props.showAll ? (
              <>
                <strong>props</strong> = {JSON.stringify(props, null, 2)}
              </>
            ) : (
              JSON.stringify(props.values, null, 2)
            )}
          </pre>
        </div>
      </div>
    </div>
  );
  if (!isDevEnvironment()) return null;
  return !props.hide && displayFormikValues;
};

DisplayFormikState.propTypes = {
  hide: PropTypes.bool,
  showAll: PropTypes.bool,
  values: PropTypes.object.isRequired,
};

DisplayFormikState.defaultProps = {
  showAll: false,
  hide: false,
};

export const setInitialValues = (
  schema,
  initialValues = {},
  keepInitial = false
) => {
  const values = {};
  Object.keys(schema).forEach((key) => {
    if (initialValues?.[key] || initialValues?.[key] === 0) {
      values[key] = initialValues[key];
    } else {
      values[key] =
        initialValues?.[key] !== undefined ? initialValues?.[key] : '';
    }
  });
  return values;
};

export const processFilterValues = (initialValues, exclude = ['range']) => {
  const values = {};
  Object.keys(initialValues).forEach((key) => {
    if (initialValues[key] && !exclude.includes(key)) {
      values[key] = getRange(initialValues[key]);
    }
  });
  return values;
};
