// pages/game-stats.js
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FiBarChart2 } from 'react-icons/fi';
import GameLineChart from '@/components/game/shared/GameLineChart';
import { BASE_API_URL } from '@/utils/constants';
import SeoHead from '@/components/utils/SeoHead';

/* -------- helpers ---------- */
const api = axios.create({ baseURL: '/', timeout: 10000 });

const toSeries = (raw = []) => {
  const total = { id: 'Total Entries', data: [] };
  const withAnswers = { id: 'Started Game', data: [] };
  const withResult = { id: 'Completed Game', data: [] };

  raw.forEach((d) => {
    total.data.push({ x: d.date, y: d.totalEntries });
    withAnswers.data.push({ x: d.date, y: d.entriesWithAnswers });
    withResult.data.push({ x: d.date, y: d.entriesWithResult });
  });

  return [total, withAnswers, withResult];
};
/* --------------------------- */

export default function GameStatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`${BASE_API_URL}/game-entry/stats`);
      setStats(data?.stats || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <SeoHead
        title="BALL Game Statistics | User Engagement & Participation"
        description="Explore detailed statistics of user engagement and participation in the BALL game. Analyze trends and insights on game entries, completions, and more."
        canonical="https://www.ballers.ng/game-stats"
        noindex={true}
      />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-sm">
              <Card.Body style={{ minHeight: 460 }}>
                <GameLineChart
                  chartData={toSeries(stats)}
                  isLoading={loading}
                  isError={Boolean(error)}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
