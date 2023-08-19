import React, { useState, useEffect, useMemo } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';

function MapWithAddress({
  defaultAddress = '4 adebisi street, shasha, Lagos state',
}) {
  const [center, setCenter] = useState(null);
  const [inputValue, setInputValue] = useState(defaultAddress || '');
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (defaultAddress.trim() !== '') {
      convertAddressToLatLng(defaultAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress]);

  const convertAddressToLatLng = async (addressToConvert) => {
    try {
      Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

      const response = await Geocode.fromAddress(addressToConvert);
      console.log('response: ', response);
      const { location } = response.results[0].geometry;

      setCenter(location);
      setMarker({ position: location });
    } catch (error) {
      console.error('Error converting address:', error);
    }
  };

  const options = useMemo(
    () => ({
      mapId: '7a8a72380bd8a9e',
      zoomControl: true,
      disableDefaultUI: true,
      clickableIcons: false,
      componentRestrictions: { country: 'ng' },
    }),
    []
  );

  const handlePlaceChanged = () => {
    const input = document.getElementById('autocomplete-input');
    if (input) {
      const selectedPlace = input.value;
      setInputValue(selectedPlace);
      convertAddressToLatLng(selectedPlace);
    }
  };

  return (
    <LoadScript
      libraries={['places']}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <div className="container mt-4">
        <h1 className="text-center mb-4">Address to LatLng Converter</h1>
        <div className="row">
          <div className="col-md-4">
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
              />
            </Autocomplete>
            <div className="mt-2">
              <p>Selected Address: {inputValue}</p>
              <p>Latitude: {center?.lat}</p>
              <p>Longitude: {center?.lng}</p>
            </div>
          </div>
          <div className="col-md-8">
            <GoogleMap
              zoom={15}
              center={center}
              mapContainerClassName="map-container"
              onZoomChanged={(newZoom) =>
                setCenter({ lat: center?.lat, lng: center?.lng, zoom: newZoom })
              }
              options={options}
              onLoad={(map) => console.log('map', map)}
            >
              {marker && (
                <Marker
                  position={marker?.position}
                  draggable={true}
                  onDragEnd={(event) => {
                    console.log('event.latLng', event.latLng);
                    setMarker({
                      position: event.latLng,
                    });
                    setCenter({
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng(),
                    });
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}

export default MapWithAddress;
