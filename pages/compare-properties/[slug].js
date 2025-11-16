import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';
import { API_ENDPOINT } from '@/utils/URL';
import Button from '@/components/forms/Button';
import { OnlineImage } from '@/components/utils/Image';
import { ArrowLeft } from 'iconsax-react';
import { Dropdown } from 'react-bootstrap';
import { moneyFormatInNaira } from '@/utils/helpers';
import { PropertyIcon } from '@/components/utils/Icons';
import SeoHead from '@/components/utils/SeoHead';

const CompareProperties = ({ property, otherProperties }) => {
  const [selectedProperty, setSelectedProperty] = React.useState(null);
  return (
    <>
      <SeoHead
        title="Compare Properties | BALL"
        description="This comparison view helps users evaluate multiple property features. Search engines should not index this dynamic comparison page."
        canonical={`https://www.ballers.ng/compare-properties/${
          property?.slug || ''
        }`}
        keywords={['compare property', 'property comparison']}
        noIndex
      />
      <Header />
      <TitleSection
        name="Compare Property"
        content="Find Your Perfect Match: Compare Properties and Discover Your Dream Home"
      />

      {selectedProperty ? (
        <ComparePropertiesSection
          property={property}
          selectedProperty={selectedProperty}
          otherProperties={otherProperties}
          setSelectedProperty={setSelectedProperty}
        />
      ) : (
        <SelectPropertyToCompare
          property={property || {}}
          otherProperties={otherProperties || []}
          setSelectedProperty={setSelectedProperty}
        />
      )}
      <CommunityGallery />
      <Footer />
    </>
  );
};

