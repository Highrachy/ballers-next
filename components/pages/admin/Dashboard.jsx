import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { UserContext } from 'context/UserContext';
import DashboardCards from 'components/common/DashboardCards';
import { OfferIcon } from 'components/utils/Icons';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { OFFER_STATUS, PROPERTY_VIDEO_STATUS } from 'utils/constants';
import { Loading } from 'components/utils/LoadingItems';
import { NoticeCard } from '../vendor/Dashboard';
import { PropertyVideosIcon } from 'components/utils/Icons';

const Dashboard = () => (
  <BackendPage>
    <Welcome />
  </BackendPage>
);

const Welcome = () => {
  const { userState } = React.useContext(UserContext);
  return (
    <section className="container-fluid">
      <div className="card bg-primary dashboard mb-3">
        <div className="row">
          <div className="col-sm-12">
            <h4>Hello, {userState.firstName} </h4>
            <p className="lead">Welcome to Admin Section!</p>
          </div>
        </div>
      </div>
      <CheckPendingNotifications />
      <DashboardCards />
    </section>
  );
};

const CheckPendingNotifications = () => {
  const axiosOptionForOffers = {
    params: { limit: 0, status: OFFER_STATUS.PENDING_ADMIN_APPROVAL },
  };
  const axiosOptionForVideos = {
    params: {
      limit: 0,
      status: PROPERTY_VIDEO_STATUS.PENDING_ADMIN_REVIEW,
    },
  };
  const [offersQuery] = useGetQuery({
    axiosOptions: axiosOptionForOffers,
    childrenKey: 'offer',
    key: 'pendingOffers',
    name: ['pendingOffers', axiosOptionForOffers],
    endpoint: API_ENDPOINT.getAllOffers(),
    refresh: true,
  });

  const [videosQuery] = useGetQuery({
    axiosOptions: axiosOptionForVideos,
    childrenKey: 'propertyVideos',
    key: 'propertyVideos',
    name: ['propertyVideos', axiosOptionForOffers],
    endpoint: API_ENDPOINT.getAllPropertyVideos(),
    refresh: true,
  });

  return (
    <>
      {offersQuery.isLoading || videosQuery.isLoading ? (
        <Loading size="small" text="" />
      ) : (
        <>
          {offersQuery?.data?.result?.length > 0 && (
            <NoticeCard
              Icon={<OfferIcon />}
              link="/admin/review-offers"
              name="Offers"
              type="warning"
              message={`You have ${offersQuery?.data?.result?.length} unresolved Offers`}
            />
          )}
          {videosQuery?.data?.result?.length > 0 && (
            <NoticeCard
              Icon={<PropertyVideosIcon />}
              link="/admin/property-videos"
              name="Property Videos"
              type="success"
              message={`You have ${videosQuery?.data?.result?.length} unresolved property videos`}
            />
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
