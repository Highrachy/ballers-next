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
        term,
      }}
      onSubmit={({ term }, actions) => {
        router.push(`/properties/search?term=${term}`);
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
                    name="term"
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
                    name="term"
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
  const [selectedOption, setSelectedOption] = React.useState({});
  const router = useRouter();
  return (
    <>
      <Button
        color="primary-light"
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
              term: '',
              price: [0, 0],
            }}
            onSubmit={({ term, price }, actions) => {
              let termOutput = `${term}`;

              let output = '';
              const { bathrooms, features, type } = selectedOption;

              if (features) {
                termOutput += ` ${features}`;
              }
              if (type) {
                termOutput += ` ${type}`;
              }

              if (bathrooms) {
                termOutput += ` ${bathrooms}`;
              }

              // if (toilets) {
              //   output += `&toilets=${toilets}:`;
              // }
              // if (bedrooms) {
              //   output += `&bedrooms=${bedrooms}:`;
              // }

              // if (price[0] > 0 || price[1] > 0) {
              //   output += [`&price=${price[0]}:${price[1]}`];
              // }

              const finalOutput = `term=${termOutput}`;

              router.push(`/properties/search?${finalOutput}`);

              setShowSearchModal(false);
            }}
          >
            {({ isSubmitting, handleSubmit, ...props }) => (
              <Form>
                <section>
                  <Input
                    label="What are you looking for"
                    name="term"
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
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />

                  <ListFilter
                    name="bedrooms"
                    title="Bedrooms"
                    options={[
                      { label: 'Any', value: null },
                      ...generateNumOptions(5, '+', { pluralizeText: false }),
                    ]}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />
                  <ListFilter
                    name="bathrooms"
                    title="Bathrooms"
                    options={[
                      { label: 'Any', value: null },
                      ...generateNumOptions(5, '+', { pluralizeText: false }),
                    ]}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />
                  <ListFilter
                    name="toilets"
                    title="Toilets"
                    options={[
                      { label: 'Any', value: null },
                      ...generateNumOptions(5, '+', { pluralizeText: false }),
                    ]}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
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
                        label: 'Tiled Road',
                        value: 'road',
                        icon: <FaRoad />,
                      },
                    ]}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />
                </section>
                <DisplayFormikState {...props} showAll hide />
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
  selectedOption,
  setSelectedOption,
}) => {
  const getClassName = (value) =>
    `btn btn-secondary${selectedOption[name] === value ? '' : '-light'} me-3`;

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
              setSelectedOption({ ...selectedOption, [name]: value })
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

export default AdvancedSearchPropertyForm;
