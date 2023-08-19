import React from 'react';
import {
  GoogleMap,
  LoadScript,
  StreetViewPanorama,
} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 51.5320665,
  lng: -0.177203,
};

const StreetViewPanoramaExample = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
      <GoogleMap
        id="street-view-example"
        mapContainerStyle={mapContainerStyle}
        zoom={7}
        center={center}
      >
        <StreetViewPanorama position={center} visible={true} />
      </GoogleMap>
    </LoadScript>
  );
};

export default StreetViewPanoramaExample;
