import React from 'react';
import { UserContext } from 'context/UserContext';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { valuesToOptions } from 'utils/helpers';

export const useAvailableOptions = () => {
  const { userState, userDispatch } = React.useContext(UserContext);
  const { availableOptions } = userState;

  React.useEffect(() => {
    availableOptions.states.length === 0 &&
      availableOptions.houseTypes.length === 0 &&
      Axios.get(`${BASE_API_URL}/property/available-options`, {
        headers: {
          Authorization: getTokenFromStore(),
        },
      })
        .then(function (response) {
          const { status, data } = response;
          if (status === 200) {
            userDispatch({
              type: 'available-options',
              availableOptions: {
                states: valuesToOptions(
                  data.availableFields.states,
                  'Any State'
                ),
                houseTypes: valuesToOptions(
                  data.availableFields.houseTypes,
                  'Any House Type'
                ),
              },
            });
          }
        })
        .catch(function () {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return availableOptions;
};
