import React from 'react';
import { getAllPostsForHome } from 'lib/api';
import HeroPost from '@/components/blog/HeroPost';
import MoreStories from '@/components/blog/MoreStories';
import Header from 'components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';

const ArticlesPage = ({ allPosts: { edges }, preview }) => {
  const heroPost = edges[0]?.node;
  // const morePosts = edges.slice(1);
  const morePosts = edges;
  return (
    <>
      <Header />
      <TitleSection
        name="Blog"
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
      <section className="container-fluid">
        <div className="row">
          <div className="col-sm-8 col-10 my-6 mx-auto">
            {heroPost && (
              <HeroPost
                title={heroPost.title}
                coverImage={heroPost.featuredImage}
                date={heroPost.date}
                author={heroPost.author}
                slug={heroPost.slug}
                excerpt={heroPost.excerpt}
                tags={heroPost.tags}
              />
            )}

            <div className="dotted-border my-5"></div>
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ArticlesPage;

export const getStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);

  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
