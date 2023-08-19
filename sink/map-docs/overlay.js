import React from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  OverlayView,
  OverlayViewF,
} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 35.772,
  lng: -120.214,
};

const onClick = () => {
  console.info('I have been clicked!');
};

const divStyle = {
  background: 'white',
  border: '1px solid #ccc',
  padding: 15,
};

const options = {
  // libraries: ['visualization'],
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
};

const onLoad = (marker) => {
  console.log('marker: ', marker);
};

const MarkerExample = () => {
  return (
    <LoadScript
      // libraries={['places']} // Add other necessary libraries
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="overlay-view-example"
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
      >
        <OverlayViewF
          position={center}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={divStyle}>
            <h1>OverlayView</h1>

            <button onClick={onClick} type="button">
              Click me
            </button>
          </div>
        </OverlayViewF>
      </GoogleMap>
    </LoadScript>
  );
};

export default MarkerExample;
