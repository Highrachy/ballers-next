import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { RightArrowIcon } from 'components/utils/Icons';
import PropertyPlaceholderImage from 'assets/img/placeholder/property-holder.jpg';
import { getPropertyHouseType, moneyFormatInNaira } from 'utils/helpers';
import { LoveIcon } from 'components/utils/Icons';
import { UserContext } from 'context/UserContext';
import { BASE_API_URL, PRICING_MODEL_DESC } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import BallersSpinner from 'components/utils/BallersSpinner';
import { BedIcon } from 'components/utils/Icons';
import { BathIcon } from 'components/utils/Icons';
import { ToiletIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import { PropertyIcon } from 'components/utils/Icons';
import { MapPinIcon } from 'components/utils/Icons';
import Image, { OnlineImage } from 'components/utils/Image';
import ProfileAvatar from 'assets/img/placeholder/property-holder.jpg';
import { useCurrentRole } from 'hooks/useUser';
import Button from '../forms/Button';

const PropertyCard = ({ isPublic, isFavorite, ...property }) => {
  const {
    name,
    address,
    houseType,
    mainImage,
    price,
    _id,
    slug,
    favourites,
    pricingModel,
    deliveryState,
  } = property;

  const [loading, setLoading] = React.useState(false);
  let { userState, userDispatch } = React.useContext(UserContext);

  const handleFavorites = (propertyId) => {
    setLoading(true);
    const FAVORITE_URL = isFavorite ? 'remove-favorite' : 'add-to-favorites';
    Axios.post(
      `${BASE_API_URL}/user/${FAVORITE_URL}`,
      { propertyId },
      {
        headers: {
          Authorization: getTokenFromStore(),
        },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setLoading(false);
          userDispatch({
            user: {
              favorites: isFavorite
                ? userState.favorites.filter(
                    (property) => property._id !== propertyId
                  )
                : [...userState.favorites, property],
            },
            type: 'add-favorite',
          });
        }
      })
      .catch(function () {
        setLoading(false);
      });
  };

  const currentRole = useCurrentRole().name;
  const propertyLink = isPublic
    ? `/properties/${slug}`
    : `/${currentRole}/property/${_id}`;

  return (
    <Card className="card-container property-card">
      <article>
        {userState?.isLoggedIn && (
          <>
            {loading ? (
              <div className="favorites-icon">
                <BallersSpinner small />
              </div>
            ) : (
              <div
                className={`favorites-icon ${
                  isFavorite
                    ? 'favorites-icon__is-favorite'
                    : 'favorites-icon__not-favorite'
                }`}
                onClick={() => handleFavorites(_id)}
              >
                <span>
                  <LoveIcon />
                </span>
              </div>
            )}
          </>
        )}
        <div className="content-image">
          {false && (
            <div className="featured-ribbon">
              <span>Featured</span>
            </div>
          )}
          <div className="image-top">
            <span className="type">
              Delivery State: {!!deliveryState ? deliveryState : 'Completed'}
            </span>
            {false && <span className="status">For Sale</span>}
          </div>
          <OnlineImage
            name={name}
            src={mainImage || PropertyPlaceholderImage}
            alt="Property"
            className="img-fluid property-holder__img"
          />
        </div>
        <div className="property-item">
          <h5 className="property-name mb-0 position-relative">
            {getPropertyHouseType(property)}
          </h5>
          {/* Details */}
          <div className="property-details property-spacing">
            <strong className="property-holder__house-type">
              <PropertyIcon /> {name}
            </strong>{' '}
          </div>

          {/* Price */}
          <h5 className="property-price property-spacing mb-1">
            {moneyFormatInNaira(price)}
          </h5>
          <div className="text-sm fw-normal mt-2 text-soft">
            <span className="property-holder__locationss">
              {address?.city}, {address?.state}
            </span>
            {/* &nbsp; | &nbsp; */}
            {/* {PRICING_MODEL_DESC?.[pricingModel] || 'Timeline Payment'} */}
          </div>
          {/* Info with Icons */}
          <div className="property-holder__separator my-3"></div>
          <div className="property-info property-spacing">
            <span className="pe-3">
              <BedIcon /> {property.bedrooms}{' '}
              {Humanize.pluralize(property.bedrooms, 'bed')}
            </span>
            |{' '}
            <span className="px-3">
              <BathIcon /> {property.bathrooms}{' '}
              {Humanize.pluralize(property.bathrooms, 'bath')}
            </span>
            |
            <span className="ps-3">
              <ToiletIcon /> {property.toilets}{' '}
              {Humanize.pluralize(property.toilets, 'toilet')}
            </span>
          </div>
          {/* View Button */}
          <div className="mt-4">
            <Button href={propertyLink} color="secondary-light" wide>
              View Details
            </Button>
          </div>
        </div>
      </article>
    </Card>
  );
};

export const RecommendedPropertyLists = ({
  properties,
  propertyClassName,
  isPublic,
}) => {
  const { userState } = React.useContext(UserContext);
  let favoritePropertyIds = userState?.favorites?.map((p) => p._id);

  return properties.map((property) => (
    <div className={propertyClassName} key={property._id}>
      <PropertyCard
        {...property}
        favorites={[]}
        isPublic={isPublic}
        isFavorite={favoritePropertyIds?.includes(property._id)}
      />
    </div>
  ));
};

RecommendedPropertyLists.propTypes = {
  properties: PropTypes.array.isRequired,
  propertyClassName: PropTypes.string,
  isPublic: PropTypes.bool,
};

RecommendedPropertyLists.defaultProps = {
  propertyClassName: '',
};

export const PropertyAvatar = ({
  property,
  nameOnly,
  portfolioId,
  linkToPage,
  className,
}) => {
  const { name = '', houseType = '', mainImage } = property;
  const currentRole = useCurrentRole().name;
  const propertyURL = portfolioId
    ? `/${currentRole}/portfolio/${portfolioId}`
    : `/${currentRole}/property/${property._id}`;

  const output = nameOnly ? (
    <span>{name}</span>
  ) : (
    <section className="d-flex">
      <div className="property-avatar">
        <Image
          alt={name}
          defaultImage={ProfileAvatar}
          className="img-fluid img-rounded"
          src={mainImage}
          title={name}
          name={name}
          width={80}
        />
      </div>

      <div className="user-info">
        <span className="user-name">
          {name}
          <span className="dot dot-success d-md-none ms-1"></span>
        </span>
        <small className="user-email">{houseType}</small>
      </div>
    </section>
  );
  return !linkToPage ? (
    output
  ) : (
    <Link href={propertyURL} className={className}>
      {output}
    </Link>
  );
};

PropertyAvatar.propTypes = {
  property: PropTypes.object.isRequired,
  nameOnly: PropTypes.bool,
  portfolioId: PropTypes.string,
  linkToPage: PropTypes.bool,
  className: PropTypes.string,
};

PropertyAvatar.defaultProps = {
  className: 'user-card',
  nameOnly: false,
  portfolioId: null,
  linkToPage: true,
};
export default PropertyCard;
