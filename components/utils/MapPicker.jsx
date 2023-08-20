import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import ReactMapPicker from 'react-google-map-picker';
import { OFFICE_LOCATION } from 'utils/constants';

const DEFAULT_ZOOM = 15;
const DEFAULT_LOCATION = OFFICE_LOCATION;

const MapPicker = ({ processLocation, mapLocation }) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  React.useEffect(() => {
    processLocation({ latLng: location, zoom });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, zoom]);

  React.useEffect(() => {
    mapLocation &&
      mapLocation.lat &&
      mapLocation.lng &&
      setLocation(mapLocation);
  }, [mapLocation]);

  const handleChange = (name, { target }) => {
    setLocation({
      ...location,
      [name]: parseFloat(target.value) || 0,
    });
  };

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setLocation(DEFAULT_LOCATION);
    setZoom(DEFAULT_ZOOM);
  }

  return (
    <>
      <div className="form-row">
        <div className="form-group col-sm-6">
          <label className="label-form">Latitute:</label>
          <input
            type="text"
            className="form-control"
            value={location && location.lat === 0 ? '' : location.lat}
            onChange={(value) => handleChange('lat', value)}
          />
        </div>
        <div className="form-group col-sm-6">
          <label>Longitute:</label>
          <input
            type="text"
            className="form-control"
            value={location && location.lng === 0 ? '' : location.lng}
            onChange={(value) => handleChange('lng', value)}
          />
        </div>
      </div>

      {location && location.lat && location.lng && (
        // <ReactMapPicker
        //   defaultLocation={location}
        //   zoom={zoom}
        //   style={{ height: '33rem' }}
        //   onChangeLocation={handleChangeLocation}
        //   onChangeZoom={handleChangeZoom}
        //   apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API}
        // />
      )}

      <div>
        <button
          className="btn btn-light btn-sm mt-4"
          onClick={handleResetLocation}
        >
          Reset Location
        </button>
      </div>
    </>
  );
};

MapPicker.propTypes = {
  processLocation: PropTypes.func,
};

MapPicker.defaultProps = {
  processLocation: () => {},
};
export default MapPicker;