const SelectPropertyToCompare = ({
  setSelectedProperty,
  property,
  otherProperties,
}) => {
  const { name, price, mainImage: image, houseType, slug } = property;
  otherProperties;
  const otherPropertiesList = otherProperties
    .filter((prop) => prop.slug !== slug)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ slug, name, price, houseType }) => ({
      slug,
      name,
      houseType,
      price,
    }));
  return (
    <section>
      <div className="container">
        <h3 className="mb-4 mt-6">Select property to compare:</h3>
        <div className="card bg-gray">
          <div className="row g-4 py-4">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center">
              <PropertyImage
                image={image}
                name={name}
                houseType={houseType}
                price={price}
              />
            </div>
            <div className="col-md-4 text-center">
              <PropertyImage image="/img/placeholder/image.png" />
              <div className="mt-3 compare-property__dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    Select Property
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {otherPropertiesList.map(
                      ({ slug, name, price, houseType }, index) => (
                        <span
                          onClick={() => setSelectedProperty(slug)}
                          key={index}
                        >
                          <Dropdown.Item>
                            <div className="text-sm fw-bold px-4 pt-2">
                              {name} - {houseType}
                            </div>
                            <div className="text-sm fw-bold text-secondary px-4 pb-2">
                              {moneyFormatInNaira(price)}
                            </div>
                          </Dropdown.Item>
                        </span>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PropertyImage = ({ image, name, houseType = '', price = 0 }) => {
  return (
    <>
      <OnlineImage
        src={image}
        alt={`${name} - ${houseType}`}
        height="200"
        width="240"
        className="rounded img-rounded-cover"
        responsiveImage={false}
      />
      {name && (
        <>
          <h5 className="property-name mb-2 mt-3">{name}</h5>
          <div className="property-holder__house-type mb-2">
            <strong>
              <PropertyIcon /> {houseType}
            </strong>
          </div>
          <h5 className="text-secondary">{moneyFormatInNaira(price)}</h5>
        </>
      )}
    </>
  );
};

const ComparePropertiesSection = ({
  selectedProperty,
  property,
  otherProperties,
  setSelectedProperty,
}) => {
  const property2 = otherProperties.find(
    (property) => property.slug === selectedProperty
  );

  return (
    <section>
      <div className="container">
        <div className="text-end mb-5">
          <Button
            color="secondary-light"
            className="btn-md mt-5"
            onClick={() => setSelectedProperty(null)}
          >
            <ArrowLeft /> Back
          </Button>
        </div>
        <div className="card">
          <div className="table-responsive mb-0">
            <table className="table table-border table-compare table-cols-3">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-center">
                    <PropertyImage
                      image={property.mainImage}
                      name={property.name}
                      houseType={property.houseType}
                      price={property.price}
                    />
                  </th>
                  <th className="text-center">
                    <PropertyImage
                      image={property2.mainImage}
                      name={property2.name}
                      houseType={property2.houseType}
                      price={property2.price}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <CompareTableRow
                  title="Type"
                  value1={property.houseType}
                  value2={property2.houseType}
                />
                <CompareTableRow
                  title="BALL VIP"
                  value1={property.vendorInfo.vendor.companyName}
                  value2={property2.vendorInfo.vendor.companyName}
                />
                <CompareTableRow
                  title="Price"
                  value1={moneyFormatInNaira(property.price)}
                  value2={moneyFormatInNaira(property2.price)}
                />
                {/* <CompareTableRow
                  title="Location"
                  value1={getLocationFromAddress(project, true)}
                  value2={getLocationFromAddress(project2, true)}
                /> */}
                <CompareTableRow
                  title="Bedrooms"
                  value1={`${property.bedrooms} Bedrooms`}
                  value2={`${property2.bedrooms} Bedrooms`}
                />
                <CompareTableRow
                  title="Bathrooms"
                  value1={`${property.bathrooms} Bathrooms`}
                  value2={`${property2.bathrooms} Bathrooms`}
                />
                <CompareTableRow
                  title="Toilets"
                  value1={`${property.toilets} Toilets`}
                  value2={`${property2.toilets} Toilets`}
                />
                <CompareTableRow
                  title="Title Document"
                  value1={`${property.titleDocument || 'N/A'}`}
                  value2={`${property2.titleDocument || 'N/A'}`}
                />

                <CompareTableRow
                  title="Available Units"
                  value1={`${property.availableUnits} units`}
                  value2={`${property2.availableUnits} units`}
                />
                <CompareTableRow
                  title="Features"
                  value1={property.features.join(', ')}
                  value2={property2.features.join(', ')}
                />
                <tr>
                  <td className="text-primary fw-semibold">&nbsp;</td>
                  <td className={`text-center `}>
                    <Button
                      color="secondary-light"
                      className="btn-md btn-wide"
                      href={`/properties/${property?.slug || 'property-name'}`}
                    >
                      View Property
                    </Button>
                  </td>
                  <td className={`text-center`}>
                    <Button
                      color="secondary-light"
                      className="btn-md btn-wide"
                      href={`/properties/${property2?.slug || 'property-name'}`}
                    >
                      View Property
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

const CompareTableRow = ({ title, value1, value2 }) => {
  const className =
    value1 === value2 ? 'text-lighter' : 'text-primary fw-semibold';
  return (
    <tr>
      <td className="font-secondary text-primary fw-semibold">{title}</td>
      <td className={`text-center ${className}`}>{value1}</td>
      <td className={`text-center ${className}`}>{value2}</td>
    </tr>
  );
};

export default CompareProperties;

export async function getStaticProps({ params }) {
  const slug = params['slug'];
  const res = await fetch(API_ENDPOINT.getPropertyBySlug(slug));

  const { result } = await res.json();

  const propertiesRes = await fetch(API_ENDPOINT.getAllProperties());
  const { result: properties } = await propertiesRes.json();

  return {
    props: {
      property: result[0],
      otherProperties: properties,
    },
  };
}

export async function getStaticPaths() {
  const res = await fetch(API_ENDPOINT.getAllProperties());
  const { result: propertyLists } = await res.json();
  return {
    paths: propertyLists.map((propertyList) => {
      return {
        params: {
          slug: propertyList['slug'].toString(),
        },
      };
    }),
    fallback: true,
  };
}
