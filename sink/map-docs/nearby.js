import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { OFFICE_LOCATION } from '@/utils/constants';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = OFFICE_LOCATION;
const position = OFFICE_LOCATION;

const customIconUrl = 'URL_TO_YOUR_CUSTOM_ICON_IMAGE'; // Replace with your icon URL

const MarkerExample = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    libraries: ['places'],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  useEffect(() => {
    if (loadError) {
      console.error('Map cannot be loaded right now, sorry.');
    }
  }, [loadError]);

  const onMapLoad = (map) => {
    const request = {
      location: OFFICE_LOCATION,
      radius: '1000',
    };

    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log('results: ', results);
        setNearbyPlaces(results);
      }
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-8">
          <GoogleMap
            id="marker-example"
            mapContainerStyle={mapContainerStyle}
            zoom={16}
            center={center}
            onLoad={onMapLoad}
          >
            {nearbyPlaces.map((place) => (
              <Marker
                key={place.place_id}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }}
                title={place.name}
                icon={place.icon}
                animation={window.google.maps.Animation.DROP}
              />
            ))}
          </GoogleMap>
        </div>
        <div className="col-md-4">
          <h3>Nearby Places</h3>
          <ul className="list-group">
            {nearbyPlaces.map((place) => (
              <li key={place.place_id} className="list-group-item">
                <h5>{place.name}</h5>
                <p>{place.vicinity}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarkerExample;
