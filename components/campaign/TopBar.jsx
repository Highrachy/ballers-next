const TopBar = ({ currentStep, totalSteps, title, isAnswered, onDotClick }) => {
  const dots = Array.from({ length: totalSteps });
  const pct = (currentStep / (totalSteps - 1)) * 100; // 0 → 100

  return (
    <div className="top-bar mb-6">
      <h4 className="m-0 text-muted fw-semibold text-center mb-3">{title}</h4>
      <div className="text-muted small text-left mb-2">
        Question {currentStep + 1} of {totalSteps}
      </div>
      <div className="progress-line">
        {/* coloured bar */}
        <div className="progress-fill" style={{ width: `${pct}%` }} />

        {/* dots */}
        {dots.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index <= currentStep ? 'active' : ''} ${
              isAnswered?.(index) ? 'clickable' : ''
            }`}
            style={{ left: `${(index / (totalSteps - 1)) * 100}%` }}
            onClick={() => isAnswered?.(index) && onDotClick?.(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TopBar;
