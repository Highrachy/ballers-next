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
import { getIn } from 'formik';
import { isValid, parseISO, format } from 'date-fns';
import { getDate } from 'utils/date-helpers';
import ModernDatePicker, {
  Calendar,
} from '@hassanmojab/react-modern-calendar-datepicker';

const DatePickerNew = ({
  name,
  className,
  dateFunction,
  helpText,
  isValidMessage,
  formGroupClassName,
  formik,
  labelClassName,
  label,
  optional,
  minimumDate,
  maximumDate,
  placeholder,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  isCalendar,
  ...props
}) => (
  <div className={classNames('mb-4', formGroupClassName)}>
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
        const currentValue = getIn(formik.values, name);
        const selectedValue = reverseTransformDate(currentValue);

        const renderCustomInput = ({ ref }) => (
          <input
            readOnly
            ref={ref}
            value={currentValue?.date ? dateFunction(currentValue.date) : ''}
            className={classNames(
              'form-control',
              className,
              getValidityClass(formik, name, showFeedback)
            )}
            id={name}
            name={name}
            placeholder={placeholder || label || 'Select a date'}
          />
        );

        const DateComponent = isCalendar ? Calendar : ModernDatePicker;

        return (
          <DateComponent
            {...props}
            onChange={(dateValue) => {
              if (dateValue) {
                const value = transformDate(dateValue);
                form.setFieldValue(name, value);
              } else {
                form.setFieldValue(name, '');
              }
            }}
            value={selectedValue}
            renderInput={renderCustomInput}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            shouldHighlightWeekends
          />
        );
      }}
    </Field>
    <FeedbackMessage
      formik={formik}
      helpText={helpText}
      name={name}
      showFeedback={showFeedback}
      validMessage={isValidMessage}
    />
  </div>
);

const DateObjectPropTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
};

DatePickerNew.propTypes = {
  className: PropTypes.string,
  dateFunction: PropTypes.func,
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  isCalendar: PropTypes.bool,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  minimumDate: DateObjectPropTypes,
  maximumDate: DateObjectPropTypes,
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  placeholder: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
};

DatePickerNew.defaultProps = {
  className: null,
  dateFunction: getDate,
  formGroupClassName: '',
  helpText: null,
  isCalendar: false,
  isValidMessage: '',
  label: '',
  labelClassName: null,
  minimumDate: null,
  maximumDate: null,
  optional: false,
  placeholder: null,
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipText: null,
  tooltipPosition: 'right',
};

export const reverseTransformDate = (input) => {
  if (!input) return null;

  if (!input.hasOwnProperty('date') || !input.hasOwnProperty('value')) {
    return null;
  }

  const { date, value } = input;

  if (typeof date !== 'string' || typeof value !== 'string') {
    throw new Error("'date' and 'value' must be strings.");
  }

  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    throw new Error('Invalid ISO date string.');
  }

  const expectedValue = format(parsedDate, 'dd/MM/yyyy');
  if (value !== expectedValue) {
    throw new Error("The 'value' does not match the formatted date.");
  }

  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  return {
    day,
    month,
    year,
  };
};

export const transformDate = (inputDate) => {
  if (
    !inputDate.hasOwnProperty('day') ||
    !inputDate.hasOwnProperty('month') ||
    !inputDate.hasOwnProperty('year')
  ) {
    throw new Error(
      "Input object must have 'day', 'month', and 'year' properties."
    );
  }

  const { day, month, year } = inputDate;

  if (
    typeof day !== 'number' ||
    typeof month !== 'number' ||
    typeof year !== 'number' ||
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    throw new Error("'day', 'month', and 'year' must be integers.");
  }

  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1) {
    throw new Error(
      "'day' must be between 1 and 31, 'month' must be between 1 and 12, and 'year' must be a positive integer."
    );
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    throw new Error('Invalid date.');
  }

  const isoDate = date.toISOString();
  const displayValue = format(date, 'dd/MM/yyyy');

  return {
    date: isoDate,
    value: displayValue,
  };
};

export default connect(DatePickerNew);
