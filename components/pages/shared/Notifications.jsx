import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import PaginatedContent from 'components/common/PaginatedContent';
import { API_ENDPOINT } from 'utils/URL';
import { NotificationIcon } from 'components/utils/Icons';
import { BASE_API_URL, NOTIFICATION_TYPE } from 'utils/constants';
import TimeAgo from 'react-timeago';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
// import BallersSpinner from 'components/utils/BallersSpinner';
import { refreshQuery } from 'hooks/useQuery';
import { UserContext } from 'context/UserContext';

const Notifications = () => (
  <BackendPage>
    <PaginatedContent
      endpoint={API_ENDPOINT.getAllNotifications()}
      pageName="Notification"
      pluralPageName="Notifications"
      DataComponent={NotificationsRowList}
      PageIcon={<NotificationIcon />}
      queryName="notification"
      initialFilter={{ sortBy: 'createdAt', sortDirection: 'desc' }}
    />
  </BackendPage>
);

export const NotificationsRowList = ({ results, offset, setToast }) => {
  const [loading, setLoading] = React.useState(0);
  const { userDispatch } = React.useContext(UserContext);

  const markAsRead = (id) => {
    setLoading(id);
    Axios.put(
      `${BASE_API_URL}/notification/read/${id}/`,
      {},
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          refreshQuery('notification', true);
          setLoading(0);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(0);
      });
  };

  React.useEffect(() => {
    userDispatch({ type: 'read-all-notifcations' });
    Axios.put(
      `${BASE_API_URL}/notification/read/all`,
      {},
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (statusIsSuccessful(status)) {
          refreshQuery('notification', true);
          userDispatch({ type: 'read-all-notifcations' });
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid mb-5">
      <Card>
        <div className="table-responsive">
          <table className="table table-border table-sm mb-0 notifications">
            <tbody>
              {results?.map((notification, index) => (
                <NotificationsRow
                  key={index}
                  number={offset + index + 1}
                  loading={notification._id === loading}
                  markAsRead={markAsRead}
                  {...notification}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const NotificationsRow = ({
  _id,
  description,
  type,
  read,
  createdAt,
  markAsRead,
  loading,
}) => (
  <tr className={read ? 'notification__read' : 'notification__unread'}>
    <td>
      <span
        className={`icon-circle icon-circle__${NOTIFICATION_TYPE[type]}`}
      ></span>{' '}
      &nbsp; &nbsp;
      {description}
    </td>
    <td>
      <small className="text-muted">
        <TimeAgo date={createdAt} />
      </small>
    </td>
    {/* <td className="text-end">
      <small
        className="text-link text-secondary"
        onClick={() => markAsRead(_id)}
      >
        {loading ? <BallersSpinner small /> : !read && 'Mark as Read'}
      </small>
    </td> */}
  </tr>
);

export default Notifications;
