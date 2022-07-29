import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, isDevEnvironment } from 'utils/helpers';

export const usePagination = ({ url, limit, page, filters }) => {
  const [toast, setToast] = useToast();
  const [output, setOutput] = React.useState(null);

  React.useEffect(() => {
    setOutput(null);
    Axios.get(`${BASE_API_URL}/${url}`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
      params: { limit, page, ...filters },
    })
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (isDevEnvironment()) {
          console.info(
            '%c[ADMIN LIST] URL',
            'color: orange',
            `${BASE_API_URL}/${url}`
          );
          console.info('%c[ADMIN LIST DATA]', 'color: red', response?.data);
        }
        if (status === 200) {
          setOutput(data);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [limit, page, setToast, url, filters]);

  return [output?.result, output?.pagination, toast];
};

usePagination.propTypes = {
  limit: PropTypes.number,
  page: PropTypes.number.isRequired,
  filters: PropTypes.object,
  url: PropTypes.string.isRequired,
};

usePagination.defaultProps = {
  filters: {},
  limit: 10,
};
