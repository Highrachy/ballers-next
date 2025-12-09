import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { API_ENDPOINT } from 'utils/URL';
import Axios from 'axios';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import PostImage from '@/components/blog/PostImage';
import PostTitle from '@/components/blog/PostTitle';
import { getTinyDate } from '@/utils/date-helpers';

const Post = ({ blogPost: post }) => {
  if (!post?.title) return null;
  return (
    <>
      <Header />
      <TitleSection name={post.title} content="" />
      <PostImage src={post.mainImage} alt={post.title} />
      <section className="py-4 container-fluid single-post">
        <div className="row">
          <div className="mx-auto col-lg-7 col-md-9 col-sm-10">
            <h2 className="single-post-title mb-2">{post.title}</h2>
            <p className="text-muted mb-4">
              By {post?.author || 'Victoria'} on {getTinyDate(post.createdAt)}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post?.content }} />
          </div>
        </div>
      </section>
      <CommunityGallery />
      <Footer />
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const post = await Axios.get(API_ENDPOINT.getOnePostBySlug(params?.slug));

  return {
    props: {
      ...post?.data,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const allPosts = await Axios.get(API_ENDPOINT.getAllBlogs());
  const postLists = allPosts?.data?.result || [];

  return {
    paths: postLists.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: true,
  };
};

export default Post;
