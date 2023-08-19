import React from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayer,
} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

const center = {
  lat: 37.774546,
  lng: -122.433523,
};

const HeatmapLayerExample = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    libraries: ['visualization'],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  if (!isLoaded) return <div>Loading...</div>;

  const onLoad = (heatmapLayer) => {
    console.log('HeatmapLayer onLoad heatmapLayer: ', heatmapLayer);
  };

  const onUnmount = (heatmapLayer) => {
    console.log('HeatmapLayer onUnmount heatmapLayer: ', heatmapLayer);
  };

  const heatmapData = [
    new google.maps.LatLng(37.782, -122.447),
    new google.maps.LatLng(37.782, -122.445),
    new google.maps.LatLng(37.782, -122.443),
    new google.maps.LatLng(37.782, -122.441),
    new google.maps.LatLng(37.782, -122.439),
    new google.maps.LatLng(37.782, -122.437),
    new google.maps.LatLng(37.782, -122.435),
    new google.maps.LatLng(37.785, -122.447),
    new google.maps.LatLng(37.785, -122.445),
    new google.maps.LatLng(37.785, -122.443),
    new google.maps.LatLng(37.785, -122.441),
    new google.maps.LatLng(37.785, -122.439),
    new google.maps.LatLng(37.785, -122.437),
    new google.maps.LatLng(37.785, -122.435),
  ];

  return (
    <GoogleMap
      id="heatmap-layer-example"
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
    >
      <HeatmapLayer onLoad={onLoad} onUnmount={onUnmount} data={heatmapData} />
    </GoogleMap>
  );
};

export default HeatmapLayerExample;
