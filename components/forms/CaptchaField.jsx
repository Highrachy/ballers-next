import React from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import { useField, useFormikContext } from 'formik';

const CaptchaField = ({ name }) => {
  const { setFieldValue } = useFormikContext();
  const [, meta] = useField(name);

  const handleChange = (token) => {
    setFieldValue(name, token);
  };

  return (
    <div className="my-3">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={handleChange}
      />

      {meta.touched && meta.error && (
        <div className="text-danger small mt-2">{meta.error}</div>
      )}
    </div>
  );
};

CaptchaField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default CaptchaField;
