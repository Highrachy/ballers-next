import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  LoadScript,
} from '@react-google-maps/api';
// https://github.com/JustFly1984/react-google-maps-api/blob/0bd9291dfefb5fe57cd98fdeb7331532fe88410f/packages/react-google-maps-api/src/components/directions/DirectionsRenderer.md

const containerStyle = {
  height: '400px',
  width: '100%',
};

const center = {
  lat: 0,
  lng: -180,
};

const LIBRARIES = ['places'];

function DirectionsExample() {
  const [response, setResponse] = useState(null);
  const [directionsFormValue, setDirectionsFormValue] = useState({
    origin: '',
    destination: '',
    travelMode: 'DRIVING',
  });

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const directionsCallback = useCallback((result, status) => {
    if (result !== null && status === 'OK') {
      setResponse(result);
    } else {
      console.log('response: ', result);
    }
  }, []);

  const checkTravelMode = useCallback(
    (mode) => () => {
      setDirectionsFormValue((currentValue) => ({
        ...currentValue,
        travelMode: mode,
      }));
    },
    []
  );

  const onClick = useCallback(() => {
    if (
      originRef.current &&
      destinationRef.current &&
      originRef.current.value !== '' &&
      destinationRef.current.value !== ''
    ) {
      setDirectionsFormValue({
        ...directionsFormValue,
        origin: originRef.current.value,
        destination: destinationRef.current.value,
      });
    }
  }, [directionsFormValue]);

  return (
    <LoadScript
      libraries={LIBRARIES}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <div className="map">
        <div className="map-settings">
          <hr className="mt-0 mb-3" />
          <div className="row">
            <div className="col-md-6 col-lg-4">
              <div className="form-group">
                <label htmlFor="ORIGIN">Origin</label>
                <br />
                <input
                  id="ORIGIN"
                  className="form-control"
                  type="text"
                  ref={originRef}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="form-group">
                <label htmlFor="DESTINATION">Destination</label>
                <br />
                <input
                  id="DESTINATION"
                  className="form-control"
                  type="text"
                  ref={destinationRef}
                />
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap">
            {['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'].map((mode) => (
              <div
                className="form-group custom-control custom-radio mr-4"
                key={mode}
              >
                <input
                  id={mode}
                  className="custom-control-input"
                  name="travelMode"
                  type="radio"
                  checked={directionsFormValue.travelMode === mode}
                  onChange={checkTravelMode(mode)}
                />
                <label className="custom-control-label" htmlFor={mode}>
                  {mode}
                </label>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" type="button" onClick={onClick}>
            Build Route
          </button>
        </div>
        <div className="map-container">
          <GoogleMap
            id="direction-example"
            mapContainerStyle={containerStyle}
            zoom={2}
            center={center}
          >
            {directionsFormValue.destination !== '' &&
              directionsFormValue.origin !== '' && (
                <DirectionsService
                  options={{
                    destination: directionsFormValue.destination,
                    origin: directionsFormValue.origin,
                    travelMode: directionsFormValue.travelMode,
                  }}
                  callback={directionsCallback}
                />
              )}

            {response && (
              <DirectionsRenderer options={{ directions: response }} />
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
}

export default DirectionsExample;
