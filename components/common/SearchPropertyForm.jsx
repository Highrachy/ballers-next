import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Select from 'react-select';
import { customStyles } from 'components/forms/Select';
import Toast, { useToast } from 'components/utils/Toast';
import { BASE_API_URL } from 'utils/constants';
import { valuesToOptions } from 'utils/helpers';
import { API_ENDPOINT } from 'utils/URL';
import { useGetQuery } from 'hooks/useQuery';
import { useRouter } from 'next/router';

const SearchPropertyForm = ({ defaultInputValue }) => {
  const LOADING = 'Loading...';

  const router = useRouter();

  const [toast, setToast] = useToast();

  const [formValue, setFormValue] = React.useState({
    state: '',
    area: '',
    houseType: '',
  });

  const statePlaceholder = '1. Select State...';
  const areaPlaceholder = '2. Select Area...';
  const houseTypePlaceholder = '3. House Type...';

  const [placeholder, setPlaceholder] = React.useState({
    state: statePlaceholder,
    area: areaPlaceholder,
    houseType: houseTypePlaceholder,
  });

  React.useEffect(() => {
    (defaultInputValue.state ||
      defaultInputValue.area ||
      defaultInputValue.houseType) &&
      setPlaceholder(defaultInputValue);
  }, [defaultInputValue]);

  // State
  const [stateQuery] = useGetQuery({
    key: 'states',
    name: 'States',
    setToast,
    endpoint: API_ENDPOINT.getAllStates(),
  });

  const states = valuesToOptions(stateQuery?.data?.states || []);

  // Area
  const [disableArea, setDisableArea] = React.useState(true);
  const [area, setArea] = React.useState({});
  const getArea = ({ value }) => {
    if (value) {
      setFormValue({ ...formValue, state: value, houseType: '' });
      setPlaceholder({ ...placeholder, area: LOADING });
      Axios.get(`${BASE_API_URL}/area/state/${value}`)
        .then(function (response) {
          const { status, data } = response;
          if (status === 200) {
            const output = data.areas.map(({ area, _id }) => ({
              label: area,
              value: _id,
            }));

            setPlaceholder({ ...placeholder, houseType: houseTypePlaceholder });
            setArea(output);
            setDisableArea(false);
          }
        })
        .catch(function (error) {
          // console.log('error', error.response);
        });
    } else {
      setDisableArea(true);
      setPlaceholder({ ...placeholder, area: areaPlaceholder });
    }
  };

  // House Type
  const [disableHouseType, setDisableHouseType] = React.useState(true);
  const [houseType, setHouseType] = React.useState({});

  const getHouseType = ({ value, label }) => {
    setHouseType(null);
    setDisableHouseType(true);
    if (value) {
      setFormValue({ ...formValue, area: label });
      setPlaceholder({ ...placeholder, houseType: LOADING });
      Axios.get(`${BASE_API_URL}/content-property/area/${value}`)
        .then(function (response) {
          const { status, data } = response;
          console.log('data', data);
          if (status === 200) {
            setPlaceholder({ ...placeholder, houseType: houseTypePlaceholder });
            setHouseType(valuesToOptions(data.houseTypes));
            setDisableHouseType(false);
          }
        })
        .catch(function (error) {
          setDisableHouseType(true);
          setPlaceholder({ ...placeholder, houseType: houseTypePlaceholder });
        });
    }
  };

  const getHouseValue = ({ value }) => {
    setFormValue({ ...formValue, houseType: value });
  };

  const handleSearch = () => {
    router.push(
      `/search?state=${formValue.state}&area=${formValue.area}&houseType=${formValue.houseType}`,
      true
    );
  };

  // Button
  const enableButton = formValue.state && formValue.area && formValue.houseType;

  return (
    <div className="input-group">
      <Toast {...toast} showToastOnly />
      <div className="select-holder">
        <Select
          options={states}
          key={JSON.stringify(defaultInputValue.state)}
          styles={customStyles}
          placeholder={placeholder.state}
          onChange={getArea}
        />
      </div>
      <div
        className="select-holder"
        onClick={() =>
          disableArea &&
          setToast({
            message:
              'You need to select your `Preferred State` to load the Area',
          })
        }
      >
        <Select
          placeholder={placeholder.area}
          options={area}
          styles={customStyles}
          isDisabled={disableArea}
          onChange={getHouseType}
          key={JSON.stringify(`${defaultInputValue.area} ${formValue.state}`)}
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
          styles={customStyles}
          isDisabled={disableHouseType}
          onChange={getHouseValue}
        />
      </div>
      <button
        className="btn btn-secondary"
        type="button"
        disabled={!enableButton}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

SearchPropertyForm.propTypes = {
  defaultInputValue: PropTypes.object,
};

SearchPropertyForm.defaultProps = {
  defaultInputValue: {
    state: '',
    area: '',
    houseType: '',
  },
};

export default SearchPropertyForm;
