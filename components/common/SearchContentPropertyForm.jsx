import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { customStyles } from 'components/forms/Select';
import Toast, { useToast } from 'components/utils/Toast';
import { valuesToOptions } from 'utils/helpers';
import contentProperty from '@/data/contentProperty';
import { Router, useRouter } from 'next/router';
import { ArrowLeft } from 'iconsax-react';

const SearchContentPropertyForm = ({
  defaultInputValue,
  customForm = false,
}) => {
  const router = useRouter();
  const [toast, setToast] = useToast();
  const [currentBudget, setCurrentBudget] = React.useState(0);

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

  const getBudget = ({ value, label }) => {
    if (value) setCurrentBudget(value);
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
    <>
      <p className="mt-2 mb-3 fw-semibold text-primary">
        {currentBudget ? (
          <span>
            With a budget of{' '}
            <strong className="text-secondary">{currentBudget}</strong>, Select
            your preferences
          </span>
        ) : (
          <>Start Your Homeownership Journey Now: Select Your Budget!</>
        )}
      </p>

      <div className="input-group search-property-form">
        <Toast {...toast} showToastOnly />
        {!currentBudget ? (
          <div className="select-holder">
            <Select
              options={valuesToOptions([
                '1 Million - 50 Million Naira',
                '51 Million - 100 Million Naira',
                '100 Million - 200 Million Naira',
                'Above 200 Million Naira',
              ])}
              styles={customStyles(customForm)}
              placeholder="Select Budget"
              onChange={getBudget}
            />
          </div>
        ) : (
          <>
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
          </>
        )}
        <button
          className="btn btn-secondary"
          type="button"
          onClick={currentBudget ? handleSearch : getBudget}
        >
          Confirm
        </button>
      </div>
      {!!currentBudget && (
        <div
          className="text-sm text-muted text-link mt-3"
          onClick={() => setCurrentBudget(0)}
        >
          <span className="icon-sm">
            <ArrowLeft />
          </span>{' '}
          &nbsp; Change your Budget
        </div>
      )}
    </>
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
