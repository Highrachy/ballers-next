import React, { useState } from 'react';
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
  getError,
  getPropertyHouseType,
  getRange,
  getTitleCase,
  statusIsSuccessful,
  valuesToOptions,
} from 'utils/helpers';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import BackendPage from 'components/layout/BackendPage';
import { PropertyIcon } from 'components/utils/Icons';
import { moneyFormatInNaira } from 'utils/helpers';
import Image from 'components/utils/Image';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import {
  BASE_API_URL,
  HOUSE_TYPES,
  PRICING_MODEL_DESC,
  STATES,
} from 'utils/constants';
import { useCurrentRole } from 'hooks/useUser';
import { API_ENDPOINT } from 'utils/URL';
import { Spacing } from 'components/common/Helpers';
import { SuccessIcon } from 'components/utils/Icons';
import { WarningIcon } from 'components/utils/Icons';
import InputFormat from 'components/forms/InputFormat';
import FilterRange from 'components/forms/FilterRange';
import WelcomeHero from '../common/WelcomeHero';
import { HelpBox } from '../dashboard/HelpBox';
import Humanize from 'humanize-plus';
import helpGuide from '@/data/docs/vip-accounts/managing-property-listings-vip.json';
import Modal from '../common/Modal';
import Axios from 'axios';
import { getTokenFromStore } from '@/utils/localStorage';
import { setQueryCache } from '@/hooks/useQuery';
import { ApprovePropertyButton } from './SingleProperty';
import DropdownButton from '../forms/DropdownButton';

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

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

      <HelpBox helpGuide={helpGuide} />
    </BackendPage>
  );
};

