import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Popover, OverlayTrigger } from 'react-bootstrap';

const Map = ({ children, coordinates, zoom, pinColor }) => {
  return (
    <>
      {children}
      <GoogleMapReact
        key={JSON.stringify(`${coordinates.lat} ${coordinates.lng}`)}
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API }}
        defaultCenter={{
          lat: parseFloat(coordinates.lat),
          lng: parseFloat(coordinates.lng),
        }}
        defaultZoom={zoom || 18}
      >
        <Marker
          lat={coordinates.lat}
          lng={coordinates.lng}
          pinColor={pinColor}
        />
      </GoogleMapReact>
    </>
  );
};

const Marker = ({ pinColor }) => (
  <>
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="top"
      overlay={popover}
    >
      <div className={`pin ${pinColor}`}></div>
    </OverlayTrigger>
    <div className="pulse"></div>
  </>
);

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Popover right</Popover.Title>
    <Popover.Content>
      And here's some <strong>amazing</strong> content. It's very engaging.
      right?
    </Popover.Content>
  </Popover>
);

export default Map;
