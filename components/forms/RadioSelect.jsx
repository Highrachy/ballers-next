import React from 'react';
import PropTypes from 'prop-types';
import { connect, Field, getIn } from 'formik';
import classNames from 'classnames';
import { FeedbackMessage, feedback } from 'components/forms/form-helper';
import Humanize from 'humanize-plus';
import { dashedLowerCase } from 'utils/helpers';
import Label from './Label';

const genId = (name, value) => `${name}-${value}`.replace(/\./g, '-');

const Radio = ({
  checked,
  custom,
  formGroupLabelClassName,
  inline,
  inputClassName,
  name,
  label,
  value,
}) => {
  const radioId = genId(name, value);
  return (
    <div
      className={classNames(
        { 'form-check': !inline && !custom },
        { 'form-check-inline': inline && !custom },
        { 'custom-control custom-radio': custom },
        { ' custom-control-inline': inline && custom }
      )}
    >
      <Field
        checked={checked}
        className={classNames(
          inputClassName,
          {
            'form-check-input': !custom,
          },
          {
            'custom-control-input': custom,
          }
        )}
        id={radioId}
        name={name}
        type="radio"
        value={value}
      />

      <label
        className={classNames(
          formGroupLabelClassName,
          {
            'custom-control-label': custom,
          },
          {
            'form-check-label': !custom,
          }
        )}
        htmlFor={radioId}
        id={`${radioId}-label `}
      >
        {label}
      </label>
    </div>
  );
};

Radio.propTypes = {
  checked: PropTypes.bool,
  custom: PropTypes.bool.isRequired,
  formGroupLabelClassName: PropTypes.string.isRequired,
  inline: PropTypes.bool.isRequired,
  inputClassName: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

Radio.defaultProps = {
  checked: false,
  label: null,
  value: null,
};

const RadioSelect = ({
  custom,
  formGroupLabelClassName,
  formik,
  helpText,
  inline,
  inputClassName,
  isValidMessage,
  label,
  labelClassName,
  labelSizeClassName,
  name,
  optional,
  options,
  radioSizeClassName,
  showFeedback,
  tooltipHeader,
  tooltipPosition,
  tooltipText,
  ...props
}) => {
  const fieldValue = getIn(formik.values, name);
  const radioGroup = options.map(({ label, value }) => {
    if (!(label || value)) return null;
    const optionValue = value || dashedLowerCase(label);
    const optionLabel = label || Humanize.capitalize(value);
    return (
      <Radio
        checked={fieldValue === optionValue}
        custom={custom}
        formGroupLabelClassName={formGroupLabelClassName}
        formik={formik}
        inline={inline}
        inputClassName={inputClassName}
        key={optionValue}
        label={optionLabel}
        name={name}
        value={optionValue}
      />
    );
  });

  return (
    <>
      {label ? (
        <RadioSelectWithLabel
          label={label}
          labelClassName={labelClassName}
          labelSizeClassName={labelSizeClassName}
          name={name}
          optional={optional}
          radioSizeClassName={radioSizeClassName}
          tooltipHeader={tooltipHeader}
          tooltipPosition={tooltipPosition}
          tooltipText={tooltipText}
        >
          {radioGroup}
        </RadioSelectWithLabel>
      ) : (
        radioGroup
      )}
      <FeedbackMessage
        formik={formik}
        helpText={helpText}
        showFeedback={showFeedback}
        name={name}
        validMessage={isValidMessage}
      />
    </>
  );
};

RadioSelect.propTypes = {
  custom: PropTypes.bool,
  formGroupLabelClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  inline: PropTypes.bool,
  inputClassName: PropTypes.string,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelSizeClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  options: PropTypes.array.isRequired,
  radioSizeClassName: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
};

RadioSelect.defaultProps = {
  custom: false,
  formGroupLabelClassName: '',
  helpText: null,
  inline: false,
  inputClassName: '',
  isValidMessage: null,
  label: null,
  labelClassName: null,
  labelSizeClassName: 'col-sm-2',
  optional: false,
  radioSizeClassName: 'col-sm-10',
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipPosition: 'right',
  tooltipText: null,
};

const RadioSelectWithLabel = ({
  children,
  label,
  labelClassName,
  labelSizeClassName,
  name,
  optional,
  radioSizeClassName,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
}) => {
  return (
    <fieldset className="form-group">
      <div className="row">
        <legend className={`col-form-label ${labelSizeClassName} pt-0`}>
          <Label
            className={`label-radio ${labelClassName}`}
            name={name}
            text={label}
            optional={optional}
            tooltipHeader={tooltipHeader}
            tooltipPosition={tooltipPosition}
            tooltipText={tooltipText}
          />
        </legend>
        <div className={radioSizeClassName}>{children}</div>
      </div>
    </fieldset>
  );
};

RadioSelectWithLabel.propTypes = {
  children: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  labelSizeClassName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  radioSizeClassName: PropTypes.string.isRequired,
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
};

RadioSelectWithLabel.defaultProps = {
  labelClassName: null,
  tooltipText: null,
  tooltipHeader: null,
  tooltipPosition: 'right',
  optional: false,
};

export default connect(RadioSelect);
