import React from 'react';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const options = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1,
};

const CircleExample = () => {
  const onLoad = (circle) => {
    console.log('Circle onLoad circle: ', circle);
  };

  const onUnmount = (circle) => {
    console.log('Circle onUnmount circle: ', circle);
  };

  return (
    <LoadScript
      libraries={['places']} // Add other necessary libraries
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="circle-example"
        mapContainerStyle={mapContainerStyle}
        zoom={7}
        center={center}
      >
        <Circle
          onLoad={onLoad}
          onUnmount={onUnmount}
          center={center}
          options={options}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default CircleExample;
