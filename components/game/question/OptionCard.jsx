import Image from 'next/image';
import classNames from 'classnames';

export default function OptionCard({
  title,
  subtitle,
  emoji,
  selected,
  onClick,
}) {
  return (
    <div className={classNames('option-card', { selected })} onClick={onClick}>
      <svg
        className="option-svg"
        viewBox="0 0 268 175"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          className="option-path"
          d="M229.784 1.44043C239.895 0.8899 249.202 6.8802 252.404 16.46
             C258.71 35.324 267.801 66.707 267.492 89.989
             C267.204 111.667 258.576 140.713 252.482 158.603
             C249.228 168.156 239.908 174.083 229.807 173.493
             L22.6309 161.398C10.2053 160.673 0.5 150.385 0.5 137.938
             V36.1797C0.5 23.6974 10.2589 13.3935 22.7227 12.7148
             L229.784 1.44043Z"
        />
      </svg>

      <div className="option-inner">
        <span className="option-radio" />
        <div>
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
        {emoji && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/img/game/options/${emoji}`}
            alt={title}
            className="option-emoji"
          />
        )}
      </div>
    </div>
  );
}
