import classNames from 'classnames';

export default function GameButton({
  children,
  color = 'gold',
  className = '',
  leftIcon = null,
  rightIcon = null,
  ...props
}) {
  return (
    <button
      className={classNames('btn-game', `btn-game--${color}`, className)}
      {...props}
    >
      {leftIcon && <span className="me-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ms-2">{rightIcon}</span>}
    </button>
  );
}
