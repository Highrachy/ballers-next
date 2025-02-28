import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Axios from 'axios';
import {
  BASE_API_URL,
  FEATURE_FLAG_LIST,
  isFeatureFlagEnabled,
  USER_ROLE,
} from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import LoadItems from 'components/utils/LoadingItems';
import NoContent from 'components/utils/NoContent';
import { VisitationIcon } from 'components/utils/Icons';
import { getError } from 'utils/helpers';
import { getTinyDate } from 'utils/date-helpers';
import TopTitle from 'components/utils/TopTitle';
import Button from 'components/forms/Button';
import WelcomeHero from '@/components/common/WelcomeHero';
import Calendar from '@/components/shared/Calendar';
import { UserContext } from '@/context/UserContext';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import PaginatedContent from './PaginatedContent';

const ScheduledVisits = () => {
  const [showCalendar, setShowCalendar] = React.useState(false);
  return (
    <BackendPage>
      <WelcomeHero
        title={`Scheduled Visits`}
        subtitle={`Manage your scheduled visits here`}
      />
      <PaginatedContent
        limit={20}
        endpoint={`${BASE_API_URL}/visitation/all`}
        initialFilter={{
          sortBy: 'createdAt',
          sortDirection: 'desc',
        }}
        pageName="Scheduled Visit"
        DataComponent={ScheduledVisitsRowList}
        // FilterComponent={FilterForm}
        PageIcon={<VisitationIcon />}
        queryName="scheduled-visit"
        showCalendar={showCalendar}
        hidePagination={showCalendar}
        setShowCalendar={setShowCalendar}
      />
    </BackendPage>
  );
};

const ScheduledVisitsRowList = ({
  results,
  offset,
  showCalendar,
  setShowCalendar,
}) => {
  const { userState } = React.useContext(UserContext);
  const isAdmin = userState?.role === USER_ROLE.admin;
  const [toast, setToast] = useToast();

  const ShowButton = () => (
    <section className="row">
      <div className="col">
        <Button
          color="secondary-light"
          className="mt-4 float-end"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </Button>
      </div>
    </section>
  );

  return (
    <div className="container-fluid">
      <Toast {...toast} showToastOnly />

      {showCalendar ? (
        <>
          <Calendar scheduledVisits={results} />
          <ShowButton />
        </>
      ) : (
        <>
          <ShowButton />
          <Card className="mt-2">
            <div className="table-responsive">
              <table className="table table-border table-hover">
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Visitor Name</th>
                    {isAdmin && <th>Contact Info</th>}
                    <th>Date</th>
                    <th>Property</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((scheduledVisit, index) => (
                    <ScheduledVisitsRow
                      key={index}
                      isAdmin={isAdmin}
                      number={offset + index + 1}
                      {...scheduledVisit}
                      setToast={setToast}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

ScheduledVisitsRowList.propTypes = {
  scheduledVisits: PropTypes.array.isRequired,
};

const ScheduledVisitsRow = ({
  _id,
  number,
  visitorName,
  visitorEmail,
  visitorPhone,
  visitDate,
  visitMode,
  propertyInfo,
  status,
  setToast,
  isAdmin,
}) => {
  const [loading, setLoading] = React.useState(false);

  const resolveVisitation = () => {
    setLoading(true);
    Axios.put(
      `${BASE_API_URL}/visitation/resolve`,
      { visitationId: _id },
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status, data } = response;
        if (status === 200) {
          setToast({
            message: data.message,
            type: 'success',
          });
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Cancelled':
        return 'text-danger';
      case 'Pending':
        return 'text-warning';
      case 'Resolved':
        return 'text-success';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Cancelled':
        return <FaTimesCircle />;
      case 'Pending':
        return <FaClock />;
      case 'Resolved':
        return <FaCheckCircle />;
      default:
        return null;
    }
  };

  const statusTextColor = getStatusTextColor(status);
  const statusIcon = getStatusIcon(status);

  return (
    <tr>
      <td>{number}</td>
      <td>{visitorName}</td>
      {isAdmin && (
        <td>
          <strong>{visitorPhone}</strong> <br />
          <small>{visitorEmail}</small>
        </td>
      )}
      <td>
        <strong>{getTinyDate(visitDate)}</strong>
        <br />
        <small>{visitMode}</small>
      </td>
      <td>{propertyInfo[0] && propertyInfo[0].name}</td>
      <td>
        {status === 'Pending' && isAdmin ? (
          <Button
            color="secondary"
            className="btn-sm btn-wide"
            loading={loading}
            onClick={resolveVisitation}
          >
            Resolve
          </Button>
        ) : (
          <span
            className={`d-flex align-items-center justify-content-center p-2 ${statusTextColor}`}
          >
            {statusIcon}
            <span className="ms-2">{status}</span>
          </span>
        )}
      </td>
    </tr>
  );
};
export default ScheduledVisits;
