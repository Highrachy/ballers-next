import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = { lat: 34.84555, lng: -111.8035 };

const MAP_OPTIONS = {
  mapId: '7a8a72380bd8a9e',
  zoomControl: true,
  disableDefaultUI: true,
  clickableIcons: false,
  componentRestrictions: { country: 'ng' },
};

const MarkerExample = () => {
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  useEffect(() => {
    if (loadError) {
      console.error('Map cannot be loaded right now, sorry.');
    }
  }, [loadError]);

  const onMapLoad = async (map) => {
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary('marker');
    const newMarkers = tourStops.map(({ position, title, ...others }, i) => {
      console.log('others: ', others);
      const pin = new PinElement({
        glyph: `${i + 1}`,
      });
      return new AdvancedMarkerElement({
        position,
        map,
        title: `${i + 1}. ${title}`,
        content: pin.element,
      });
    });
    setMarkers(newMarkers);
  };

  if (!isLoaded) return <div>Loading...</div>;

  const tourStops = [
    {
      position: { lat: 34.8791806, lng: -111.8265049 },
      title: 'Boynton Pass',
    },
    {
      position: { lat: 34.8559195, lng: -111.7988186 },
      title: 'Airport Mesa',
    },
    {
      position: { lat: 34.832149, lng: -111.7695277 },
      title: 'Chapel of the Holy Cross',
    },
    {
      position: { lat: 34.823736, lng: -111.8001857 },
      title: 'Red Rock Crossing',
    },
    {
      position: { lat: 34.800326, lng: -111.7665047 },
      title: 'Bell Rock',
    },
  ];

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-8">
          <GoogleMap
            id="marker-example"
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
            onLoad={onMapLoad}
            onClick={() => setActiveMarker(null)}
            options={MAP_OPTIONS}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                title={marker.title}
                onClick={() => handleActiveMarker(index)}
              >
                {activeMarker === index ? (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div>{marker.title}</div>
                  </InfoWindow>
                ) : null}
              </Marker>
            ))}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default MarkerExample;
