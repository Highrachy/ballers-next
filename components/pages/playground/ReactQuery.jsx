import Axios, { CancelToken } from 'axios';
import TitleSection from 'components/common/TitleSection';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/TopBar';
import React from 'react';
import { queryCache, useQuery } from 'react-query';
import { BASE_API_URL } from 'utils/constants';
import { getError, statusIsSuccessful } from 'utils/helpers';
import { getTokenFromStore } from 'utils/localStorage';

const MINUTES = 60 * 1000;

const ReactQuery = () => {
  const allStatesQuery = useGetAllStates();
  const allAreasQuery = useGetAllAreas();
  const oneStateQuery = useGetOneState();

  return (
    <>
      <Header />
      <TitleSection name="React Query" content="Testing React Query" />
      <div className="container-fluid">
        <h3>States</h3>
        {allStatesQuery.isLoading
          ? 'Loading'
          : allStatesQuery.isError
          ? allStatesQuery.error.message
          : allStatesQuery.data?.states?.map((state) => (
              <p key={state}>{state}</p>
            ))}

        <h4 className="mt-5">Lagos Areas</h4>
        {oneStateQuery.isLoading
          ? 'Loading'
          : oneStateQuery.isError
          ? oneStateQuery.error.message
          : oneStateQuery.data?.areas?.map((area) => (
              <p key={area.area}>{area.area}</p>
            ))}

        <h4 className="mt-5">All Areas</h4>
        {allAreasQuery.isLoading
          ? 'Loading'
          : allAreasQuery.isError
          ? allAreasQuery.error.message
          : allAreasQuery.data?.areas?.map((area) => (
              <p key={area._id}>{area.area}</p>
            ))}
      </div>
      <Footer />
    </>
  );
};

export const useGetAllStates = () => {
  const queryInfo = useQuery(
    'getAllStates',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Axios.get(`${BASE_API_URL}/area/states`).then((res) => {
        if (statusIsSuccessful(res.status)) {
          return res.data;
        }
        throw new Error(res);
      });
    },
    {
      retry: 2,
      refetchOnWindowFocused: true,
      staleTime: 10 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

  return { ...queryInfo, errorMessage: queryInfo?.error?.message };
};

export const useGetOneState = () =>
  useQuery(
    'getOneState',
    async () => {
      const source = CancelToken.source();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const promise = Axios.get(`${BASE_API_URL}/area/state/Lagos`, {
        cancelToken: source.token,
      })
        .then((res) => {
          if (statusIsSuccessful(res.status)) {
            return res.data;
          }
          throw new Error(
            getError('Request was not successful. Please try again later')
          );
        })
        .catch((error) => {
          throw new Error(getError(error));
        });
      promise.cancel = () => {
        source.cancel('Query was cancelled by React Query');
      };
      return promise;
    },
    {
      // initialData: () =>
      //   queryCache.getQueryData('posts')?.find((post) => post.id === postId), // get a single post from a previously retrieved all posts
      // initialStale: true,

      enabled: true,
      retry: 0,
      refetchOnWindowFocused: true,
      staleTime: 10 * MINUTES,
      cacheTime: 60 * MINUTES,
    }
  );

export const useGetAllAreas = () => {
  queryCache.invalidateQueries('getAllAreas', {
    // dont refetch when you invalidate query
    refetchActive: false,
  });
  const queryInfo = useQuery(
    'getAllAreas',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const results = await Axios.get(`${BASE_API_URL}/area/all`, {
        headers: {
          Authorization: getTokenFromStore(),
        },
      }).then((res) => {
        if (statusIsSuccessful(res.status)) {
          return res.data;
        }
        throw new Error(res);
      });

      results.areas.forEach((result) =>
        queryCache.setQueryData(['getAllAreas', result._id], result)
      );
      return results;
    },
    {
      retry: 0,
      refetchOnWindowFocused: true,
      staleTime: Infinity, // still in memory but considered outdated
      cacheTime: Infinity, // time it would be removed in memoery
    }
  );

  return { ...queryInfo, errorMessage: queryInfo?.error?.message };
};

// console.log(`queryInfo`, queryInfo?.error?.message);

export default ReactQuery;
