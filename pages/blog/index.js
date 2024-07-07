import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { API_ENDPOINT } from 'utils/URL';
import Axios from 'axios';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSidebar from '@/components/blog/BlogSidebar';

const Blog = ({ result, categories }) => {
  const heroPost = result[0]?.node;
  const morePosts = result.slice(1);
  return (
    <>
      <Header />
      <TitleSection
        name="Blog"
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
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
