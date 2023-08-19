import { Form, Formik } from 'formik';
import React from 'react';
import Input from '../forms/Input';
import Button from '../forms/Button';
import { useRouter } from 'next/router';
import { createSchema } from '../forms/schemas/schema-helpers';
import {
  DisplayFormikState,
  feedback,
  processFilterValues,
} from '../forms/form-helper';
import { searchPropertySchema } from '../forms/schemas/propertySchema';
import { FilterIcon, SearchIcon } from '../utils/Icons';
import {
  booleanOptions,
  generateNumOptions,
  manualWait,
  valuesToOptions,
} from '@/utils/helpers';
import Modal from './Modal';
import FilterRange from '../forms/FilterRange';
import Select from '../forms/Select';
import InputFormat from '../forms/InputFormat';
import { HOUSE_TYPES } from '@/utils/constants';
import Label from '../forms/Label';
import { BsFillHouseFill } from 'react-icons/bs';
import { BiSolidBuildingHouse, BiWater } from 'react-icons/bi';
import { GiFamilyHouse, GiSelect } from 'react-icons/gi';
import { PiHouseFill } from 'react-icons/pi';
import { FaParking, FaRoad } from 'react-icons/fa';
import { be } from 'date-fns/locale';

const AdvancedSearchPropertyForm = ({ advanced = false, term = '' }) => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{
        all: term,
      }}
      enableReinitialize={true}
      onSubmit={({ all }, actions) => {
        router.push(`/properties/search?all=${all}`);
        actions.setSubmitting(false);
      }}
      validationSchema={createSchema(searchPropertySchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => {
        const submitFormWithEnterKey = (event) => {
          if (event.keyCode === 13) {
            handleSubmit();
          }
        };
        return (
          <Form>
            {!advanced ? (
              <div className="input-group search-property-form">
                <div className="select-holder">
                  <Input
                    name="all"
                    label=""
                    formGroupClassName="mb-0"
                    inputClassName="w-100"
                    placeholder="Search for Property"
                    showFeedback={feedback.ERROR}
                    optional
                    onKeyDown={(e) => submitFormWithEnterKey(e)}
                  />
                </div>
                <Button loading={isSubmitting} onClick={handleSubmit}>
                  Search
                </Button>
              </div>
            ) : (
              <div className="container search-property-container mt-4">
                <div className="w-100 position-relative">
                  <Input
                    name="all"
                    formGroupClassName="mb-0"
                    inputClassName="form-control pe-5 bigger-search-input"
                    placeholder="Search for Property"
                    showFeedback={feedback.ERROR}
                    onKeyDown={(e) => submitFormWithEnterKey(e)}
                  />
                  {props?.touched?.term && props?.errors?.term ? null : (
                    <span className="position-absolute top-50 input-search-icon translate-middle-y">
                      <SearchIcon />
                    </span>
                  )}
                </div>

                <div className="d-flex justify-content-center mt-3">
                  <FilterButton />
                  <Button
                    loading={isSubmitting}
                    className="btn btn-wide d-flex align-items-center"
                    onClick={handleSubmit}
                  >
                    <SearchIcon /> &nbsp;Search
                  </Button>
                </div>
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export const FilterButton = () => {
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const router = useRouter();
  const NUM_OPTIONS = [
    { label: 'Any', value: null },
    ...generateNumOptions(3, '', { noPluralText: true }),
    { label: '4+', value: '4:' },
  ];
  return (
    <>
      <Button
        color="light"
        className="btn me-3 btn-wide d-flex align-items-center"
        onClick={() => setShowSearchModal(true)}
      >
        <FilterIcon /> &nbsp;Filters
      </Button>
      <Modal
        title="Search our Articles"
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        showFooter={false}
        size="lg"
      >
        <section className="px-4 pt-3">
          <Formik
            initialValues={{
              all: '',
              price: [0, 0],
            }}
            onSubmit={(values, actions) => {
              const finalOutput = convertToQueryString({
                ...values,
                ...selectedOptions,
              });
              router.push(`/properties/search?${finalOutput}`);
              setShowSearchModal(false);
            }}
          >
            {({ isSubmitting, handleSubmit, ...props }) => (
              <Form>
                <section>
                  <Input
                    label="What are you looking for"
                    name="all"
                    placeholder="Enter name, location, city or state"
                  />

                  <div className="form-row">
                    <InputFormat
                      formGroupClassName="col-md-6"
                      name="price[0]"
                      label="From Price"
                      showFeedback={feedback.ERROR}
                    />
                    <InputFormat
                      formGroupClassName="col-md-6"
                      name="price[1]"
                      label="From Price"
                      showFeedback={feedback.ERROR}
                    />
                  </div>

                  <ListFilter
                    name="type"
                    title="Property Type"
                    options={[
                      {
                        label: 'Any',
                        value: null,
                        icon: <PiHouseFill />,
                      },
                      {
                        label: 'Bungalow',
                        value: 'bungalow',
                        icon: <BsFillHouseFill />,
                      },
                      {
                        label: 'Flat',
                        value: 'Flat',
                        icon: <GiFamilyHouse />,
                      },
                      {
                        label: 'Duplex',
                        value: 'Duplex',
                        icon: <BiSolidBuildingHouse />,
                      },
                    ]}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />

                  <ListFilter
                    name="bedrooms"
                    title="Bedrooms"
                    options={NUM_OPTIONS}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />
                  <ListFilter
                    name="bathrooms"
                    title="Bathrooms"
                    options={NUM_OPTIONS}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />
                  <ListFilter
                    name="toilets"
                    title="Toilets"
                    options={NUM_OPTIONS}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />

                  <ListFilter
                    name="features"
                    title="Features"
                    options={[
                      {
                        label: 'Any',
                        value: null,
                        icon: <GiSelect />,
                      },
                      {
                        label: 'Parking',
                        value: 'parking',
                        icon: <FaParking />,
                      },
                      {
                        label: 'Portable Water',
                        value: 'water',
                        icon: <BiWater />,
                      },
                      {
                        label: 'Paved Road',
                        value: 'road',
                        icon: <FaRoad />,
                      },
                    ]}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />
                </section>
                <DisplayFormikState {...props} showAll />
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Filter Properties
                </Button>
              </Form>
            )}
          </Formik>
        </section>
      </Modal>
    </>
  );
};

const ListFilter = ({
  name,
  title,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const getClassName = (value) =>
    `btn btn-secondary${selectedOptions[name] === value ? '' : '-light'} me-3`;

  return (
    <div className="row mb-5">
      <div className="col-12">
        <Label name={name} hideOptionalText>
          {title}
        </Label>
      </div>
      <div className="col">
        {options.map(({ label, value, icon }) => (
          <button
            key={value}
            type="button"
            className={getClassName(value)}
            onClick={() =>
              setSelectedOptions({ ...selectedOptions, [name]: value })
            }
          >
            {icon && (
              <div className="icon-lg py-2 px-3 list-filter-icon">{icon}</div>
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

function convertToQueryString(values) {
  const queryParams = [];

  for (const key in values) {
    if (values.hasOwnProperty(key)) {
      const value = values[key];
      if (Array.isArray(value)) {
        const [min, max] = value;
        if (min !== 0 || max !== 0) {
          queryParams.push(`${key}=${min}:${max}`);
        }
      } else if (value && value !== '' && value !== '0') {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }
    }
  }

  return queryParams.length > 0 ? queryParams.join('&') : '';
}

export default AdvancedSearchPropertyForm;
