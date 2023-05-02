import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/forms/Input';
import { valuesToOptions } from 'utils/helpers';
import Select from 'components/forms/Select';
import { STATES } from 'utils/constants';
import { countryList } from 'utils/countryList';

const Address = ({ showCountry, companyAddress }) => {
  return (
    <>
      <Input
        label="Street Line 1"
        name={
          companyAddress ? 'vendor.companyAddress.street1' : 'address.street1'
        }
        placeholder="Street Line 1"
      />
      <Input
        label="Street Line 2"
        optional
        name={
          companyAddress ? 'vendor.companyAddress.street2' : 'address.street2'
        }
        placeholder="Street Line 2"
      />
      <div className="form-row">
        <Input
          formGroupClassName="col-md-6"
          label="City"
          name={companyAddress ? 'vendor.companyAddress.city' : 'address.city'}
          placeholder="City"
        />
        {showCountry ? (
          <Input
            formGroupClassName="col-md-6"
            label="State"
            name={
              companyAddress ? 'vendor.companyAddress.state' : 'address.state'
            }
            placeholder="State"
          />
        ) : (
          <Select
            formGroupClassName="col-md-6"
            label="State"
            name={
              companyAddress ? 'vendor.companyAddress.state' : 'address.state'
            }
            options={valuesToOptions(STATES)}
            placeholder="Select State"
          />
        )}
      </div>
      {showCountry && (
        <div className="form-row">
          <Select
            formGroupClassName="col-md-6 ms-n2"
            label="Country"
            name={
              companyAddress
                ? 'vendor.companyAddress.country'
                : 'address.country'
            }
            placeholder="Country"
            options={valuesToOptions(countryList)}
          />
        </div>
      )}
    </>
  );
};

Address.propTypes = {
  companyAddress: PropTypes.bool,
  showCountry: PropTypes.bool,
};

Address.defaultProps = {
  companyAddress: false,
  showCountry: true,
};

export default Address;
