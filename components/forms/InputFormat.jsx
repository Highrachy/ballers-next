import React from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { connect } from 'formik';
import classNames from 'classnames';
import {
  getValidityClass,
  FeedbackMessage,
  feedback,
} from 'components/forms/form-helper';
import Label from './Label';
import NumberFormat from 'react-number-format';

// https://www.npmjs.com/package/react-number-format
const InputFormat = ({
  autoComplete,
  formGroupClassName,
  formik,
  helpText,
  inline,
  inputClassName,
  inputSizeClassName,
  isValidMessage,
  label,
  labelLink,
  labelClassName,
  name,
  nairaFormat,
  optional,
  placeholder,
  prefix,
  suffix,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  type,
  ...props
}) => {
  return (
    <div
      className={classNames(formGroupClassName, {
        row: inline,
      })}
    >
      <Label
        className={labelClassName}
        labelLink={labelLink}
        name={name}
        optional={optional}
        text={label}
        tooltipPosition={tooltipPosition}
        tooltipText={tooltipText}
      />
      <div className={inputSizeClassName}>
        <Field name={name}>
          {({ field, form }) => {
            // we are using array for range,
            // we want to ensure that the array value is not used
            const value = Array.isArray(getIn(formik.values, name))
              ? 0
              : getIn(formik.values, name);
            return (
              <NumberFormat
                {...props}
                className={classNames(
                  'form-control',
                  inputClassName,
                  getValidityClass(formik, name, showFeedback)
                )}
                id={name}
                name={name}
                onBlur={field.onBlur}
                onValueChange={(number) =>
                  form.setFieldValue(name, number.value)
                }
                prefix={prefix}
                suffix={suffix}
                thousandSeparator={true}
                placeholder={placeholder || label}
                value={value}
              />
            );
          }}
        </Field>
      </div>
      <FeedbackMessage
        formik={formik}
        helpText={helpText}
        name={name}
        showFeedback={showFeedback}
        validMessage={isValidMessage}
      />
    </div>
  );
};

// NB: Wrap multiple fields in .form-row and give formGroupClassname the size e.g form-group col-md-6

InputFormat.defaultProps = {
  autoComplete: 'off',
  formGroupClassName: 'form-group mb-4',
  helpText: null,
  inline: false,
  inputClassName: null,
  inputSizeClassName: null,
  isValidMessage: '',
  label: null,
  labelClassName: null,
  labelLink: null,
  optional: false,
  placeholder: null,
  prefix: '₦ ',
  suffix: '',
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipText: null,
  tooltipPosition: 'right',
  type: null,
};

InputFormat.propTypes = {
  autoComplete: PropTypes.string,
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  inline: PropTypes.bool,
  inputClassName: PropTypes.string,
  inputSizeClassName: PropTypes.number,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelLink: PropTypes.shape({
    to: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
  }),
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
  type: PropTypes.string,
};

export default connect(InputFormat);