const PropertiesRowLists = ({ results, offset, setToast, ...props }) => {
  const [properties, setProperties] = useState(results);

  return (
    <div className="container-fluid">
      {properties.map((property, index) => (
        <PropertiesList
          setToast={setToast}
          key={index}
          number={offset + index + 1}
          property={property}
          properties={properties}
          setProperties={setProperties}
          {...props}
        />
      ))}
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
};

export const PropertiesList = ({ setToast = () => {}, property, ...props }) => {
  const {
    _id,
    name,
    address,
    price,
    availableUnits,
    units,
    mainImage,
    approved,
    flagged,
    deliveryState,
    pricingModel,
    vendorInfo,
  } = property;
  const userType = useCurrentRole().name;
  const propertyIsFlagged = !!useCurrentRole().isUser && flagged?.status;
  const isSoldOut = availableUnits === 0;
  const { properties, setProperties } = props;

  return (
    <div className="card property-card mb-5">
      <div className="row g-0 p-3">
        <div className="col-lg-4">
          <Link href={`/${userType}/property/${_id}`} passHref>
            <a className="content-image">
              <Image
                name={property?.name}
                src={mainImage}
                alt={`property ${_id}`}
                className="property-card__img small rounded-1"
              />
              <div className="image-top">
                <span className="type">
                  Delivery State:{' '}
                  {!!deliveryState ? deliveryState : 'Completed'}
                </span>
                {false && <span className="status">For Sale</span>}
              </div>
              {propertyIsFlagged && (
                <span className="badge bg-danger position-absolute top-0 start-0">
                  Reported
                </span>
              )}
            </a>
          </Link>
        </div>
        <div className="col-lg-8">
          <div className="card-body ps-4">
            <div className="d-xl-flex justify-content-between">
              <div>
                <Link href={`/${userType}/property/${_id}`} passHref>
                  <a>
                    <h5 className="property-name d-flex mb-0">
                      <span className="me-2">{name} </span>

                      {!useCurrentRole().isUser ? (
                        isSoldOut ? (
                          <small className="badge text-bg-primary opacity-50">
                            Sold Out
                          </small>
                        ) : approved?.status ? (
                          <small className="text-success">
                            <SuccessIcon />
                          </small>
                        ) : (
                          <small className="text-warning">
                            <WarningIcon />
                          </small>
                        )
                      ) : null}
                    </h5>
                  </a>
                </Link>
                <div className="property-details">
                  <strong className="property-holder__house-type">
                    {getPropertyHouseType(property)}
                  </strong>{' '}
                </div>
              </div>
              <h5 className="property-price property-spacing mb-1">
                {moneyFormatInNaira(price)}
              </h5>
            </div>
            <div className="property__meta pt-3">
              <figure>
                <figcaption>Location</figcaption>
                <p>
                  {address?.city}, {address?.state}
                </p>
              </figure>
              <figure>
                <figcaption>Available</figcaption>
                <p>
                  {availableUnits} {Humanize.pluralize(availableUnits, 'unit')}
                </p>
              </figure>
              <figure>
                <figcaption>Payment Type</figcaption>
                <p>{PRICING_MODEL_DESC?.[pricingModel] || 'Timeline'}</p>
              </figure>
              {useCurrentRole().isAdmin && (
                <figure>
                  <figcaption>Vendor</figcaption>
                  <p>{vendorInfo?.vendor?.companyName}</p>
                </figure>
              )}
            </div>
            <div className="pt-4 d-md-flex">
              <Button
                href={`/${userType}/property/${_id}`}
                color="secondary-light"
                wide
                className="btn-sm me-3 mb-3"
              >
                View
              </Button>
              {useCurrentRole().isVendor && (
                <>
                  <Button
                    href={`/${userType}/property/edit/${_id}`}
                    color="info-light"
                    wide
                    className="btn-sm me-3 mb-3"
                  >
                    Edit
                  </Button>

                  <ManagePropertyButton
                    setToast={setToast}
                    property={property}
                    {...props}
                  />
                </>
              )}

              {useCurrentRole().isAdmin &&
                property?.availableUnits > 0 &&
                !property?.approved?.status && (
                  <ApprovePropertyButton
                    property={property}
                    setToast={setToast}
                    className="btn-sm btn-danger-light btn-wide me-3 mb-3"
                    afterSave={() => {
                      setProperties(
                        properties.map((currentProperty) =>
                          currentProperty._id === property._id
                            ? {
                                ...currentProperty,
                                approved: {
                                  by: currentProperty._id, // pseudo id
                                  date: Date.now(),
                                  status: true,
                                },
                              }
                            : currentProperty
                        )
                      );
                    }}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
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

const ManagePropertyButton = ({ setToast, property, ...props }) => {
  const { properties, setProperties } = props;
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (!properties) return null;

  const markAsSoldOut = () => {
    setLoading(true);

    const payload = {
      id: property?._id,
      availableUnits: 0,
    };

    Axios.put(`${BASE_API_URL}/property/update`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setQueryCache([pageOptions.key, data.property._id], {
            property: data.property,
          });
          setToast({
            type: 'success',
            message: 'Your property has been successfully marked as sold out',
          });
          // update setProperties state to  properties by setting  the availableUnits of data.property._id i properties to 0
          setProperties(
            properties.map((property) =>
              property._id === data.property._id
                ? { ...property, availableUnits: 0 }
                : property
            )
          );

          setLoading(false);
          setShowModal(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  return (
    <div className="row">
      <div className="col-12">
        <DropdownButton
          wide
          className="btn-sm me-3 mb-3"
          color="primary-light"
          dropdownItems={[
            ...(property?.availableUnits > 0 && [
              {
                text: 'Mark as Sold Out',
                onClick: () => setShowModal(true),
              },
            ]),
            {
              text: 'Duplicate Property',
              href: `/vendor/property/duplicate/${property?._id}`,
            },
          ]}
        >
          Manage
        </DropdownButton>
        <Modal
          title="Mark Property as Sold Out"
          show={showModal}
          onHide={() => setShowModal(false)}
          showFooter={false}
          size="md"
        >
          <section className="row">
            <div className="col-md-12 my-3 text-center">
              <p className="mx-3 confirmation-text fw-bold">
                Are you sure you want to mark this property as sold out? It
                would no longer be available for sale.
              </p>
              <Button
                color="primary"
                className="mb-5"
                onClick={markAsSoldOut}
                loading={loading}
              >
                Mark as Sold Out
              </Button>
            </div>
          </section>
        </Modal>
      </div>
    </div>
  );
};

export default Properties;
