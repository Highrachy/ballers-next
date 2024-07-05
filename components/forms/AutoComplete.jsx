import React from 'react';
import PropTypes from 'prop-types';
import { connect, Field } from 'formik';
import classNames from 'classnames';
import { FeedbackMessage, feedback } from 'components/forms/form-helper';
import Label from './Label';
import { ReactTags } from 'react-tag-autocomplete';

// https://github.com/i-like-robots/react-tags/tree/6.0#allownew-optional

const AutoComplete = ({
  autoComplete,
  className,
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
  optional,
  placeholder,
  removeButtonText,
  showFeedback,
  suggestions,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  type,
  value,
  ...props
}) => {
  return (
    <div className={classNames('form-group', formGroupClassName)}>
      <div>
        <Label
          className={labelClassName}
          name={name}
          optional={optional}
          text={label}
          tooltipHeader={tooltipHeader}
          tooltipPosition={tooltipPosition}
          tooltipText={tooltipText}
        />{' '}
        <div className={inputSizeClassName}>
          <Field name={name}>
            {({ field, form }) => {
              let fieldValue = field.value || value || [];
              return (
                <ReactTags
                  allowBackspace={false}
                  allowNew
                  className={className}
                  delimiterKeys={['Enter', 'Tab', ',']}
                  onAdd={(tag) => {
                    const tags = [...fieldValue, tag];
                    form.setFieldValue(name, tags);
                  }}
                  onDelete={(index) => {
                    const tags = fieldValue.slice(0);
                    tags.splice(index, 1);
                    form.setFieldValue(name, tags);
                  }}
                  placeholderText={
                    placeholder || label ? `Add ${label}` : 'Add New'
                  }
                  deleteButtonText={removeButtonText}
                  suggestions={suggestions}
                  selected={fieldValue}
                />
              );
            }}
          </Field>
        </div>
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

AutoComplete.propTypes = {
  className: PropTypes.string,
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  placeholder: PropTypes.string,
  removeButtonText: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  suggestions: PropTypes.array,
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
  value: PropTypes.array,
};

AutoComplete.defaultProps = {
  className: null,
  formGroupClassName: null,
  helpText: 'Please separate each value with a comma',
  isValidMessage: '',
  label: null,
  labelClassName: null,
  optional: true,
  placeholder: null,
  removeButtonText: 'Click tag to remove',
  showFeedback: feedback.ALL,
  suggestions: [],
  tooltipHeader: null,
  tooltipPosition: 'right',
  tooltipText: null,
  value: [],
};

export default connect(AutoComplete);
