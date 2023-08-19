import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const centers = [
  {
    lat: 37.772,
    lng: -122.214,
  },
  {
    lat: 37.672,
    lng: -122.219,
  },
  {
    lat: 37.832,
    lng: -122.424,
  },
];

// Define the circle path separately
const CIRCLE_PATH =
  'M8 12l-4.7023 2.4721.898-5.236L.3916 5.5279l5.2574-.764L8 0l2.3511 4.764 5.2574.7639-3.8043 3.7082.898 5.236z';

const MarkerExample = () => {
  return (
    <LoadScript
      libraries={['places']} // Add other necessary libraries
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    >
      <GoogleMap
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={2}
        center={centers[0]}
      >
        <Marker
          icon={{
            path: CIRCLE_PATH,
            scale: 7,
          }}
          position={centers[0]}
        />
        <Marker
          icon={{
            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          }}
          position={centers[1]}
        />
        <Marker
          icon={{
            path: CIRCLE_PATH,
            fillColor: 'yellow',
            fillOpacity: 0.9,
            scale: 2,
            strokeColor: 'gold',
            strokeWeight: 2,
          }}
          position={centers[2]}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MarkerExample;
