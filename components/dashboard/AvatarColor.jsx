import React from 'react';

export function getColor(title) {
  const firstLetter = title?.charAt(0)?.toUpperCase();
  const colorMapping = {
    A: 'secondary',
    B: 'purple',
    C: 'pink',
    D: 'warning',
    E: 'success',
    F: 'primary',
    G: 'danger',
    H: 'secondary',
    I: 'gray',
    J: 'purple',
    K: 'pink',
    L: 'warning',
    M: 'success',
    N: 'primary',
    O: 'danger',
    P: 'secondary',
    Q: 'gray',
    R: 'purple',
    S: 'pink',
    T: 'warning',
    U: 'success',
    V: 'primary',
    W: 'warning',
    X: 'pink',
    Y: 'primary',
    Z: 'purple',
  };

  return colorMapping[firstLetter] || 'danger';
}

function getInitials(title) {
  if (!title) return 'ZZ';
  const words = title.split(' ');
  return (words?.[0]?.charAt(0) || '') + (words?.[1]?.charAt(0) || '');
}

const AvatarColor = ({
  title,
  avatarColor,
  avatarInitials = null,
  avatarCircle = false,
}) => {
  const color = avatarColor || getColor(title);
  const initials = getInitials(title)?.toUpperCase();
  const avatarClass = avatarCircle ? 'avatar-circle' : 'avatar-rounded';

  return (
    <div className={`${avatarClass} avatar-${color}`}>
      {avatarInitials || initials}
    </div>
  );
};

export default AvatarColor;
