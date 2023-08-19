import React, { useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import Button from '@/components/forms/Button';
import { OFFICE_LOCATION } from '@/utils/constants';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = OFFICE_LOCATION;
const defaultPosition = OFFICE_LOCATION;

const MarkerExample = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    libraries: ['places'],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  const [position, setPosition] = useState(defaultPosition);
  const [infoWindow, setInfoWindow] = useState(null);

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  if (!isLoaded) return <div>Loading...</div>;

  const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      const infoWindow = new google.maps.InfoWindow();
      setInfoWindow(infoWindow);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open();
          setPosition(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  };

  return (
    <div>
      <Button className="mb-4 mt-n5" onClick={getCurrentLocation}>
        Get Current Location
      </Button>
      <GoogleMap
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
      >
        {position && (
          <InfoWindow position={position}>
            <div className="card">
              <h3>Your Location</h3>
            </div>
          </InfoWindow>
        )}
        {position && (
          <Marker
            position={position}
            title="Your Location"
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MarkerExample;
