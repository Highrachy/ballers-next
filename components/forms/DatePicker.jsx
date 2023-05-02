import React from 'react';
import PropTypes from 'prop-types';
import { connect, Field } from 'formik';
import classNames from 'classnames';
import {
  getValidityClass,
  FeedbackMessage,
  feedback,
} from 'components/forms/form-helper';
import Label from './Label';
import ReactDatePicker from 'react-datepicker';
import { getIn } from 'formik';
import { isValid, parseISO } from 'date-fns';
import { convertToUTC } from 'utils/date-helpers';

const DatePicker = ({
  name,
  className,
  dateFormat,
  helpText,
  isValidMessage,
  formGroupClassName,
  formik,
  labelClassName,
  label,
  optional,
  placeholder,
  showFeedback,
  showTimeSelect,
  showTimeSelectOnly,
  timeCaption,
  timeIntervals,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  ...props
}) => (
  <div className={classNames('mb-4', formGroupClassName)}>
    <div>
      <Label
        className={labelClassName}
        name={name}
        optional={optional}
        text={label}
        tooltipHeader={tooltipHeader}
        tooltipPosition={tooltipPosition}
        tooltipText={tooltipText}
      />
      <Field name={name}>
        {({ form }) => {
          let selectedValue = null;
          const currentValue = getIn(formik.values, name);

          if (
            typeof currentValue === 'object' &&
            currentValue.date &&
            isValid(parseISO(currentValue.date))
          ) {
            selectedValue = parseISO(currentValue.date);
          } else if (currentValue !== '' && isValid(parseISO(currentValue))) {
            selectedValue = parseISO(currentValue);
          }

          return (
            <ReactDatePicker
              {...props}
              autoComplete="off"
              className={classNames(
                'form-control',
                className,
                getValidityClass(formik, name, showFeedback)
              )}
              dateFormat={dateFormat}
              id={name}
              name={name}
              onChange={(dateValue) => {
                if (dateValue) {
                  let dateTime = dateValue.toLocaleDateString();
                  let date = convertToUTC(dateValue);

                  if (showTimeSelectOnly) {
                    dateTime = dateValue.toLocaleTimeString();
                    date = dateValue;
                  }

                  if (showTimeSelect) {
                    dateTime = dateValue.toLocaleString();
                    date = dateValue;
                  }

                  form.setFieldValue(name, { date, value: dateTime });
                } else {
                  form.setFieldValue(name, '');
                }
              }}
              placeholderText={placeholder || label}
              selected={selectedValue}
              showTimeSelect={showTimeSelect}
              showTimeSelectOnly={showTimeSelectOnly}
              timeCaption={timeCaption}
              timeIntervals={timeIntervals}
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

DatePicker.propTypes = {
  className: PropTypes.string,
  dateFormat: PropTypes.string,
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  placeholder: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  showTimeSelect: PropTypes.bool,
  showTimeSelectOnly: PropTypes.bool,
  timeCaption: PropTypes.string,
  timeIntervals: PropTypes.number,
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
};

DatePicker.defaultProps = {
  className: null,
  dateFormat: 'MMMM d, yyyy',
  formGroupClassName: '',
  helpText: null,
  isValidMessage: '',
  label: '',
  labelClassName: null,
  optional: false,
  placeholder: null,
  showFeedback: feedback.ALL,
  showTimeSelect: false,
  showTimeSelectOnly: false,
  timeCaption: 'Time',
  timeIntervals: 60,
  tooltipHeader: null,
  tooltipText: null,
  tooltipPosition: 'right',
};

export default connect(DatePicker);
