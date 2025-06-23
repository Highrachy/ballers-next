import GameButton from '../shared/GameButton';

export default function InterludePage({
  onContinue,
  heading = 'Great so far!',
}) {
  return (
    <section className="d-flex flex-column align-items-center justify-content-center py-5">
      <h2 className="mb-3 text-center">{heading}</h2>
      <p className="text-muted text-center mb-4" style={{ maxWidth: 480 }}>
        You’ve completed the first section. Click **Continue** when you’re ready
        for the next questions.
      </p>

      <GameButton gold onClick={onContinue}>
        Continue
      </GameButton>
    </section>
  );
}
