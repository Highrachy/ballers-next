import Geocode from 'react-geocode';
// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// import { OFFICE_LOCATION } from 'utils/constants';

const useMapGeocoder = ({ mapAddress }) => {
  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API);

  // set response language. Defaults to english.
  Geocode.setLanguage('en');

  // set response region. Its optional.
  // A Geocoding request with region=es (Spain) will return the Spanish city.
  Geocode.setRegion('ng');

  // Enable or disable logs. Its optional.
  Geocode.enableDebug();

  // Get address from latidude & longitude.
  // Geocode.fromLatLng(OFFICE_LOCATION.lat, OFFICE_LOCATION.lng).then(
  //   (response) => {
  //     console.log('response.results[0]', response.results[0]);
  //     const address = response.results[0].formatted_address;
  //     console.log('ADDRESS ', address);
  //   },
  //   (error) => {
  //     console.error(error);
  //   }
  // );

  const [latLngFromAddress, setLatLngFromAddress] = useState(null);

  useEffect(() => {
    if (!mapAddress) {
      return undefined;
    }

    // Get latidude & longitude from address.
    Geocode.fromAddress(mapAddress).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLatLngFromAddress({ lat, lng });
      },
      (error) => {
        console.error(error);
        setLatLngFromAddress(null);
      }
    );

    return () => undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapAddress]); // Empty array ensures that effect is only run on mount and unmount

  return { latLngFromAddress };
};

// useMapGeocoder.propTypes = {
//   mapAddress: PropTypes.string,
// };

// useMapGeocoder.defaultProps = {
//   mapAddress: ,
// };
export default useMapGeocoder;
