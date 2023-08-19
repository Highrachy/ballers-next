import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';
import { OFFICE_LOCATION } from 'utils/constants';

const DEFAULT_ZOOM = 15;
const LIBRARIES = ['places'];
const MAP_OPTIONS = {
  mapId: '7a8a72380bd8a9e',
  zoomControl: true,
  disableDefaultUI: true,
  clickableIcons: false,
  componentRestrictions: { country: 'ng' },
};

function MapPicker({ processLocation, mapLocation, defaultAddress }) {
  const [location, setLocation] = useState(mapLocation || OFFICE_LOCATION);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [inputValue, setInputValue] = useState(defaultAddress || '');
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    processLocation({ latLng: location, zoom });
    convertLatLngToAddress(location);
  }, [location]);

  useEffect(() => {
    if (!mapLocation && defaultAddress) {
      setInputValue(defaultAddress);
      convertAddressToLatLng(defaultAddress);
    } else if (mapLocation && mapLocation.lat && mapLocation.lng) {
      setLocation(mapLocation);
      setZoom(DEFAULT_ZOOM);
      convertLatLngToAddress(mapLocation);
    }
  }, [mapLocation, defaultAddress]);

  const convertLatLngToAddress = async (locationToConvert) => {
    try {
      Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);
      const response = await Geocode.fromLatLng(
        locationToConvert.lat,
        locationToConvert.lng
      );
      const address = response.results[0].formatted_address;
      setInputValue(address);
    } catch (error) {
      console.error('Error converting location to address:', error);
    }
  };

  const convertAddressToLatLng = async (addressToConvert) => {
    try {
      Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);
      const response = await Geocode.fromAddress(addressToConvert);
      const { location } = response.results[0].geometry;
      setLocation(location);
      setZoom(DEFAULT_ZOOM);
    } catch (error) {
      console.error('Error converting address:', error);
    }
  };

  const handlePlaceChanged = () => {
    const input = document.getElementById('autocomplete-input');
    if (input) {
      const selectedPlace = input.value;
      setInputValue(selectedPlace);
      convertAddressToLatLng(selectedPlace);
    }
  };

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const handleResetLocation = () => {
    if (defaultAddress) {
      convertAddressToLatLng(defaultAddress);
    } else {
      setLocation(OFFICE_LOCATION);
      setZoom(DEFAULT_ZOOM);
    }
  };

  return (
    <LoadScript
      libraries={LIBRARIES}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <div className="map-picker">
        {/* Latitude and Longitude */}
        <div className="form-row">
          <div className="form-group col-sm-6">
            <label className="label-form">Latitude:</label>
            {isEditable ? (
              <input
                type="text"
                className="form-control"
                value={location.lat}
                onChange={(event) =>
                  setLocation({ ...location, lat: event.target.value })
                }
              />
            ) : (
              <label>{location.lat}</label>
            )}
          </div>
          <div className="form-group col-sm-6">
            <label className="label-form">Longitude:</label>
            {isEditable ? (
              <input
                type="text"
                className="form-control"
                value={location.lng}
                onChange={(event) =>
                  setLocation({ ...location, lng: event.target.value })
                }
              />
            ) : (
              <label>{location.lng}</label>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="form-row">
          <div className="form-group col-sm-12">
            <label className="label-form">Address:</label>
            <Autocomplete
              restrictions={{ country: 'ng' }}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                id="autocomplete-input"
                type="text"
                className="form-control"
                placeholder="Enter address..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onFocus={() => setInputValue('')}
              />
            </Autocomplete>
          </div>
        </div>

        {/* Google Map */}
        <div className="google-map-container">
          <GoogleMap
            zoom={zoom}
            center={location}
            mapContainerStyle={{ height: '33rem', width: '100%' }}
            onZoomChanged={(newZoom) =>
              setZoom((prevZoom) => ({
                ...location,
                zoom: newZoom,
              }))
            }
            options={MAP_OPTIONS}
          >
            {location.lat !== 0 && (
              <Marker
                position={location}
                draggable={true}
                onDragEnd={(event) =>
                  setLocation({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                  })
                }
              />
            )}
          </GoogleMap>
        </div>

        {/* Reset Location and Edit Toggle */}
        <div className="controls">
          <button
            className="btn btn-light btn-sm mt-4"
            onClick={() => {
              handleResetLocation();
            }}
          >
            Reset Location
          </button>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="editSwitch"
              checked={isEditable}
              onChange={toggleEditMode}
            />
            <label className="form-check-label" htmlFor="editSwitch">
              Edit
            </label>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}

MapPicker.propTypes = {
  processLocation: PropTypes.func,
  mapLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  defaultAddress: PropTypes.string,
};

MapPicker.defaultProps = {
  processLocation: (location) => {
    console.log('result', JSON.stringify(location, null, 2));
  },
};

export default MapPicker;
