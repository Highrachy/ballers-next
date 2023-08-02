import Axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';
import { getError } from 'utils/helpers';
import Toast, { useToast } from 'components/utils/Toast';
import Humanize from 'humanize-plus';
import { useFormikContext } from 'formik';
import { feedback, FeedbackMessage, getValidityClass } from './form-helper';
import classNames from 'classnames';
import Label from './Label';
import { FiUploadCloud } from 'react-icons/fi';
import Image from 'components/utils/Image';
import BallersSpinner from 'components/utils/BallersSpinner';

// https://blog.devgenius.io/upload-files-to-amazon-s3-from-a-react-frontend-fbd8f0b26f5

const UPLOAD_API_URL =
  'https://staging-ballers-api.herokuapp.com/api/v1/user/upload-to-highrachy';

const Upload = ({
  afterUpload,
  allowPdf,
  changeText,
  children,
  className,
  customFormats,
  defaultImage,
  folder,
  formGroupClassName,
  imgOptions,
  isValidMessage,
  label,
  labelClassName,
  maxFileSize,
  name,
  oldImage,
  optional,
  showFeedback,
  tooltipHeader,
  tooltipText,
  tooltipPosition,
  uploadText,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [toast, setToast] = useToast();

  const AWS_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET || 'ballers-staging';
  let allowedFormats =
    customFormats.length > 0 ? customFormats : ['jpg', 'jpeg', 'gif', 'png'];

  if (allowPdf) {
    allowedFormats.push('pdf');
  }
  const formikProps = useFormikContext();

  const setErrorMessage = (errorMessage) => {
    formikProps && formikProps.setFieldTouched(name, true, false);
    formikProps && formikProps.setFieldError(name, errorMessage);
    setToast({
      message: errorMessage,
    });
    setLoading(false);
    setProgress(0);
    return null;
  };

  const onFileChange = async (event) => {
    const fileToUpload = event?.target?.files?.[0];

    setProgress(1);

    setLoading(true);
    if (!fileToUpload) return null;

    if (fileToUpload.size > maxFileSize) {
      setErrorMessage(
        `'${
          fileToUpload.name
        }' is too large, please pick a file smaller than ${Humanize.fileSize(
          maxFileSize
        )}`
      );
      return null;
    } else {
      const type = fileToUpload.type;
      const extension = fileToUpload.name.split('.').pop();

      if (!allowedFormats.includes(extension)) {
        setErrorMessage(
          `Unsupported extension. Only ${allowedFormats.join(
            ', '
          )} are allowed.`
        );
        return null;
      }

      const uploadConfig = await Axios.get(UPLOAD_API_URL, {
        params: {
          extension,
          type,
          folder,
          bucket: AWS_BUCKET,
        },
      }).catch(function (error) {
        setErrorMessage(getError(error));
        return null;
      });

      if (uploadConfig) {
        Axios.put(uploadConfig.data.url, fileToUpload, {
          headers: { 'Content-Type': type },
          onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        })
          .then(() => {
            const fileURL = `https://${AWS_BUCKET}.s3.amazonaws.com/${uploadConfig.data.key}`;
            setUploadedFile(fileURL);
            afterUpload(fileURL);
            if (formikProps) {
              formikProps.setFieldValue(name, fileURL);
            }
            setLoading(false);
          })
          .catch(function (error) {
            setErrorMessage(getError(error));
          });

        return null;
      }
      setErrorMessage('Unable to upload file');
    }
  };

  const formikImage = formikProps?.values?.[name];
  const currentImage = formikProps ? formikImage : uploadedFile;
  const inputHasAnImage = !!currentImage || !!defaultImage;
  const hasUploadedFile = !!currentImage || !!oldImage;

  const supportedFormats = allowedFormats.map((extension) => '.' + extension);
  const helpText = `Supported Formats: ${Humanize.oxford(
    supportedFormats
  )} files. File size should be less than ${Humanize.fileSize(maxFileSize)}`;

  const accept = supportedFormats.join(',');
  const id = name || 'upload-file';
  return (
    <div className={formGroupClassName}>
      <Toast {...toast} showToastOnly />
      <Label
        className={labelClassName}
        name={name}
        optional={optional}
        text={label}
        tooltipHeader={tooltipHeader}
        tooltipPosition={tooltipPosition}
        tooltipText={tooltipText}
      />
      <div
        className={classNames(
          'form-control',
          className,
          getValidityClass(formikProps, name, showFeedback)
        )}
      >
        {children ||
          (inputHasAnImage && (
            <Image
              defaultImage={defaultImage}
              src={currentImage || oldImage}
              name={name || 'uploaded-image'}
              alt={name}
              {...imgOptions}
            />
          ))}
        <div className="custom-file-upload mt-3">
          <input
            type="file"
            id={id}
            name={name || 'myfile'}
            accept={accept}
            onChange={onFileChange}
          />

          <label htmlFor={id}>
            {loading ? (
              <>
                <BallersSpinner small /> Uploading File
              </>
            ) : (
              <>
                <FiUploadCloud />{' '}
                {hasUploadedFile ? (
                  <>{changeText || 'Change File'}</>
                ) : (
                  <>{uploadText || 'Upload New File'}</>
                )}
              </>
            )}
          </label>
          {progress > 0 && progress < 100 && (
            <div className="progress mt-2" style={{ height: '10px' }}>
              <div
                className="progress-bar progress-bar-striped bg-success"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          )}
        </div>
      </div>
      {formikProps ? (
        <FeedbackMessage
          helpText={helpText}
          name={name}
          showFeedback={showFeedback}
          validMessage={isValidMessage}
        />
      ) : (
        { helpText }
      )}
    </div>
  );
};

Upload.propTypes = {
  afterUpload: PropTypes.func,
  allowPdf: PropTypes.bool,
  changeText: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  customFormats: PropTypes.array,
  defaultImage: PropTypes.string,
  folder: PropTypes.string,
  formGroupClassName: PropTypes.string,
  imgOptions: PropTypes.object,
  isValidMessage: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  maxFileSize: PropTypes.number,
  name: PropTypes.string,
  oldImage: PropTypes.string,
  optional: PropTypes.bool,
  showFeedback: PropTypes.oneOf(Object.keys(feedback)),
  tooltipHeader: PropTypes.string,
  tooltipPosition: PropTypes.string,
  tooltipText: PropTypes.any,
  uploadText: PropTypes.string,
};

Upload.defaultProps = {
  afterUpload: () => {},
  allowPdf: false,
  changeText: null,
  children: null,
  className: '',
  customFormats: [],
  defaultImage: null,
  folder: 'unknown',
  formGroupClassName: 'mb-4',
  imgOptions: {},
  label: null,
  labelClassName: null,
  isValidMessage: '',
  maxFileSize: 1_024 * 1_000, // 1 MB
  name: null,
  oldImage: null,
  optional: false,
  showFeedback: feedback.ALL,
  tooltipHeader: null,
  tooltipText: null,
  tooltipPosition: 'right',
  uploadText: null,
};

export default Upload;
