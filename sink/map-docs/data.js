import React from 'react';
import { GoogleMap, LoadScript, Data } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 38.685,
  lng: -115.234,
};

const onLoad = (data) => {
  console.log('data: ', data);
};

const DataExample = () => {
  // Check if 'window' is defined before accessing it
  const controlPosition =
    typeof window !== 'undefined'
      ? window.google?.maps?.ControlPosition.TOP_LEFT
      : undefined;

  return (
    <LoadScript
      libraries={['places']} // Add other necessary libraries
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="data-example"
        mapContainerStyle={mapContainerStyle}
        zoom={2.5}
        center={center}
      >
        <Data
          onLoad={onLoad}
          options={{
            controlPosition,
            controls: ['Point'],
            drawingMode: 'Point', // "LineString" or "Polygon".
            featureFactory: (geometry) => {
              console.log('geometry: ', geometry);
            },
            clickable: true,
            draggable: true,
            editable: false,
            fillColor: '#FF0055',
            fillOpacity: 1,
            strokeColor: '#00FF55',
            strokeOpacity: 1,
            strokeWeight: 2,
            title: 'Title',
            visible: true,
            zIndex: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default DataExample;
