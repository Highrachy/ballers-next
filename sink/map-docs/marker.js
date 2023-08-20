import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { OFFICE_LOCATION } from '@/utils/constants';

// https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = OFFICE_LOCATION;
const position = OFFICE_LOCATION;

const MarkerExample = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    libraries: ['places'],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  if (!isLoaded) return <div>Loading...</div>;
  console.log('google', google);
  console.log(
    'google?.maps?.Animation?.BOUNCE',
    google?.maps?.Animation?.BOUNCE
  );
  return (
    <div>
      <GoogleMap
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
      >
        <Marker position={position} animation={google.maps.Animation.DROP} />
      </GoogleMap>
    </div>
  );
};

export default MarkerExample;
