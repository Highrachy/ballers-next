import { Form, Formik } from 'formik';
import React from 'react';
import Input from '../forms/Input';
import Button from '../forms/Button';
import { useRouter } from 'next/router';
import { createSchema } from '../forms/schemas/schema-helpers';
import { DisplayFormikState, feedback } from '../forms/form-helper';
import { searchPropertySchema } from '../forms/schemas/propertySchema';
import { FilterIcon, SearchIcon } from '../utils/Icons';
import { generateNumOptions } from '@/utils/helpers';
import Modal from './Modal';
import InputFormat from '../forms/InputFormat';
import { BsFillHouseFill } from 'react-icons/bs';
import { BiSolidBuildingHouse, BiWater } from 'react-icons/bi';
import { GiFamilyHouse, GiSelect } from 'react-icons/gi';
import { PiHouseFill } from 'react-icons/pi';
import { FaParking, FaRoad } from 'react-icons/fa';
import classNames from 'classnames';

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
                <FilterButton />
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
                    <span
                      onClick={handleSubmit}
                      className="position-absolute top-50 input-search-icon translate-middle-y"
                    >
                      <SearchIcon />
                    </span>
                  )}
                </div>

                <div className="d-flex justify-content-center mt-3">
                  <FilterButton advanced />
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

export const FilterButton = ({ advanced = false }) => {
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
        className={classNames('me-md-3 mb-md-0 mb-3', {
          'btn-wide': advanced,
        })}
        onClick={() => setShowSearchModal(true)}
      >
        <FilterIcon />
        &nbsp; Filters
      </Button>
      <Modal
        title="Filters"
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        showFooter={false}
        size="lg"
      >
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
            <Form className="filter-container">
              <FilterSection title="Search by Name, Type, City or keywords">
                <Input
                  name="all"
                  optional
                  placeholder="Enter your search keywords here"
                />
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="form-row">
                  <InputFormat
                    formGroupClassName="col-md-6"
                    name="price[0]"
                    helpText="Lowest Price"
                    optional
                    showFeedback={feedback.ERROR}
                  />
                  <InputFormat
                    formGroupClassName="col-md-6"
                    name="price[1]"
                    helpText="Highest Price"
                    optional
                    hide
                    showFeedback={feedback.ERROR}
                  />
                </div>
              </FilterSection>

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
                name="houseType"
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
                    value: 'Car Parking',
                    icon: <FaParking />,
                  },
                  {
                    label: 'Portable Water',
                    value: 'Portable Water',
                    icon: <BiWater />,
                  },
                  {
                    label: 'Paved Roads',
                    value: 'Paved Roads',
                    icon: <FaRoad />,
                  },
                ]}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
              />

              <DisplayFormikState {...props} showAll hide />
              <Button
                className="ms-4 mt-3 mb-5"
                color={'primary'}
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                <FilterIcon /> Filter Properties
              </Button>
            </Form>
          )}
        </Formik>
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
  return (
    <FilterSection title={title}>
      <div className="row mb-4">
        <div className="col">
          {options.map(({ label, value, icon }) => (
            <button
              key={value}
              type="button"
              className={classNames('list-filter', {
                active: selectedOptions[name] === value,
                'with-icon': !!icon,
              })}
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
    </FilterSection>
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

const FilterSection = ({ title, children }) => (
  <section className="my-4 pb-3 px-4 border-bottom-dotted">
    <p className="fw-bold text-md mb-2">{title}</p>
    {children}
  </section>
);

export default AdvancedSearchPropertyForm;
