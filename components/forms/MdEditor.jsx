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

import ReactMdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';

const MdEditor = ({
  name,
  className,
  helpText,
  isValidMessage,
  formGroupClassName,
  formik,
  height,
  labelClassName,
  label,
  optional,
  placeholder,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
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
      {({ form, field }) => {
        return (
          <ReactMdEditor
            style={{ height }}
            renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
            view={{ menu: true, md: true, html: false }}
            {...props}
            autoComplete="off"
            className={classNames(
              'form-control d-flex p-0',
              className,
              getValidityClass(formik, name, showFeedback)
            )}
            name={name}
            onChange={({ text }) => form.setFieldValue(name, text)}
            placeholderText={placeholder || label}
            onBlur={field.onBlur}
            value={getIn(formik.values, name)}
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

MdEditor.propTypes = {
  className: PropTypes.string,
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  height: PropTypes.string,
  helpText: PropTypes.string,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  placeholder: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
};

MdEditor.defaultProps = {
  className: null,
  formGroupClassName: '',
  height: '20rem',
  helpText: null,
  isValidMessage: '',
  label: '',
  labelClassName: null,
  optional: false,
  placeholder: null,
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipText: null,
  tooltipPosition: 'right',
};

export default connect(MdEditor);
