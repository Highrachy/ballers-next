import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import PaginatedContent from 'components/common/PaginatedContent';
import { Form, Formik } from 'formik';
import {
  DisplayFormikState,
  processFilterValues,
} from 'components/forms/form-helper';
import Select from 'components/forms/Select';
import {
  booleanOptions,
  formatFilterBoolean,
  formatFilterString,
  generateNumOptions,
  getPropertyHouseType,
  getRange,
  getTitleCase,
  valuesToOptions,
} from 'utils/helpers';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import BackendPage from 'components/layout/BackendPage';
import { PropertyIcon } from 'components/utils/Icons';
import { moneyFormatInNaira } from 'utils/helpers';
import Image from 'components/utils/Image';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import { HOUSE_TYPES, PRICING_MODEL_DESC, STATES } from 'utils/constants';
import { useCurrentRole } from 'hooks/useUser';
import { API_ENDPOINT } from 'utils/URL';
import { Spacing } from 'components/common/Helpers';
import { SuccessIcon } from 'components/utils/Icons';
import { WarningIcon } from 'components/utils/Icons';
import { BedIcon } from 'components/utils/Icons';
import { BathIcon } from 'components/utils/Icons';
import InputFormat from 'components/forms/InputFormat';
import { ToiletIcon } from 'components/utils/Icons';
import FilterRange from 'components/forms/FilterRange';
import WelcomeHero from '../common/WelcomeHero';
import { HelpBox } from '../dashboard/HelpBox';
import helpGuide from '@/data/docs/vip-accounts/managing-property-listings-vip.json';

const Properties = () => {
  const addNewUrl = useCurrentRole().isVendor ? '/vendor/property/new' : '';
  return (
    <BackendPage>
      <WelcomeHero
        title={`Properties`}
        subtitle={`Manage your properties here`}
      />
      <PaginatedContent
        addNewUrl={addNewUrl}
        endpoint={API_ENDPOINT.getAllProperties()}
        initialFilter={{ sortBy: 'createdAt', sortDirection: 'desc' }}
        pageName="Property"
        pluralPageName="Properties"
        noContentLink={{
          linkText: 'Add New Property',
          linkTo: '/vendor/property/new',
          isButton: true,
          buttonClassName: 'btn-secondary',
        }}
        DataComponent={PropertiesRowLists}
        FilterComponent={FilterForm}
        PageIcon={<PropertyIcon />}
        queryName="property"
      />
      <div className="mt-7">
        <HelpBox helpGuide={helpGuide} />
      </div>
    </BackendPage>
  );
};

