import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import ReactSelect from 'react-select';
import { connect } from 'formik';
import classNames from 'classnames';
import {
  getValidityClass,
  FeedbackMessage,
  feedback,
} from 'components/forms/form-helper';
import Label from './Label';

const Select = ({
  formGroupClassName,
  formik,
  helpText,
  inline,
  inputClassName,
  inputSizeClassName,
  isMulti,
  isValidMessage,
  label,
  labelLink,
  labelClassName,
  name,
  optional,
  placeholder,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  options,
  ...props
}) => {
  return (
    <div
      className={classNames('form-group mb-4', formGroupClassName, {
        row: inline,
      })}
    >
      <Label
        className={labelClassName}
        labelLink={labelLink}
        name={name}
        optional={optional}
        text={label}
        tooltipHeader={tooltipHeader}
        tooltipPosition={tooltipPosition}
        tooltipText={tooltipText}
      />
      <div className={inputSizeClassName}>
        <Field name={name}>
          {({ field, form }) => {
            let value = props.defaultValue
              ? [props.defaultValue]
              : isMulti
              ? []
              : '';

            if (options && field.value) {
              value = options.filter((option) =>
                isMulti
                  ? field.value.toString().indexOf(option.value) >= 0
                  : field.value.toString() === option.value.toString()
              );
            }

            const handleChange = (option) => {
              option && (option.value || option.length > 0)
                ? isMulti
                  ? form.setFieldValue(
                      name,
                      option.map((item) => item.value)
                    )
                  : form.setFieldValue(name, option.value)
                : form.setFieldValue(name, isMulti ? [] : '');
            };

            return (
              <ReactSelect
                className={classNames(
                  inputClassName,
                  getValidityClass(formik, name, showFeedback)
                )}
                id={name}
                isMulti={isMulti}
                name={name}
                onBlur={field.onBlur}
                onChange={(option) => handleChange(option)}
                options={options}
                placeholder={placeholder || `Select ${label}...`}
                styles={customStyles}
                value={value}
                {...props}
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

export const customStyles = {
  option: (provided, state) => {
    return {
      ...provided,
      color: state.isSelected ? '#5775FA' : '#161D3F',
      backgroundColor: 'white',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ':hover': {
        ...provided[':hover'],
        backgroundColor: 'rgba(232, 237, 255, 0.38)',
        color: '#5775fa',
      },
    };
  },
  menu: (provided, state) => {
    return {
      ...provided,
      zIndex: 10000,
    };
  },
  control: (provided, state) => {
    return {
      ...provided,
      backgroundColor: '#f5f5f5', //'#e8edff61',
      borderColor: state.isDisabled ? '#dddddd' : 'rgba(87, 117, 250, 0.2)',
      borderRadius: 3,
      cursor: 'default',
      minHeight: 56,
      width: '100%',
      paddingLeft: '0.5rem',
      ':hover': {
        borderColor: '#3256f9',
        boxShadow: 'none',
      },
      ':focus': {
        ...provided[':focus'],
        outline: 'none !important',
      },
    };
  },

  indicatorSeparator: (provided) => {
    return {
      ...provided,
      backgroundColor: 'transparent',
    };
  },

  placeholder: (provided, state) => {
    return {
      ...provided,
      color: state.isDisabled ? '#b4b4b4' : '#979797',
    };
  },

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition, color: '#5775fa' };
  },
};

export const customStylesDashboard = {
  ...customStyles,
  control: (provided, state) => {
    return {
      ...customStyles.control(provided, state),
      minHeight: 36,
      width: '100%',
      borderRadius: 0,
      backgroundColor: state.isDisabled ? '#f5f5f5' : 'white',
    };
  },
};

export const customStylesJustForYou = {
  ...customStyles,
  control: (provided, state) => {
    return {
      ...customStyles.control(provided, state),
      width: '100%',
      borderRadius: 0,
    };
  },
};

Select.defaultProps = {
  autoComplete: '',
  formGroupClassName: 'form-group mb-4',
  helpText: null,
  inline: false,
  inputClassName: null,
  inputSizeClassName: null,
  isMulti: false,
  isValidMessage: '',
  label: null,
  labelClassName: null,
  labelLink: null,
  optional: false,
  placeholder: null,
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipText: null,
  tooltipPosition: 'right',
  type: null,
};

Select.propTypes = {
  autoComplete: PropTypes.string,
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  inline: PropTypes.bool,
  inputClassName: PropTypes.string,
  inputSizeClassName: PropTypes.number,
  isMulti: PropTypes.bool,
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  placeholder: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
  type: PropTypes.string,
};

export default connect(Select);
