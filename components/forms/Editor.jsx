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
import { EDITOR_MENU } from '@/utils/constants';
import TipTapEditor from '../editor/TipTapEditor';

// Custom Formik Input for TipTap
const Editor = ({
  formGroupClassName,
  formik,
  helpText,
  inputClassName,
  isValidMessage,
  label,
  labelLink,
  labelClassName,
  menuType,
  name,
  optional,
  placeholder,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  showMenuBar,
  showBubbleMenu,
  showFloatingMenu,
  ...props
}) => {
  return (
    <div className={classNames(formGroupClassName, 'mb-4')}>
      <Label
        className={labelClassName}
        labelLink={labelLink}
        name={name}
        optional={optional}
        text={label}
        tooltipPosition={tooltipPosition}
        tooltipText={tooltipText}
      />
      <Field name={name}>
        {({ field, form }) => {
          const value = getIn(formik.values, name) || '';
          return (
            <>
              <div
                {...props}
                className={classNames(
                  'editor-container form-control p-0',
                  inputClassName,
                  getValidityClass(formik, name, showFeedback)
                )}
                id={name}
                name={name}
              >
                <TipTapEditor
                  menuType={menuType}
                  placeholder={placeholder || 'Write something...'}
                  showMenuBar={showMenuBar}
                  showBubbleMenu={showBubbleMenu}
                  showFloatingMenu={showFloatingMenu}
                  onUpdate={({ editor }) =>
                    form.setFieldValue(name, editor.getHTML())
                  }
                  value={value}
                />
              </div>
              <FeedbackMessage
                formik={formik}
                helpText={helpText}
                name={name}
                showFeedback={showFeedback}
                validMessage={isValidMessage}
              />
            </>
          );
        }}
      </Field>
    </div>
  );
};

// PropTypes and defaultProps for Editor
Editor.defaultProps = {
  formGroupClassName: 'form-group mb-4',
  helpText: null,
  inputClassName: null,
  isValidMessage: '',
  label: null,
  labelClassName: null,
  labelLink: null,
  menuType: EDITOR_MENU.FULL,
  optional: false,
  placeholder: null,
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipPosition: 'right',
  tooltipText: null,
  showMenuBar: true,
  showBubbleMenu: true,
  showFloatingMenu: false,
};

Editor.propTypes = {
  formGroupClassName: PropTypes.string,
  formik: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  inputClassName: PropTypes.string,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelLink: PropTypes.shape({
    to: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
  }),
  menuType: PropTypes.oneOf(Object.values(EDITOR_MENU)),
  name: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  placeholder: PropTypes.string,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.string,
  showMenuBar: PropTypes.bool,
  showBubbleMenu: PropTypes.bool,
  showFloatingMenu: PropTypes.bool,
};

export default connect(Editor);
