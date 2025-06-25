import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GameButton from './GameButton';

export default function GameNavigation({
  onNext,
  onPrevious,
  isFirst,
  isLast,
  className,
  isNextDisabled,
}) {
  return (
    <div
      className={`question-nav mt-5 mt-md-7 d-flex justify-content-between align-items-center flex-wrap gap-3 ${className}`}
    >
      <GameButton
        color="navy"
        disabled={isFirst}
        onClick={onPrevious}
        className="me-auto"
        leftIcon={<FaChevronLeft />}
      >
        Previous
      </GameButton>
      <GameButton
        color="gold"
        onClick={onNext}
        disabled={isNextDisabled}
        rightIcon={<FaChevronRight size="0.9em" />}
      >
        {isLast ? 'Submit' : 'Next'}
      </GameButton>
    </div>
  );
}

GameNavigation.defaultProps = {
  onNext: () => {},
  onPrevious: () => {},
  isFirst: false,
  isLast: false,
};
