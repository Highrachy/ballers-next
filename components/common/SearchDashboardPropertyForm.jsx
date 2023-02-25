import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {
  customStylesJustForYou,
  customStylesDashboard,
} from 'components/forms/Select';
import { useRouter } from 'next/router';
import { useAvailableOptions } from 'hooks/useAvailableOptions';

const SearchPropertyForm = ({ defaultInputValue, useDashboardStyles }) => {
  const router = useRouter();
  const statePlaceholder = 'Any State';
  const houseTypePlaceholder = 'Any House Type';

  const [formValue, setFormValue] = React.useState({
    state: defaultInputValue.state || '',
    houseType: defaultInputValue.houseType || '',
  });

  const [placeholder, setPlaceholder] = React.useState({
    state: statePlaceholder,
    houseType: houseTypePlaceholder,
  });

  const availableOptions = useAvailableOptions() || {};
  console.log('availableOptions', availableOptions);

  React.useEffect(() => {
    const defaults = placeholder;

    if (defaultInputValue.state) {
      defaults['state'] = defaultInputValue.state;
    }
    if (defaultInputValue.houseType) {
      defaults['houseType'] = defaultInputValue.houseType;
    }

    setPlaceholder(defaults);
  }, [defaultInputValue, placeholder]);

  const handleSearch = () => {
    const params = [];
    if (formValue.state) {
      params.push([`state=${formValue.state}`]);
    }
    if (formValue.houseType) {
      params.push([`houseType=${formValue.houseType}`]);
    }
    const query = params.length > 0 ? `?${params.join('&')}` : '';
    router.push(`/user/just-for-you${query}`, true);
  };

  // Styles to use
  const styles = useDashboardStyles
    ? customStylesDashboard
    : customStylesJustForYou;

  return (
    <div className="input-group">
      <div className="select-holder">
        <Select
          options={availableOptions.states}
          styles={styles}
          placeholder={placeholder.state}
          onChange={({ value }) => setFormValue({ ...formValue, state: value })}
        />
      </div>
      <div className="select-holder">
        <Select
          placeholder={placeholder.houseType}
          options={availableOptions.houseTypes}
          styles={styles}
          onChange={({ value }) =>
            setFormValue({ ...formValue, houseType: value })
          }
        />
      </div>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={handleSearch}
      >
        <span>Search</span>
      </button>
    </div>
  );
};

SearchPropertyForm.propTypes = {
  defaultInputValue: PropTypes.object,
  useDashboardStyles: PropTypes.bool,
};

SearchPropertyForm.defaultProps = {
  useDashboardStyles: true,
  defaultInputValue: {
    state: '',
    houseType: '',
  },
};

export default SearchPropertyForm;
