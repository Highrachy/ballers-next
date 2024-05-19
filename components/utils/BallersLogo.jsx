import { isFestivePeriod } from '@/utils/helpers';
import Image from 'next/image';
import React from 'react';
import Lottie from 'react-lottie';
import animationData from 'lotties/logo';

const BallersLogo = ({ alt, className, width, height }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <a>
      {isFestivePeriod() ? (
        <Image
          src={
            !!process.env.NEXT_PUBLIC_API_URL
              ? '/img/ballers-logo_xmas.png'
              : '/img/ballers-staging-logo_xmas.png'
          }
          alt={alt || 'Ballers.ng logo'}
          className={className}
          width={width}
          height={height}
        />
      ) : (
        <Lottie options={defaultOptions} height={64} width={104} />
        // <Image
        //   src={
        //     !!process.env.NEXT_PUBLIC_API_URL
        //       ? '/img/ballers-logo.png'
        //       : '/img/ballers-staging-logo.png'
        //   }
        //   alt={alt || 'Ballers.ng logo'}
        //   className={className}
        //   width={width}
        //   height={height}
        // />
      )}
    </a>
  );
};

export default BallersLogo;
