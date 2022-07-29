import Link from 'next/link';
import React from 'react';

const CommunityGallery = () => (
  <section className="community-gallery mt-6">
    <h6 className="header-secondary mb-5">COMMUNITY GALLERY</h6>
    <h2 className="mb-7">
      Take a deep dive into <br /> what your home looks like
    </h2>
    <Link href="/register">
      <a className="btn btn-secondary">SIGN UP NOW</a>
    </Link>
  </section>
);

export default CommunityGallery;