const PropertiesRowLists = ({ results, offset }) => (
  <div className="container-fluid">
    <Card>
      <div className="table-responsive">
        <table className="table table-border table-hover">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((property, index) => (
              <PropertiesRow
                key={index}
                number={offset + index + 1}
                {...property}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
    {useCurrentRole().isAdmin && (
      <div className="my-5 text-end">
        <Link href="/admin/reported-properties">
          <a className="btn btn-wide btn-danger-light">
            View Reported Properties
          </a>
        </Link>
      </div>
    )}
  </div>
);

const PropertiesRow = (property) => {
  const {
    _id,
    name,
    address,
    price,
    number,
    mainImage,
    approved,
    flagged,
    bedrooms,
    bathrooms,
    toilets,
    pricingModel,
  } = property;
  const userType = useCurrentRole().name;
  const propertyIsFlagged = !useCurrentRole().isUser && flagged?.status;

  return (
    <tr>
      <td>{number}</td>
      <td>
        <div
          className={`${
            propertyIsFlagged ? 'overlay overlay__danger' : ''
          } d-inline-block`}
        >
          <Link href={`/${userType}/property/${_id}`} passHref>
            <a>
              <Image
                src={mainImage}
                name={`property ${_id}`}
                className="img-compact"
                alt="property"
                defaultImage={PropertyPlaceholderImage}
              />

              {propertyIsFlagged && (
                <span className="overlay__content">Reported</span>
              )}
            </a>
          </Link>
        </div>
      </td>
      <td>
        {name}{' '}
        {!useCurrentRole().isUser &&
          (approved?.status ? (
            <small className="text-success">
              <Spacing />
              <SuccessIcon />
            </small>
          ) : (
            <small className="text-warning">
              <Spacing />
              <WarningIcon />
            </small>
          ))}
        <span className="block-text-small text-muted">
          {address?.city}, {address?.state}
        </span>
      </td>
      <td>
        {getPropertyHouseType(property)}
        <div className="text-smaller text-muted">
          <span className="pe-2">
            {bedrooms} <BedIcon />
          </span>
          |{' '}
          <span className="px-2">
            {bathrooms} <BathIcon />
          </span>
          |
          <span className="ps-2">
            {toilets} <ToiletIcon />
          </span>
        </div>
      </td>
      <td>
        <h5 className="text-secondary">{moneyFormatInNaira(price)}</h5>
        <span className="block-text-small text-soft">
          {PRICING_MODEL_DESC?.[pricingModel] || 'Timeline - Spread Payment'}
        </span>
      </td>
      <td>
        <Link href={`/${userType}/property/${_id}`} passHref>
          <a className="btn btn-wide btn-sm btn-secondary-light">View</a>
        </Link>
        {useCurrentRole().isVendor && (
          <>
            <Spacing />
            <Spacing />
            <Link href={`/${userType}/property/new/${_id}`} passHref>
              <a className="btn btn-sm btn-wide btn-primary-light">Edit</a>
            </Link>
          </>
        )}
      </td>
    </tr>
  );
};

const FilterForm = ({ setFilterTerms }) => {
  return (
    <Formik
      initialValues={{}}
      onSubmit={(values, actions) => {
        const payload = processFilterValues(values);
        setFilterTerms(payload, {
          name: formatFilterString('Property Name', values.name),
          price: `Price : ${getRange(values?.price, { suffix: 'Naira' })}`,
          houseType: formatFilterString(
            'House Type',
            getTitleCase(values?.houseType)
          ),
          toilets: formatFilterString('Toilet', values.toilets),
          state: formatFilterString('State', values.state),
          city: formatFilterString('City', values.city),
          approved: formatFilterBoolean('Approved', values.approved),
          flagged: formatFilterBoolean('Flagged', values.flagged),
          bedrooms: formatFilterString('Bathrooms', values.bedrooms),
          bathrooms: formatFilterString('Bathrooms', values.bathrooms),
        });
      }}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <section>
            <Input label="Property Name" name="name" />

            <FilterRange
              Field={InputFormat}
              name="price"
              label="Price"
              values={props?.values}
            />

            <FilterRange
              Field={Select}
              name="toilets"
              label="Toilets"
              options={{
                options: generateNumOptions(9, 'Toilet'),
                placeholder: 'Select Toilets',
              }}
              values={props?.values}
            />
            <FilterRange
              Field={Select}
              name="bathrooms"
              label="Bathrooms"
              options={{
                options: generateNumOptions(9, 'Bathroom'),
                placeholder: 'Select Bathrooms',
              }}
              values={props?.values}
            />

            <FilterRange
              Field={Select}
              name="bedrooms"
              label="Bedrooms"
              options={{
                options: generateNumOptions(9, 'Bedroom'),
                placeholder: 'Select Bedrooms',
              }}
              values={props?.values}
            />

            <Select
              label="House Type"
              name="houseType"
              options={valuesToOptions(HOUSE_TYPES)}
              placeholder="House Type"
            />

            <Input label="City" name="city" />

            <Select
              label="State"
              name="state"
              options={valuesToOptions(STATES)}
              placeholder="Select State"
            />

            <Select
              label="Flagged"
              name="flagged"
              options={booleanOptions()}
              placeholder="Flagged Property"
            />

            <Select
              label="Approved"
              name="approved"
              options={booleanOptions()}
              placeholder="Approved Property"
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
  );
};

export default Properties;
