import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import BallersSpinner from 'components/utils/BallersSpinner';
import { BASE_API_URL } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getError } from 'utils/helpers';
import Image from './Image';
import { FileIcon } from './Icons';

export const UploadedDocument = ({ document }) => {
  if (!document) return null;

  const extension = document.split('.').pop();
  const allowedFormats = ['jpg', 'jpeg', 'gif', 'png', 'pdf'];
  if (!allowedFormats.includes(extension)) return null;

  return extension !== 'pdf' ? (
    <Image
      className="uploaded-image mb-3"
      name="document upload"
      src={document}
    />
  ) : (
    <>
      <div className="large-icon text-center">
        <FileIcon />
      </div>
      <a href={document}>{document}</a>
    </>
  );
};

const UploadImage = ({ defaultImage, uploadText, changeText, afterUpload }) => {
  const MAX_IMG_SIZE = 1000000; //1MB

  // HOOKS
  const [toast, setToast] = useToast();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const onChangeHandler = (event) => {
    setLoading(true);
    setToast({ message: null });
    const file = event.target.files[0];
    if (!file) {
      setToast({
        message: 'Invalid file',
      });
      setLoading(false);
    }
    if (file.size > MAX_IMG_SIZE) {
      setToast({
        message: `'${
          file.name
        }' is too large, please pick a file smaller than ${
          MAX_IMG_SIZE / 1000
        }kb`,
      });
      setLoading(false);
    } else if (
      file.type !== 'image/png' &&
      file.type !== 'image/jpeg' &&
      file.type !== 'image/gif' &&
      file.type !== 'application/pdf'
    ) {
      setToast({
        message:
          "Unsupported format. Only 'image' and 'pdf' files are supported",
      });
      setLoading(false);
    } else {
      const data = new FormData();
      data.append('image', file);

      Axios.post(`${BASE_API_URL}/user/upload-image`, data, {
        headers: { Authorization: getTokenFromStore() },
      })
        .then(function (response) {
          const { status, data } = response;
          if (status === 200) {
            setImage(data.file.path);
            afterUpload(data.file.path);
            setLoading(false);
          }
        })
        .catch(function (error) {
          setToast({
            message: getError(error),
          });
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className="mb-5">
        <Toast {...toast} showToastOnly />
        <div className="custom-file">
          <input
            id="image"
            type="file"
            className="custom-file-input"
            onChange={onChangeHandler}
          />
          <label className="custom-file-label" htmlFor="image">
            {loading ? (
              <>
                <BallersSpinner small /> &nbsp; &nbsp; Uploading Image
              </>
            ) : image || defaultImage ? (
              changeText || 'Change Image'
            ) : (
              uploadText || 'Upload New Image'
            )}
          </label>
        </div>
        {/* <small>The image should not exceed 1MB (1,000KB)</small> */}
      </div>
    </>
  );
};

UploadImage.propTypes = {
  afterUpload: PropTypes.func,
  changeText: PropTypes.string,
  uploadText: PropTypes.string,
  defaultImage: PropTypes.string,
};

UploadImage.defaultProps = {
  afterUpload: () => {},
  uploadText: null,
  defaultImage: null,
  changeText: null,
};

export default UploadImage;
