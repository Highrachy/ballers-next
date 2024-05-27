import React from 'react';

const ImageWithBackground = ({ src, alt }) => (
  <figure className="bg-image__container">
    <div className="bg-image__wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="bg-image__img img-fluid" src={src} alt={alt} />
    </div>
  </figure>
);

export default ImageWithBackground;
