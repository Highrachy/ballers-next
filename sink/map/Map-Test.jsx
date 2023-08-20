import { useMemo, useCallback, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

export default function Map() {
  const mapRef = useRef();
  const center = useMemo(() => ({ lat: 48.8584, lng: 2.2945 }), []);
  const options = useMemo(
    () => ({
      // styling - https://console.cloud.google.com/projectselector2/google/maps-apis/studio/styles
      mapId: '7a8a72380bd8a9e',
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const onLoad = useCallback((map) => (mapRef.current = map), []);
  return (
    <div className="test-map">
      <div className="p-container">
        <div className="controls">
          <h1>Commute?</h1>
        </div>
        <div className="map">
          <GoogleMap
            zoom={10}
            center={center}
            mapContainerClassName="map-container"
            options={options}
            onLoad={onLoad}
          >
            <Marker position={center} />
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: '#8BC34A',
  fillColor: '#8BC34A',
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: '#FBC02D',
  fillColor: '#FBC02D',
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: '#FF5252',
  fillColor: '#FF5252',
};

const generateHouses = (position) => {
  const _houses = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
