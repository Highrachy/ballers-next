import React from 'react';
import PropTypes from 'prop-types';
import useMapGeocoder from 'hooks/useMapGeocoder';
import { Card } from 'react-bootstrap';
import MapPicker from './MapPicker';

const MapLocation = ({ mapAddress, setLocation, title }) => {
  const { latLngFromAddress } = useMapGeocoder({
    mapAddress,
  });
  console.log('mapAddress', mapAddress);
  console.log('latLngFromAddress', latLngFromAddress);
  return (
    <Card className="card-container mt-5">
      <section className="row">
        <div className="col-md-10 px-4">
          <div className="mb-4">
            <h5 className="mb-1">{title}</h5>
            <p className="small text-muted">
              You can drag the red map marker to the precise location to select
              a more accurate place or enter the longitude and latitude
              manually.
            </p>
          </div>
          <MapPicker
            mapLocation={latLngFromAddress}
            processLocation={(value) => {
              setLocation(value);
            }}
          />
        </div>
      </section>
    </Card>
  );
};

MapLocation.propTypes = {
  mapAddress: PropTypes.string,
  setLocation: PropTypes.func.isRequired,
  title: PropTypes.string,
};

MapLocation.defaultProps = {
  mapAddress: null,
  title: 'Set Map Location',
};

export default MapLocation;
