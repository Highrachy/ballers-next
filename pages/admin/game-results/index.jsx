/******************************************************************
 * pages/admin/game-results/index.jsx
 *
 *  – Lists ALL Game Results with pagination + filter
 *  – Uses PaginatedContent and the same helper ecosytem you already have
 ******************************************************************/
import React from 'react';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import Humanize from 'humanize-plus';
import Modal from 'components/common/Modal'; // your shared modal wrapper

import BackendPage from 'components/layout/BackendPage';
import PaginatedContent from 'components/common/PaginatedContent';
import WelcomeHero from '@/components/common/WelcomeHero';
import { Spacing } from 'components/common/Helpers';

import { API_ENDPOINT } from 'utils/URL'; // add getAllGameEntries()
import { GameIcon } from 'components/utils/Icons'; // make a simple icon or re-use any
import { Badge, Nav, Tab, Table } from 'react-bootstrap';
import {
  FiCalendar,
  FiMail,
  FiUser,
  FiHash,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

import { useCurrentRole } from 'hooks/useUser';
import { getShortDateTime } from '@/utils/date-helpers';
import { MdInsights } from 'react-icons/md';

/* ─────────────────────────────────────────────────────────────── */

const TOTAL_QUESTIONS = 11;

const GameResultsPage = () => (
  <BackendPage>
    <WelcomeHero
      title="Game Results"
      subtitle="View and analyse every BALL play-through"
    />

    <PaginatedContent
      endpoint={API_ENDPOINT.getAllGameEntries()} // NEW ↓↓↓ (see URL.js)
      addNewUrl={null} // no “Add new” for results
      pageName="Result"
      pluralPageName="Results"
      DataComponent={ResultsRowList}
      // FilterComponent={FilterForm}
      PageIcon={<GameIcon />}
      queryName="result"
    />
  </BackendPage>
);

export default GameResultsPage;

/* ─────────────────────────  TABLE LIST  ─────────────────────── */

const ResultsRowList = ({ results, offset }) => {
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState(null);

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setShowDetailsModal(true);
  };

  return (
    <div className="container-fluid">
      <Card className="mt-2">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Player</th>
                <th>Email</th>
                <th>Questions</th>
                <th>Result</th>
                <th>Date</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {results.map((entry, index) => (
                <ResultRow
                  key={entry._id}
                  number={offset + index + 1}
                  entry={entry}
                  onView={openModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/*  🔍  Details Modal  */}
      <ModalForGameDetails
        entry={selectedEntry}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
      />
    </div>
  );
};

const ResultRow = ({ number, entry, onView }) => {
  const {
    _id,
    contact,
    result,
    answers = {},
    sharedVia = [],
    createdAt,
  } = entry;
  const userType = useCurrentRole().name; // admin | super-admin etc.
  const answeredCount = Object.keys(answers).length;
  const hasResult = Boolean(result?.label);

  return (
    <tr>
      <td>{number}</td>
      <td>{contact?.name || contact.id}</td>
      <td>{contact?.email || '—'}</td>
      <td>
        {answeredCount}/{TOTAL_QUESTIONS}
      </td>
      <td>{hasResult ? 'Yes' : 'No'}</td>
      <td>{getShortDateTime(createdAt)}</td>
      <td>
        <Spacing />
        <Spacing />
        <button
          className={`btn btn-wide ${
            hasResult ? 'btn-success-light' : 'btn-secondary-light'
          }`}
          onClick={() => onView(entry)}
        >
          View details
        </button>
      </td>
    </tr>
  );
};
const STATUS_COLOURS = {
  'Certified Baller': 'success',
  'Almost There': 'primary',
  'Getting Started': 'warning text-dark',
  'Boost Earnings': 'secondary',
};

const ModalForGameDetails = ({
  entry,
  showDetailsModal,
  setShowDetailsModal,
}) => {
  if (!entry) return null;

  const {
    contact,
    answers = {},
    insights = {},
    result = {},
    sharedVia = [],
    createdAt,
  } = entry;

  const answeredCount = Object.keys(answers).length;
  const hasResult = Boolean(result.label);

  // Helper to clean up result.label
  const getCleanLabel = (label) => {
    if (!label) return '';
    let clean = label.replace(/^You are\s*/i, '');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  return (
    <Modal
      title="Game Details"
      size="md" /* sm keeps header tidy */
      show={showDetailsModal}
      onHide={() => setShowDetailsModal(false)}
      showFooter={false}
    >
      {/* STACK EVERYTHING VERTICALLY */}
      <div className="d-flex flex-column">
        {/* ── META CARD ───────────────────────────────────────── */}
        <section>
          <h6 className="text-uppercase  small mb-2">Overview</h6>
          <div className="d-flex align-items-center mb-2">
            <FiUser className="me-2 text-muted" />
            {contact?.name || '—'}
          </div>

          <div className="d-flex align-items-center mb-2">
            <FiMail className="me-2 text-muted" />
            {contact?.email || '—'}
          </div>

          <div className="d-flex align-items-center mb-2">
            <FiCalendar className="me-2 text-muted" />
            {getShortDateTime(createdAt)}
          </div>

          <div className="d-flex align-items-center mb-2">
            <FiHash className="me-2 text-muted" />
            <span className="font-monospace small">{contact.id}</span>
          </div>

          <div className="my-3">
            <Badge bg={hasResult ? 'success' : 'warning'} className="me-1">
              {hasResult ? 'Result ✓' : 'In-Progress'}
            </Badge>
            {hasResult && (
              <Badge
                bg={STATUS_COLOURS[result.label] || 'secondary'}
                className="me-1"
              >
                {getCleanLabel(result.label)}
              </Badge>
            )}
          </div>

          {sharedVia.length > 0 && (
            <div className="small text-muted">
              Shared:&nbsp;{sharedVia.join(', ')}
            </div>
          )}

          {hasResult && (
            <div className="mt-2">
              <a
                href={`/game/view-results?id=${contact?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-game btn-game--sm btn-game--navy text-white"
              >
                View Online
              </a>
            </div>
          )}
        </section>
        {/* ── TABS ────────────────────────────────────────────── */}
        <Tab.Container defaultActiveKey="answers">
          <Nav variant="tabs" className="mb-0">
            <Nav.Link eventKey="answers">
              Answers&nbsp;{' '}
              <Badge bg="light" text="dark">
                {answeredCount}/{TOTAL_QUESTIONS}
              </Badge>
            </Nav.Link>
            <Nav.Item>
              <Nav.Link eventKey="insights">
                Insights{' '}
                {Object.keys(insights).length > 0 && (
                  <Badge bg="secondary" pill>
                    {Object.keys(insights).length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="result">Result</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="small">
            {/* ANSWERS */}
            <Tab.Pane eventKey="answers">
              {answeredCount === 0 ? (
                <p className="text-muted">No answers yet.</p>
              ) : (
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  size="sm"
                  className="align-middle shadow-sm"
                >
                  <tbody>
                    {Object.entries(answers).map(([k, v]) => (
                      <tr key={k}>
                        <td className="text-capitalize fw-bold">
                          {k.replace(/_/g, ' ')}
                        </td>
                        <td className="ps-3">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab.Pane>

            {/* INSIGHTS */}
            <Tab.Pane eventKey="insights">
              {Object.keys(insights).length === 0 ? (
                <p className="text-muted">No insights yet.</p>
              ) : (
                <ul className="list-unstyled ps-3">
                  {Object.entries(insights).map(([k, v]) => (
                    <li key={k} className="mb-2 d-flex align-items-start gap-2">
                      <MdInsights className="text-primary flex-shrink-0 mt-1" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Tab.Pane>

            {/* RESULT */}
            <Tab.Pane eventKey="result">
              {hasResult ? (
                <section className="text-center">
                  <div className="result-image my-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/img/game/summary/${result.emoji}`}
                      alt="Certified Baller badge"
                      width={150}
                      className="img-fluid"
                    />
                  </div>

                  <h3 className="mb-4 fw-bold">
                    {getCleanLabel(result.label)}
                  </h3>

                  <div className="diamond-divider my-3">
                    <span />
                    <span className="diamond" />
                    <span />
                  </div>
                  <h4 className="my-2 text-gray">{result.description}</h4>
                  <hr />
                  <p className="text-lg text-muted">{result.summary}</p>
                </section>
              ) : (
                <p className="text-muted">
                  Result not available <FiXCircle className="text-warning" />
                </p>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Modal>
  );
};
