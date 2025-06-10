/* ResultPage.jsx — full version that covers all sections in ResultCopy */
import { Badge, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { FaArrowRight, FaSyncAlt } from 'react-icons/fa';
import resultCopy from '@/data/campaign/result';
import { BuildingIcon } from '../utils/Icons';
import Button from '../forms/Button';
import { useEffect, useRef } from 'react';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';

export default function ResultPage({
  answers,
  yearsToBuy,
  availableFunds,
  totalNeeded,
}) {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current();
    }
  }, []);
  /* ── Tier badge ───────────────────────────────────────────────────── */
  const tier = (() => {
    if (yearsToBuy <= 2)
      return { emoji: '🏆', label: 'Certified Baller', variant: 'success' };
    if (yearsToBuy <= 5)
      return { emoji: '💰', label: 'Almost There', variant: 'primary' };
    if (yearsToBuy <= 9)
      return { emoji: '🔥', label: 'Getting Started', variant: 'warning' };
    return { emoji: '🔄', label: 'Boost Earnings', variant: 'secondary' };
  })();

  /* ── Helpers ──────────────────────────────────────────────────────── */
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /** get copy for a section id */
  const copy = (id) => {
    const val = resultCopy[id]?.[answers[id]];
    if (!val) return undefined;
    return Array.isArray(val) ? pick(val) : val;
  };

  /** expand template {foo} with user answers */
  const template = (str) =>
    str
      .replace('{number_of_bedrooms}', answers.number_of_bedrooms || '')
      .replace('{house_type}', answers.house_type || '')
      .replace('{ideal_location}', answers.ideal_location || '');

  /* ── Derived numbers ──────────────────────────────────────────────── */
  const houseChoice = [answers.number_of_bedrooms, answers.house_type]
    .filter(Boolean)
    .join(' ');

  const pct =
    totalNeeded <= 0
      ? 100
      : Math.min(100, (availableFunds / (availableFunds + totalNeeded)) * 100);

  /* pick rotating content */
  const statusObj = copy('homeownership_status') || { heading: '', body: '' };
  const houseSummary = template(pick(resultCopy.house_choice_summary));
  const tagline = pick(resultCopy.baller_tagline);
  const advice = pick(resultCopy.baller_advice);
  const how = pick(resultCopy.baller_how);

  /* ── Reset handler ───────────────────────────────────────────────── */
  const handleReset = () => {
    localStorage.removeItem('confirm_landlord_answers');
    window.location.reload();
  };

  /* ── UI ───────────────────────────────────────────────────────────── */
  return (
    <div className="result-paper py-5">
      <Container style={{ maxWidth: 900 }}>
        {/* ---------- TOP BAR ---------- */}
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-3">Your Homeownership Status</h2>
          <p className="text-muted lead">
            Here’s how you’re doing on your journey to homeownership
          </p>
          <BuildingIcon />
        </div>

        {/* ---------- HERO CARD ---------- */}
        <Card className="shadow-sm mb-4 hero-card">
          <Card.Body>
            <Row className="align-items-center g-4">
              <Col md={8}>
                <h2 className="fw-bold mb-3">{statusObj.heading}</h2>
                <p className="lead mb-0">{statusObj.body}</p>
              </Col>
              <Col
                md={4}
                className="text-md-end text-center d-flex flex-column align-items-center justify-content-center"
              >
                <FaSyncAlt size={80} className="text-primary hero-icon mb-2" />
                <Badge bg={`${tier.variant}-light`} className="fs-6 px-3 py-2">
                  {tier.emoji} {tier.label}
                </Badge>
              </Col>

              {/* ---------- HOUSE CHOICE SUMMARY ---------- */}
              {houseChoice && (
                <div className="dash-box dash-blue">
                  Preferred build:&nbsp;<strong>{houseChoice}</strong>
                  <br />
                  <p className="mb-0">{houseSummary}</p>
                </div>
              )}
            </Row>
          </Card.Body>
        </Card>

        {/* ---------- SAVINGS PROGRESS ---------- */}
        <Card className="shadow-sm mb-4 p-4">
          <Card.Body>
            <h5 className="fw-semibold mb-4">Savings Progress</h5>
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="dash-box dash-green">
                Cash in Hand: ₦{availableFunds.toLocaleString()}
              </div>
              <div className="dash-box dash-red">
                Still Needed: ₦{totalNeeded.toLocaleString()}
              </div>
            </div>
            <ProgressBar
              now={pct}
              label={`${Math.round(pct)}%`}
              className="progress-thick"
            />
          </Card.Body>
        </Card>

        {/* ---------- KEY INSIGHTS ---------- */}
        <Card className="shadow-sm mb-4 p-4">
          <Card.Body>
            <h5 className="fw-semibold mb-4">Key Insights</h5>
            <ul className="list-unstyled small mb-0">
              {/* timelines */}
              {answers.home_buying_timeline && (
                <li className="dash-box dash-yellow mb-3">
                  Buying timeline: {copy('home_buying_timeline')}
                </li>
              )}
              {answers.home_paying_timeline && (
                <li className="dash-box dash-blue mb-3">
                  Paying timeline: {copy('home_paying_timeline')}
                </li>
              )}

              {/* advisory */}
              {answers.financial_advisory && (
                <li className="dash-box dash-indigo mb-3">
                  Advisory habit: {copy('financial_advisory')}
                </li>
              )}

              {/* financial status bullets */}
              {answers.income_bracket && (
                <li className="dash-box dash-gray mb-3">
                  Income: {copy('income_bracket')}
                </li>
              )}
              {answers.saving_plan && (
                <li className="dash-box dash-green mb-3">
                  Savings: {copy('saving_plan')}
                </li>
              )}
              {answers.debt_profile && (
                <li className="dash-box dash-red mb-3">
                  Debt: {copy('debt_profile')}
                </li>
              )}
              {answers.retirement_planning && (
                <li className="dash-box dash-blue mb-3">
                  Retirement savings: {copy('retirement_planning')}
                </li>
              )}
              {answers.saving_percent && (
                <li className="dash-box dash-yellow mb-0">
                  Saving rate: {copy('saving_percent')}
                </li>
              )}
            </ul>
          </Card.Body>
        </Card>

        {/* ---------- TAGLINE + ADVICE ---------- */}
        <Card className="shadow-sm mb-4 p-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">{tagline}</h5>
            <p className="mb-2">{advice}</p>
            <p className="mb-0 text-muted lead">{how}</p>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap mb-5">
          <Button color="secondary" size="lg" href="/register">
            {resultCopy.call_to_action || 'Start Your BALLER Journey'}
            <FaArrowRight className="ms-2" />
          </Button>
          <Button color="danger-light" onClick={handleReset}>
            Reset & Start Over
          </Button>
        </div>

        {/* ---------- Confetti Animation ---------- */}
        {/* Confetti animation on load */}
        <Realistic autorun={{ speed: 0.3, duration: 9000 }} ref={confettiRef} />
      </Container>
    </div>
  );
}
