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
        description="Read BALL Blog for easy-to-understand tips on buying property, market trends, and becoming a landlord in Nigeria."
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
        content="Learn about property, homeownership, and real estate in simple, practical steps with BALL."
      />

      {/* Hidden SEO content for indexing */}
      <section style={{ display: 'none' }}>
        <h2>BALL Real Estate Blog</h2>
        <p>
          The BALL Blog gives simple, practical advice for anyone looking to buy
          property or invest in real estate in Nigeria. Our guides cover Lagos,
          Abuja, and other key cities.
        </p>
        <p>
          Articles explain real estate trends, payment plans, property
          verification, financing, and investment ideas. We focus on clear,
          easy-to-follow advice.
        </p>
        <p>
          Whether you are buying your first home or investing in multiple
          properties, BALL provides actionable steps, market updates, and
          community stories to help you make smart decisions.
        </p>
        <h3>Topics You Can Explore</h3>
        <ul>
          <li>Buying your first property in Nigeria</li>
          <li>Investment opportunities and risks in real estate</li>
          <li>Market insights and pricing trends in Lagos and Abuja</li>
          <li>Planning for homeownership and financial readiness</li>
          <li>Payment plans, mortgages, and shared ownership options</li>
          <li>How to check developer credibility and property verification</li>
          <li>Choosing the right developer or BALL VIP</li>
        </ul>
        <p>
          BALL is committed to making real estate simple, transparent, and
          accessible. Read our blog to learn, grow, and take confident steps
          toward owning a home.
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
  <section className="py-4 py-md-6 px-md-7 px-5 container-fluid">
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
