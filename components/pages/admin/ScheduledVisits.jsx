import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Axios from 'axios';
import { BASE_API_URL } from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import LoadItems from 'components/utils/LoadingItems';
import NoContent from 'components/utils/NoContent';
import { VisitationIcon } from 'components/utils/Icons';
import { getError } from 'utils/helpers';
import { getTinyDate } from 'utils/date-helpers';
import TopTitle from 'components/utils/TopTitle';
import WelcomeHero from '@/components/common/WelcomeHero';

const ScheduledVisits = () => {
  const [toast, setToast] = useToast();
  const [scheduledVisits, setScheduledVisits] = React.useState(null);
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
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title={`Scheduled Visits`}
        subtitle={`Manage your scheduled visits here`}
      />
      <TopTitle>Scheduled Visits</TopTitle>
      <AllScheduledVisits scheduledVisits={scheduledVisits} toast={toast} />
    </BackendPage>
  );
};

const AllScheduledVisits = ({ scheduledVisits }) => (
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
    <ScheduledVisitsRowList scheduledVisits={scheduledVisits || []} />
  </LoadItems>
);

const ScheduledVisitsRowList = ({ scheduledVisits }) => (
  <div className="container-fluid">
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
            </tr>
          </thead>
          <tbody>
            {scheduledVisits.map((scheduledVisit, index) => (
              <ScheduledVisitsRow
                key={index}
                number={index + 1}
                {...scheduledVisit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

ScheduledVisitsRowList.propTypes = {
  scheduledVisits: PropTypes.array.isRequired,
};

const ScheduledVisitsRow = ({
  number,
  visitorName,
  visitorEmail,
  visitorPhone,
  visitDate,
  propertyInfo,
}) => (
  <tr>
    <td>{number}</td>
    <td>{visitorName}</td>
    <td>
      <strong>{visitorPhone}</strong> <br />
      <small>{visitorEmail}</small>
    </td>
    <td>
      <strong>{getTinyDate(visitDate)}</strong>
    </td>
    <td>{propertyInfo[0] && propertyInfo[0].name}</td>
  </tr>
);

export default ScheduledVisits;
