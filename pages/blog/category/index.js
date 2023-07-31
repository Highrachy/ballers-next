import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import PostTitle from '@/components/blog/PostTitle';
import MoreStories from '@/components/blog/MoreStories';
import Header from '@/components/layout/Header';
import { BlogContainer, SearchModal } from 'pages/blog';
import { getAllPostsForHome, getSingleCategory } from 'lib/api';
import TitleSection from '@/components/common/TitleSection';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';

export default function Post({ posts }) {
  const router = useRouter();
  const allPosts = posts?.edges;

  return (
    <>
      <>
        <Head>
          <title>{`All posts | Ballers`}</title>
        </Head>
        <Header />
        <TitleSection
          name="All Articles"
          content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
        />
        <BlogContainer>
          <SearchModal>
            <h3>All Articles</h3>
          </SearchModal>
          {allPosts.length === 0 ? (
            <h2 className="text-center my-8">No posts found</h2>
          ) : (
            allPosts.length > 0 && <MoreStories posts={allPosts} />
          )}
        </BlogContainer>
        <CommunityGallery />
        <Footer />
      </>
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getAllPostsForHome();

  return {
    props: {
      posts: data,
    },
    revalidate: 10,
  };
};
