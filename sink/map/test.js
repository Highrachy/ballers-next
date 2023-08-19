import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import Map from 'sink/map/Map';

const TestMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY, // console.cloud.google.com
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
};

export default TestMap;
