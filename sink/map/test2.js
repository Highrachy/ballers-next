import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = ({ defaultLat = 48.8584, defaultLng = 2.2945 }) => {
  const [center, setCenter] = useState({
    lat: defaultLat,
    lng: defaultLng,
  });

  const [marker, setMarker] = useState({
    position: center,
  });

  const iconBase =
    'https://developers.google.com/maps/documentation/javascript/examples/full/images/';

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
      <div className="test-map">
        <div className="p-container">
          <div className="controls">
            <h1>Commute?</h1>
          </div>
          <div className="map">
            <GoogleMap
              zoom={15}
              center={center}
              onZoomChanged={(newZoom) =>
                setCenter({ lat: center.lat, lng: center.lng, zoom: newZoom })
              }
              mapContainerClassName="map-container"
              // options={options}
            >
              {marker && (
                <Marker
                  position={marker?.position}
                  // map={this.map}
                  draggable={true}
                  onDragEnd={(event) => {
                    setMarker({
                      position: event.latLng,
                    });
                    console.log(
                      'event',
                      event?.latLng?.lat(),
                      event?.latLng?.lng()
                    );
                  }}
                />
              )}
              {/* <Marker
                position={center}
                icon={iconBase + 'parking_lot_maps.png'}
                label="Eiffel Tower"
              /> */}
            </GoogleMap>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default Map;
