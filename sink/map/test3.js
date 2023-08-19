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
  const [address, setAddress] = useState(defaultAddress || '');
  const [marker, setMarker] = useState(null);

  const handleBlur = () => {
    if (address.trim() !== '') {
      convertAddressToLatLng();
    }
  };

  useEffect(() => {
    if (defaultAddress.trim() !== '') {
      convertAddressToLatLng();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress]);

  const convertAddressToLatLng = async () => {
    try {
      // Set your Google Maps API key (if required)
      Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

      const response = await Geocode.fromAddress(address);
      const { location } = response.results[0].geometry;

      setCenter(location);
      setMarker({ position: location });
    } catch (error) {
      console.error('Error converting address:', error);
    }
  };

  const options = useMemo(
    () => ({
      // styling - https://console.cloud.google.com/projectselector2/google/maps-apis/studio/styles
      mapId: '7a8a72380bd8a9e',
      zoomControl: true,
      // streetViewControl: true,
      // mapTypeControl: true,
      // fullscreenControl: true,
      disableDefaultUI: true,
      clickableIcons: false,
      componentRestrictions: { country: 'ng' },
    }),
    []
  );

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
              onPlaceChanged={() => {
                // setAddress(place.name);
                // setCenter(place.geometry.location);
              }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Enter address..."
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                onBlur={handleBlur}
              />
            </Autocomplete>
            <div className="mt-2">
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

// ... (propTypes and export)

export default MapWithAddress;
