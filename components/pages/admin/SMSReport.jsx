import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import BackendPage from 'components/layout/BackendPage';
import { getShortDateTime } from 'utils/date-helpers';
import { buildKudiSMSActionUrl } from 'utils/sms';
import { getNairaSymbol } from 'utils/helpers';
import TopTitle from 'components/utils/TopTitle';
import BallersSpinner from 'components/utils/BallersSpinner';
import { Card } from 'react-bootstrap';
import { ClockIcon } from 'components/utils/Icons';
import Tag from 'components/common/Tag';

const Reports = () => {
  const [loading, setLoading] = React.useState(true);
  const [balance, setBalance] = React.useState(null);
  const [reports, setReports] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    axios
      .post(buildKudiSMSActionUrl('balance'))
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (status === 200) {
          setBalance(data.balance);
        }
        setLoading(false);
      })
      .catch(function () {
        setBalance(0);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    axios
      .post(buildKudiSMSActionUrl('reports'))
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (status === 200) {
          setReports(data);
        }
      })
      .catch(function (error) {
        setReports([]);
      });
  }, []);

  return (
    <BackendPage>
      <section className="container-fluid">
        <TopTitle>
          SMS Balance:{' '}
          {loading ? (
            <BallersSpinner small />
          ) : (
            <>
              {getNairaSymbol()} {balance}
            </>
          )}
        </TopTitle>

        {reports && <ReportsRowList reports={reports} />}
      </section>
    </BackendPage>
  );
};

const ReportsRowList = ({ reports }) => (
  <div className="container-fluid">
    <Card>
      <div className="table-responsive">
        <table className="table table-border table-hover">
          <thead>
            <tr>
              <th>Status</th>
              <th>Phone</th>
              <th>Message</th>
              <th className="text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <ReportsRow key={index} report={report} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const ReportsRow = ({ report, number }) => (
  <tr>
    <td width="15%">
      <Tag
        color={
          report.status === 'DELIVERED' || report.status === 'Submitted'
            ? 'success'
            : 'danger'
        }
        text={report.status}
      />
    </td>
    <td width="15%">
      <div className="text-secondary fw-bold ls-1">{report.mobile}</div>
    </td>
    <td width="50%">
      <span className="text-gray block-text-small">{report.message}</span>
    </td>

    <td className="text-end" width="20%">
      <span className="text-gray block-text-small">
        <ClockIcon /> {getShortDateTime(report.date)}
      </span>
    </td>
  </tr>
);

ReportsRow.propTypes = {
  report: PropTypes.object.isRequired,
};

export default Reports;
