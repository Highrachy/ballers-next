import React, { useMemo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const Map = ({ coordinates, zoom }) => {
  const center = useMemo(
    () => ({ lat: coordinates.lat, lng: coordinates.lng }),
    [coordinates]
  );
  const options = useMemo(
    () => ({
      mapId: '7a8a72380bd8a9e',
      zoomControl: true,
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <GoogleMap
        zoom={zoom}
        center={center}
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          minHeight: '20rem',
        }}
        options={options}
      >
        {/* <StreetViewPanorama position={center} visible={true} /> */}
        <Marker position={center} animation={google.maps.Animation.BOUNCE} />
      </GoogleMap>
    </>
  );
};

export default Map;
