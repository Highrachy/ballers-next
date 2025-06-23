import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
} from 'react-icons/fa';
import GameButton from './GameButton';

export default function QuestionPageNavigation({
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) {
  return (
    <div className="question-nav mt-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <GameButton
        color="navy"
        disabled={isFirst}
        onClick={onPrevious}
        className="me-auto"
        leftIcon={<FaChevronLeft />}
      >
        Previous
      </GameButton>

      {!isLast ? (
        <GameButton
          color="gold"
          onClick={onNext}
          rightIcon={<FaChevronRight size="0.9em" />}
        >
          Next
        </GameButton>
      ) : (
        <GameButton
          color="gold"
          onClick={onNext}
          rightIconcon={<FaPlay size="0.9em" />}
        >
          Start Challenge
        </GameButton>
      )}
    </div>
  );
}
