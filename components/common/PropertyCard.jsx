import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from '@reach/router';
import { RightArrowIcon } from 'components/utils/Icons';
import PropertyPlaceholderImage from 'assets/img/placeholder/property-holder.jpg';
import { moneyFormatInNaira } from 'utils/helpers';
import { LoveIcon } from 'components/utils/Icons';
import { UserContext } from 'context/UserContext';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import BallersSpinner from 'components/utils/BallersSpinner';
import { BedIcon } from 'components/utils/Icons';
import { BathIcon } from 'components/utils/Icons';
import { ToiletIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import { PropertyIcon } from 'components/utils/Icons';
import { MapPinIcon } from 'components/utils/Icons';
import Image from 'components/utils/Image';
import ProfileAvatar from 'assets/img/placeholder/property-holder.jpg';
import { useCurrentRole } from 'hooks/useUser';

export const OldPropertyCard = (property) => {
  const { name, address, favorites, houseType, mainImage, price, _id } =
    property;
  const [loading, setLoading] = React.useState(false);
  const isFavorite = (favorites || []).includes(_id);
  let { userDispatch } = React.useContext(UserContext);

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
          userDispatch({ type: FAVORITE_URL, property });
        }
      })
      .catch(function () {
        setLoading(false);
      });
  };
  const currentRole = useCurrentRole().name;

  return (
    <section className="mb-3">
      <Card className="card-container property-holder">
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
        <div className="row">
          <div className="col-md-5">
            <img
              src={mainImage || PropertyPlaceholderImage}
              alt="Property"
              className="img-fluid property-holder__img"
            />
          </div>
          <div className="col-md-7">
            <h5 className="font-weight-500 mt-3 mt-md-0">{name}</h5>
            <div className="property-holder__location">
              Location:{' '}
              <strong>
                {address?.city}, {address?.state}
              </strong>
            </div>
            <div className="property-holder__house-type">
              House Type: <strong>{houseType}</strong>
            </div>

            <h5 className="mt-2">{moneyFormatInNaira(price)}</h5>
            <div className="property-holder__separator"></div>

            <Link
              className="text-uppercase small float-right badge badge-dark property-holder__details"
              to={`/${currentRole}/property/${_id}`}
            >
              Details{' '}
              <div className="small-icon">
                <RightArrowIcon />
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
};

const PropertyCard = (property) => {
  const { name, address, favorites, houseType, mainImage, price, _id } =
    property;
  const [loading, setLoading] = React.useState(false);
  const isFavorite = (favorites || []).includes(_id);
  let { userDispatch } = React.useContext(UserContext);

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
          userDispatch({ type: FAVORITE_URL, property });
        }
      })
      .catch(function () {
        setLoading(false);
      });
  };
  const currentRole = useCurrentRole().name;

  return (
    <section>
      <Card className="card-container property-card">
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
        <Link to={`/${currentRole}/property/${_id}`}>
          <article>
            <div className="content-image">
              <img
                src={mainImage || PropertyPlaceholderImage}
                alt="Property"
                className="img-fluid property-holder__img"
              />
            </div>
            <div className="property-item">
              <h5 className="property-name mb-0">{name}</h5>
              {/* Details */}
              <div className="property-details property-spacing">
                <span className="property-holder__house-type">
                  <strong>
                    <PropertyIcon /> {houseType}
                  </strong>
                </span>{' '}
                &nbsp; | &nbsp;
                <span className="property-holder__location">
                  <strong>
                    <MapPinIcon /> {address?.city}, {address?.state}
                  </strong>
                </span>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  {/* Price */}
                  <h5 className="property-price property-spacing">
                    {moneyFormatInNaira(price)}
                  </h5>
                </div>
                <div className="col-sm-6 text-right">
                  <button className="btn btn-sm btn-secondary">
                    View Details
                  </button>
                </div>
              </div>
              {/* Info with Icons */}
              <div className="property-holder__separator my-3"></div>
              <div className="property-info property-spacing">
                <span className="pr-3">
                  <BedIcon /> {property.bedrooms}{' '}
                  {Humanize.pluralize(property.bedrooms, 'bed')}
                </span>
                |{' '}
                <span className="px-3">
                  <BathIcon /> {property.bathrooms}{' '}
                  {Humanize.pluralize(property.bathrooms, 'bath')}
                </span>
                |
                <span className="pl-3">
                  <ToiletIcon /> {property.toilets}{' '}
                  {Humanize.pluralize(property.toilets, 'toilet')}
                </span>
              </div>
            </div>
          </article>
        </Link>
      </Card>
    </section>
  );
};

export const RecommendedPropertyLists = ({ properties, propertyClassName }) => {
  const { userState } = React.useContext(UserContext);
  let favoritePropertyIds = userState.favorites.map((p) => p._id);

  return properties.map((property) => (
    <div className={propertyClassName} key={property._id}>
      <PropertyCard {...property} favorites={favoritePropertyIds} />
    </div>
  ));
};

RecommendedPropertyLists.propTypes = {
  properties: PropTypes.array.isRequired,
  propertyClassName: PropTypes.string,
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
    <>
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
          <span className="dot dot-success d-md-none ml-1"></span>
        </span>
        <small className="user-email">{houseType}</small>
      </div>
    </>
  );
  return !linkToPage ? (
    output
  ) : (
    <Link to={propertyURL} className={className}>
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
