import React from 'react';
import { GoogleMap, LoadScript, DrawingManager } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 38.685,
  lng: -115.234,
};

const onLoad = (drawingManager) => {
  console.log(drawingManager);
};

const onPolygonComplete = (polygon) => {
  console.log(polygon);
};

const DrawingManagerExample = () => {
  return (
    <LoadScript
      libraries={['drawing']} // Add other necessary libraries
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="drawing-manager-example"
        mapContainerStyle={mapContainerStyle}
        zoom={2.5}
        center={center}
      >
        <DrawingManager onLoad={onLoad} onPolygonComplete={onPolygonComplete} />
      </GoogleMap>
    </LoadScript>
  );
};

export default DrawingManagerExample;
