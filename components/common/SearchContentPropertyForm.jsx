import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { customStyles } from 'components/forms/Select';
import Toast, { useToast } from 'components/utils/Toast';
import { valuesToOptions } from 'utils/helpers';
import contentProperty from '@/data/contentProperty';
import { Router, useRouter } from 'next/router';

const SearchContentPropertyForm = ({
  defaultInputValue,
  customForm = false,
}) => {
  const router = useRouter();
  const [toast, setToast] = useToast();

  const locations = Object.keys(contentProperty)
    .map((location) => ({
      label: `${location}, ${contentProperty[location].state}`,
      value: location,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const [formValue, setFormValue] = React.useState({
    area: '',
    houseType: '',
  });

  const areaPlaceholder = '1. Select Area';
  const houseTypePlaceholder = '2. Select House Type';

  const [placeholder, setPlaceholder] = React.useState({
    area: areaPlaceholder,
    houseType: houseTypePlaceholder,
  });

  React.useEffect(() => {
    (defaultInputValue.area || defaultInputValue.houseType) &&
      setPlaceholder(defaultInputValue);
  }, [defaultInputValue]);

  // const area = valuesToOptions(['Lekki, Lagos', 'Maitama, Abuja']);

  // House Type
  const [disableHouseType, setDisableHouseType] = React.useState(true);
  const [houseType, setHouseType] = React.useState({});

  const getHouseType = ({ value, label }) => {
    setHouseType(null);
    setDisableHouseType(true);
    if (value) {
      const availableHouseType = Object.keys(contentProperty[value].houseType);
      setFormValue({ ...formValue, area: value });
      setPlaceholder({ ...placeholder, houseType: 'Select House Type' });
      setHouseType(valuesToOptions(availableHouseType));
      setDisableHouseType(false);
    }
  };

  const getHouseValue = ({ value }) => {
    setFormValue({ ...formValue, houseType: value });
  };

  const handleSearch = () => {
    const enableButton = formValue.area && formValue.houseType;
    if (!enableButton) {
      setToast({
        message: 'You need to select a `Preferred Area` and `HouseType`',
      });
      return;
    }
    router.push(
      `/confirm-eligibility?area=${formValue.area}&houseType=${formValue.houseType}`
    );
  };

  return (
    <div className="input-group search-property-form">
      <Toast {...toast} showToastOnly />
      <div className="select-holder">
        <Select
          options={locations}
          key={JSON.stringify(defaultInputValue.area)}
          styles={customStyles(customForm)}
          placeholder={placeholder.area}
          onChange={getHouseType}
        />
      </div>
      <div
        className="select-holder"
        onClick={() =>
          disableHouseType &&
          setToast({
            message:
              'You need to select your `Preferred Area` to load the HouseType',
          })
        }
      >
        <Select
          key={JSON.stringify(
            `${defaultInputValue.houseType} ${formValue.area}`
          )}
          placeholder={placeholder.houseType}
          options={houseType}
          styles={customStyles(customForm)}
          isDisabled={disableHouseType}
          onChange={getHouseValue}
        />
      </div>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={handleSearch}
      >
        Confirm
      </button>
    </div>
  );
};

SearchContentPropertyForm.propTypes = {
  defaultInputValue: PropTypes.object,
};

SearchContentPropertyForm.defaultProps = {
  defaultInputValue: {
    area: '',
    houseType: '',
  },
};

export default SearchContentPropertyForm;
