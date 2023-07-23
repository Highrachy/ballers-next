import React from 'react';
import { getAllCategories, getAllPostsForHome } from 'lib/api';
import HeroPost from '@/components/blog/HeroPost';
import MoreStories from '@/components/blog/MoreStories';
import Header from 'components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';
import { SearchIcon } from '@/components/utils/Icons';
import Link from 'next/link';

const ArticlesPage = ({ allPosts: { edges }, allCategories }) => {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  return (
    <>
      <Header />
      <TitleSection
        name="Blog"
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
      <BlogContainer>
        {heroPost && <HeroPost {...heroPost} />}
        <div className="dotted-border my-6"></div>
        {/* <h2 className="mt-6 mb-4">More Posts</h2> */}
        <CategoriesComponent categories={allCategories} />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </BlogContainer>

      <Footer />
    </>
  );
};

export const BlogContainer = ({ children }) => (
  <section className="container-fluid py-6">
    <div className="row">
      <div className="col-md-8 col-10 mx-auto">{children}</div>
    </div>
  </section>
);

const CategoriesComponent = ({ categories }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <ul className="list-inline blog-categories-list">
        <li className="list-inline-item active">
          <a
            href="https://firstsight.design/linden/demo/blog/"
            className="text-decoration-none"
          >
            All Articles
          </a>
        </li>
        {categories.nodes.map((category) => (
          <li key={category.slug} className="list-inline-item">
            <a
              href={`https://firstsight.design/linden/demo/category/${category.slug}/`}
              className="text-decoration-none"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
      <Link href="/" className="btn btn-link">
        <SearchIcon />
      </Link>
    </div>
  );
};

export default ArticlesPage;

export const getStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);
  const allCategories = await getAllCategories(preview);

  return {
    props: { allPosts, allCategories, preview },
    revalidate: 10,
  };
};
