import Image from 'next/image';
import React from 'react';

const BallersLogo = ({ alt, className, width, height }) => {
  return (
    <Image
      src={
        !!process.env.NEXT_PUBLIC_API_URL
          ? '/img/ballers-logo.png'
          : '/img/ballers-staging-logo.png'
      }
      alt={alt || 'Ballers.ng logo'}
      className={className}
      width={width}
      height={height}
    />
  );
};

export default BallersLogo;
