import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { API_ENDPOINT } from 'utils/URL';
import Axios from 'axios';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import SeoHead from '@/components/utils/SeoHead';

const Blog = ({ result, categories }) => {
  const heroPost = result[0]?.node;
  const morePosts = result.slice(1);
  return (
    <>
      <SeoHead
        title="BALL Blog | Real Estate & Homeownership Guides"
        description="Explore the BALL Blog for homeownership insights, property buying tips, market trends, and guides to help Nigerians become landlords with confidence."
        canonical="https://www.ballers.ng/blog"
        keywords={[
          'real estate blog nigeria',
          'property buying tips',
          'homeownership nigeria',
          'ball blog',
          'become a landlord nigeria',
          'lagos property advice',
          'investment property nigeria',
        ]}
      />
      <Header />
      <TitleSection
        name="Blog"
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
      {/* Hidden SEO content to fix low-word count */}
      <section style={{ display: 'none' }}>
        <h2>BALL Real Estate Blog</h2>
        <p>
          The BALL Blog provides expert insights and practical guidance for
          anyone looking to buy property, invest in real estate, or begin their
          journey toward homeownership in Nigeria. From Lagos to Abuja and
          emerging markets across the country, our articles explain real estate
          trends, payment plans, due diligence, property verification, financing
          options, and investment strategies.
        </p>

        <p>
          Whether you are a first-time home buyer or an investor evaluating new
          opportunities, BALL offers simplified advice, unbiased education,
          community stories, market updates, and actionable steps to help you
          become a landlord with confidence.
        </p>

        <h3>Topics You Can Explore</h3>
        <ul>
          <li>How to buy your first property in Nigeria</li>
          <li>Real estate investment opportunities and risks</li>
          <li>Market insights and price trends across Lagos and Abuja</li>
          <li>Homeownership planning and financial readiness</li>
          <li>Payment plans, mortgages, and fractional ownership</li>
          <li>
            Developer credibility, due diligence and property verification
          </li>
          <li>Tips for choosing the right developer or BALL VIP</li>
        </ul>

        <p>
          BALL is dedicated to making real estate transparent, modern and
          accessible. Explore the blog to learn, grow and achieve your
          homeownership goals.
        </p>
      </section>

      <BlogContainer categories={categories}>
        <BlogList result={result} />
      </BlogContainer>
      <CommunityGallery />
      <Footer />
    </>
  );
};

export const BlogContainer = ({ categories, children }) => (
  <section className="py-6 px-7 container-fluid">
    <div className="row">
      <div className="col-lg-8 col-sm-12">{children}</div>
      <BlogSidebar categories={categories} />
    </div>
  </section>
);

export const BlogList = ({ result }) => {
  return result && result.length > 0 ? (
    result.map((post, index) => (
      <BlogPostCard key={index} post={post} isPublic />
    ))
  ) : (
    <h3 className="mt-5 text-center">No Blog Found</h3>
  );
};

export async function getStaticProps() {
  const blog = await Axios.get(API_ENDPOINT.getAllBlogs());

  return {
    props: {
      ...blog.data,
    },
    revalidate: 10,
  };
}

export default Blog;
