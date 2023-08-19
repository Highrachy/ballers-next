import React from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 38.685,
  lng: -115.234,
};

const position = { lat: 33.772, lng: -117.214 };

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};

const onLoad = (infoWindow) => {
  console.log('infoWindow: ', infoWindow);
};

const InfoWindowExample = () => {
  return (
    <LoadScript
      libraries={['places']} // Add other necessary libraries
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="InfoWindow-example"
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <InfoWindow onLoad={onLoad} position={position}>
          <div style={divStyle}>
            <h1>InfoWindow</h1>
          </div>
        </InfoWindow>
      </GoogleMap>
    </LoadScript>
  );
};

export default InfoWindowExample;
