import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { API_ENDPOINT } from '@/utils/URL';
import axios from 'axios';
import SummaryPageComponent from '@/components/game/result/SummaryPageComponent';
import { FaExclamationTriangle } from 'react-icons/fa';
import BallersLogo from '@/components/utils/BallersLogo';

export default function ViewResultsPage() {
  const router = useRouter();
  const { id: contact_idParam } = router.query;
  const fallBackContactId = 'abc123def456'; // Fallback ID for testing
  const contact_id = contact_idParam || fallBackContactId;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!contact_id) return;
    setLoading(true);
    axios
      .get(`${API_ENDPOINT.getGameEntry()}/contact/${contact_id}`)
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [contact_id]);

  if (loading || contact_id === fallBackContactId) {
    return (
      <EmptyView>
        <span className="me-3">
          <svg
            width="64"
            height="64"
            viewBox="0 0 100 100"
            className="spin"
            style={{ verticalAlign: 'middle' }}
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#ffc107"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="188"
              strokeDashoffset="60"
            />
          </svg>
        </span>
        <span className="lead">Loading result...</span>
      </EmptyView>
    );
  }

  if (Object.keys(result?.result || {}).length === 0 && !loading) {
    return (
      <EmptyView>
        <FaExclamationTriangle className="me-3" size={128} color="#d9534f" />
        <ErrorAlert message="Sorry, we couldn't find the result you're looking for." />
      </EmptyView>
    );
  }

  return (
    <SummaryPageComponent
      contact={result.contact}
      answers={result.answers}
      bulletCache={result.insights}
      isSharedView
      userTier={result.result}
    />
  );
}

const EmptyView = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <Header />

      <section className="summary-container">
        <div className="summary-page">
          <div className="summary-content container text-center">
            <BallersLogo />

            <div className="mt-5 lead">{children}</div>
            <button
              onClick={() => router.push('/game')}
              className="btn-game btn-game--gold btn-game--xl mt-5"
            >
              Play Game
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

const ErrorAlert = ({ message }) => (
  <div
    className="alert alert-danger mt-4"
    role="alert"
    style={{
      border: '1.5px solid #f5c6cb',
      boxShadow: '0 2px 8px rgba(245, 54, 92, 0.08)',
    }}
  >
    <div>
      <h5 className="mb-1 text-danger fw-bold">Error Message</h5>
      <div className="lead">{message}</div>
    </div>
  </div>
);
