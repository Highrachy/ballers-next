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

const ScheduledVisits = () => {
  const [toast, setToast] = useToast();
  const [scheduledVisits, setScheduledVisits] = React.useState(null);
  const { userState } = React.useContext(UserContext);
  const [showCalendar, setShowCalendar] = React.useState(false);

  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/visitation/all`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (status === 200) {
          setScheduledVisits(data.result);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [setToast]);

  const isAdmin = userState?.role === USER_ROLE.admin;

  // const calendarIsEnabled = isFeatureFlagEnabled(
  //   userState?.featureFlag || [],
  //   FEATURE_FLAG_LIST.tour
  // );

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title={`Scheduled Visits`}
        subtitle={`Manage your scheduled visits here`}
      />
      <TopTitle>Scheduled Visits</TopTitle>
      {showCalendar ? (
        <Calendar scheduledVisits={scheduledVisits} />
      ) : (
        <AllScheduledVisits
          scheduledVisits={scheduledVisits}
          toast={toast}
          isAdmin={isAdmin}
        />
      )}
      <Button
        color="secondary"
        className="ms-5 mt-4"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
      </Button>
    </BackendPage>
  );
};

const AllScheduledVisits = ({ scheduledVisits, isAdmin }) => (
  <LoadItems
    Icon={<VisitationIcon />}
    items={scheduledVisits}
    loadingText="Loading your Scheduled Visits"
    noContent={
      <NoContent
        Icon={<VisitationIcon />}
        isButton
        text="No Scheduled Visits found"
      />
    }
  >
    <ScheduledVisitsRowList
      isAdmin={isAdmin}
      scheduledVisits={scheduledVisits || []}
    />
  </LoadItems>
);

const ScheduledVisitsRowList = ({ scheduledVisits, isAdmin }) => {
  const [toast, setToast] = useToast();
  return (
    <div className="container-fluid">
      <Toast {...toast} showToastOnly />
      <Card className="mt-2">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Visitor Name</th>
                <th>Contact Info</th>
                <th>Date</th>
                <th>Property</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduledVisits.map((scheduledVisit, index) => (
                <ScheduledVisitsRow
                  key={index}
                  isAdmin={isAdmin}
                  number={index + 1}
                  {...scheduledVisit}
                  setToast={setToast}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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
  return (
    <tr>
      <td>{number}</td>
      <td>{visitorName}</td>
      <td>
        <strong>{visitorPhone}</strong> <br />
        <small>{visitorEmail}</small>
      </td>
      <td>
        <strong>{getTinyDate(visitDate)}</strong>
        <br />
        <small>{visitMode}</small>
      </td>
      <td>{propertyInfo[0] && propertyInfo[0].name}</td>
      <td>
        {status === 'Pending' && isAdmin ? (
          <Button
            color="success-light"
            className="btn-sm btn-wide"
            loading={loading}
            onClick={resolveVisitation}
          >
            Resolve
          </Button>
        ) : (
          status
        )}
      </td>
    </tr>
  );
};

export default ScheduledVisits;
