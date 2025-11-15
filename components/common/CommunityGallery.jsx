import Link from 'next/link';
import React from 'react';

const CommunityGallery = () => (
  <section className="community-gallery mt-7">
    <h6 className="header-secondary mb-5 text-uppercase">
      Do you have a property for sale?
    </h6>
    <p className="h2 mb-5">
      Become a <span className="">BALL VIP</span> today <br /> and enjoy
      exclusive benefits.
    </p>
    <Link href="/ball-vips">
      <a className="btn btn-secondary btn-wide mb-6">Become a BALL VIP</a>
    </Link>
  </section>
);

export default CommunityGallery;
