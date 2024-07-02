import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { API_ENDPOINT } from 'utils/URL';
import Axios from 'axios';
import BlogPostCard from '@/components/blog/BlogPostCard';

const Blog = ({ result }) => {
  return (
    <>
      <Header />
      <TitleSection
        name="Blog"
        content="The only realistic burden free process of owning your ideal home."
      />
      <BlogList result={result} />
      <CommunityGallery />
      <Footer />
    </>
  );
};

export const BlogList = ({ result }) => {
  return result && result.length > 0 ? (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h3 className="mt-7 mb-4">Blog</h3>
        </div>
      </div>
      <div className="row">
        {result.map((post, index) => (
          <BlogPostCard key={index} post={post} />
        ))}
      </div>
    </div>
  ) : null;
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
