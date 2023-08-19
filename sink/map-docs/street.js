import React from 'react';
import {
  GoogleMap,
  LoadScript,
  StreetViewService,
} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 37.869085,
  lng: -122.254775,
};

const StreetViewServiceExample = () => {
  const onLoad = (streetViewService) => {
    streetViewService.getPanorama(
      {
        location: center,
        radius: 50,
      },
      (data, status) => {
        console.log('StreetViewService results', { data, status });
      }
    );
  };

  return (
    <LoadScript
      libraries={['places']} // Add other necessary libraries
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="circle-example"
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
      >
        <StreetViewService onLoad={onLoad} />
      </GoogleMap>
    </LoadScript>
  );
};

export default StreetViewServiceExample;
