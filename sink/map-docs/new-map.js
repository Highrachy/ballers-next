import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  LoadScript,
  Marker,
  PlacesService,
  StreetViewPanorama,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';
import { OFFICE_LOCATION } from 'utils/constants';

const DEFAULT_ZOOM = 15;
const LIBRARIES = [];
const MAP_OPTIONS = {
  mapId: '7a8a72380bd8a9e',
  zoomControl: true,
  disableDefaultUI: true,
  clickableIcons: false,
  componentRestrictions: { country: 'ng' },
};

function MapPicker() {
  const [location, setLocation] = useState(OFFICE_LOCATION);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    setLocation(location);
    setZoom(DEFAULT_ZOOM);
  }, [location]);

  console.log('location', location);

  return (
    <LoadScript
      libraries={LIBRARIES}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <div className="map-picker">
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
            <StreetViewPanorama position={location} visible={true} />
            {location?.lat !== 0 && (
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
