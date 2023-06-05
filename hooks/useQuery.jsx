import React from 'react';
import Axios, { CancelToken } from 'axios';
import { queryCache, usePaginatedQuery, useQuery } from 'react-query';
import { getError, statusIsSuccessful } from 'utils/helpers';
import { getTokenFromStore } from 'utils/localStorage';

export const refreshQuery = (name, reloadQuery = false) =>
  queryCache.invalidateQueries(name, {
    refetchActive: reloadQuery,
  });

export const getQueryCache = (name) => queryCache.getQueryData(name);
export const setQueryCache = (name, value) =>
  queryCache.setQueryData(name, value);

const fetchQuery =
  ({
    endpoint,
    key,
    setResult,
    setToast,
    axiosOptions,
    noAuthentication = false,
  }) =>
  async () => {
    const source = CancelToken.source();

    // await new Promise((resolve) => setTimeout(resolve, 10_000));
    const promise = Axios.get(endpoint, {
      cancelToken: source.token,

      headers: {
        Authorization: !noAuthentication && getTokenFromStore(),
      },
      ...axiosOptions,
    })
      .then((res) => {
        if (statusIsSuccessful(res.status)) {
          setResult && setResult(res?.data?.[key]);
          return res?.data;
        }
        setToast({
          message: 'Request was not successful. Please try again later',
        });
      })
      .catch((error) => {
        setToast({
          message: getError(error),
        });
        throw new Error(getError(error));
      });

    promise.cancel = () => {
      setToast({ message: 'Query was cancelled' });
      source.cancel('Query was cancelled');
    };
    return promise;
  };

const getQueryOptions = (queryOptions = {}) => ({
  retry: 0,
  refetchOnWindowFocused: true,
  staleTime: Infinity, // still in memory but considered outdated
  cacheTime: Infinity, // time it would be removed in memoery
  ...queryOptions,
});

export const useGetQuery = ({
  name,
  endpoint,
  key,
  setToast,
  refresh,
  childrenKey,
  queryOptions = {},
  axiosOptions = {},
  noAuthentication = false,
}) => {
  const [result, setResult] = React.useState(null);

  if (refresh && getQueryCache(name)) {
    refreshQuery(name);
  }

  const queryResult = useQuery(
    name,
    fetchQuery({
      endpoint,
      key,
      setResult,
      setToast,
      axiosOptions,
      noAuthentication,
    }),
    getQueryOptions(queryOptions)
  );
  const output = result || queryResult?.data?.[key];

  if (childrenKey && output?.length > 0) {
    output.forEach((item) =>
      setQueryCache([name, item._id], { [childrenKey]: item })
    );
  }

  return [queryResult, output, setResult];
};

export const usePaginationQuery = ({
  name,
  endpoint,
  key,
  setToast,
  refresh,
  childrenKey,
  queryOptions = {},
  axiosOptions = {},
  noAuthentication = false,
}) => {
  let queryName = [name, axiosOptions.params];

  if (refresh) {
    refreshQuery(queryName);
  }

  const queryResult = usePaginatedQuery(
    queryName,
    fetchQuery({ endpoint, key, setToast, axiosOptions, noAuthentication }),
    getQueryOptions(queryOptions)
  );
  const result = queryResult?.resolvedData?.[key];
  const pagination = queryResult?.latestData?.pagination;

  if (!!pagination && pagination?.totalPage > pagination?.currentPage) {
    queryCache.prefetchQuery(
      [name, { ...axiosOptions.params, page: pagination?.currentPage + 1 }],
      fetchQuery({
        endpoint,
        key,
        setToast,
        axiosOptions: {
          ...axiosOptions,
          params: {
            ...axiosOptions.params,
            page: pagination?.currentPage + 1,
          },
        },
      }),
      getQueryOptions(queryOptions)
    );
  }

  if (childrenKey && result?.length > 0) {
    result.forEach((item) =>
      setQueryCache([childrenKey || name, item._id], { [childrenKey]: item })
    );
  }

  return [queryResult, result];
};
