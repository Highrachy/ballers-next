import React from 'react';
import { GoogleMap, LoadScript, GroundOverlay } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 40.74,
  lng: -74.18,
};

const bounds = {
  north: 40.773941,
  south: 40.712216,
  east: -74.12544,
  west: -74.22655,
};

const LIBRARIES = ['places'];

function MyMapWithAutocomplete() {
  return (
    <LoadScript
      libraries={LIBRARIES}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="circle-example"
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
      >
        <GroundOverlay
          key={'url'}
          url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
          bounds={bounds}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default MyMapWithAutocomplete;
